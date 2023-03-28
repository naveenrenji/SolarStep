import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { LinkContainer } from "react-router-bootstrap";

import { getProjectTasksApi } from "../../api/tasks";

import useProject from "../../hooks/useProject";

import ErrorCard from "../shared/ErrorCard";
import Loader from "../shared/Loader";
import RouteHeader from "../shared/RouteHeader";

const Tasks = () => {
  const { project } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const tasks = await getProjectTasksApi({ projectId: project._id });
      setCreatedTasks(tasks.filter((task) => task.status === "created"));
      setInProgressTasks(tasks.filter((task) => task.status === "in-progress"));
      setCompletedTasks(tasks.filter((task) => task.status === "completed"));
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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <RouteHeader headerText="Tasks" />
      {loading ? (
        <Loader />
      ) : !error ? (
        <ErrorCard error={error} />
      ) : (
        <>
          <Stack gap={2} direction="horizontal" className="mt-3 mb-3">
            <LinkContainer to={`/projects/${project._id}`}>
              <Button>Go to project</Button>
            </LinkContainer>
            <LinkContainer to={`/projects/${project._id}/tasks/create`}>
              <Button>+ Create Task</Button>
            </LinkContainer>
          </Stack>
          <Row style={{ flexGrow: 1 }}>
            <Col>
              <Card>
                <Card.Header>Created Tasks</Card.Header>
                <Card.Body>
                  {createdTasks?.length ? (
                    createdTasks.map((task) => (
                      <Card>
                        <Card.Body>
                          <Card.Text>{task.title}</Card.Text>
                          <Card.Text>
                            {task.workers
                              .map((worker) => worker.name)
                              .join(", ")}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <Card.Body>
                        <Form.Text>No tasks created yet.</Form.Text>
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>In-progress Tasks</Card.Header>
                <Card.Body>
                  {inProgressTasks?.length ? (
                    inProgressTasks.map((task) => (
                      <Card>
                        <Card.Body>
                          <Card.Text>{task.title}</Card.Text>
                          <Card.Text>
                            {task.workers
                              .map((worker) => worker.name)
                              .join(", ")}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <Card.Body>
                        <Form.Text>No in progress tasks created yet.</Form.Text>
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Header>Completed Tasks</Card.Header>
                <Card.Body>
                  {completedTasks?.length ? (
                    completedTasks.map((task) => (
                      <Card>
                        <Card.Body>
                          <Card.Text>{task.title}</Card.Text>
                          <Card.Text>
                            {task.workers
                              .map((worker) => worker.name)
                              .join(", ")}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <Card.Body>
                        <Form.Text>No completed tasks created yet.</Form.Text>
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Tasks;
