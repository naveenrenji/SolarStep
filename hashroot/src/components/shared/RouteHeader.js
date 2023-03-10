import React from "react";
import Card from "react-bootstrap/Card";

const RouteHeader = ({ headerText }) => {
  return (
    <Card className="text-center shadow-sm">
      <Card.Body as="h5" className="mb-0">
        {headerText}
      </Card.Body>
    </Card>
  );
};

export default RouteHeader;
