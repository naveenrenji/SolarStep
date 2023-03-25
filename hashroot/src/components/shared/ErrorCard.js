import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const ErrorCard = ({ error, onRefresh }) => {
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
      <Card
        className="text-center shadow-sm card-warning"
        style={{ height: "fit-content" }}
      >
        <Card.Header as="h5">Something went wrong</Card.Header>
        <Card.Body>
          <Card.Text>{error}</Card.Text>

          {onRefresh && (
            <Button variant="outline-secondary" onClick={onRefresh}>
              Refresh
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ErrorCard;
