import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import RouteHeader from "../shared/RouteHeader";
import { updateProfile } from "../../api/users";
import useAuth from "../../hooks/useAuth"
import SubmitButton from "../shared/SubmitButton";

const Profile = () => {
  const auth = useAuth()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(auth?.user?.firstName)
    setLastName(auth?.user?.lastName)
  }, [auth?.user])

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const body = {firstName, lastName, oldPassword, newPassword}
      const user = await updateProfile(body);
      auth.updateProfile(user)
      // Handle form submission here.
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
        Edit User Profile
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={firstName}
              type="firstName"
              onChange={handleFirstNameChange}
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
              onChange={handleLastNameChange}
              placeholder="Last Name"
            />
            <Form.Control.Feedback type="invalid">
              Last Name is required
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              value={oldPassword}
              type="pass"
              onChange={handleOldPasswordChange}
              placeholder="*********"
            />
            <Form.Control.Feedback type="invalid">
              Password is required
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              value={newPassword}
              type="pass"
              onChange={handleNewPasswordChange}
              placeholder="*********"
            />
            <Form.Control.Feedback type="invalid">
              Password is required
            </Form.Control.Feedback>
            </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              value={confirmNewPassword}
              type="pass"
              onChange={handleConfirmNewPasswordChange}
              placeholder="*********"
            />
            <Form.Control.Feedback type="invalid">
              Password is required
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-grid gap-2">
            <SubmitButton type="submit" variant="primary" loading={loading}>
              Save Changes
            </SubmitButton>
          </div>
        </Form>
      </Card.Body>
    </Card>
    
  </div>
);
};

export default Profile;
