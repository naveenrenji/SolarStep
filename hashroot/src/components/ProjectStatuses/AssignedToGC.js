import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import { GrUserWorker } from "react-icons/gr";
import { BsExclamationLg } from "react-icons/bs";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";

const AssignedToGC = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showRejectConfirmationModal, setShowRejectConfirmationModal] =
    React.useState(false);

  const onGCAcceptsProposal = async () => {
    console.log(project._id);
    // return await gcAcceptsProposalAPI(project._id);
  };

  const onGCRejectsProposal = async () => {
    console.log(project._id);
    // return await gcRejectsProposalAPI(project._id);
  };

  return (
    <Card className="shadow-sm mt-3 h-100 project-status">
      <Card.Body
        className="mb-0 flex-1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Stack direction="horizontal" style={{ justifyContent: "center" }}>
          <GrUserWorker
            className="primary"
            style={{
              height: "12rem",
              width: "12rem",
              marginBottom: "1rem",
            }}
          />
          <BsExclamationLg
            className="secondary"
            style={{
              height: "8rem",
              width: "8rem",
              marginBottom: "1rem",
            }}
          />
        </Stack>
        <Card.Text>The project is assigned to General Contractor.</Card.Text>
        {[USER_ROLES.SALES_REP, USER_ROLES.CUSTOMER].includes(
          auth.user.role
        ) ? (
          <Card.Text>
            Please wait for the general contractor to have a look at the
            proposal
          </Card.Text>
        ) : [USER_ROLES.ADMIN, USER_ROLES.GENERAL_CONTRACTOR].includes(
            auth.user.role
          ) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please check the proposal and accept it if you are happy with it
            </Card.Text>
            <Button variant="link">View Proposal</Button>
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={onGCAcceptsProposal}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure you have checked the proposal and you are not happy with it. You will be assigned and accepted as a new General Contractor to this project."
                confirmText="Yes, move to next state"
                cancelText="No, cancel"
                type="primary"
              />
            ) : (
              <></>
            )}
            {showRejectConfirmationModal ? (
              <ConfirmationModal
                key="reject"
                show={showRejectConfirmationModal}
                onClose={() => setShowRejectConfirmationModal(false)}
                onConfirm={onGCRejectsProposal}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to reject the proposal?"
                body="Please confirm if you want to reject the proposal. You will be removed from the project and the project will be assigned to another General Contractor."
                confirmText="Yes, move to next state"
                cancelText="No, cancel"
                type="danger"
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </Card.Body>
      {[USER_ROLES.ADMIN, USER_ROLES.GENERAL_CONTRACTOR].includes(
        auth.user.role
      ) ? (
        <Card.Footer>
          <Stack style={{ float: "right" }} gap={2} direction="horizontal">
            <SubmitButton
              onClick={() => setShowRejectConfirmationModal(true)}
              className="ml-3"
              variant="secondary"
            >
              Reject Proposal
            </SubmitButton>
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              Accept Proposal
            </SubmitButton>
          </Stack>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default AssignedToGC;
