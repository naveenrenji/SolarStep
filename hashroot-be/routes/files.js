import { Router } from "express";
import { USER_ROLES } from "../constants.js";
import authorizeRequest from "../middleware/authorizeRequest.js";
import { filesData, projectsData } from "../data/index.js";
import { downloadFileAuthorizer, uploadFileAuthorizer } from "../middleware/fileAuthorizers.js";

const router = Router();

router.route("/upload").post(uploadFileAuthorizer, filesData.uploadPdfFile);

router
  .route("/:fileId/download")
  .get(downloadFileAuthorizer, filesData.downloadPdfFile);

router
  .route("/:fileId/sign")
  .patch(
    authorizeRequest([USER_ROLES.CUSTOMER, USER_ROLES.GENERAL_CONTRACTOR]),
    async (req, res) => {
      try {
        const { fileId } = req.params;
        const { customerSign, generalContractorSign } = req.body;
        if (!customerSign && !generalContractorSign) {
          throw new Error("customerSign or generalContractorSign is required");
        }
        const project = await projectsData.signDocument(
          req.user,
          req.project._id,
          fileId,
          {
            customerSign,
            generalContractorSign,
          }
        );
        return res.status(200).json({ project });
      } catch (e) {
        return res.status(404).json({ error: e.toString() });
      }
    }
  );

router.route("/:fileId/delete").delete(async (req, res) => {
  try {
    let project = await filesData.deletePdfFile(req, res);
    return res.status(200).json({ project });
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
});

export default router;
