import userRoutes from "./users.js";
import authRoutes from "./auth.js";

const configureRoutes = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api", authRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configureRoutes;
