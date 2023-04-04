import { Router } from "express";
import { projectsData } from "../data/index.js";
import { USER_ROLES } from "../constants.js";
import * as helpers from "../helpers.js";
import authorizeRequest from "../middleware/authorizeRequest.js";
import { filesData } from "../data/index.js";

const router = Router();

router
  .route("/upload")
  .post(
    authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP]),
    async (req, res) => {
      const { file, projectName } = req.files;

      if (!file || !projectName) {
        return res
          .status(400)
          .json({ error: "File and projectName are required." });
      }
      if (
        req.user.role === USER_ROLES.ADMIN ||
        req.user.role === USER_ROLES.SALES_REP
      ) {
        filesData
          .uploadPdfFile(projectName.name, file.data)
          .then((result) => {
            return res.status(200).json(result);
          })
          .catch((error) => {
            return res.status(500).json(error);
          });
      }
    }
  );

  export default router;

