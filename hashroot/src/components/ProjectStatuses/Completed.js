import React from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import { LinkContainer } from "react-router-bootstrap";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";

// TODO: Build Dashboard page(Sprint 4?)

const Completed = () => {
  const auth = useAuth();

  return (
    <Card className="shadow-sm mt-3 h-100">
      <Card.Body
        className="mb-0 flex-1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Card.Text>The project is completed.</Card.Text>
        {[USER_ROLES.GENERAL_CONTRACTOR, USER_ROLES.WORKER].includes(
          auth.user.role
        ) ? (
          <Card.Text>Thank you for your service.</Card.Text>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Card.Text>
              Click the button below to view the project dashboard
            </Card.Text>
            <LinkContainer to={`/projects/dashboard`}>
              <Button variant="link">View Dashboard</Button>
            </LinkContainer>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Completed;
