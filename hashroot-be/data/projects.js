import { ObjectId } from "mongodb";

import { projects } from "../config/mongoCollections.js";
import * as helpers from "../helpers.js";
import {
  AUTHORIZED_ROLES_FOR_MARKING_PROJECT_STATUS,
  PAGE_LIMIT,
  PROJECT_STATUSES,
  PROJECT_UPLOAD_TYPES,
  USER_ROLES,
} from "../constants.js";
import { getUserById } from "./users.js";

const createProject = async (
  currentUser,
  userId,
  salesRepId,
  projectName,
  address
) => {
  userId = helpers.checkId(userId);
  salesRepId = helpers.checkId(salesRepId);
  if (projectName) {
    projectName = helpers.checkString(projectName);
  }
  address = helpers.checkAddress(address);

  const user = await getUserById(userId);
  const salesRep = await getUserById(salesRepId);

  const projectCollection = await projects();
  const newProject = {
    user: {
      _id: new ObjectId(user?._id),
      email: user?.email,
    },
    projectName,
    address,
    salesRep: {
      _id: new ObjectId(salesRep?._id),
      email: salesRep?.email,
    },
    generalContractor: {},
    workers: [],
    status: PROJECT_STATUSES.CREATED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertInfo = await projectCollection.insertOne(newProject);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add new project";
  }

  const newId = insertInfo.insertedId.toString();
  const project = await getProjectById(currentUser, newId);

  return project;
};

const getProjectById = async (currentUser, id) => {
  if (!currentUser) throw "User not logged in";
  id = helpers.checkId(id, "Project ID");

  const projectCollection = await projects();
  const project = await projectCollection.findOne({ _id: new ObjectId(id) });

  if (!project || !helpers.canViewProject(currentUser, project)) {
    throw `Project with ID ${id} not found`;
  }

  return project;
};

const getPaginatedProjects = async (currentUser, page, search, statuses) => {
  if (!currentUser) throw "User not logged in";

  page = parseInt(page || 1);
  let limit = PAGE_LIMIT;
  let skip = (page - 1) * limit;

  const findQuery = {};
  const roleSpecificQuery = {};
  if (currentUser.role === USER_ROLES.CUSTOMER) {
    roleSpecificQuery["user._id"] = new ObjectId(currentUser._id);
  } else if (currentUser.role === USER_ROLES.GENERAL_CONTRACTOR) {
    roleSpecificQuery["generalContractor._id"] = new ObjectId(currentUser._id);
  } else if (currentUser.role === USER_ROLES.WORKER) {
    roleSpecificQuery["workers._id"] = new ObjectId(currentUser._id);
  } else if (currentUser.role === USER_ROLES.SALES_REP) {
    roleSpecificQuery["salesRep._id"] = new ObjectId(currentUser._id);
  }

  const statusesQuery = {};
  if (statuses?.length) {
    statusesQuery.status = { $in: statuses };
  }

  const searchQuery = {};
  if (search) {
    const textRegex = new RegExp(search, "i");
    searchQuery["$or"] = [
      { projectName: textRegex },
      { "address.streetAddress": textRegex },
      { "address.city": textRegex },
      { "address.state": textRegex },
      { "address.zipCode": textRegex },
      { "user.email": textRegex },
    ];
  }

  if (
    Object.keys(roleSpecificQuery).length > 0 ||
    Object.keys(searchQuery).length > 0 ||
    Object.keys(statusesQuery).length > 0
  ) {
    findQuery["$and"] = [];
    if (Object.keys(roleSpecificQuery).length > 0) {
      findQuery["$and"].push(roleSpecificQuery);
    }
    if (Object.keys(searchQuery).length > 0) {
      findQuery["$and"].push(searchQuery);
    }
    if (Object.keys(statusesQuery).length > 0) {
      findQuery["$and"].push(statusesQuery);
    }
  }

  const projectCollection = await projects();

  const aggregateRes = projectCollection.aggregate([
    { $match: findQuery },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ], // add projection here wish you re-shape the docs
      },
    },
  ]);

  let res;
  for await (const doc of aggregateRes) {
    res = doc;
  }

  if (!res) throw "Could not get all projects";
  res.data.forEach((element) => {
    element._id = element._id.toString();
  });
  return {
    projects: res.data,
    totalPages: Math.ceil((res.metadata[0]?.total || 0) / limit),
  };
};

const signDocument = async (currentUser, id, fileId, body) => {
  if (!currentUser) throw "User not logged in";
  id = helpers.checkId(id, "Project ID");

  const projectCollection = await projects();
  const project = await projectCollection.findOne(
    {
      _id: new ObjectId(id),
      "documents.fileId": new ObjectId(fileId),
    },
    { projection: { _id: 1, status: 1, "documents.$": 1 } }
  );
  if (!project) {
    throw new Error("File not found!");
  }

  if (project.documents[0].type !== PROJECT_UPLOAD_TYPES.contract) {
    throw new Error("Invalid file type");
  }

  if (!project.documents[0].latest) {
    throw new Error("Invalid file");
  }

  if (
    project.documents[0].customerSign &&
    project.documents[0].generalContractorSign
  ) {
    throw new Error("Document already signed");
  }

  const documentToUpdate = {};

  if (body?.generalContractorSign) {
    if (
      project.status === PROJECT_STATUSES.ASSIGNED_TO_GC &&
      !project.documents[0].customerSign
    ) {
      throw new Error("Customer has not signed the document yet");
    }
    documentToUpdate["documents.$.generalContractorSign"] =
      body.generalContractorSign;
  } else {
    documentToUpdate["documents.$.customerSign"] = body.customerSign;
  }

  const updatedInfo = await projectCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      "documents.fileId": new ObjectId(fileId),
    },
    { $set: documentToUpdate },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n !== 1 || !updatedInfo.value) {
    throw new Error("Could not update project");
  }

  return await getProjectById(currentUser, id);
};

const getAuthorizations = (currentUser) => {
  if (!currentUser) throw "User not logged in";

  return Object.entries(AUTHORIZED_ROLES_FOR_MARKING_PROJECT_STATUS).reduce(
    (acc, [key, roles]) => {
      acc[key] = roles.includes(currentUser.role);
      return acc;
    },
    {}
  );
};

const getCompletedProjects = async (currentUser) => {
  if (!currentUser) throw "User not logged in";

  const projectCollection = await projects();
  let completedProjects = [];
  for (let project in projectCollection) {
    if (project.status === "COMPLETED") {
      completedProjects.concat(project);
    }
  }
  return completedProjects;
};

const getEnergyUsage = async (currentUser, id) => {
  if (!currentUser) throw "User not logged in";

  const project = await getProjectById(currentUser, id);
  const energyUsed = {kwhUsed: 1000, solarCost: 20, traditionalCost: 50};

  return { ...project, energyUsed};
};

export {
  createProject,
  projects,
  getCompletedProjects,
  getEnergyUsage,
  getProjectById,
  getPaginatedProjects,
  signDocument,
  getAuthorizations,
};
