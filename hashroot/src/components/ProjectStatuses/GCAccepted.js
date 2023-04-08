import React from "react";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import { GrUserWorker } from "react-icons/gr";
import { GiCheckMark } from "react-icons/gi";

import { moveToOnSiteInspectionScheduledApi } from "../../api/projectStatuses";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";
import FormDatePicker from "../shared/FormDatePicker";

import SubmitButton from "../shared/SubmitButton";
import { toast } from "react-toastify";

const GCAccepted = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [onSiteInspectionDate, setOnSiteInspectionDate] = React.useState();

  const onScheduleOnsiteInspection = async () => {
    return await moveToOnSiteInspectionScheduledApi(project._id, {
      onSiteInspectionDate,
    });
  };

  const hasMoveAccess = React.useMemo(() => {
    return [
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
      USER_ROLES.GENERAL_CONTRACTOR,
    ].includes(auth.user.role);
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
          <GiCheckMark className="success" />
        </Stack>
        <Card.Text>
          The project is accepted by the General Contractor.
        </Card.Text>
        {[USER_ROLES.WORKER, USER_ROLES.CUSTOMER].includes(auth.user.role) ? (
          <Card.Text>
            Please wait for the general contractor to schedule an on-site
            inspection
          </Card.Text>
        ) : hasMoveAccess ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please add the date when the on-site analysis will be scheduled
            </Card.Text>
            <FormDatePicker
              minDate={new Date()}
              value={onSiteInspectionDate}
              onChange={setOnSiteInspectionDate}
            />
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={onScheduleOnsiteInspection}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure the date is correct. You will confirm and share the on-site inspection date to the customer. You wont be able to change the date once you confirm."
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
          <div style={{ float: "right" }}>
            <SubmitButton
              onClick={() => {
                if (!onSiteInspectionDate) {
                  toast("Please select a date", {
                    type: toast.TYPE.ERROR,
                  });
                  return;
                }
                setShowConfirmationModal(true);
              }}
              className="ml-3"
            >
              Schedule on-site inspection
            </SubmitButton>
          </div>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default GCAccepted;
