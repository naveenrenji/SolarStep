import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { LinkContainer } from "react-router-bootstrap";

const UsersCard = () => {
  return (
    <Card className="text-center shadow-sm">
      <Card.Header as="h5">Users</Card.Header>
      <Card.Body>
        <Stack gap={3}>
          <div>
            <Card.Text>
              To view the list of users you have access to, click the button
              below
            </Card.Text>
            <LinkContainer to="/users">
              <Button variant="primary">View Users</Button>
            </LinkContainer>
          </div>
          <div>
            <Card.Text>To create a user, click the button below</Card.Text>
            <LinkContainer to="/users/create">
              <Button variant="primary">+ Create a User</Button>
            </LinkContainer>
          </div>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default UsersCard;
