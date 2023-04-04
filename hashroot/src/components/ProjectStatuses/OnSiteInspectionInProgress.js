import React from "react";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import Form from "react-bootstrap/esm/Form";
import { GrSchedulePlay } from "react-icons/gr";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";
import FormDatePicker from "../shared/FormDatePicker";
import { toast } from "react-toastify";
import { moveToReadyForInstallationApi } from "../../api/projectStatuses";

const OnSiteInspectionInProgress = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [scheduledInstallationDate, setScheduledInstallationDate] =
    React.useState();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showProposalNeedsUpdateModal, setShowProposalNeedsUpdateModal] =
    React.useState(false);

  const readyForInstallation = async () => {
    return await moveToReadyForInstallationApi(project._id, {
      scheduledInstallationDate,
    });
  };

  const proposalNeedsUpdate = async () => {
    console.log(project._id);
    // return await proposalNeedsUpdateApi(project._id);
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
        <GrSchedulePlay className="primary" />
        <Card.Text>The On Site Inspection is progress.</Card.Text>
        <Card.Text>Started Inspection On: {project.inspectionDate}</Card.Text>
        {[USER_ROLES.WORKER, USER_ROLES.CUSTOMER].includes(auth.user.role) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please wait for general contractor to complete the inspection.
            </Card.Text>
          </div>
        ) : [
            USER_ROLES.ADMIN,
            USER_ROLES.SALES_REP,
            USER_ROLES.GENERAL_CONTRACTOR,
          ].includes(auth.user.role) ? (
          <div style={{ textAlign: "center" }}>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label aria-required>Inspection Date</Form.Label>
              <FormDatePicker
                value={scheduledInstallationDate}
                onChange={setScheduledInstallationDate}
                minDate={new Date()}
              />
            </Form.Group>
            {showConfirmationModal ? (
              <ConfirmationModal
                key="ready-for-installation"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={readyForInstallation}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure your inspection is complete and the project is ready for installation."
                confirmText="Yes, move to next state"
                cancelText="No, cancel"
                type="primary"
              />
            ) : (
              <></>
            )}
            {showProposalNeedsUpdateModal ? (
              <ConfirmationModal
                key="proposal-needs-update"
                show={showProposalNeedsUpdateModal}
                onClose={() => setShowProposalNeedsUpdateModal(false)}
                onConfirm={proposalNeedsUpdate}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to reject the proposal?"
                body="Please confirm that you want the proposal needs to be updated. Customer will be notified and the project will be moved to the Proposal Needs Update state."
                confirmText="Yes, proposal needs to be updated"
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
              onClick={() => setShowProposalNeedsUpdateModal(true)}
              className="ml-3"
              variant="secondary"
            >
              Proposal needs to be updated
            </SubmitButton>
            <SubmitButton
              onClick={() => {
                if (!scheduledInstallationDate) {
                  toast("Please select a date for installation", {
                    type: toast.TYPE.ERROR,
                  });
                  return;
                }
                setShowConfirmationModal(true);
              }}
              className="ml-3"
            >
              Ready for installation
            </SubmitButton>
          </Stack>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default OnSiteInspectionInProgress;
