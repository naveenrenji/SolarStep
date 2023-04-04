import React from "react";
import Card from "react-bootstrap/esm/Card";
import { GrScheduleNew } from "react-icons/gr";

import { moveToOnSiteInspectionInProgressApi } from "../../api/projectStatuses";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import { displayDate } from "../../utils/date";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";

const OnSiteInspectionScheduled = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);

  const onSiteInspectionStart = async () => {
    return await moveToOnSiteInspectionInProgressApi(project._id, {
      onSiteInspectionStartedOn: new Date(),
    });
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
        <GrScheduleNew
          className="primary"
          style={{
            height: "12rem",
            width: "12rem",
            marginBottom: "1rem",
          }}
        />
        <Card.Text>The On Site Inspection has been scheduled</Card.Text>
        {[
          USER_ROLES.WORKER,
          USER_ROLES.SALES_REP,
          USER_ROLES.CUSTOMER,
        ].includes(auth.user.role) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please wait for general contractor to start the inspection
              process.
            </Card.Text>
            <Card.Text>
              Inspection Date: {displayDate(project.onSiteInspectionDate)}
            </Card.Text>
          </div>
        ) : [USER_ROLES.ADMIN, USER_ROLES.GENERAL_CONTRACTOR].includes(
            auth.user.role
          ) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Are you ready to start the on-site inspection process?
            </Card.Text>
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={onSiteInspectionStart}
                afterConfirm={(updatedProject) => updateProject(updatedProject)}
                title="Are you sure you want to move to next state?"
                body="Please make sure you are ready to start the on-site inspection process."
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
      {[USER_ROLES.ADMIN, USER_ROLES.GENERAL_CONTRACTOR].includes(
        auth.user.role
      ) ? (
        <Card.Footer>
          <div style={{ float: "right" }}>
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              Start On-Site Inspection
            </SubmitButton>
          </div>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default OnSiteInspectionScheduled;
