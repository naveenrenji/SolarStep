import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

import { updateUserApi } from "../../api/users";
import SubmitButton from "./SubmitButton";

const EditUserModal = ({ user, show, onClose, afterSave }) => {
  const [firstName, setFirstName] = React.useState(user.firstName);
  const [lastName, setLastName] = React.useState(user.lastName);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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
        if (!confirmPassword) {
          toast("Please enter confirm password", {
            type: toast.TYPE.ERROR,
          });
          return;
        }
        if (newPassword !== confirmPassword) {
          toast("Passwords do not match", { type: toast.TYPE.ERROR });
          return;
        }
        body.oldPassword = oldPassword;
        body.newPassword = newPassword;
      }
      setLoading(true);
      const updatedUser = await updateUserApi(user._id, body);
      toast("User updated successfully", { type: toast.TYPE.SUCCESS });
      await afterSave(updatedUser);
      setLoading(false);
      onClose();
    } catch (error) {
      toast(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong",
        {
          type: toast.TYPE.ERROR,
        }
      );
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">User {user._id}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label aria-required>Email</Form.Label>
            <Form.Control value={user.email} type="email" disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label aria-required>Role</Form.Label>
            <Form.Control value={user.role} disabled />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label aria-required>First Name</Form.Label>
            <Form.Control
              value={firstName}
              type="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label aria-required>Last Name</Form.Label>
            <Form.Control
              value={lastName}
              type="lastName"
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </Form.Group>
          <Form.Text className="text-muted">
            *NOTE: Leave password fields empty if you don't want to change
            password
          </Form.Text>
          <Form.Group className="my-3" controlId="formBasicPassword">
            <Form.Label aria-required>Old Password</Form.Label>
            <Form.Control
              value={oldPassword}
              type="password"
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="*********"
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label aria-required>New Password</Form.Label>
            <Form.Control
              value={newPassword}
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="*********"
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label aria-required>Confirm Password</Form.Label>
            <Form.Control
              value={confirmPassword}
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="*********"
              autoComplete="off"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            Close
          </Button>
          <SubmitButton type="submit" variant="primary" loading={loading}>
            Update User
          </SubmitButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
