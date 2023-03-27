import React, { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createProjectApi } from "../../api/projects";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";

import AddressModal from "../shared/AddressModal";
import SubmitButton from "../shared/SubmitButton";
import UserSelect from "../shared/UserSelect";

const CreateProject = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState("");
  const [projectName, setProjectName] = useState("");
  const [userOption, setUserOption] = useState({});
  const [salesRepOption, setSalesRepOption] = useState({});
  const [address, setAddress] = useState({});
  const [showAddressModal, setShowAddressModal] = useState(false);

  const isAdmin = useMemo(
    () => auth.user.role === USER_ROLES.ADMIN,
    [auth.user]
  );

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (!userOption?.value) {
        toast("Please select a user", { type: toast.TYPE.ERROR });
        return;
      }
      if (isAdmin && !salesRepOption?.value) {
        toast("Please select a sales rep", { type: toast.TYPE.ERROR });
        return;
      }
      if (!Object.keys(address).length) {
        toast("Please add an address", { type: toast.TYPE.ERROR });
        return;
      }
      await createProjectApi({
        projectName,
        userId: userOption?.value,
        address,
        ...(isAdmin ? { salesRepId: salesRepOption?.value } : {}), // if admin, add salesRepId, else don't add anything
      });
      toast("Project created successfully", { type: toast.TYPE.SUCCESS });
      navigate("/projects");
    } catch (e) {
      toast(e?.response?.data?.error || e?.message || "Something went wrong", {
        type: toast.TYPE.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card style={{ width: "24rem" }} className="mx-auto shadow-sm">
        <Card.Header as="h5" className="text-center">
          Create a Project
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                value={projectName}
                type="projectName"
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label aria-required>Select a user</Form.Label>
              <UserSelect
                onSelect={setUserOption}
                roles={[USER_ROLES.CUSTOMER]}
              />
            </Form.Group>
            {isAdmin && (
              <Form.Group className="mb-3" controlId="formBasicFirstName">
                <Form.Label aria-required>Select a Sales Rep</Form.Label>
                <UserSelect
                  onSelect={setSalesRepOption}
                  roles={[USER_ROLES.SALES_REP]}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label aria-required>Address</Form.Label>
              {Object.keys(address).length ? (
                <ListGroup>
                  <ListGroup.Item
                    action
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAddressModal(true);
                    }}
                  >
                    {address.streetAddress}
                  </ListGroup.Item>
                </ListGroup>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() => setShowAddressModal(true)}
                  className="w-100"
                >
                  Add an address
                </Button>
              )}
            </Form.Group>

            <div className="d-grid gap-2">
              <SubmitButton type="submit" variant="primary" loading={loading}>
                Create Project
              </SubmitButton>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {showAddressModal ? (
        <AddressModal
          show={showAddressModal}
          address={address}
          isEdit={Object.keys(address).length}
          onClose={() => {
            setShowAddressModal(false);
          }}
          saveAddress={(address) => {
            setAddress(address);
            setShowAddressModal(false);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreateProject;
