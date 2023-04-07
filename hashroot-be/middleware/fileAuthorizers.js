import { ObjectId } from "mongodb";
import { projects } from "../config/mongoCollections.js";
import { PROJECT_UPLOAD_TYPES, USER_ROLES } from "../constants.js";
import authorizeRequest from "./authorizeRequest.js";

const uploadFileAuthorizer = (req, res, next) => {
  try {
    const { type } = req.query;
    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }
    if (!PROJECT_UPLOAD_TYPES[type]) {
      return res.status(400).json({ error: "Invalid type" });
    }

    if (type === PROJECT_UPLOAD_TYPES.contract) {
      return authorizeRequest([USER_ROLES.ADMIN, USER_ROLES.SALES_REP])(
        req,
        res,
        next
      );
    } else {
      return authorizeRequest()(req, res, next);
    }
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
};

const downloadFileAuthorizer = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    if (!fileId) {
      return res.status(400).json({ error: "File Id is required" });
    }

    const projectCollection = await projects();
    const project = await projectCollection.findOne(
      {
        _id: new ObjectId(req.project._id),
        "documents.fileId": new ObjectId(fileId),
      },
      { projection: { _id: 1, "documents.$": 1 } }
    );

    if (!project) {
      return res.status(400).send({ error: "File not found!" });
    }

    if (project.documents[0].type === PROJECT_UPLOAD_TYPES.contract) {
      return authorizeRequest(
        Object.values(USER_ROLES).filter((role) => role !== USER_ROLES.WORKER)
      )(req, res, next);
    }

    return authorizeRequest()(req, res, next);
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
};

export { uploadFileAuthorizer, downloadFileAuthorizer };
