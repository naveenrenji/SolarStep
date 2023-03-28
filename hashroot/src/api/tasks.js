import http from "./http";

export const getProjectTasksApi = async (params) => {
  const { projectId } = params;

  const {
    data: { tasks },
  } = await http.get(`/projects/${projectId}/tasks`);
  return { tasks };
};
