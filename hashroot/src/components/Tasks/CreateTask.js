import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createTaskApi } from "../../api/tasks";
import { USER_ROLES } from "../../constants";

import SubmitButton from "../shared/SubmitButton";
import useProject from "../../hooks/useProject";
import UserOptsSelectionModal from "../shared/UserOptsSelectionModal";

const FormControlDatePicker = React.forwardRef(({ value, onClick }, ref) => (
  <Form.Control
    onClick={onClick}
    ref={ref}
    value={value}
    type="input"
    autoComplete="off"
    placeholder="Select Date"
  />
));

const CreateTask = () => {
  const navigate = useNavigate();
  const { project } = useProject();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workerOpts, setWorkerOpts] = useState([]);
  const [expectedCompletionDate, setExpectedCompletionDate] = useState("");
  const [showWorkerSelectionModal, setShowWorkerSelectionModal] =
    useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!title) {
        toast("Please enter a title", { type: toast.TYPE.ERROR });
        return;
      }
      if (!description) {
        toast("Please enter a description", { type: toast.TYPE.ERROR });
        return;
      }
      if (!expectedCompletionDate) {
        toast("Please select an expected completion date", {
          type: toast.TYPE.ERROR,
        });
        return;
      }
      if (!workerOpts?.length && workerOpts.every((opt) => !opt?.value)) {
        toast("Please select at least one worker", {
          type: toast.TYPE.ERROR,
        });
        return;
      }
      setLoading(true);
      await createTaskApi({
        projectId: project._id,
        title,
        description,
        workerIds: workerOpts.map(({ value }) => value),
        expectedCompletionDate,
      });
      toast("Task created successfully", { type: toast.TYPE.SUCCESS });
      navigate(`/projects/${project._id}/tasks`);
    } catch (e) {
      toast(e?.response?.data?.error || e?.message || "Something went wrong", {
        type: toast.TYPE.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card style={{ width: "24rem" }} className="mx-auto shadow-sm">
        <Card.Header as="h5" className="text-center">
          Create a Task
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label aria-required>Title</Form.Label>
              <Form.Control
                value={title}
                type="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label aria-required>Description</Form.Label>
              <Form.Control
                value={description}
                type="textarea"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label aria-required>Expected Completion Date</Form.Label>
              <DatePicker
                value={expectedCompletionDate}
                selected={expectedCompletionDate}
                onChange={(date) => setExpectedCompletionDate(date)}
                minDate={new Date()}
                customInput={<FormControlDatePicker />}
                placeholderText="Select a date"
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
                  added. Click to view and change.
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

            <div className="d-grid gap-2">
              <SubmitButton type="submit" variant="primary" loading={loading}>
                Create Task
              </SubmitButton>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {showWorkerSelectionModal ? (
        <UserOptsSelectionModal
          roles={[USER_ROLES.WORKER]}
          show={showWorkerSelectionModal}
          userOpts={workerOpts}
          onClose={() => {
            setShowWorkerSelectionModal(false);
          }}
          onUserOptsChange={(newWorkerOpts) => {
            setWorkerOpts(newWorkerOpts);
            setShowWorkerSelectionModal(false);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreateTask;
