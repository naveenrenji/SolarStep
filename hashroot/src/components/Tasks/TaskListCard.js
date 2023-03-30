import { useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import CloseButton from "react-bootstrap/esm/CloseButton";
import FormText from "react-bootstrap/esm/FormText";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";

import { TASK_STATUSES } from "../../constants";

const TaskListCard = ({ task, onTaskClick, onStatusChange, onDelete }) => {
  const taskActionStatuses = useMemo(() => {
    if (!task.canChangeStatus) {
      return {};
    }
    switch (task?.status) {
      case TASK_STATUSES.TO_DO:
        return {
          left: null,
          right: TASK_STATUSES.IN_PROGRESS,
        };
      case TASK_STATUSES.IN_PROGRESS:
        return {
          left: TASK_STATUSES.TO_DO,
          right: TASK_STATUSES.COMPLETED,
        };
      default:
        return {};
    }
  }, [task]);

  const elapsedTime = useMemo(() => {
    const startDate = new Date(task.createdAt);
    const endDate = new Date();
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays - 1;
  }, [task]);

  const toBeCompletedIn = useMemo(() => {
    const expectedCompletedDate = new Date(task.expectedCompletionDate);
    const endDate = new Date();
    const timeDiff = expectedCompletedDate.getTime() - endDate.getTime();

    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }, [task]);

  const completedTime = useMemo(() => {
    if (!task.completedOn) return null;
    const completedOn = new Date(task.completedOn);
    return completedOn.toLocaleDateString();
  }, [task]);

  const taskCompletionDelayedBy = useMemo(() => {
    if (!task.completedOn) return null;
    const expectedCompletedDate = new Date(task.expectedCompletionDate);
    const completedOn = new Date(task.completedOn);
    const timeDiff = completedOn.getTime() - expectedCompletedDate.getTime();

    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }, [task]);

  return (
    <Card className="task-card">
      <Card.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Card.Text style={{ marginBottom: 0 }}>
          <b>{task.title}</b>
        </Card.Text>
        {task.canEdit && onDelete ? (
          <CloseButton onClick={() => onDelete(task)} />
        ) : (
          <></>
        )}
      </Card.Header>
      <Card.Body style={{ cursor: "pointer" }} onClick={onTaskClick}>
        <FormText>
          <small>Total Workers: {task.workers.length}</small>
        </FormText>
        <br />
        <FormText>
          <small>GC: {task.generalContractor.email}</small>
        </FormText>
        <br />
        {task.status !== TASK_STATUSES.COMPLETED ? (
          <FormText
            className={
              toBeCompletedIn > 0
                ? "text-muted"
                : toBeCompletedIn === 0
                ? "text-secondary"
                : "text-danger"
            }
            style={{ fontWeight: "bold" }}
          >
            <small>
              {toBeCompletedIn > 0
                ? `Expected to complete in ${toBeCompletedIn} days`
                : toBeCompletedIn === 0
                ? `Expected to finish today`
                : `Delayed by ${Math.abs(toBeCompletedIn)} days`}
            </small>
          </FormText>
        ) : (
          <FormText className="text-success" style={{ fontWeight: "bold" }}>
            <small>
              {taskCompletionDelayedBy > 0
                ? `Task completed ${taskCompletionDelayedBy} days late`
                : taskCompletionDelayedBy === 0
                ? `Task completed on time`
                : `Task completed ${Math.abs(
                    taskCompletionDelayedBy
                  )} days early`}
            </small>
          </FormText>
        )}
      </Card.Body>
      <Card.Footer className="text-muted">
        {task.status === TASK_STATUSES.COMPLETED ? (
          <FormText>Completed on: {completedTime}</FormText>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {taskActionStatuses.left ? (
              <OverlayTrigger
                key="left"
                overlay={
                  <Tooltip id={`task-actions-${taskActionStatuses.left}`}>
                    {taskActionStatuses.left}
                  </Tooltip>
                }
              >
                {({ ref, ...triggerHandler }) => (
                  <span ref={ref} {...triggerHandler}>
                    <BsArrowLeftSquareFill
                      className="primary"
                      fontSize={20}
                      onClick={() =>
                        onStatusChange(task._id, taskActionStatuses.left)
                      }
                      style={{ cursor: "pointer" }}
                      title={taskActionStatuses.left}
                    />
                  </span>
                )}
              </OverlayTrigger>
            ) : (
              <div style={{ width: "20px", height: "20px" }} />
            )}
            <FormText>
              {elapsedTime === 0 ? `Today` : `${elapsedTime} day(s) ago`}
            </FormText>
            {taskActionStatuses.right ? (
              <OverlayTrigger
                key="right"
                placement="left"
                overlay={
                  <Tooltip id={`task-actions-${taskActionStatuses.right}`}>
                    {taskActionStatuses.right}
                  </Tooltip>
                }
              >
                {({ ref, ...triggerHandler }) => (
                  <span ref={ref} {...triggerHandler}>
                    <BsArrowRightSquareFill
                      className="primary"
                      fontSize={20}
                      onClick={() =>
                        onStatusChange(task._id, taskActionStatuses.right)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                )}
              </OverlayTrigger>
            ) : (
              <div style={{ width: "20px", height: "20px" }} />
            )}
          </div>
        )}
      </Card.Footer>
    </Card>
  );
};

export default TaskListCard;
