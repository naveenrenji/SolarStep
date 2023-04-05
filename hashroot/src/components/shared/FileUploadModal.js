import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";

import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";

const FileUploadModal = ({
  show,
  onClose,
  title = "Upload Document",
  submitButtonText = "Upload",
  onFileUpload,
  afterFileUpload,
}) => {
  const [file, setFile] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const handleFileUpload = async (e) => {
    try {
      e.preventDefault();
      if (!file) {
        toast("Please upload a document", { type: toast.TYPE.ERROR });
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await onFileUpload({ file, formData });
      if (afterFileUpload) {
        await afterFileUpload(res);
      }
      toast("Document uploaded successfully", { type: toast.TYPE.SUCCESS });
      setLoading(false);
      onClose();
    } catch (error) {
      toast(
        error?.response?.data?.error ||
          error?.message ||
          "Could not upload document",
        { type: toast.TYPE.ERROR }
      );
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Document</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <SubmitButton
            type="submit"
            loading={loading}
            onClick={handleFileUpload}
          >
            {submitButtonText}
          </SubmitButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FileUploadModal;
