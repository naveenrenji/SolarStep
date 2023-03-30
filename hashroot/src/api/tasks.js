import http from "./http";

export const getProjectTasksApi = async (params) => {
  const { projectId } = params;

  const {
    data: { tasks },
  } = await http.get(`/projects/${projectId}/tasks`);
  return { tasks };
};

export const createTaskApi = async (params) => {
  const {
    projectId,
    title,
    description,
    workerIds,
    generalContractorId,
    expectedCompletionDate,
  } = params;

  const {
    data: { task },
  } = await http.post(`/projects/${projectId}/tasks`, {
    title,
    description,
    workerIds,
    generalContractorId,
    expectedCompletionDate,
  });
  return { task };
};

export const updateTaskApi = async (params) => {
  const { taskId, projectId, title, description, workerIds } = params;

  const {
    data: { task },
  } = await http.patch(`/projects/${projectId}/tasks/${taskId}`, {
    title,
    description,
    workerIds,
  });
  return { task };
};

export const updateTaskStatusApi = async (params) => {
  const { taskId, projectId, status } = params;

  const {
    data: { task },
  } = await http.patch(`/projects/${projectId}/tasks/${taskId}/status`, {
    status,
  });
  return { task };
};

export const deleteTaskApi = async (params) => {
  const { taskId, projectId } = params;

  const {
    data: { task },
  } = await http.delete(`/projects/${projectId}/tasks/${taskId}`);
  return { task };
};
