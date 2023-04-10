import React, { useCallback, useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router";

import { getProjectApi, getProjectAuthorizationsApi } from "../api/projects";
import ErrorCard from "../components/shared/ErrorCard";
import Loader from "../components/shared/Loader";
import ProjectContext from "../config/ProjectContext";

const ProjectLayout = () => {
  const { projectId } = useParams();
  const [project, setProject] = React.useState();
  const [authorizations, setAuthorizations] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const getProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjectApi(projectId);
      setProject(data);
      const authData = await getProjectAuthorizationsApi(projectId);
      setAuthorizations(authData);
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
    return { project, authorizations, updateProject };
  }, [project, authorizations, updateProject]);

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
