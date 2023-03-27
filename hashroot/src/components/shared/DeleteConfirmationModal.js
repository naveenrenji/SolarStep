import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

import SubmitButton from "./SubmitButton";

const DeleteConfirmationModal = ({
  show,
  onClose,
  item,
  onConfirm,
  title,
  message,
  afterDelete,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(item);
      if (afterDelete) {
        await afterDelete(item);
      }
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      toast(
        error?.response?.data?.error ||
          error?.message ||
          "Could not delete item",
        { type: toast.TYPE.ERROR }
      );
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <SubmitButton
          variant="danger"
          onClick={handleConfirm}
          loading={loading}
          loadingText="Deleting"
        >
          Delete
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
