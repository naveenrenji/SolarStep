import { Router } from "express";
import { PROJECT_STATUSES, PROJECT_STATUS_KEYS, USER_ROLES } from "../constants.js";
import {createProjectLog, moveToOnSiteInspectionScheduled, projectClosingOut, projectComplete,  projectValidatingPermits} from "../data/projectStatuses.js";

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

router
.route(`/${PROJECT_STATUS_KEYS.COMPLETED}`)
.patch(
  authorizeRequest([
    USER_ROLES.ADMIN,
    USER_ROLES.SALES_REP
  ]),
  async (req, res) => {
    try {
      const {completed} = req.body;
      const project = await projectComplete(
        req.user,
        req.project,
        completed
      );
      await createProjectLog(
        req.user,
        req.project,
        req.project.status,
        PROJECT_STATUSES.COMPLETED,
        `Completed Schedule on ${completed}`
      );
      res.json({project});
    } catch{
      return res.status(404).json({error: error?.toString()});
    }
  }
);

router
.route(`/${PROJECT_STATUS_KEYS.CLOSING_OUT}`)
.patch(
  authorizeRequest([
    USER_ROLES.ADMIN,
    USER_ROLES.SALES_REP
  ]),
  async(req, res) => {
    try {
      const {closingout} = req.body;
      const project = await projectClosingOut(
        req.user,
        req.project,
        closingout
      );
      await createProjectLog(
        req.user,
        req.project,
        req.project.status,
        PROJECT_STATUSES.CLOSING_OUT,
        `Closing out on ${closingout}`
      );
      res.json({project});
    } catch{
      return res.status(404).json({error: error?.toString()});
    }
  }
);

router
.route(`/${PROJECT_STATUS_KEYS.VALIDATING_PERMITS}`)
.patch(
  authorizeRequest([
    USER_ROLES.ADMIN,
    USER_ROLES.SALES_REP
  ]),
  async (req, res) => {
    try {
      const {validating_user} = req.body;
      const project = await projectValidatingPermits(
        req.user,
        req.project,
        validating_user
      );
      await createProjectLog(
        req.user,
        req.project,
        req.project.status,
        PROJECT_STATUSES.VALIDATING_PERMITS,
        `The project is validating users with ${validating_user}`
      );
      res.json({project});
    } catch{
      return res.status(404).json({error: error?.toString()})
    }
  }
)


export default router;
