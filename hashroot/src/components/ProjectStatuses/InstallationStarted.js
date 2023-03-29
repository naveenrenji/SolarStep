import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import { LinkContainer } from "react-router-bootstrap";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";

const InstallationStarted = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);

  const completeInstallation = async () => {
    console.log(project._id);
    // return await startInstallationApi(project._id);
  };

  return (
    <Card className="shadow-sm mt-3 h-100">
      <Card.Body
        className="mb-0 flex-1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Card.Text>The project installation is in progress.</Card.Text>
        <div style={{ textAlign: "center" }}>
          <Card.Text>
            You currently have {project.incompleteTasks} incomplete tasks out of{" "}
            {project.totalTasks}
          </Card.Text>
          <LinkContainer to={`/projects/${project._id}/tasks`}>
            <Button variant="link">View Tasks</Button>
          </LinkContainer>
          {showConfirmationModal ? (
            <ConfirmationModal
              key="accept"
              show={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
              onConfirm={completeInstallation}
              afterConfirm={(updatedProject) => updateProject(updatedProject)}
              title="Are you sure you want to move to next state?"
              body="All your tasks must be completed before you can move to next state. Your installation will be marked as completed once you move to next state."
              confirmText="Yes, move to next state"
              cancelText="No, cancel"
              type="primary"
            />
          ) : (
            <></>
          )}
        </div>
      </Card.Body>
      {[
        USER_ROLES.ADMIN,
        USER_ROLES.GENERAL_CONTRACTOR,
        USER_ROLES.SALES_REP,
      ].includes(auth.user.role) ? (
        <Card.Footer>
          <div style={{ marginLeft: "auto", marginRight: 0, display: "block" }}>
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
              disabled={project.incompleteTasks > 0}
            >
              Complete Installation
            </SubmitButton>
          </div>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default InstallationStarted;
