import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import { GrDocumentUser } from "react-icons/gr";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";

const ReviewingProposal = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showRejectConfirmationModal, setShowRejectConfirmationModal] =
    React.useState(false);

  const onCustomerAcceptsUpdatedProposal = async () => {
    console.log(project._id);
    // return await gcUpdatesProposalApi(project._id);
  };

  const onCustomerRejectsUpdatedProposal = async () => {
    console.log(project._id);
    // return await gcUpdatesProposalApi(project._id);
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
        <GrDocumentUser
          className="primary"
          style={{
            height: "12rem",
            width: "12rem",
            marginBottom: "1rem",
          }}
        />
        <Card.Text>The project is assigned to General Contractor.</Card.Text>
        {[USER_ROLES.GENERAL_CONTRACTOR, USER_ROLES.WORKER].includes(
          auth.user.role
        ) ? (
          <Card.Text>
            Please wait for the customer to accept the proposal
          </Card.Text>
        ) : [
            USER_ROLES.ADMIN,
            USER_ROLES.CUSTOMER,
            USER_ROLES.SALES_REP,
          ].includes(auth.user.role) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please verify and sign the updated proposal and upload it here so
              that the installation can begin
            </Card.Text>
            <Button variant="link">View Proposal</Button>
            <Button variant="link">Upload Signed Updated Proposal</Button>
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={onCustomerAcceptsUpdatedProposal}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure that the customer uploaded the signed updated proposal"
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
                onConfirm={onCustomerRejectsUpdatedProposal}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to reject the proposal?"
                body="Please confirm if you want to reject the proposal. This will move the project to the 'Updating Proposal' state."
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
      {[USER_ROLES.ADMIN, USER_ROLES.SALES_REP].includes(auth.user.role) ? (
        <Card.Footer>
          <Stack style={{ float: "right" }} gap={2} direction="horizontal">
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              Start Installation
            </SubmitButton>
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              Re-upload proposal
            </SubmitButton>
          </Stack>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ReviewingProposal;
