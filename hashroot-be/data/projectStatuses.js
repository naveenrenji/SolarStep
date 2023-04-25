import { ObjectId } from "mongodb";
import {
  projectStatusLogs,
  projects,
  users,
} from "../config/mongoCollections.js";
import {
  PROJECT_STATUSES,
  PROJECT_UPLOAD_TYPES,
  TASK_STATUSES,
  USER_ROLES,
} from "../constants.js";
import { checkProjectStatus } from "../helpers.js";
import { getAllTasks } from "./tasks.js";

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

const updateProjectStatus = async (
  currentUser,
  project,
  status,
  updates = {}
) => {
  if (!currentUser) throw "User not logged in";
  
  const projectCollections = await projects();
  const updateFields = {
    ...updates,
    status: status,
    updatedAt: new Date(),
  };

  const updatedProject = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: updateFields,
    },
    { returnDocument: "after" }
  );

  if (!updatedProject.value) {
    throw new Error(`Failed to update project to ${status} status`);
  }

  await createProjectLog(currentUser, project, project.status, status);

  return updatedProject.value;
};

const updateProjectStatusToAssignedToGC = async (
  currentUser,
  project,
  generalContractorId
) => {
  if (!currentUser) throw "User not logged in";

  const userCollection = await users();
  const gc = await userCollection.findOne({
    _id: new ObjectId(generalContractorId),
    role: USER_ROLES.GENERAL_CONTRACTOR,
  });
  if (!gc) {
    throw new Error("Invalid general contractor ID");
  }

  const status = PROJECT_STATUSES.ASSIGNED_TO_GC;

  const updates = {
    generalContractor: {
      _id: new ObjectId(gc._id),
      email: gc.email,
    },
  };

  return await updateProjectStatus(currentUser, project, status, updates);
};

const acceptProjectByGC = async (currentUser, project) => {
  if (!currentUser) throw new Error("User not logged in");
  if (
    !project.documents.find(
      (doc) =>
        doc.type === PROJECT_UPLOAD_TYPES.contract &&
        doc.latest &&
        doc.customerSign &&
        doc.generalContractorSign
    )
  ) {
    throw new Error("Contract not signed yet");
  }
  const status = PROJECT_STATUSES.GC_ACCEPTED;

  return await updateProjectStatus(currentUser, project, status);
};

const rejectProjectByGC = async (currentUser, project, comment) => {
  if (!currentUser) throw new Error("User not logged in");
  const status = PROJECT_STATUSES.READY_TO_BE_ASSIGNED_TO_GC;

  const updates = {
    generalContractor: {},
  };

  return await updateProjectStatus(currentUser, project, status, updates);
};

const moveToReadyToBeAssignedToGC = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";
  if (
    !project.documents.find(
      (doc) =>
        doc.type === PROJECT_UPLOAD_TYPES.contract &&
        doc.latest &&
        doc.customerSign &&
        !doc.generalContractorSign
    )
  ) {
    throw new Error("Contract not signed by customer");
  }
  const status = PROJECT_STATUSES.READY_TO_BE_ASSIGNED_TO_GC;

  return await updateProjectStatus(currentUser, project, status);
};


const moveToReviewingProposal = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";
  if (
    !project.documents.find(
      (doc) =>
        doc.type === PROJECT_UPLOAD_TYPES.contract &&
        doc.latest &&
        !doc.customerSign &&
        doc.generalContractorSign
    )
  ) {
    throw new Error("Contract not signed by General Contractor");
  }
  const status = PROJECT_STATUSES.REVIEWING_PROPOSAL;

  return await updateProjectStatus(currentUser, project, status);
};

const moveToUpdatingProposal = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";
  const status = PROJECT_STATUSES.UPDATING_PROPOSAL;

  return await updateProjectStatus(currentUser, project, status);
};


const moveToInstallationStarted = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";
  if (
    !project.documents.find(
      (doc) =>
        doc.type === PROJECT_UPLOAD_TYPES.contract &&
        doc.latest &&
        doc.customerSign &&
        doc.generalContractorSign
    )
  ) {
    throw new Error("Contract not signed by customer or General contractor");
  }
  const status = PROJECT_STATUSES.INSTALLATION_STARTED;

  return await updateProjectStatus(currentUser, project, status);
};

const projectComplete = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";

  const status = PROJECT_STATUSES.COMPLETED;

  if (project.status === status) {
    throw "Project status is already completed";
  }

  return await updateProjectStatus(currentUser, project, status);
};

const projectClosingOut = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";

  const status = PROJECT_STATUSES.CLOSING_OUT;

  return await updateProjectStatus(currentUser, project, status);
};

const moveToOnSiteInspectionScheduled = async (
  currentUser,
  project,
  onSiteInspectionDate
) => {
  if (!currentUser) throw "User not logged in";
  const status = PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED;

  const updates = {
    onSiteInspectionDate: new Date(onSiteInspectionDate),
  };

  return await updateProjectStatus(currentUser, project, status, updates);
};

const moveToOnSiteInspectionInProgress = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";
  const status = PROJECT_STATUSES.ON_SITE_INSPECTION_IN_PROGRESS;

  const updates = {
    onSiteInspectionStartedOn: new Date(),
  };

  return await updateProjectStatus(currentUser, project, status, updates);
};

const moveToReadyForInstallation = async (
  currentUser,
  project,
  scheduledInstallationStartDate
) => {
  if (!currentUser) throw "User not logged in";
  if (
    !project.documents.find(
      (doc) =>
        doc.type === PROJECT_UPLOAD_TYPES.contract &&
        doc.latest &&
        doc.customerSign &&
        doc.generalContractorSign
    )
  ) {
    throw new Error("Contract not signed by customer or General contractor");
  }
  const status = PROJECT_STATUSES.READY_FOR_INSTALLATION;

  const updates = {
    scheduledInstallationStartDate: new Date(scheduledInstallationStartDate),
  };

  return await updateProjectStatus(currentUser, project, status, updates);
};

const projectValidatingPermits = async (currentUser, project) => {
  if (!currentUser) throw "User not logged in";

  const tasks = await getAllTasks(currentUser, project._id.toString());
  if (!tasks.length) {
    throw new Error("No tasks found for this project");
  }

  if (tasks.filter((task) => task.status !== TASK_STATUSES.COMPLETED).length) {
    throw new Error("All tasks are not completed");
  }

  const status = PROJECT_STATUSES.VALIDATING_PERMITS;

  const updates = {
    installationCompletedAt: new Date(),
  };

  return await updateProjectStatus(currentUser, project, status, updates);
};


export {
  createProjectLog,
  moveToReadyToBeAssignedToGC,
  moveToOnSiteInspectionScheduled,
  moveToOnSiteInspectionInProgress,
  moveToReviewingProposal,
  moveToUpdatingProposal,
  moveToReadyForInstallation,
  projectClosingOut,
  projectComplete,
  projectValidatingPermits,
  updateProjectStatusToAssignedToGC,
  rejectProjectByGC,
  acceptProjectByGC,
  moveToInstallationStarted,
};
