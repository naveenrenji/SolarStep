import React from "react";
import Card from "react-bootstrap/Card";
import useAuth from "../../hooks/useAuth";

const WelcomeCard = () => {
  const { user } = useAuth();
  return (
    <Card className="text-center shadow-sm">
      <Card.Body as="h5" className="mb-0">
        Welcome {user.firstName} {user.lastName}
      </Card.Body>
    </Card>
  );
};

export default WelcomeCard;
