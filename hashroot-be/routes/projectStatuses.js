import { Router } from "express";
import { PROJECT_STATUSES, PROJECT_STATUS_KEYS } from "../constants.js";
import {
  createProjectLog,
  moveToOnSiteInspectionScheduled,
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

export default router;
