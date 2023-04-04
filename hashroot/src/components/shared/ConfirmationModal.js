import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

import SubmitButton from "./SubmitButton";

const ConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  body,
  afterConfirm,
  type = "primary",
  confirmText = "Yes",
  cancelText = "No",
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await onConfirm();
      if (afterConfirm) {
        await afterConfirm(res);
      }
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      toast(
        error?.response?.data?.error ||
          error?.message ||
          "Could not do this task",
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
        <p>{message || body}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <SubmitButton variant={type} onClick={handleConfirm} loading={loading}>
          {confirmText}
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
