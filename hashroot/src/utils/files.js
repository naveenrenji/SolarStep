export const getProjectDocumentDownloadUrl = (projectId, fileId) => {
  return `${process.env.REACT_APP_API_URL}projects/${projectId}/files/${fileId}/download`;
};
