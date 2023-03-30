import userRoutes from "./users.js";
import authRoutes from "./auth.js";
import projectRoutes from "./projects.js";
import taskRoutes from "./tasks.js";
import authenticateRequest from "../middleware/authenticateRequest.js";
import authenticateProject from "../middleware/authenticateProject.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);
  app.use("/api/users", authenticateRequest, userRoutes);
  app.use("/api/projects", authenticateRequest, projectRoutes);
  app.use(
    "/api/projects/:projectId/tasks",
    authenticateRequest,
    authenticateProject,
    taskRoutes
  );

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configureRoutes;
