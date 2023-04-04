import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
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
  showComment = false,
  commentRequired = false,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [comment, setComment] = React.useState("");

  const handleConfirm = async () => {
    try {
      if (showComment && commentRequired && !comment) {
        toast("Please enter a comment", { type: toast.TYPE.ERROR });
        return;
      }
      setLoading(true);
      const res = await onConfirm(comment);
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

        {showComment && (
          <Form.Group controlId="formComment" className="mb-3">
            <Form.Label aria-required={commentRequired}>Comment</Form.Label>
            <Form.Control
              as="input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required={commentRequired}
            />
          </Form.Group>
        )}
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
