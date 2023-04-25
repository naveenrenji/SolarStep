import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { mongoConfig } from "../config/settings.js";
import { dbConnection } from "../config/mongoConnection.js";

const maxSize = 2 * 1024 * 1024;

let storage = new GridFsStorage({
  db: dbConnection(),
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (_, file) => {
    return {
      bucketName: mongoConfig.fileBucket,
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

let uploadFile = util.promisify(
  multer({
    storage,
    limits: { fileSize: maxSize },
  }).single("file")
);

export default uploadFile;
