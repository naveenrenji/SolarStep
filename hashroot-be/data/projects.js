import { ObjectId } from "mongodb";

import { projects } from "../config/mongoCollections.js";
import * as helpers from "../helpers.js";
import {
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
    { projection: { _id: 1, "documents.$": 1 } }
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
    if (!project.documents[0].customerSign) {
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

// const getEveryProject = async () => {
//   const projectCollection = await projects();
//   const projectList = await projectCollection.find({}).toArray();
//   if (!projectList) throw "Could not get all projects";
//   if (projectList.length == 0) return [];
//   projectList.forEach((element) => {
//     element._id = element._id.toString();
//   });
//   return projectList;
// };

// const updateProject = async (id, userId, updatedProject) => {
//   id = helpers.checkId(id);
//   userId = helpers.checkId(userId);
//   if (!updatedProject || typeof updatedProject !== "object") {
//     throw "Valid updated project data is required";
//   }

//   const projectCollection = await projects();
//   const existingProject = await projectCollection.findOne({
//     _id: new ObjectId(id),
//   });

//   if (!existingProject) {
//     throw `Project with ID ${id} not found`;
//   }

//   if (existingProject.userId.toString() !== userId.toString()) {
//     throw "Only project owner can update the project";
//   }

//   const updatedProjectData = {};

//   if (
//     updatedProject.projectName &&
//     typeof updatedProject.projectName === "string"
//   ) {
//     updatedProjectData.projectName = updatedProject.projectName;
//   }

//   if (updatedProject.address && typeof updatedProject.address === "string") {
//     updatedProjectData.address = updatedProject.address;
//   }

//   if (Object.keys(updatedProjectData).length === 0) {
//     throw "At least one field must be provided to update the project";
//   }

//   const updatedInfo = await projectCollection.updateOne(
//     { _id: new ObjectId(id) },
//     { $set: updatedProjectData }
//   );

//   if (updatedInfo.modifiedCount === 0) {
//     throw "Could not update project successfully";
//   }

//   return await getProjectById(id);
// };

// const deleteProject = async (id, userId) => {
//   id = helpers.checkId(id);
//   userId = helpers.checkId(userId);
//   let projectCollection = await projects();
//   const project = await getProjectById(id);
//   if (!project) {
//     throw "Project not found";
//   }
//   // Check if the user has permission to delete the project
//   if (project.userId !== userId) {
//     throw "You are not authorized to delete this project";
//   }
//   const projectExists = await projectCollection.findOne({
//     _id: mongo.ObjectId(id),
//   });
//   const deletionInfo = await projectCollection.deleteOne({
//     _id: mongo.ObjectId(id),
//   });
//   if (deletionInfo.deletedCount === 0) {
//     throw `Could not delete project with id of ${id}`;
//   }
//   return `${projectExists.projectName} has been successfully deleted!`;
// };

export {
  createProject,
  projects,
  // deleteProject,
  // updateProject,
  getProjectById,
  getPaginatedProjects,
  signDocument,
  // getEveryProject,
};
