import { ObjectId } from "mongodb";
import { projectStatusLogs, projects } from "../config/mongoCollections.js";
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

const projectComplete = async (currentUser, project, completed) => {
  if (!currentUser) 
    throw 'User not logged in';

  // if (currentUser.role !== USER_ROLES.ADMIN && currentUser.role !== USER_ROLES.SALES_REP) {
  //   throw 'Only admins and sales reps can update project status to completed';
  // }

  const status = PROJECT_STATUSES.COMPLETED;

  if (project.status === status) {
    throw 'Project status is already completed';
  }

  let projectCollections = await projects();
  const updatedProjectLog = await projectCollections.findOneAndUpdate(
    {_id: new ObjectId(project._id)},
    {
      $set: {
        status: status,
        completed: completed,
        completedAt: new Date(),
      },
    },
    {returnDocument: "after" }
  );

  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for Projects could not be changed to Completed.")
  }

  const updatedProject = await getProjectById(currentUser, project._id.toString());
  return updatedProject;
}

const projectClosingOut = async (currentUser, project, closingout) => {
  if (!currentUser) throw 'User not logged in';

// if (currentUser.role !== USER_ROLES.ADMIN && currentUser.role !== USER_ROLES.SALES_REP) throw 'Only admins and sales reps can update project status to completed';

const status = PROJECT_STATUSES.CLOSING_OUT;

let projectCollections = await projects();
const updatedProjectLog = projectCollections.findOneAndUpdate({_id: new ObjectId(project._id)},
{
  $set: {
    status: status,
    closingout: closingout,
  },
},
{returnDocument: "after"}
);
if(updatedProjectLog.lastErrorObject.n !== 1 || updatedProjectLog.value){
  throw new Error("Status for Projects could not be changed to Closing Out.");
}
const updatedProject = await getProjectById(
  currentUser,
  project._id.toString()
);

return updatedProject;

}

const projectValidatingPermits = async (
  currentUser,
  project,
  validating_user
) => {
  if (!currentUser) throw 'User not logged in';

  // if (currentUser.role !== USER_ROLES.ADMIN && currentUser.role !== USER_ROLES.SALES_REP) {
  //   throw 'Only admins and sales reps can update project status to completed';
  // }

  const status = PROJECT_STATUSES.VALIDATING_PERMITS;

  let projectCollections = await projects();
  const updatedProjectLog = projectCollections.findOneAndUpdate(
    {_id: new ObjectId(project._id)},
    {
      $set: {
        status: status,
        validating_user: validating_user,
        installationCompletedAt: new Date(),
      },
    },
    {returnDocument: "after"}
  );

  if (updatedProjectLog.lastErrorObject.n !== 1 || !updatedProjectLog.value) {
    throw new Error("Status for On-Site Inspection could not be changed.");
  }

  const updatedProject = await getProjectById(
    currentUser,
    project._id.toString()
  );

  return updatedProject;
}


export { createProjectLog, moveToOnSiteInspectionScheduled, projectClosingOut, projectComplete,  projectValidatingPermits};
