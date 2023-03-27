import http from "./http";

export const createProjectApi = async (body) => {
  const { projectName, userId, address } = body;

  const {
    data: { project },
  } = await http.post("/projects", {
    projectName,
    userId,
    address,
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

