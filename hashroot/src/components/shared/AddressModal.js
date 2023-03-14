import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const AddressModal = ({
  address,
  show,
  onClose,
  isEdit = false,
  saveAddress,
}) => {
  const onSave = () => {
    saveAddress({address1: "513 River street"});
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">{isEdit ? "Edit" : "Add"} Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>-- Address fields will be here --</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;
