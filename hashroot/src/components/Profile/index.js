import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";

import { updateProfile } from "../../api/users";
import useAuth from "../../hooks/useAuth";

import SubmitButton from "../shared/SubmitButton";

const Profile = () => {
  const auth = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(auth?.user?.firstName);
    setLastName(auth?.user?.lastName);
  }, [auth?.user]);

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
      e.preventDefault();
      if (!firstName) {
        toast("Please enter first name", { type: toast.TYPE.ERROR });
        return;
      }
      if (!lastName) {
        toast("Please enter last name", { type: toast.TYPE.ERROR });
        return;
      }

      const body = {
        firstName,
        lastName,
      };
      if (!oldPassword && newPassword) {
        toast("Please enter old password", { type: toast.TYPE.ERROR });
        return;
      }
      if (oldPassword && !newPassword) {
        toast("Please enter new password", { type: toast.TYPE.ERROR });
        return;
      }
      if (oldPassword && newPassword) {
        if (!confirmNewPassword) {
          toast("Please enter confirm password", {
            type: toast.TYPE.ERROR,
          });
          return;
        }
        if (newPassword !== confirmNewPassword) {
          toast("Passwords do not match", { type: toast.TYPE.ERROR });
          return;
        }
        body.oldPassword = oldPassword;
        body.newPassword = newPassword;
      }
      setLoading(true);
      const user = await updateProfile(body);
      auth.updateProfile(user);
      toast("Profile updated successfully", { type: toast.TYPE.SUCCESS });
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
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label aria-required>Email</Form.Label>
              <Form.Control value={auth.user.email} type="email" disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label aria-required>Role</Form.Label>
              <Form.Control value={auth.user.role} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={firstName}
                type="firstName"
                onChange={handleFirstNameChange}
                placeholder="First Name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={lastName}
                type="lastName"
                onChange={handleLastNameChange}
                placeholder="Last Name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                value={oldPassword}
                type="password"
                onChange={handleOldPasswordChange}
                placeholder="*********"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                value={newPassword}
                type="password"
                onChange={handleNewPasswordChange}
                placeholder="*********"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                value={confirmNewPassword}
                type="password"
                onChange={handleConfirmNewPasswordChange}
                placeholder="*********"
              />
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
