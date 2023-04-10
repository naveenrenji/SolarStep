import React, { useMemo } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import { GrDocumentTime } from "react-icons/gr";

import { PROJECT_UPLOAD_TYPES, USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";
import FileUploadModal from "../shared/FileUploadModal";
import { signContractApi, uploadProjectDocumentApi } from "../../api/projects";
import { getProjectDocumentDownloadUrl } from "../../utils/files";
import DocumentModal from "../shared/DocumentModal";
import Stack from "react-bootstrap/esm/Stack";
import {
  moveToReadyForInstallationApi,
  moveToReviewingProposalApi,
} from "../../api/projectStatuses";
import FormDatePicker from "../shared/FormDatePicker";

const UpdatingProposal = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = React.useState(false);
  const [scheduledInstallationStartDate, setScheduledInstallationStartDate] =
    React.useState(null);

  const handleFileUpload = async ({ file }) => {
    return await uploadProjectDocumentApi(
      project._id,
      file,
      PROJECT_UPLOAD_TYPES.contract
    );
  };

  const onGCUpdatesProposal = async () => {
    if (fullySignedContract) {
      throw new Error("Contract is already signed");
    }

    if (unsignedContract || !gcSignedContract) {
      throw new Error("Contract is not signed");
    }
    return await moveToReviewingProposalApi(project._id);
  };

  const unsignedContract = useMemo(() => {
    const contract = project?.documents?.find(
      (document) =>
        document.type === PROJECT_UPLOAD_TYPES.contract &&
        document.latest &&
        !document.generalContractorSign &&
        !document.customerSign
    );
    return contract
      ? {
          ...contract,
          url: getProjectDocumentDownloadUrl(project._id, contract?.fileId),
        }
      : null;
  }, [project]);

  const gcSignedContract = useMemo(() => {
    const contract = project?.documents?.find(
      (document) =>
        document.type === PROJECT_UPLOAD_TYPES.contract &&
        document.latest &&
        !document.customerSign &&
        document.generalContractorSign
    );
    return contract
      ? {
          ...contract,
          url: getProjectDocumentDownloadUrl(project._id, contract?.fileId),
        }
      : null;
  }, [project]);

  const fullySignedContract = useMemo(() => {
    const contract = project?.documents?.find(
      (document) =>
        document.type === PROJECT_UPLOAD_TYPES.contract &&
        document.latest &&
        document.customerSign &&
        document.generalContractorSign
    );
    return contract
      ? {
          ...contract,
          url: getProjectDocumentDownloadUrl(project._id, contract?.fileId),
        }
      : null;
  }, [project]);

  const onSignContract = async (generalContractorSign) => {
    return await signContractApi(project._id, unsignedContract.fileId, {
      generalContractorSign,
    });
  };

  const readyForInstallation = async () => {
    if (!scheduledInstallationStartDate) {
      throw new Error("Please select an installation start date");
    }

    return await moveToReadyForInstallationApi(project._id, {
      scheduledInstallationStartDate,
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
        <GrDocumentTime className="primary" />
        <Card.Text>A new proposal is getting churned.</Card.Text>
        {[USER_ROLES.CUSTOMER, USER_ROLES.WORKER].includes(auth.user.role) ? (
          <Card.Text>
            Please wait for the general contractor and sales rep to update the
            proposal
          </Card.Text>
        ) : fullySignedContract ? (
          USER_ROLES.GENERAL_CONTRACTOR === auth.user.role ? (
            <Card.Text>
              Please wait for the sales rep to update the proposal and upload
              the new contract.
            </Card.Text>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please upload the updated proposal for the GC to sign and
                review. Or if you want to keep the original proposal, you can
                add the installation start date and move to ready for
                installation.
              </Card.Text>
              <Form.Group className="mb-3" controlId="formDate">
                <Form.Label aria-required>Installation Start Date</Form.Label>
                <FormDatePicker
                  value={scheduledInstallationStartDate}
                  onChange={setScheduledInstallationStartDate}
                  minDate={new Date()}
                />
              </Form.Group>
              <Button onClick={() => setShowFileUploadModal(true)}>
                Upload New Proposal
              </Button>
              {showFileUploadModal ? (
                <FileUploadModal
                  show={showFileUploadModal}
                  onClose={() => setShowFileUploadModal(false)}
                  onFileUpload={handleFileUpload}
                  afterFileUpload={(updatedProject) =>
                    updateProject(updatedProject)
                  }
                />
              ) : (
                <></>
              )}
            </div>
          )
        ) : gcSignedContract ? (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Please wait for the sales rep to move this to the next step so
              that the customer can review.
            </Card.Text>
            <Stack
              direction="horizontal"
              style={{ justifyContent: "center" }}
              gap={3}
            >
              <Button onClick={() => setShowDocumentModal(true)}>
                View GC signed proposal
              </Button>
              {USER_ROLES.GENERAL_CONTRACTOR !== auth.user.role ? (
                <Button onClick={() => setShowFileUploadModal(true)}>
                  Upload a new proposal
                </Button>
              ) : (
                <></>
              )}
            </Stack>
            {showFileUploadModal ? (
              <FileUploadModal
                show={showFileUploadModal}
                onClose={() => setShowFileUploadModal(false)}
                onFileUpload={handleFileUpload}
                afterFileUpload={(updatedProject) =>
                  updateProject(updatedProject)
                }
              />
            ) : (
              <></>
            )}
            {showDocumentModal ? (
              <DocumentModal
                show={showDocumentModal}
                onClose={() => setShowDocumentModal(false)}
                title="GC Signed Contract"
                file={gcSignedContract?.url}
              />
            ) : (
              <></>
            )}
          </div>
        ) : unsignedContract ? (
          USER_ROLES.GENERAL_CONTRACTOR === auth.user.role ? (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please have a look at the new proposal and sign it.
              </Card.Text>
              <Button onClick={() => setShowDocumentModal(true)}>
                View and sign updated proposal
              </Button>
              {showDocumentModal ? (
                <DocumentModal
                  show={showDocumentModal}
                  onClose={() => setShowDocumentModal(false)}
                  title="Unsigned Contract"
                  file={unsignedContract?.url}
                  signRequired
                  onSign={onSignContract}
                  afterSign={(updatedProject) => updateProject(updatedProject)}
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please wait for GC to sign the proposal. You can upload a new
                one before GC signs it.
              </Card.Text>
              <Stack
                direction="horizontal"
                gap={3}
                style={{ justifyContent: "center" }}
              >
                <Button
                  variant="primary"
                  onClick={() => setShowDocumentModal(true)}
                >
                  View updated proposal
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowFileUploadModal(true)}
                >
                  Upload New Proposal
                </Button>
              </Stack>
              {showDocumentModal ? (
                <DocumentModal
                  show={showDocumentModal}
                  onClose={() => setShowDocumentModal(false)}
                  title="Unsigned Contract"
                  file={unsignedContract?.url}
                />
              ) : (
                <></>
              )}
              {showFileUploadModal ? (
                <FileUploadModal
                  show={showFileUploadModal}
                  onClose={() => setShowFileUploadModal(false)}
                  onFileUpload={handleFileUpload}
                  afterFileUpload={(updatedProject) =>
                    updateProject(updatedProject)
                  }
                />
              ) : (
                <></>
              )}
            </div>
          )
        ) : (
          <></>
        )}
        {showConfirmationModal ? (
          <ConfirmationModal
            key="accept"
            show={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={
              fullySignedContract ? readyForInstallation : onGCUpdatesProposal
            }
            afterConfirm={(updatedProject) => updateProject(updatedProject)}
            title="Are you sure you want to move to next state?"
            body={
              fullySignedContract
                ? "Do you want to keep the original contract as it is and move to next state"
                : "Please make sure you have uploaded the updated proposal before moving to next state. You will not be able to upload the proposal again after moving to next state."
            }
            confirmText="Yes, move to next state"
            cancelText="No, cancel"
            type="primary"
          />
        ) : (
          <></>
        )}
      </Card.Body>
      {[USER_ROLES.ADMIN, USER_ROLES.SALES_REP].includes(auth.user.role) &&
      (fullySignedContract || gcSignedContract) ? (
        <Card.Footer>
          <div style={{ float: "right" }}>
            <SubmitButton
              onClick={() => setShowConfirmationModal(true)}
              className="ml-3"
            >
              {fullySignedContract
                ? "Keep the original proposal"
                : "Update Proposal"}
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
