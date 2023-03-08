import userRoutes from "./users.js";

const configureRoutes = (app) => {
  app.use("/api/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default configureRoutes;
