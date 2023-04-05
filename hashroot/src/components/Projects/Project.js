import React, { useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import Dropdown from "react-bootstrap/Dropdown";
import { LinkContainer } from "react-router-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";

import { getProjectApi } from "../../api/projects";
import useProject from "../../hooks/useProject";
import { getProgressBarPercentage } from "../../utils";
import ProjectStatuses from "../ProjectStatuses";

import RouteHeader from "../shared/RouteHeader";
import Button from "react-bootstrap/esm/Button";
import ViewProjectModal from "../shared/ViewProjectModal";

export const projectLoader = async ({ params }) => {
  const projects = getProjectApi(params.projectId);
  return { projects };
};

const Project = () => {
  const { project } = useProject();
  const [showProjectModal, setShowProjectModal] = React.useState(false);

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
            <Card.Body
              className="mb-0"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <LinkContainer to="/projects">
                <Button
                  variant="outline-primary"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <IoIosArrowBack />
                  &nbsp;Projects
                </Button>
              </LinkContainer>
              <span>Project ID: {project?._id}</span>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-primary"
                  as={Button}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "37.6px",
                  }}
                  className="project-dropdown"
                >
                  <GiHamburgerMenu />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setShowProjectModal(true)}>
                    View
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    View Files
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
          </Card>
          <ProjectStatuses project={project} />
          {showProjectModal ? (
            <ViewProjectModal
              project={project}
              show={showProjectModal}
              onClose={() => setShowProjectModal(false)}
            />
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default Project;
