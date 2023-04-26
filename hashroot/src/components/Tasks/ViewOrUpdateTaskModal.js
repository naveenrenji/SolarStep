import React, { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

import { updateTaskApi } from "../../api/tasks";
import { USER_ROLES } from "../../constants";

import SubmitButton from "../shared/SubmitButton";
import SelectUserOptsBody from "../shared/SelectUserOptsBody";

const ViewOrUpdateTaskModal = ({
  show,
  onClose,
  task,
  projectId,
  afterUpdate,
}) => {
  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description);
  const [workerOpts, setWorkerOpts] = React.useState(
    task.workers?.map((w) => ({
      label: w.email,
      value: w._id,
    }))
  );
  const [showWorkerSelectionModal, setShowWorkerSelectionModal] =
    React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const canUpdate = useMemo(() => task.canEdit, [task]);

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!title) {
        toast("Please enter a title", { type: toast.TYPE.ERROR });
        return;
      }
      if (!description) {
        toast("Please enter a description", { type: toast.TYPE.ERROR });
        return;
      }
      if (!workerOpts?.length && workerOpts.every((opt) => !opt?.value)) {
        toast("Please select at least one worker", {
          type: toast.TYPE.ERROR,
        });
        return;
      }
      const updatedTask = await updateTaskApi({
        taskId: task._id,
        projectId,
        title,
        description,
        workerIds: workerOpts.map((w) => w.value),
      });
      toast("Task updated successfully", { type: toast.TYPE.SUCCESS });
      await afterUpdate(updatedTask);
      setLoading(false);
      handleCancel();
    } catch (error) {
      setLoading(false);
      toast(error.message, { type: toast.TYPE.ERROR });
    }
  };

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">Task {task._id}</Modal.Title>
      </Modal.Header>
      {showWorkerSelectionModal ? (
        <>
          <Modal.Body>
            <SelectUserOptsBody
              selectedUserOpts={workerOpts}
              removeOption={(opt) => {
                setWorkerOpts(workerOpts.filter((o) => o.value !== opt.value));
              }}
              onNewOptionAdd={(opt) => {
                if (workerOpts.find((o) => o.value === opt.value)) {
                  toast("User already added", { type: toast.TYPE.INFO });
                  return;
                }
                setWorkerOpts([...workerOpts, opt]);
              }}
              roles={[USER_ROLES.WORKER]}
              canEdit={canUpdate}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowWorkerSelectionModal(false);
              }}
            >
              Go back
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label aria-required>Title</Form.Label>
              <Form.Control
                value={title}
                type="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                disabled={!canUpdate}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label aria-required>Description</Form.Label>
              <Form.Control
                value={description}
                type="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                disabled={!canUpdate}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label aria-required>Expected Completion Date</Form.Label>
              <Form.Control
                value={new Date(
                  task.expectedCompletionDate
                ).toLocaleDateString()}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label aria-required>Workers</Form.Label>
              {workerOpts.length ? (
                <Button
                  variant="link"
                  onClick={() => setShowWorkerSelectionModal(true)}
                >
                  {workerOpts.length} worker{workerOpts.length > 1 ? "s" : ""}{" "}
                  added. Click to view{canUpdate ? " and change." : "."}
                </Button>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() => setShowWorkerSelectionModal(true)}
                  className="w-100"
                >
                  Add worker(s)
                </Button>
              )}
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Close
            </Button>
            {canUpdate && (
              <SubmitButton type="submit" variant="primary" loading={loading}>
                Update Task
              </SubmitButton>
            )}
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
};

export default ViewOrUpdateTaskModal;
