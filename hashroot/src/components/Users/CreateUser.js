import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
// import Button from "react-bootstrap/Button";
// import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";

import { createUserApi } from "../../api/users";
import { getCreateUserRoleList } from "../../utils/user";
import useAuth from "../../hooks/useAuth";

// import AddressModal from "../shared/AddressModal";
import SubmitButton from "../shared/SubmitButton";

const Signup = () => {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  // const [addresses, setAddresses] = useState([]);
  // const [showAddressModal, setShowAddressModal] = useState(false);
  // const [selectedAddressIdx, setSelectedAddressIdx] = useState();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      await createUserApi({ firstName, lastName, password, email, role });
      toast("User created successfully", { type: toast.TYPE.SUCCESS });
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
          Create a User
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={firstName}
                type="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
              <Form.Control.Feedback type="invalid">
                First Name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={lastName}
                type="lastName"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
              <Form.Control.Feedback type="invalid">
                Last Name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <Form.Control.Feedback type="invalid">
                Email is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                type="pass"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*********"
              />
              <Form.Control.Feedback type="invalid">
                Password is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label> Confirm Password</Form.Label>
              <Form.Control
                value={confirmPassword}
                type="pass"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="*********"
              />
              <Form.Control.Feedback type="invalid">
                Password is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Select a role</option>
                {getCreateUserRoleList(user?.role).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* <Form.Group className="mb-3">
              {addresses.length ? (
                <>
                  <Form.Label>Addresses</Form.Label>
                  <ListGroup>
                    {addresses.map((addr, idx) => (
                      <ListGroup.Item
                        key={addr.address1}
                        action
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAddressModal(true);
                          setSelectedAddressIdx(idx);
                        }}
                      >
                        {addr.address1}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              ) : (
                <></>
              )}
              <Button
                variant="outline-primary"
                onClick={() => setShowAddressModal(true)}
                className="w-100"
              >
                + Add new address
              </Button>
            </Form.Group> */}

            <div className="d-grid gap-2">
              <SubmitButton type="submit" variant="primary" loading={loading}>
                Create User
              </SubmitButton>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {/* {showAddressModal ? (
        <AddressModal
          show={showAddressModal}
          address={
            selectedAddressIdx ? { ...addresses[selectedAddressIdx] } : {}
          }
          isEdit={selectedAddressIdx !== undefined}
          onClose={() => {
            setShowAddressModal(false);
            setSelectedAddressIdx();
          }}
          saveAddress={(address) => {
            if (selectedAddressIdx) {
              setAddresses((arr) => {
                arr[selectedAddressIdx] = address;
                return arr;
              });
            } else {
              setAddresses((arr) => [...arr, address]);
            }
            setShowAddressModal(false);
            setSelectedAddressIdx();
          }}
        />
      ) : (
        <></>
      )} */}
    </div>
  );
};

export default Signup;
