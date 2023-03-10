import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

import useAuth from "../../hooks/useAuth";

const NotFound = () => {
  const { user } = useAuth();

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
      <Card className="text-center shadow-sm" style={{ height: "fit-content" }}>
        <Card.Header as="h5">Route does not exist</Card.Header>
        <Card.Body>
          <Card.Text>The route you are looking for does not exist</Card.Text>
          <LinkContainer to={!user ? "/" : "/dashboard"}>
            <Button variant="primary">
              Go to {!user ? "home" : "dashboard"}
            </Button>
          </LinkContainer>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotFound;
