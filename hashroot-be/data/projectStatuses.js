import { ObjectId } from "mongodb";
import { projectStatusLogs } from "../config/mongoCollections.js";
import { PROJECT_STATUSES } from "../constants.js";
import { checkProjectStatus } from "../helpers.js";
import { USER_ROLES } from "../constants.js";

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

// completed status below
const ProjectStatusLog = (currentUser, project, from) => {
  if (currentUser.role !== USER_ROLES.ADMIN && currentUser.role !== USER_ROLES.SALES_REP) {
    throw 'Only admins and sales reps can update project status to completed';
}
const _id = new ObjectId();
const projectId = new ObjectId(project._id);
const user = {
  _id: new ObjectId(currentUser._id),
  email: currentUser.email,
  role: currentUser.role,
};
return {
_id,
projectId,
user,
from,
to: PROJECT_STATUSES.COMPLETED, 
comment: null,
completedAt: new Date() 
  };
};


// closing out status below
const ProjectStatusLogClosing = (currentUser, project, from) => {
  if(currentUser.role !== USER_ROLES.ADMIN && currentUser.role !== USER_ROLES.SALES_REP){
    throw 'Only the admins and sales reps can update project status to closing out';
  }
  const _id = new ObjectId();
  const projectId = new ObjectId(project._id);
  const user = {
    _id: new ObjectId(currentUser._id),
    email: currentUser.email,
    role: currentUser.role,
  };
  return {
_id,
projectId,
user,
from,
to: PROJECT_STATUSES.CLOSING_OUT, 
comment: null
};
};


// changing the status log to installationcomplete
const projectStatusLogChange = (currentUser, project, from) => {
  if (currentUser.role !== USER_ROLES.ADMIN && currentUser.role !== USER_ROLES.SALES_REP){
    throw 'Only admins and sales reps can update project status to validating permits';
  }

const to = PROJECT_STATUSES.VALIDATING_PERMITS;
const installationCompletedAt = new Date();
const _id = new ObjectId();
const projectId = new Object(project._id);
const user = {
  _id: new ObjectId(currentUser._id),
  email: currentUser.email,
  role: currentUser.role,
};
  return {
  _id,
  projectId,
  user,
  from,
  to,
  comment: null,
  installationCompletedAt
  };
};


export { createProjectLog, moveToOnSiteInspectionScheduled, ProjectStatusLog, ProjectStatusLogClosing, projectStatusLogChange };
