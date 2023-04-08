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
  const createNewProjectStatusLog = (currentUser, project, from, to, comment) => {
    return {
      projectId: new ObjectId(project._id),
      user: {
        _id: new ObjectId(currentUser._id),
        email: currentUser.email,
      },
      from: from,
      to: to,
      comment: comment,
      createdAt: new Date(),
    }
  };

  const addProjectLog = async (newProjectStatusLog) => {

    const insertInfo = await projectStatusLogCollection.insertOne(
      newProjectStatusLog
    );
  
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      return false;
    }
  
      return true;
    };
  }

const moveToOnSiteInspectionScheduled = async (
  currentUser,
  project,
  onSiteInspectionDate
) => {
  const status = PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED;
  const previousStatus = project.status;
  // Write the code here
  const allProjects = await projects();
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
  await addProjectLog(createProjectLog(currentUser, project, previousStatus, status, null));
  return project;
};

export { createProjectLog, moveToOnSiteInspectionScheduled };
