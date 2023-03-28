import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createUserApi } from "../../api/users";
import { getCreateUserRoleList } from "../../utils/user";
import useAuth from "../../hooks/useAuth";

import SubmitButton from "../shared/SubmitButton";

const Signup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);

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
      if (!email) {
        toast("Please enter first name", { type: toast.TYPE.ERROR });
        return;
      }
      if (!password) {
        toast("Please enter last name", { type: toast.TYPE.ERROR });
        return;
      }
      if (!confirmPassword) {
        toast("Please enter first name", { type: toast.TYPE.ERROR });
        return;
      }
      if (!role) {
        toast("Please enter last name", { type: toast.TYPE.ERROR });
        return;
      }
      setLoading(true);
      await createUserApi({ firstName, lastName, password, email, role });
      toast("User created successfully", { type: toast.TYPE.SUCCESS });
      navigate("/users");
    } catch (e) {
      toast(e?.response?.data?.error || e?.message || "Something went wrong", {
        type: toast.TYPE.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "24rem" }} className="mx-auto shadow-sm">
      <Card.Header as="h5" className="text-center">
        Create a User
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label aria-required>First Name</Form.Label>
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
            <Form.Label aria-required>Last Name</Form.Label>
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
            <Form.Label aria-required>Email</Form.Label>
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
            <Form.Label aria-required>Password</Form.Label>
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
            <Form.Label aria-required>Confirm Password</Form.Label>
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
            <Form.Label aria-required>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Select a role</option>
              {getCreateUserRoleList(user?.role).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-grid gap-2">
            <SubmitButton type="submit" variant="primary" loading={loading}>
              Create User
            </SubmitButton>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Signup;
