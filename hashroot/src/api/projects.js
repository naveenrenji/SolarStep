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

export const uploadProjectDocumentApi = async (projectId, file, type) => {
  const formData = new FormData();
  formData.append("file", file);

  const {
    data: { project },
  } = await http.post(`/projects/${projectId}/files/upload`, formData, {
    params: { type },
  });
  return project;
};

export const downloadProjectDocumentApi = async (projectId, fileId) => {
  return await http.get(`/projects/${projectId}/files/${fileId}/download`);
};

export const deleteProjectDocumentApi = async (projectId, fileId) => {
  const {
    data: { project },
  } = await http.delete(`/projects/${projectId}/files/${fileId}/delete`);
  return project;
}

export const signContractApi = async (projectId, documentId, body) => {
  const {
    data: { project },
  } = await http.patch(`/projects/${projectId}/files/${documentId}/sign`, body);
  return project;
};

export const getProjectAuthorizationsApi = async (projectId) => {
  const {
    data: { authorizations },
  } = await http.get(`/projects/${projectId}/authorizations`);

  return authorizations;
};


export const getProjectEnergyUsageApi = async (projectId) => {
  const {
    data: { project },
  } = await http.get(`/projects/${projectId}/energy-usage`);

  return project;
};
