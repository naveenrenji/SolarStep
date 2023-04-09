import React, { useMemo } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import { GrDocumentUser } from "react-icons/gr";

import { PROJECT_UPLOAD_TYPES, USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";
import DocumentModal from "../shared/DocumentModal";
import {
  moveToReadyForInstallationApi,
  moveToUpdatingProposalAfterRejectionApi,
} from "../../api/projectStatuses";
import { getProjectDocumentDownloadUrl } from "../../utils/files";
import { signContractApi } from "../../api/projects";

// TODO: Update this code to include signing

const ReviewingProposal = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showRejectConfirmationModal, setShowRejectConfirmationModal] =
    React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);

  const unsignedContract = useMemo(() => {
    const contract = project?.documents?.find(
      (document) =>
        document.type === PROJECT_UPLOAD_TYPES.contract &&
        document.latest &&
        document.generalContractorSign &&
        !document.customerSign
    );
    return contract
      ? {
          ...contract,
          url: getProjectDocumentDownloadUrl(project._id, contract?.fileId),
        }
      : null;
  }, [project]);

  const signedContract = useMemo(() => {
    const contract = project?.documents?.find(
      (document) =>
        document.type === PROJECT_UPLOAD_TYPES.contract &&
        document.latest &&
        document.generalContractorSign &&
        document.customerSign
    );
    return contract
      ? {
          ...contract,
          url: getProjectDocumentDownloadUrl(project._id, contract?.fileId),
        }
      : null;
  }, [project]);

  const onCustomerAcceptsUpdatedProposal = async () => {
    if (!signedContract) {
      throw new Error("Contract not signed");
    }
    return await moveToReadyForInstallationApi(project._id);
  };

  const onCustomerRejectsUpdatedProposal = async () => {
    return await moveToUpdatingProposalAfterRejectionApi(project._id);
  };

  const onSignContract = async (customerSign) => {
    return await signContractApi(project._id, unsignedContract.fileId, {
      customerSign,
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
        <GrDocumentUser className="primary" />
        <Card.Text>The project is being reviewed by customer</Card.Text>
        {[USER_ROLES.WORKER].includes(auth.user.role) ? (
          <Card.Text>
            Please wait for the customer to accept the proposal
          </Card.Text>
        ) : auth.user.role === USER_ROLES.CUSTOMER ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              {unsignedContract
                ? "Please verify and sign the updated proposal so that the installation can begin. If you are not satisfied with the updated proposal, you can speak to the sales rep and get it ammended."
                : "Please wait for the sales rep to the next step."}
            </Card.Text>

            {unsignedContract && showDocumentModal ? (
              <DocumentModal
                show={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                title="GC Signed Contract"
                file={unsignedContract?.url}
                signRequired
                onSign={onSignContract}
                afterSign={(updatedProject) => updateProject(updatedProject)}
              />
            ) : (
              <></>
            )}

            {signedContract && showDocumentModal ? (
              <DocumentModal
                show={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                title="Signed Contract"
                file={signedContract?.url}
              />
            ) : (
              <></>
            )}

            <Button variant="link" onClick={() => setShowDocumentModal(true)}>
              {unsignedContract
                ? "View and sign updated proposal"
                : "View Signed proposal"}
            </Button>
          </div>
        ) : [
            USER_ROLES.ADMIN,
            USER_ROLES.SALES_REP,
            USER_ROLES.CUSTOMER,
          ].includes(auth.user.role) ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              {unsignedContract
                ? "Please wait for the customer to accept the proposal"
                : "You can now move to the next state"}
            </Card.Text>

            <Button variant="link" onClick={() => setShowDocumentModal(true)}>
              View proposal
            </Button>

            {unsignedContract && showDocumentModal ? (
              <DocumentModal
                show={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                title="GC Signed Contract"
                file={unsignedContract?.url}
              />
            ) : (
              <></>
            )}

            {signedContract && showDocumentModal ? (
              <DocumentModal
                show={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                title="Signed Contract"
                file={signedContract?.url}
              />
            ) : (
              <></>
            )}
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
                showComment
                commentRequired
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
        USER_ROLES.SALES_REP,
        USER_ROLES.GENERAL_CONTRACTOR,
      ].includes(auth.user.role) ? (
        <Card.Footer>
          <Stack style={{ float: "right" }} gap={2} direction="horizontal">
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              Start Installation
            </SubmitButton>
            {USER_ROLES.GENERAL_CONTRACTOR !== auth.user.role ? (
              <SubmitButton
                onClick={() => setShowConfirmationModal(true)}
                className="ml-3"
              >
                Re-upload proposal
              </SubmitButton>
            ) : (
              <></>
            )}
          </Stack>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default ReviewingProposal;
