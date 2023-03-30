import { Router } from "express";
import { PROJECT_STATUSES } from "../constants";

const router = Router();

router.route("/ON_SITE_INSPECTION_SCHEDULED").patch(async (req, res) => {
  try {
    const { onSiteInspectionDate } = body;
    const project = await moveToOnSiteInspectionScheduled(
      req.user,
      req.project,
      PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED,
      onSiteInspectionDate
    );
    res.json({ project });
  } catch {
    return res.status(404).json({ error: error?.toString() });
  }
});

export default router;
