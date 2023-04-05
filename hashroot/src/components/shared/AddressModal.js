import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const AddressModal = ({
  address,
  show,
  onClose,
  isEdit = false,
  saveAddress,
}) => {
  const [streetAddress, setStreetAddress] = React.useState(
    address.streetAddress || ""
  );
  const [city, setCity] = React.useState(address.city || "");
  const [state, setState] = React.useState(address.state || "");
  const [zipCode, setZipCode] = React.useState(address.zipCode || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!streetAddress || !city || !state || !zipCode) {
      toast("Please fill all the fields", { type: "error" });
      return;
    }
    await saveAddress({ streetAddress, city, state, zipCode });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">{isEdit ? "Edit" : "Add"} Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              value={streetAddress}
              type="streetAddress"
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Street Address"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              type="city"
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>State</Form.Label>
            <Form.Control
              value={state}
              type="state"
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              value={zipCode}
              type="zipCode"
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zip Code"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;
