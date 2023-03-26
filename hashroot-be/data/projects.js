import { ObjectId } from "mongodb";

import { projects } from "../config/mongoCollections.js";
import * as helpers from "../helpers.js";
import { PAGE_LIMIT, PROJECT_STATUSES, USER_ROLES } from "../constants.js";
import { getUserById } from "./users.js";

const createProject = async (currentUser, userId, projectName, address) => {
  if (!currentUser) throw "User not logged in";

  userId = helpers.checkId(userId);
  if (projectName) {
    projectName = helpers.checkString(projectName);
  }
  address = helpers.checkAddress(address);

  const user = await getUserById(userId);

  const projectCollection = await projects();
  const newProject = {
    user: {
      _id: new ObjectId(user?._id),
      email: user?.email,
    },
    projectName,
    address,
    salesRep: {
      _id: new ObjectId(currentUser?._id),
      email: currentUser?.email,
    },
    generalContractorId: {},
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
  const project = await getProjectById(newId);

  return project;
};

const getProjectById = async (id) => {
  id = helpers.checkId(id);

  const projectCollection = await projects();
  const project = await projectCollection.findOne({ _id: new ObjectId(id) });

  if (!project) {
    throw `Project with ID ${id} not found`;
  }

  return project;
};

const getPaginatedProjects = async (currentUser, page, search) => {
  if (!currentUser) throw "User not logged in";

  page = parseInt(page || 1);
  let limit = PAGE_LIMIT;
  let skip = (page - 1) * limit;
  const findQuery = {};
  if (currentUser.role === USER_ROLES.CUSTOMER) {
    findQuery["user._id"] = currentUser._id;
  } else if (currentUser.role === USER_ROLES.GENERAL_CONTRACTOR) {
    findQuery["generalContractor._id"] = currentUser._id;
  } else if (currentUser.role === USER_ROLES.WORKER) {
    findQuery["workers._id"] = currentUser._id;
  } else if (currentUser.role === USER_ROLES.SALES_REP) {
    findQuery["salesRep._id"] = currentUser._id;
  }

  if (search) {
    const textRegex = new RegExp(search, 'i');
    findQuery["$and"] = [
      {
        $or: [
          { _id: textRegex },
          { projectName: textRegex },
          { "user.email": textRegex },
        ],
      },
    ];
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

const getEveryProject = async () => {
  const projectCollection = await projects();
  const projectList = await projectCollection.find({}).toArray();
  if (!projectList) throw "Could not get all projects";
  if (projectList.length == 0) return [];
  projectList.forEach((element) => {
    element._id = element._id.toString();
  });
  return projectList;
};

const updateProject = async (id, userId, updatedProject) => {
  id = helpers.checkId(id);
  userId = helpers.checkId(userId);
  if (!updatedProject || typeof updatedProject !== "object") {
    throw "Valid updated project data is required";
  }

  const projectCollection = await projects();
  const existingProject = await projectCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!existingProject) {
    throw `Project with ID ${id} not found`;
  }

  if (existingProject.userId.toString() !== userId.toString()) {
    throw "Only project owner can update the project";
  }

  const updatedProjectData = {};

  if (
    updatedProject.projectName &&
    typeof updatedProject.projectName === "string"
  ) {
    updatedProjectData.projectName = updatedProject.projectName;
  }

  if (updatedProject.address && typeof updatedProject.address === "string") {
    updatedProjectData.address = updatedProject.address;
  }

  if (Object.keys(updatedProjectData).length === 0) {
    throw "At least one field must be provided to update the project";
  }

  const updatedInfo = await projectCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedProjectData }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update project successfully";
  }

  return await getProjectById(id);
};

const deleteProject = async (id, userId) => {
  id = helpers.checkId(id);
  userId = helpers.checkId(userId);
  let projectCollection = await projects();
  const project = await getProjectById(id);
  if (!project) {
    throw "Project not found";
  }
  // Check if the user has permission to delete the project
  if (project.userId !== userId) {
    throw "You are not authorized to delete this project";
  }
  const projectExists = await projectCollection.findOne({
    _id: mongo.ObjectId(id),
  });
  const deletionInfo = await projectCollection.deleteOne({
    _id: mongo.ObjectId(id),
  });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete project with id of ${id}`;
  }
  return `${projectExists.projectName} has been successfully deleted!`;
};

export {
  createProject,
  deleteProject,
  updateProject,
  getProjectById,
  getPaginatedProjects,
  getEveryProject,
};