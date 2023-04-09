import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import { GrUserWorker } from "react-icons/gr";
import { BsExclamationLg } from "react-icons/bs";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import { signContractApi } from "../../api/projects";
import {
  gcRejectProposalApi,
  moveToGCAcceptedApi,
} from "../../api/projectStatuses";

import ConfirmationModal from "../shared/ConfirmationModal";
import SubmitButton from "../shared/SubmitButton";
import DocumentModal from "../shared/DocumentModal";
import { getProjectDocumentDownloadUrl } from "../../utils/files";

const AssignedToGC = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showRejectConfirmationModal, setShowRejectConfirmationModal] =
    React.useState(false);

  const unsignedContract = React.useMemo(() => {
    const contract = project?.documents?.find(
      (document) =>
        document.type === "contract" &&
        document.customerSign &&
        !document.generalContractorSign
    );
    return {
      ...contract,
      url: contract?.fileId
        ? getProjectDocumentDownloadUrl(project._id, contract.fileId)
        : null,
    };
  }, [project]);

  const onGCAcceptsProposal = async (generalContractorSign) => {
    await signContractApi(project._id, unsignedContract.fileId, {
      generalContractorSign,
    });

    return await moveToGCAcceptedApi(project._id);
  };

  const onGCRejectsProposal = async (comment) => {
    return await gcRejectProposalApi(project._id, { comment });
  };

  const hasMoveAccess = React.useMemo(() => {
    return [USER_ROLES.ADMIN, USER_ROLES.GENERAL_CONTRACTOR].includes(
      auth.user.role
    );
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
          <BsExclamationLg className="secondary" />
        </Stack>
        <Card.Text>The project is assigned to General Contractor.</Card.Text>
        {[USER_ROLES.SALES_REP, USER_ROLES.CUSTOMER].includes(
          auth.user.role
        ) ? (
          <Card.Text>
            Please wait for the general contractor to have a look at the
            proposal
          </Card.Text>
        ) : hasMoveAccess ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please check the proposal and accept it if you are happy with it
            </Card.Text>
            <Button onClick={() => setShowConfirmationModal(true)}>
              Sign and Accept Proposal
            </Button>
            {showDocumentModal ? (
              <DocumentModal
                show={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                onSign={onGCAcceptsProposal}
                signRequired
                afterSign={(updatedProject) => updateProject(updatedProject)}
                title="Contract"
                file={unsignedContract?.url}
              />
            ) : (
              <></>
            )}
            {showConfirmationModal ? (
              <ConfirmationModal
                key="accept"
                show={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onConfirm={() => setShowDocumentModal(true)}
                title="Are you sure you want to accept the proposal?"
                body="Once you sign, you will be assigned to the project and the project will be moved to the next state."
                confirmText="Yes, show document to sign"
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
                confirmText="Reject Proposal"
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
      {hasMoveAccess ? (
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
