import jwt from "jsonwebtoken";
import { userWithEmail } from "../data/users.js";

const authenticateRequest = async (req, res, next) => {
  try {
    const { accesstoken } = req.headers;
    const { id, email } = (await jwt.verify(accesstoken, "secret")) || {};
    if (!id || !email) {
      throw new Error("Unauthorised request");
    }
    const user = await userWithEmail(email);
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "Unauthorised request" });
  }
};

export default authenticateRequest;
