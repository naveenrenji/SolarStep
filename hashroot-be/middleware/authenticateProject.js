import { PROJECT_STATUSES } from "../constants.js";
import { getProjectById } from "../data/projects.js";

const authenticateProject = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Authorization not properly defined" });
    }
    const { projectId } = req.params;
    req.project = await getProjectById(req.user, projectId);
    next();
  } catch (error) {
    return res.status(401).json({ error: error?.toString() });
  }
};

export default authenticateProject;
