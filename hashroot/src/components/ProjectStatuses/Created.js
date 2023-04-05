import React, { useMemo } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Stack from "react-bootstrap/esm/Stack";
import { BsSunFill } from "react-icons/bs";

import { signContractApi, uploadProjectDocumentApi } from "../../api/projects";
import { moveToReadyToBeAssignedToGCApi } from "../../api/projectStatuses";
import { PROJECT_UPLOAD_TYPES, USER_ROLES } from "../../constants";
import { getProjectDocumentDownloadUrl } from "../../utils/files";

import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";

import ConfirmationModal from "../shared/ConfirmationModal";
import DocumentModal from "../shared/DocumentModal";
import FileUploadModal from "../shared/FileUploadModal";
import SubmitButton from "../shared/SubmitButton";

const Created = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showDocumentModal, setShowDocumentModal] = React.useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = React.useState(false);

  const unsignedContract = useMemo(() => {
    const contract = project?.documents?.find(
      (document) =>
        document.type === PROJECT_UPLOAD_TYPES.contract &&
        document.latest &&
        !document.customerSign &&
        !document.generalContractorSign
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
        document.customerSign &&
        !document.generalContractorSign
    );
    return contract
      ? {
          ...contract,
          url: getProjectDocumentDownloadUrl(project._id, contract?.fileId),
        }
      : null;
  }, [project]);

  const onCreatedStatusComplete = async () => {
    if (!signedContract) {
      throw new Error("Contract is not signed");
    }
    return await moveToReadyToBeAssignedToGCApi(project._id);
  };

  const handleFileUpload = async ({ file }) => {
    return await uploadProjectDocumentApi(
      project._id,
      file,
      PROJECT_UPLOAD_TYPES.contract
    );
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
        <BsSunFill className="primary" />
        <Card.Text>
          Congraulations! Project is now created. Here are the next steps.
        </Card.Text>
        {[USER_ROLES.GENERAL_CONTRACTOR, USER_ROLES.WORKER].includes(
          auth.user.role
        ) ? (
          <Card.Text>
            Please wait for the contract to be assigned to you
          </Card.Text>
        ) : auth.user.role === USER_ROLES.CUSTOMER ? (
          !unsignedContract && !signedContract ? (
            <Card.Text>
              Please wait for the sales representative to upload the contract
              for you to look at.
            </Card.Text>
          ) : unsignedContract ? (
            <div style={{ textAlign: "center" }}>
              <Card.Text>Please view and sign the contract</Card.Text>
              <Button
                variant="primary"
                onClick={() => setShowDocumentModal(true)}
              >
                View and Sign
              </Button>
              {showDocumentModal ? (
                <DocumentModal
                  show={showDocumentModal}
                  onClose={() => setShowDocumentModal(false)}
                  title="Signed Contract"
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
                Please wait for the sales representative to assign it to a
                general contractor.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setShowDocumentModal(true)}
              >
                Click here to view contract
              </Button>
              {showDocumentModal ? (
                <DocumentModal
                  show={showDocumentModal}
                  onClose={() => setShowDocumentModal(false)}
                  title="Signed Contract"
                  file={signedContract?.url}
                />
              ) : (
                <></>
              )}
            </div>
          )
        ) : [USER_ROLES.ADMIN, USER_ROLES.SALES_REP].includes(
            auth.user.role
          ) ? (
          !unsignedContract && !signedContract ? (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please upload the preliminay contract for the customer
              </Card.Text>
              <Button onClick={() => setShowFileUploadModal(true)}>
                Upload Document
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
          ) : unsignedContract ? (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please wait for the customer to check and sign the contract
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
                  Check the contract uploaded
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowFileUploadModal(true)}
                >
                  Re-upload
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
          ) : (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Click the button below to move to next state and find a GC
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setShowDocumentModal(true)}
              >
                Click here to view the signed contract
              </Button>
              {showDocumentModal ? (
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
                  show={showConfirmationModal}
                  onClose={() => setShowConfirmationModal(false)}
                  onConfirm={onCreatedStatusComplete}
                  title="Are you sure you want to move to next state?"
                  body="This will assign a general contractor to the project. You won't be able to update the contract after this."
                  confirmText="Yes, move to next state"
                  cancelText="No, cancel"
                  type="primary"
                  afterConfirm={(updatedProject) =>
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
      </Card.Body>
      {[USER_ROLES.ADMIN, USER_ROLES.SALES_REP].includes(auth.user.role) &&
      signedContract ? (
        <Card.Footer>
          <SubmitButton
            variant="primary"
            style={{ marginLeft: "auto", marginRight: 0, display: "block" }}
            onClick={() => setShowConfirmationModal(true)}
          >
            Assign General Contractor
          </SubmitButton>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default Created;
