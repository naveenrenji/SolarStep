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
import { getProjectById } from "./projects.js";
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

  let projectCollections = await projects();
  const updatedProject = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
        generalContractor: {
          _id: new ObjectId(gc._id),
          email: gc.email,
        },
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
  if (!updatedProject.value) {
    throw new Error("Failed to update project");
  }
  await createProjectLog(
    currentUser,
    project,
    project.status,
    PROJECT_STATUSES.ASSIGNED_TO_GC
  );

  return updatedProject.value;
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
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for GC Accepted could not be changed.");
  }

  await createProjectLog(currentUser, project, project.status, status);

  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
};

const rejectProjectByGC = async (currentUser, project, comment) => {
  if (!currentUser) throw new Error("User not logged in");
  const status = PROJECT_STATUSES.READY_TO_BE_ASSIGNED_TO_GC;

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
        generalContractor: {},
      },
    },
    { returnDocument: "after" }
  );
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for Project Rejected by GC could not be changed.");
  }

  await createProjectLog(currentUser, project, project.status, status, comment);

  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
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
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error(
      "Status for Ready to be Assigned to GC could not be changed."
    );
  }

  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
};

const moveToOnSiteInspectionScheduled = async (
  currentUser,
  project,
  onSiteInspectionDate
) => {
  if (!currentUser) throw "User not logged in";
  const status = PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED;

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

const moveToReviewingProposal = async (
  currentUser,
  project
) => {
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
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for Reviewing Proposal could not be changed.");
  }
  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
};

const moveToUpdatingProposal = async (
  currentUser,
  project
) => {
  if (!currentUser) throw "User not logged in";
  const status = PROJECT_STATUSES.UPDATING_PROPOSAL;

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
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for Updating Proposal could not be changed.");
  }
  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );
  return updatedProject;
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

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {
        status: status,
        scheduledInstallationStartDate: new Date(scheduledInstallationStartDate),
      },
    },
    { returnDocument: "after" }
  );
  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for scheduling Installation could not be changed.");
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

  const tasks = await getAllTasks(currentUser, project._id.toString());
  if (!tasks.length) {
    throw new Error("No tasks found for this project");
  }

  if (tasks.filter((task) => task.status !== TASK_STATUSES.COMPLETED).length) {
    throw new Error("All tasks are not completed");
  }

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
};
