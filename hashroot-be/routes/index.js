import userRoutes from "./users.js";
import authRoutes from "./auth.js";
import authenticateRequest from "../middleware/authenticateRequest.js";

const configureRoutes = (app) => {
  app.use("/api", authRoutes);
  app.use("/api/users", authenticateRequest, userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configureRoutes;
