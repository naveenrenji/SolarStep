import React from "react";
import Card from "react-bootstrap/esm/Card";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";
import { moveToClosingOutApi } from "../../api/projectStatuses";

// TODO: Update this code to include permit documents to be uploaded

const ValidatingPermits = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);

  const permitsValidated = async () => {
    return await moveToClosingOutApi(project._id);
  };

  const hasMoveAccess = React.useMemo(() => {
    return [
      USER_ROLES.ADMIN,
      USER_ROLES.GENERAL_CONTRACTOR,
      USER_ROLES.SALES_REP,
    ].includes(auth.user.role);
  }, [auth.user.role]);

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
        <Card.Text>The project installation is complete.</Card.Text>
        {[USER_ROLES.CUSTOMER, USER_ROLES.WORKER].includes(auth.user.role) ? (
          <Card.Text>
            Please wait fot the team to validate all the permits.
          </Card.Text>
        ) : hasMoveAccess ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please validate all the permits for the customer and ensure
              everything is up to code. You can upload the permit documents from
              the right side hamburger menu.
            </Card.Text>
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={permitsValidated}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure the permits are valid and the project is ready to be handed over to the customer."
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
      {hasMoveAccess ? (
        <Card.Footer>
          <SubmitButton
            onClick={() => setShowConfirmationModal(true)}
            className="ml-3"
          >
            Permits are validated
          </SubmitButton>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ValidatingPermits;
