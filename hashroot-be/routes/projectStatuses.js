import { Router } from "express";
import { PROJECT_STATUSES, PROJECT_STATUS_KEYS } from "../constants.js";
import {createProjectLog, moveToOnSiteInspectionScheduled,ProjectStatusLog, ProjectStatusLogClosing, projectStatusLogChange} from "../data/projectStatuses.js";

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
  .patch(async (req, res) => {
    try {
      const project = req.project;
      project.status = PROJECT_STATUSES.COMPLETED;
      project.completedAt = new Date();
      await req.project.save();
      await createProjectLog(
        req.user,
        req.project,
        req.project.status,
        PROJECT_STATUSES.COMPLETED,
        `Project marked as completed on ${project.completedAt}`
      );

      res.json({ project });
    } catch (error) {
      return res.status(404).json({ error: error?.toString() });
    }
  });

  router
  .route(`/${PROJECT_STATUS_KEYS.CLOSING_OUT}`)
  .patch(async (req, res) => {
    try {
      const project = req.project;
      const result = await createProjectLog(
        req.user,
        project,
        result,
        req.project.status,
        PROJECT_STATUSES.CLOSING_OUT,
        `Project marked as closing out`
      );
      res.json({ success: true });
    }catch(error){
        return res.status(404).json({ error: error?.toString() });
}
  });

  router.patch(`/${PROJECT_STATUS_KEYS.VALIDATING_PERMITS}`, async (req, res) => {
    try {
      const project = req.project;
      const statusLogChange = projectStatusLogChange(req.user, project, project.status);
      project.status = PROJECT_STATUSES.VALIDATING_PERMITS;
      project.installationCompletedAt = statusLogChange.installationCompletedAt;
      await req.project.save();
      await createProjectLog(req.user,req.project,statusLogChange.from,PROJECT_STATUSES.VALIDATING_PERMITS,`Project status changed to VALIDATING_PERMITS`)
      res.json({ project });
    } catch(error){
        return res.status(404).json({ error: error?.toString() });
    }
  });

export default router;
