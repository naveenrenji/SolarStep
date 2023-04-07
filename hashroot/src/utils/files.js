import { PROJECT_UPLOAD_TYPES } from "../constants";
import { capitalize } from "./user";

export const getProjectDocumentDownloadUrl = (projectId, fileId) => {
  return `${process.env.REACT_APP_API_URL}projects/${projectId}/files/${fileId}/download`;
};

export const getProjectFileUploadTypes = () => {
  return Object.values(PROJECT_UPLOAD_TYPES)
    .filter((type) => type !== PROJECT_UPLOAD_TYPES.contract)
    .map(capitalize);
};
