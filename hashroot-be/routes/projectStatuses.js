import { Router } from "express";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_KEYS,
  USER_ROLES,
} from "../constants.js";
import {
  createProjectLog,
  moveToOnSiteInspectionScheduled,
  projectClosingOut,
  projectComplete,
  projectValidatingPermits,
} from "../data/projectStatuses.js";

const router = Router();

router
  .route(`/${PROJECT_STATUS_KEYS.ON_SITE_INSPECTION_SCHEDULED}`)
  .patch(async (req, res) => {
    try {
      const { onSiteInspectionDate } = body;
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
    } catch {
      return res.status(404).json({ error: error?.toString() });
    }
  });

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
      } catch {
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
      } catch {
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
      } catch {
        return res.status(404).json({ error: error?.toString() });
      }
    }
  );

export default router;
