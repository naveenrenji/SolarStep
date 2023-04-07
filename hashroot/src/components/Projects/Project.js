import React, { useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import Dropdown from "react-bootstrap/Dropdown";
import { LinkContainer } from "react-router-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";

import { uploadProjectDocumentApi } from "../../api/projects";
import useProject from "../../hooks/useProject";
import { getProgressBarPercentage } from "../../utils";
import ProjectStatuses from "../ProjectStatuses";

import RouteHeader from "../shared/RouteHeader";
import Button from "react-bootstrap/esm/Button";
import ProjectDocuments from "./ProjectDocuments";
import ViewProjectModal from "../shared/ViewProjectModal";
import FileUploadModal from "../shared/FileUploadModal";

const Project = () => {
  const { project, updateProject } = useProject();
  const [showProjectModal, setShowProjectModal] = React.useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = React.useState(false);
  const [showProjectDcouments, setShowProjectDocuments] = React.useState(false);

  const progress = useMemo(() => {
    if (!project) return 0;
    return getProgressBarPercentage(project.status);
  }, [project]);

  const handleFileUpload = async ({ file, type }) => {
    return await uploadProjectDocumentApi(project._id, file, type);
  };

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
          {showProjectDcouments ? (
            <ProjectDocuments
              project={project}
              onClose={() => setShowProjectDocuments(false)}
              onUploadClick={() => setShowFileUploadModal(true)}
            />
          ) : (
            <>
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
                  <b>{project?._id}</b>
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
                      <Dropdown.Item
                        onClick={() => setShowProjectDocuments(true)}
                      >
                        View Files
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setShowFileUploadModal(true)}
                      >
                        Upload File
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
            </>
          )}
          {showFileUploadModal ? (
            <FileUploadModal
              show={showFileUploadModal}
              onClose={() => setShowFileUploadModal(false)}
              onFileUpload={handleFileUpload}
              afterFileUpload={(updatedProject) =>
                updateProject(updatedProject)
              }
              typeRequired
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
