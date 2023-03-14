import { USER_ROLES } from "../constants.js";

const authorizeRequest =
  (roles = Object.values(USER_ROLES)) =>
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Authorization not properly defined" });
      }
      if (!roles.includes(req.user.role)) {
        return res
          .status(401)
          .json({ error: "You are not authorised to access this route" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: "Unauthorised request" });
    }
  };

export default authorizeRequest;
