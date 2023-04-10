import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-toastify";

import { PROJECT_UPLOAD_TYPES } from "../../constants";
import { getProjectFileUploadTypes } from "../../utils/files";

import SubmitButton from "./SubmitButton";

const FileUploadModal = ({
  show,
  onClose,
  title = "Upload Document",
  submitButtonText = "Upload",
  onFileUpload,
  afterFileUpload,
  typeRequired = false,
}) => {
  const [file, setFile] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState(
    typeRequired ? "" : PROJECT_UPLOAD_TYPES.contract
  );

  const handleFileUpload = async (e) => {
    try {
      e.preventDefault();
      if (!file) {
        toast("Please upload a document", { type: toast.TYPE.ERROR });
        return;
      }
      if (!type) {
        toast("Please select a type", { type: toast.TYPE.ERROR });
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await onFileUpload({ file, formData, type });
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

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label aria-required>Upload Document</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept={
                type === PROJECT_UPLOAD_TYPES.contract ? "application/pdf" : "*"
              }
            />
          </Form.Group>
          {typeRequired ? (
            <Form.Group controlId="formType" className="mb-3">
              <Form.Label aria-required>File Type</Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Select a type</option>
                {getProjectFileUploadTypes().map((opt) => (
                  <option key={opt} value={opt.toLowerCase()}>
                    {opt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <SubmitButton
            type="submit"
            loading={loading}
            onClick={handleFileUpload}
            loadingText="Uploading..."
          >
            {submitButtonText}
          </SubmitButton>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FileUploadModal;
