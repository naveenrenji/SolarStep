import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { USER_ROLES } from "../../constants";
import { create } from "../../Backend/Users/users";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    await create(firstname, lastname, pass, email, [role])
  };



  return (
    <div>
      <Card style={{ marginTop: "32px", width: "24rem" }} className="mx-auto">
        <Card.Header as="h5" className="text-center">
          Signup
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={firstname}
                type="firstname"
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
                value={lastname}
                type="lastname"
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
                value={pass}
                type="pass"
                onChange={(e) => setPass(e.target.value)}
                placeholder="*********"
              />
              <Form.Control.Feedback type="invalid">
                Password is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label> Confirm Password</Form.Label>
              <Form.Control
                value={pass}
                type="pass"
                onChange={(e) => setPass(e.target.value)}
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
                <option>Select the Role</option>
                {Object.values(USER_ROLES).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Create User
              </Button>{" "}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;
