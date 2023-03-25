import userRoutes from "./users.js";
import authRoutes from "./auth.js";
import projectRoutes from "./projects";
import authenticateRequest from "../middleware/authenticateRequest.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);
  app.use("/api/users", authenticateRequest, userRoutes);
  app.use("/api/projects", authenticateRequest, projectRoutes);


  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configureRoutes;
