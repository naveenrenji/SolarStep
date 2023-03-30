import { PROJECT_STATUSES } from "../constants.js";

const authenticateTaskCrud = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Authorization not properly defined" });
    }
    if (!req.project) {
      return res
        .status(401)
        .json({ error: "Project not defined" });
    }

    if (req.project.status !== PROJECT_STATUSES.INSTALLATION_STARTED) {
      throw new Error("Project installation not started yet");
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: error?.toString() });
  }
};

export default authenticateTaskCrud;
