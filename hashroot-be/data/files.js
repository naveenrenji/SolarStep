import uploadFile from "../middleware/uploadFile.js";
import { getBucket, projects } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { PROJECT_UPLOAD_TYPES } from "../constants.js";

const uploadPdfFile = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }
    if (!PROJECT_UPLOAD_TYPES[type]) {
      return res.status(400).json({ error: "Invalid type" });
    }
    await uploadFile(req, res);
    const projectCollection = await projects();
    if (
      req.project.documents?.length &&
      type === PROJECT_UPLOAD_TYPES.contract &&
      req.project.documents.some((doc) => doc.type === type)
    ) {
      // Is this needed?
      // if (
      //   req.project.documents.some(
      //     (doc) => doc.customerSign && doc.generalContractorSign
      //   )
      // ) {
      //   return res.status(400).json({ error: "Contract already signed" });
      // }
      const updateEveryContractAsOld = await projectCollection.updateOne(
        {
          _id: new ObjectId(req.project._id),
          "documents.type": type,
        },
        {
          $set: {
            "documents.$[].latest": false,
          },
        }
      );

      if (!updateEveryContractAsOld.acknowledged) {
        return res
          .status(400)
          .json({ error: "Could not update previous types" });
      }
    }

    const result = await projectCollection.findOneAndUpdate(
      { _id: new ObjectId(req.project._id) },
      {
        $push: {
          documents: {
            _id: new ObjectId(),
            fileId: req.file.id,
            type,
            filename: req.file.filename,
            originalname: req.file.originalname,
            customerSign: "",
            generalContractorSign: "",
            latest: true,
            uploadedBy: {
              _id: new ObjectId(req.user._id),
              email: req.user.email,
            },
            createdAt: new Date(),
          },
        },
      },
      { returnDocument: "after" }
    );
    if (result.lastErrorObject.n === 0) {
      return res.status(400).json({ error: "Could not add file" });
    }
    return res.status(200).json({ project: result.value });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};

const downloadPdfFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!fileId) {
      return res.status(400).send({ error: "File Id is required!" });
    }

    const projectCollection = await projects();
    const project = await projectCollection.findOne({
      _id: new ObjectId(req.project._id),
      "documents.fileId": new ObjectId(fileId),
    });

    if (!project) {
      return res.status(400).send({ error: "File not found!" });
    }
    const bucket = await getBucket();
    let downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ error: "Cannot download the file!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (err) {
    return res.status(500).send({ error: err.toString() });
  }
};

export { uploadPdfFile, downloadPdfFile };
