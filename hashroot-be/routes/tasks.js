import express from "express";
import { USER_ROLES } from "../constants.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  updateTaskStatus,
} from "../data/tasks.js";
import * as helpers from "../helpers.js";
import authorizeRequest from "../middleware/authorizeRequest.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authorizeRequest(), async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await getAllTasks(req.user, projectId);
      res.json({ tasks });
    } catch (error) {
      res.status(400).json({ error: error?.toString() });
    }
  })
  .post(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { projectId } = req.params;
        let {
          workerIds,
          title,
          description,
          expectedCompletionDate,
          generalContractorId,
        } = req.body;
        if (req.user.role !== USER_ROLES.GENERAL_CONTRACTOR) {
          helpers.checkId(generalContractorId, "General Contractor Id");
        } else {
          generalContractorId = req.user._id;
        }
        const tasks = await createTask(
          req.user,
          projectId,
          title,
          description,
          expectedCompletionDate,
          generalContractorId,
          workerIds
        );
        res.json({ tasks });
      } catch (error) {
        res.status(400).json({ error: error?.toString() });
      }
    }
  );

router
  .route("/:taskId")
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { projectId, taskId } = req.params;
        const { title, description, workerIds } = req.body;
        const task = await updateTask(
          req.user,
          projectId,
          taskId,
          title,
          description,
          workerIds
        );

        res.json({ task });
      } catch (error) {
        res.status(400).json({ error: error?.toString() });
      }
    }
  )
  .delete(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ]),
    async (req, res) => {
      try {
        const { projectId, taskId } = req.params;
        const task = await deleteTask(req.user, projectId, taskId);

        res.json({ task });
      } catch (error) {
        res.status(400).json({ error: error?.toString() });
      }
    }
  );

router
  .route("/:taskId/status")
  .patch(
    authorizeRequest([
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
      USER_ROLES.WORKER,
    ]),
    async (req, res) => {
      try {
        const { projectId, taskId } = req.params;
        const { status } = req.body;
        const task = await updateTaskStatus(
          req.user,
          projectId,
          taskId,
          status
        );

        res.json({ task });
      } catch (error) {
        res.status(400).json({ error: error?.toString() });
      }
    }
  );

export default router;
