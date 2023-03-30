import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { LinkContainer } from "react-router-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { toast } from "react-toastify";

import {
  deleteTaskApi,
  getProjectTasksApi,
  updateTaskStatusApi,
} from "../../api/tasks";
import { TASK_STATUSES, USER_ROLES } from "../../constants";

import useProject from "../../hooks/useProject";
import useAuth from "../../hooks/useAuth";

import ErrorCard from "../shared/ErrorCard";
import Loader from "../shared/Loader";
import RouteHeader from "../shared/RouteHeader";
import TaskListCard from "./TaskListCard";
import ViewOrUpdateTaskModal from "./ViewOrUpdateTaskModal";
import ConfirmationModal from "../shared/ConfirmationModal";

const Tasks = () => {
  const auth = useAuth();
  const { project } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskConfirmation, setShowDeleteTaskConfirmation] =
    useState(false);

  const toDoTasks = useMemo(
    () => tasks.filter((task) => task.status === TASK_STATUSES.TO_DO),
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task.status === TASK_STATUSES.IN_PROGRESS),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === TASK_STATUSES.COMPLETED),
    [tasks]
  );

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { tasks: tasksList } = await getProjectTasksApi({
        projectId: project._id,
      });
      setTasks(tasksList);
    } catch (error) {
      setError(
        error?.response?.data?.error || error.message || "Could not fetch tasks"
      );
    } finally {
      setLoading(false);
    }
  }, [project._id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onTaskStatusChange = async (taskId, status) => {
    try {
      const { task: updatedTask } = await updateTaskStatusApi({
        projectId: project._id,
        taskId,
        status,
      });
      setTasks((tasks) =>
        tasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
      toast(`Task moved to ${status}`, { type: toast.TYPE.SUCCESS });
    } catch (error) {
      toast(
        error?.response?.data?.error || error.message || "Could not move tasks",
        { type: toast.TYPE.ERROR }
      );
    }
  };

  const handleTaskClick = (task) => {
    setCurrentTask(task);
    setShowTaskModal(true);
  };

  const handleTaskDeleteClick = async (task) => {
    setCurrentTask(task);
    setShowDeleteTaskConfirmation(true);
  };

  const canCreate = useMemo(
    () => ![USER_ROLES.CUSTOMER, USER_ROLES.WORKER].includes(auth.user.role),
    [auth.user.role]
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      className="mb-3"
    >
      <RouteHeader headerText="Tasks" />
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorCard error={error} />
      ) : (
        <>
          <Stack gap={2} direction="horizontal" className="mt-3 mb-3">
            <LinkContainer to={`/projects/${project._id}`}>
              <Button>
                <BsArrowLeft /> Go to project
              </Button>
            </LinkContainer>
            {canCreate ? (
              <LinkContainer to={`/projects/${project._id}/tasks/create`}>
                <Button>+ Create Task</Button>
              </LinkContainer>
            ) : (
              <></>
            )}
          </Stack>
          <Row style={{ flexGrow: 1 }} className="mb-3">
            <Col>
              <Card>
                <Card.Header>To-Do</Card.Header>
                <Card.Body>
                  <Stack gap={2}>
                    {toDoTasks?.length ? (
                      toDoTasks.map((task) => (
                        <TaskListCard
                          key={task._id}
                          task={task}
                          onStatusChange={onTaskStatusChange}
                          onTaskClick={() => handleTaskClick(task)}
                          onDelete={handleTaskDeleteClick}
                        />
                      ))
                    ) : (
                      <Card>
                        <Card.Body>
                          <Form.Text>No tasks created yet.</Form.Text>
                        </Card.Body>
                      </Card>
                    )}
                    {canCreate ? (
                      <Card className="add-task-card">
                        <Card.Body>
                          <Form.Text>
                            To create a new task,{" "}
                            <LinkContainer
                              to={`/projects/${project._id}/tasks/create`}
                              style={{ fontSize: "0.875rem", padding: 0 }}
                            >
                              <Button
                                variant="link"
                                style={{ fontSize: "0.875rem", padding: 0 }}
                              >
                                click here
                              </Button>
                            </LinkContainer>
                          </Form.Text>
                        </Card.Body>
                      </Card>
                    ) : (
                      <></>
                    )}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>In Progress</Card.Header>
                <Card.Body>
                  <Stack gap={2}>
                    {inProgressTasks?.length ? (
                      inProgressTasks.map((task) => (
                        <TaskListCard
                          key={task._id}
                          task={task}
                          onStatusChange={onTaskStatusChange}
                          onTaskClick={() => handleTaskClick(task)}
                          onDelete={handleTaskDeleteClick}
                        />
                      ))
                    ) : (
                      <Card>
                        <Card.Body>
                          <Form.Text>
                            No in progress tasks created yet.
                          </Form.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>Completed</Card.Header>
                <Card.Body>
                  <Stack gap={2}>
                    {completedTasks?.length ? (
                      completedTasks.map((task) => (
                        <TaskListCard
                          key={task._id}
                          task={task}
                          onStatusChange={onTaskStatusChange}
                          onTaskClick={() => handleTaskClick(task)}
                        />
                      ))
                    ) : (
                      <Card>
                        <Card.Body>
                          <Form.Text>No completed tasks created yet.</Form.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {currentTask && showTaskModal && (
            <ViewOrUpdateTaskModal
              show={showTaskModal}
              onClose={() => {
                setCurrentTask();
                setShowTaskModal(false);
              }}
              task={currentTask}
              projectId={project._id}
              afterUpdate={(updatedTask) => {
                setTasks((state) =>
                  state.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                  )
                );
              }}
            />
          )}
          {currentTask && showDeleteTaskConfirmation && (
            <ConfirmationModal
              show={showDeleteTaskConfirmation}
              onClose={() => {
                setCurrentTask();
                setShowDeleteTaskConfirmation(false);
              }}
              onConfirm={async () => {
                await deleteTaskApi({
                  projectId: project._id,
                  taskId: currentTask._id,
                });
              }}
              title="Delete Task"
              message="Are you sure you want to delete this task?"
              afterConfirm={() => {
                setTasks((tasks) =>
                  tasks.filter((task) => task._id !== currentTask._id)
                );
                toast("Task deleted successfully", {
                  type: toast.TYPE.SUCCESS,
                });
                setCurrentTask();
                setShowDeleteTaskConfirmation(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Tasks;
