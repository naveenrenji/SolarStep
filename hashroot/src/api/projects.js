import http from "./http";

export const createProjectApi = async (body) => {
  const { projectName, userId, address, salesRepId } = body;

  const {
    data: { project },
  } = await http.post("/projects", {
    projectName,
    userId,
    address,
    salesRepId,
  });
  return project;
};

export const getPaginatedProjectsApi = async (params) => {
  const { page, search, statuses } = params;

  const {
    data: { projects, totalPages },
  } = await http.get("/projects", { params: { page, search, statuses } });
  return { projects, totalPages };
};

export const getProjectApi = async (projectId) => {
  const {
    data: { project },
  } = await http.get(`/projects/${projectId}`);
  return project;
};

export const uploadProjectDocumentApi = async (projectId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const {
    data: { project },
  } = await http.post(`/projects/${projectId}/documents`, formData);
  return project;
};

export const signContractApi = async (projectId, documentId, body) => {
  const {
    data: { project },
  } = await http.patch(`/projects/${projectId}/documents/${documentId}/sign`, body);
  return project;
};
