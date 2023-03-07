import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

const NoAccess = () => {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Card className="text-center" style={{ height: "fit-content" }}>
        <Card.Header as="h5">No Access</Card.Header>
        <Card.Body>
          <Card.Text>
            The route you are looking for does not exist or you dont have
            access.
          </Card.Text>
          <LinkContainer to="/dashboard">
            <Button variant="primary">Go to dashboard</Button>
          </LinkContainer>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NoAccess;
