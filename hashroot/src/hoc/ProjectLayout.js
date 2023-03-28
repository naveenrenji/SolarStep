import React, { useCallback, useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router";

import { getProjectApi } from "../api/projects";

import ErrorCard from "../components/shared/ErrorCard";
import Loader from "../components/shared/Loader";
import ProjectContext from "../config/ProjectContext";

const ProjectLayout = () => {
  const { projectId } = useParams();
  const [project, setProject] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const getProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjectApi(projectId);
      setProject(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not fetch project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  const updateProject = useCallback((newProject) => {
    setProject(newProject);
  }, []);

  const projectContextValue = useMemo(() => {
    return { project, updateProject };
  }, [project, updateProject]);

  return (
    <ProjectContext.Provider value={projectContextValue}>
      <div
        className="h-100"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorCard error={error} />
        ) : (
          <Outlet />
        )}
      </div>
    </ProjectContext.Provider>
  );
};

export default ProjectLayout;
