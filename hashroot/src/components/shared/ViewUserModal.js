import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

const ViewUserModal = ({ user, show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">User {user._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>User ID</b>
              </div>
              <div>{user._id}</div>
            </Stack>
          </ListGroup.Item>
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>First Name:</b>
              </div>
              <div>
                {user.firstName}
              </div>
            </Stack>
          </ListGroup.Item>
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>Last Name:</b>
              </div>
              <div>
                {user.firstName}
              </div>
            </Stack>
          </ListGroup.Item>
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>Email</b>
              </div>
              <div>{user.email}</div>
            </Stack>
          </ListGroup.Item>
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>Role:</b>
              </div>
              <div>{user.role}</div>
            </Stack>
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewUserModal;
