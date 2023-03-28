import React, { useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import ProgressBar from "react-bootstrap/esm/ProgressBar";

import { getProjectApi } from "../../api/projects";
import useProject from "../../hooks/useProject";
import { getProgressBarPercentage } from "../../utils";
import ProjectStatuses from "../ProjectStatuses";

import RouteHeader from "../shared/RouteHeader";

export const projectLoader = async ({ params }) => {
  const projects = getProjectApi(params.projectId);
  return { projects };
};

const Project = () => {
  const { project } = useProject();

  const progress = useMemo(() => {
    if (!project) return 0;
    return getProgressBarPercentage(project.status);
  }, [project]);

  return (
    <>
      <RouteHeader
        headerText={
          "Project" + (project?.projectName ? ` ${project?.projectName}` : "")
        }
      />
      <Card className="shadow-sm mt-3 h-100">
        <Card.Body
          className="mb-0"
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ProgressBar striped now={progress} label={`${progress}%`} />
          <Card className="shadow-sm mt-3">
            <Card.Body className="mb-0">
              Project ID: {project?._id}
              Current Status: {project?.status}
            </Card.Body>
          </Card>
          <ProjectStatuses project={project} />
        </Card.Body>
      </Card>
    </>
  );
};

export default Project;
