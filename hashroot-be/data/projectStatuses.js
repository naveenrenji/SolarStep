import { ObjectId } from "mongodb";
import { projectStatusLogs, projects } from "../config/mongoCollections.js";
import { PROJECT_STATUSES } from "../constants.js";
import { checkProjectStatus } from "../helpers.js";
import { getProjectById } from "./projects.js";

const createProjectLog = async (
  currentUser,
  project,
  from,
  to,
  comment = null
) => {
  if (!currentUser) throw "User not logged in";
  if (!project) throw "Project not found";
  from = checkProjectStatus(from, "Project from status");
  to = checkProjectStatus(to, "Project to status");

  const projectStatusLogCollection = await projectStatusLogs();
  const newProjectStatusLog = {
    projectId: new ObjectId(project._id),
    user: {
      _id: new ObjectId(currentUser._id),
      email: currentUser.email,
    },
    from,
    to,
    comment,
    createdAt: new Date(),
  };

  const insertInfo = await projectStatusLogCollection.insertOne(
    newProjectStatusLog
  );

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    return false;
  }

  return true;
};

const moveToOnSiteInspectionScheduled = async (
  currentUser,
  project,
  onSiteInspectionDate
) => {
  if (!currentUser) throw "User not logged in";
  const status = PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED;
  // Write the code here

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
        onSiteInspectionDate: onSiteInspectionDate,
      },
    },
    { returnDocument: "after" }
  );
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for On-Site Inspection could not be changed.");
  }

  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
};

const moveToOnSiteInspectionInProgress = async (
  currentUser,
  project,
  onSiteInspectionStartedOn
) => {
  if (!currentUser) throw "User not logged in";
  const status = PROJECT_STATUSES.ON_SITE_INSPECTION_IN_PROGRESS;

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
        onSiteInspectionStartedOn: onSiteInspectionStartedOn,
      },
    },
    { returnDocument: "after" }
  );
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for On-Site Inspection could not be changed.");
  }
  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
};

const projectComplete = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";

  const status = PROJECT_STATUSES.COMPLETED;

  if (project.status === status) {
    throw "Project status is already completed";
  }

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
        completedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for Projects could not be changed to Completed.");
  }

  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
};

const projectClosingOut = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";

  const status = PROJECT_STATUSES.CLOSING_OUT;

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
      },
    },
    { returnDocument: "after" }
  );
  if (updatedProjectLog.lastErrorObject.n !== 1 || updatedProjectLog.value) {
    throw new Error("Status for Projects could not be changed to Closing Out.");
  }
  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );

  return updatedProject;
};

const projectValidatingPermits = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";

  const status = PROJECT_STATUSES.VALIDATING_PERMITS;

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
        installationCompletedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for On-Site Inspection could not be changed.");
  }

  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
};

export {
  createProjectLog,
  moveToOnSiteInspectionScheduled,
  moveToOnSiteInspectionInProgress,
  projectClosingOut,
  projectComplete,
  projectValidatingPermits,
};
