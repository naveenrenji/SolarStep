import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

const ViewProjectModal = ({ project, show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">Project {project._id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>{project._id}</ListGroup.Item>
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>Address:</b>
              </div>
              <div>
                {project.address.streetAddress}, {project.address.city},{" "}
                {project.address.state}, {project.address.zipCode}
              </div>
            </Stack>
          </ListGroup.Item>
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>SalesRep Email</b>
              </div>
              <div>{project.salesRep.email}</div>
            </Stack>
          </ListGroup.Item>
          <ListGroup.Item>
            <Stack gap={1}>
              <div>
                <b>User Email: </b>
              </div>
              <div>{project.user.email}</div>
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

export default ViewProjectModal;
