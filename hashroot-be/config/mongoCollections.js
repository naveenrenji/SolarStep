import { dbConnection } from "./mongoConnection.js";
import { mongoConfig } from "./settings.js";
import { GridFSBucket } from "mongodb";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

const getBucketFn = (bucket) => {
  let _bucket = undefined;

  return async () => {
    if (!_bucket) {
      const db = await dbConnection();
      _bucket = new GridFSBucket(db, { bucketName: bucket });
    }

    return _bucket;
  };
};

export const users = getCollectionFn("users");
export const projects = getCollectionFn("projects");
export const tasks = getCollectionFn("tasks");
export const projectStatusLogs = getCollectionFn("projectStatusLogs");
export const files = getCollectionFn(`${mongoConfig.fileBucket}.files`);
export const chunks = getCollectionFn(`${mongoConfig.fileBucket}.chunks`);
export const getBucket = getBucketFn(mongoConfig.fileBucket);
