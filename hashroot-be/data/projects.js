const mongoCollections = require("../config/mongoCollections");
const projects = mongoCollections.projects;
const ObjectId = require("mongodb").ObjectId;
const helpers = require("../helpers");

const createProject = async (userId, username, projectName, address) => {
  userId = helpers.checkId(userId);
  username = helpers.checkString(username);
  projectName = helpers.checkString(projectName);
  address = helpers.checkString(address);

  const projectCollection = await projects();
  const newProject = {
    userId: userId,
    username: username,
    projectName: projectName,
    address: address,
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

const getAllProjects = async (page) => {
  if (!page) {
    page = 1;
  }
  page = parseInt(page);
  let limit = 50;
  let skip = (page - 1) * limit;
  const projectCollection = await projects();
  const projectList = await projectCollection
    .find()
    .skip(skip)
    .limit(limit)
    .toArray();
  if (!projectList) throw "Could not get all projects";
  if (projectList.length == 0) {
    if (page > 1) throw "No more projects for the requested page";
    return [];
  }
  projectList.forEach((element) => {
    element._id = element._id.toString();
  });
  return projectList;
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

module.exports = {
  createProject,
  deleteProject,
  updateProject,
  getProjectById,
  getAllProjects,
  getEveryProject,
};
