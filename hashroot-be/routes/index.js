import userRoutes from "./users.js";
import authRoutes from "./auth.js";
import projectRoutes from "./projects.js";
import taskRoutes from "./tasks.js";
import projectStatusRoutes from "./projectStatuses.js";
import authenticateRequest from "../middleware/authenticateRequest.js";
import authenticateProject from "../middleware/authenticateProject.js";
import authenticateTaskCrud from "../middleware/authenticatTaskCrud.js";
import filesRoutes from "./files.js";
import authenticateProjectStatusChange from "../middleware/authenticateProjectStatusChange.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);
  app.use("/api/users", authenticateRequest, userRoutes);
  app.use("/api/projects", authenticateRequest, projectRoutes);
  app.use(
    "/api/projects/:projectId/tasks",
    authenticateRequest,
    authenticateProject,
    authenticateTaskCrud,
    taskRoutes
  );
  app.use(
    "/api/projects/:projectId/status",
    authenticateRequest,
    authenticateProject,
    authenticateProjectStatusChange,
    projectStatusRoutes
  );
  app.use(
    "/api/projects/:projectId/files",
    authenticateRequest,
    authenticateProject,
    filesRoutes
  );

  app.use("*", (_, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configureRoutes;
