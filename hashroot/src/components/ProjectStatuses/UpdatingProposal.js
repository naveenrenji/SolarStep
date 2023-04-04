import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import { GrDocumentTime } from "react-icons/gr";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";

const UpdatingProposal = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);

  const onGCUpdatesProposal = async () => {
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
        <GrDocumentTime
          className="primary"
          style={{
            height: "12rem",
            width: "12rem",
            marginBottom: "1rem",
          }}
        />
        <Card.Text>The project is assigned to General Contractor.</Card.Text>
        {[USER_ROLES.CUSTOMER, USER_ROLES.WORKER].includes(auth.user.role) ? (
          <Card.Text>
            Please wait for the general contractor to update the proposal
          </Card.Text>
        ) : [
            USER_ROLES.ADMIN,
            USER_ROLES.GENERAL_CONTRACTOR,
            USER_ROLES.SALES_REP,
          ].includes(auth.user.role) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please upload the updated proposal for the customer to review.
            </Card.Text>
            <Button variant="link">Upload New Proposal</Button>
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={onGCUpdatesProposal}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure you have uploaded the updated proposal before moving to next state. You will not be able to upload the proposal again after moving to next state."
                confirmText="Yes, move to next state"
                cancelText="No, cancel"
                type="primary"
              />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </Card.Body>
      {[
        USER_ROLES.ADMIN,
        USER_ROLES.GENERAL_CONTRACTOR,
        USER_ROLES.SALES_REP,
      ].includes(auth.user.role) ? (
        <Card.Footer>
          <div style={{ float: "right" }}>
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              Update Proposal
            </SubmitButton>
          </div>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default UpdatingProposal;
