import {
  PROJECT_STATUSES,
  PROJECT_STATUS_TRANSITIONS_SHOULD_COME_FROM,
} from "../constants.js";

const authenticateProjectStatusChange = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Authorization not properly defined" });
    }
    if (!req.project) {
      return res.status(401).json({ error: "Project not defined" });
    }

    const statusChangeToKey = req.url.split("/").pop();
    const statusChangeTo = PROJECT_STATUSES[statusChangeToKey];

    if (!statusChangeTo) {
      return res.status(401).json({ error: "Invalid status change" });
    }

    if (req.project.status === statusChangeTo) {
      return res
        .status(401)
        .json({ error: `Project already in this '${statusChangeTo}'` });
    }

    if (
      !PROJECT_STATUS_TRANSITIONS_SHOULD_COME_FROM[statusChangeToKey].includes(
        req.project.status
      )
    ) {
      return res.status(401).json({
        error: `Project cannot be changed from '${req.project.status}' to '${statusChangeTo}'`,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: error?.toString() });
  }
};

export default authenticateProjectStatusChange;
