import React from "react";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import { GrUserWorker } from "react-icons/gr";
import { BsQuestionLg } from "react-icons/bs";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import { moveToAssignedToGCApi } from "../../api/projectStatuses";

import ConfirmationModal from "../shared/ConfirmationModal";
import SubmitButton from "../shared/SubmitButton";
import UserSelect from "../shared/UserSelect";

const ReadyToBeAssignedToGC = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [gcOpt, setGCOpt] = React.useState(null);

  const assignGCToProject = async () => {
    return await moveToAssignedToGCApi(project._id, {
      generalContractorId: gcOpt.value,
    });
  };

  const hasMoveAccess = React.useMemo(() => {
    return [USER_ROLES.ADMIN, USER_ROLES.SALES_REP].includes(auth.user.role);
  }, [auth.user.role]);

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
          <GrUserWorker className="primary" />
          <BsQuestionLg className="secondary" />
        </Stack>
        <Card.Text>
          The project is now ready to be assigned to a general contractor.
        </Card.Text>
        {[USER_ROLES.GENERAL_CONTRACTOR, USER_ROLES.WORKER].includes(
          auth.user.role
        ) ? (
          <Card.Text>
            Please wait for the contract to be assigned to you
          </Card.Text>
        ) : hasMoveAccess ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please assign the project to a general contractor
            </Card.Text>
            <UserSelect
              onSelect={setGCOpt}
              roles={[USER_ROLES.GENERAL_CONTRACTOR]}
            />
            {showConfirmationModal ? (
              <ConfirmationModal
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={assignGCToProject}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure the General Contractor you have selected is the correct one. You will not be able to change it later."
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
            variant="primary"
            style={{ marginLeft: "auto", marginRight: 0, display: "block" }}
            onClick={() => setShowConfirmationModal(true)}
          >
            Assign this General Contractor
          </SubmitButton>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ReadyToBeAssignedToGC;
