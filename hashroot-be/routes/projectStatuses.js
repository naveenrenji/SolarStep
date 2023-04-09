import { Router } from "express";

import {
  PROJECT_STATUSES,
  PROJECT_STATUS_KEYS,
  USER_ROLES,
} from "../constants.js";
import {
  createProjectLog,
  moveToOnSiteInspectionInProgress,
  moveToOnSiteInspectionScheduled,
  moveToReadyToBeAssignedToGC,
  projectClosingOut,
  projectComplete,
  projectValidatingPermits,
  updateProjectStatusToAssignedToGC,
  acceptProjectByGC,
  rejectProjectByGC
} from "../data/projectStatuses.js";
import authorizeRequest from "../middleware/authorizeRequest.js";

const router = Router();

router
  .route(`/${PROJECT_STATUS_KEYS.ASSIGNED_TO_GC}`)
  .patch(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      try {
        const project = await updateProjectStatusToAssignedToGC(
          req.user,
          req.project
        );
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.ASSIGNED_TO_GC
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error.toString() });
      }
    }
  );

// Define the route handlers for the APIs
/*router.patch("/GC_ACCEPTED", async (req, res) => {
  const projectId = req.params.projectId;
  const currentUser = req.user;

  try {
    const project = await db.collection('projects').findOne({ _id: new ObjectID(projectId) });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!isUserAuthorized(currentUser, project)) {
      return res.status(403).json({ message: "User not authorized" });
    }

    const updatedProject = await db.collection('projects').findOneAndUpdate(
      { _id: new ObjectID(projectId) },
      { $set: { status: 'GC Accepted' } },
      { returnOriginal: false }
    );

    const projectStatusLog = {
      _id: new ObjectID(),
      projectId: new Object(project._id),
      doneBy: {
        _id: new ObjectID(currentUser._id),
        email: currentUser.email,
        role: currentUser.role,
      },
      from: "Assigned to GC",
      to: "GC Accepted",
      comment: null
    };

    await getDb().collection('projectStatusLogs').insertOne(projectStatusLog);

    return res.status(200).json({ project: updatedProject.value });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});*/

/*router.patch("/rejected/ASSIGNED_TO_GC", async (req, res) => {
  const projectId = req.params.projectId;
  const currentUser = req.user;
  const reason = req.body.reason;

  try {
    const project = await db.collection('projects').findOne({ _id: new ObjectID(projectId) });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!isUserAuthorized(currentUser, project)) {
      return res.status(403).json({ message: "User not authorized" });
    }

    const updatedProject = await db.collection('projects').findOneAndUpdate(
      { _id: new ObjectID(projectId) },
      { $set: { status: 'Ready to be assigned to GC' } },
      { returnOriginal: false }
    );

    const projectStatusLog = {
      _id: new ObjectID(),
      projectId: new Object(project._id),
      doneBy: {
        _id: new ObjectID(currentUser._id),
        email: currentUser.email,
        role: currentUser.role,
      },
      from: "Assigned to GC",
      to: "Ready to be assigned to GC",
      comment: reason
    };

    await db.collection('projectStatusLogs').insertOne(projectStatusLog);

    return res.status(200).json({ project: updatedProject.value });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
  });
 
  // Helper function to check if the user is authorized to access the project
  function isUserAuthorized(currentUser, project) {
  if (currentUser.role === 'ADMIN') {
  return true;
  }
  
  if (currentUser.role === 'SALES_REP') {
  return currentUser._id.equals(project.salesRepId);
  }
  
  if (currentUser.role === 'GENERAL_CONTRACTOR') {
  return currentUser._id.equals(project.gcId);
  }
  
  return false;
  }*/
  
router
  .route(`/${PROJECT_STATUS_KEYS.GC_ACCEPTED}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR
    ]),
    async (req, res) => {
      try {
        const project = await acceptProjectByGC(
          req.user,
          req.project,
          req.body.comment
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.ASSIGNED_TO_GC}/rejected`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR
    ]),
    async (req, res) => {
      try {
        const project = await rejectProjectByGC(
          req.user,
          req.project,
          req.body.reason
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.READY_TO_BE_ASSIGNED_TO_GC}`)
  .patch(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      try {
        const project = await moveToReadyToBeAssignedToGC(
          req.user,
          req.project
        );
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.READY_TO_BE_ASSIGNED_TO_GC
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error.toString() });
      }
    }
  );


router
  .route(`/${PROJECT_STATUS_KEYS.ON_SITE_INSPECTION_SCHEDULED}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { onSiteInspectionDate } = req.body;
        const project = await moveToOnSiteInspectionScheduled(
          req.user,
          req.project,
          onSiteInspectionDate
        );
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED,
          `On site inspection scheduled on ${onSiteInspectionDate}`
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.ON_SITE_INSPECTION_IN_PROGRESS}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { onSiteInspectionStartedOn } = req.body;
        const project = await moveToOnSiteInspectionInProgress(
          req.user,
          req.project,
          onSiteInspectionStartedOn
        );
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.ON_SITE_INSPECTION_IN_PROGRESS,
          `On site inspection started on ${onSiteInspectionStartedOn}`
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.COMPLETED}`)
  .patch(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      try {
        const project = await projectComplete(req.user, req.project);
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.COMPLETED
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.CLOSING_OUT}`)
  .patch(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      try {
        const project = await projectClosingOut(req.user, req.project);
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.CLOSING_OUT
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.VALIDATING_PERMITS}`)
  .patch(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      try {
        const project = await projectValidatingPermits(req.user, req.project);
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.VALIDATING_PERMITS
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

export default router;
