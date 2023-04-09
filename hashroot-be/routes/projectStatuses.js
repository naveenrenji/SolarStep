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
  moveToReadyForInstallation,
  moveToReadyToBeAssignedToGC,
  moveToReviewingProposal,
  moveToUpdatingProposal,
  projectClosingOut,
  projectComplete,
  projectValidatingPermits,
  updateProjectStatusToAssignedToGC,
  acceptProjectByGC,
  rejectProjectByGC,
  moveToInstallationStarted,
} from "../data/projectStatuses.js";
import authorizeRequest from "../middleware/authorizeRequest.js";

const router = Router();

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
  .route(`/${PROJECT_STATUS_KEYS.ASSIGNED_TO_GC}`)
  .patch(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      try {
        const project = await updateProjectStatusToAssignedToGC(
          req.user,
          req.project,
          req.body.generalContractorId
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.GC_ACCEPTED}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
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
  .route(`/REJECTED/${PROJECT_STATUS_KEYS.READY_TO_BE_ASSIGNED_TO_GC}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        if (!req.body.comment) {
          throw new Error("comment is required");
        }
        const project = await rejectProjectByGC(
          req.user,
          req.project,
          req.body.comment
        );
        res.json({ project });
      } catch (error) {
        return res.status(400).json({ error: error.toString() });
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
  .route(`/${PROJECT_STATUS_KEYS.UPDATING_PROPOSAL}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const project = await moveToUpdatingProposal(req.user, req.project);
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.UPDATING_PROPOSAL,
          `The proposal needs to be updated`
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.REVIEWING_PROPOSAL}`)
  .patch(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      try {
        const project = await moveToReviewingProposal(req.user, req.project);
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.REVIEWING_PROPOSAL,
          `Proposal is currently under review`
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(
    `/${PROJECT_STATUS_KEYS.REJECTED}/${PROJECT_STATUS_KEYS.UPDATING_PROPOSAL}`
  )
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.CUSTOMER,
    ]),
    async (req, res) => {
      try {
        const project = await moveToUpdatingProposal(req.user, req.project);
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.UPDATING_PROPOSAL,
          req.body.comment ||
            `The proposal was rejected and needs to be updated`
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.READY_FOR_INSTALLATION}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { installationDate } = req.body;
        const project = await moveToReadyForInstallation(
          req.user,
          req.project,
          installationDate
        );
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.READY_FOR_INSTALLATION,
          `Installation scheduled on ${installationDate}`
        );
        res.json({ project });
      } catch (error) {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

router
  .route(`/${PROJECT_STATUS_KEYS.INSTALLATION_STARTED}`)
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { installationDate } = req.body;
        const project = await moveToInstallationStarted(req.user, req.project);
        await createProjectLog(
          req.user,
          req.project,
          req.project.status,
          PROJECT_STATUSES.READY_FOR_INSTALLATION,
          `Installation scheduled on ${installationDate}`
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
