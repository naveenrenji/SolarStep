import React from "react";
import Card from "react-bootstrap/esm/Card";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";

const ClosingOut = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);

  const completeProject = async () => {
    console.log(project._id);
    // return await completeProjectApi(project._id);
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
        <Card.Text>The project almost ready to be handed out.</Card.Text>
        {[USER_ROLES.CUSTOMER].includes(auth.user.role) ? (
          <Card.Text>
            Please wait fot the team to verify if everything is up to code.
          </Card.Text>
        ) : [
            USER_ROLES.ADMIN,
            USER_ROLES.GENERAL_CONTRACTOR,
            USER_ROLES.SALES_REP,
          ].includes(auth.user.role) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please verify the system is up to code and everything is ready to
              be handed out to the customer.
            </Card.Text>
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={completeProject}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="After this, the project will be handed out to the customer. Please make sure everything is up to code."
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
          <div style={{ marginLeft: "auto", marginRight: 0, display: "block" }}>
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              Hand over to customer
            </SubmitButton>
          </div>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ClosingOut;
