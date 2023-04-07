import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/esm/Button";
import Alert from "react-bootstrap/esm/Alert";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import SubmitButton from "./SubmitButton";
import Loader from "./Loader";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const DocumentModal = ({
  show,
  onClose,
  title,
  signRequired,
  onSign,
  afterSign,
  file,
}) => {
  const auth = useAuth();
  const [signedName, setSignedName] = React.useState("");
  const [numPages, setNumPages] = React.useState(1);
  const [currentPageIdx, setCurrentPageIdx] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const documentWrapperRef = React.useRef(null);

  const onDocumentLoadSuccess = ({ numPages: pages }) => {
    setNumPages(pages);
  };

  const handleSign = async (e) => {
    try {
      e.preventDefault();
      if (!signedName) {
        toast("Please sign the document", { type: toast.TYPE.ERROR });
        return;
      }
      setLoading(true);
      const res = await onSign(signedName);
      if (afterSign) {
        await afterSign(res);
      }
      setLoading(false);
      toast("Document signed successfully", { type: toast.TYPE.SUCCESS });
      onClose();
    } catch (error) {
      toast(
        error?.response?.data?.error ||
          error?.message ||
          "Could not sign document",
        { type: toast.TYPE.ERROR }
      );
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSignedName("");
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className={"view-document-modal" + (signRequired ? " sign-required" : "")}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div ref={documentWrapperRef}>
          <Document
            file={file}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadError={console.error}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadProgress={console.log}
            options={{
              httpHeaders: {
                accesstoken: auth.user.accessToken,
              },
            }}
            loading={
              <div style={{ position: "relative", height: "100%" }}>
                <Loader />
              </div>
            }
            onItemClick={({ pageNumber }) => {
              setCurrentPageIdx(pageNumber - 1);
            }}
            externalLinkTarget="_blank"
            noData={
              <Alert variant="danger" className="text-center">
                PDF file unavailable or not specified
              </Alert>
            }
            error={
              <Alert variant="danger" className="text-center">
                Could not load pdf. You may not have authorization to view.
              </Alert>
            }
          >
            <Page
              pageNumber={currentPageIdx + 1}
              width={
                documentWrapperRef.current?.getBoundingClientRect().width ||
                undefined
              }
            />
            {numPages > 1 ? (
              <Pagination className="pdf-page-controls">
                <Pagination.First
                  disabled={currentPageIdx === 0}
                  onClick={() => {
                    setCurrentPageIdx(0);
                  }}
                />
                <Pagination.Prev
                  disabled={currentPageIdx === 0}
                  onClick={() => {
                    setCurrentPageIdx(currentPageIdx - 1);
                  }}
                />
                <Pagination.Item active>{currentPageIdx + 1}</Pagination.Item>
                <Pagination.Next
                  disabled={currentPageIdx === numPages - 1}
                  onClick={() => {
                    setCurrentPageIdx(currentPageIdx + 1);
                  }}
                />
                <Pagination.Last
                  disabled={currentPageIdx === numPages - 1}
                  onClick={() => {
                    setCurrentPageIdx(numPages - 1);
                  }}
                />
              </Pagination>
            ) : (
              <></>
            )}
          </Document>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Stack gap={3}>
          {signRequired ? (
            <Form>
              <Stack direction="horizontal" gap={3}>
                <Form.Label htmlFor="inlineFormInputName" visuallyHidden>
                  Full Name
                </Form.Label>
                <Form.Control
                  id="inlineFormInputName"
                  placeholder="Full Name"
                  value={signedName}
                  onChange={(e) => setSignedName(e.target.value)}
                />
                <SubmitButton
                  variant="primary"
                  onClick={handleSign}
                  style={{ width: "10rem" }}
                  loading={loading}
                  loadingText="Signing..."
                >
                  Sign PDF
                </SubmitButton>
              </Stack>
            </Form>
          ) : (
            <></>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentModal;
