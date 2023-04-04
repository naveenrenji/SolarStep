import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import { BsSunFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { USER_ROLES } from "../../constants";

import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";
import SubmitButton from "../shared/SubmitButton";

const Created = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onCreatedStatusComplete = async () => {
    console.log(project._id);
    // return await moveProjectToNextStatusAPI(project._id);
  };

  const uploadDocument = async () => {
    try {
      setLoading(true);
      // const res = await uploadProjectDocumentApi(project._id, file);
      // updateProject();
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast(
        error?.response?.data?.error ||
          error?.message ||
          "Could not do this task",
        { type: toast.TYPE.ERROR }
      );
    } finally {
      setLoading(false);
    }
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
        <BsSunFill
          className="primary"
          style={{
            height: "12rem",
            width: "12rem",
            marginBottom: "1rem",
            color: "rgb(81, 156, 195)",
          }}
        />
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
          !project.preliminaryUnsignedContact &&
          !project.preliminarysignedContact ? (
            <Card.Text>
              Please wait for the sales representative to upload the preliminary
              contract for you to look at.
            </Card.Text>
          ) : project.preliminaryUnsignedContact ? (
            <div style={{ textAlign: "center" }}>
              <Card.Text>Please sign this contract</Card.Text>
              <Button variant="primary">Sign Contract</Button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please wait for the sales representative to assign it to a
                general contractor.
              </Card.Text>
              <Button variant="primary">Click here to view contract</Button>
              <Button variant="primary">Re-upload the signed contract</Button>
            </div>
          )
        ) : [USER_ROLES.ADMIN, USER_ROLES.SALES_REP].includes(
            auth.user.role
          ) ? (
          !project.preliminaryUnsignedContact &&
          !project.preliminarysignedContact ? (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please upload the preliminay contract for the customer
              </Card.Text>
              <Button variant="primary" onClick={uploadDocument}>
                Upload
              </Button>
            </div>
          ) : project.preliminaryUnsignedContact ? (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Please wait for the customer to check and sign the contract
              </Card.Text>
              <Button variant="primary">Check the contract uploaded</Button>
              <Button variant="primary">Re-upload</Button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Card.Text>
                Click the button below to move to next state and find a GC
              </Card.Text>
              <Button variant="primary">
                Click here to view the signed contract
              </Button>
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
      project.preliminaryUnsignedContact &&
      project.preliminarysignedContact ? (
        <Card.Footer>
          <SubmitButton
            variant="primary"
            style={{ marginLeft: "auto", marginRight: 0, display: "block" }}
            loading={loading}
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
