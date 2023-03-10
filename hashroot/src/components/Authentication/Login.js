import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";
import { loginApi } from "../../api/auth";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const from = location.state?.from?.pathname;

  const login = async (e) => {
    try {
      e.preventDefault();
      setValidated(true);
      if (!email || !password) {
        return;
      }

      const user = await loginApi({ email, password });
      auth.signIn(user, () => {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from || "/dashboard", {
          replace: true,
        });
      });
    } catch (e) {
      toast(e?.response?.data?.error || e?.message || "Something went wrong", {
        type: toast.TYPE.ERROR,
      });
    }
  };

  return (
    <Card style={{ width: "24rem" }} className="mx-auto shadow-sm">
      <Card.Header as="h5" className="text-center">
        Login
      </Card.Header>
      <Card.Body>
        <Form noValidate validated={validated} onSubmit={login}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e?.target?.value)}
              onBlur={(e) => setEmail(e?.target?.value?.trim())}
              value={email}
              required
            />
            <Form.Control.Feedback type="invalid">
              Email is required
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e?.target?.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Password is required
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Form.Text className="text-muted">
              Don't have an account yet?{" "}
              <a href="mailto:admin@solarstep.com">Click here</a> to contact our
              customer care to get your account created
            </Form.Text>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default React.memo(Login);
