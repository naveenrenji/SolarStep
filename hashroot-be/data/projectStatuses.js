import { projects, projectStatusLogs } from "../config/mongoCollections.js";
import { PROJECT_STATUSES } from "../constants.js";
import { checkProjectStatus } from "../helpers.js";

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
  const status = PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED;
  // Write the code here
  const allProjects = await projects()
  const result = await allProjects.findOneAndUpdate(
    { _id: new ObjectId(project._id) },
    {
      $set: {status, onSiteInspectionDate},
    },
    { returnDocument: "after" }
  );

  if (result.lastErrorObject.n === 0) {
    throw new Error(`Could not set the inspection date for Project ${project._id}.`);
  }
  return project
};

export { createProjectLog, moveToOnSiteInspectionScheduled };
