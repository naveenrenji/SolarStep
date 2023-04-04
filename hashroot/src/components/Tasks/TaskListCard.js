import { useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import CloseButton from "react-bootstrap/esm/CloseButton";
import FormText from "react-bootstrap/esm/FormText";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";

import { TASK_STATUSES } from "../../constants";
import { daysRemaining, displayDate } from "../../utils/date";

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

  const elapsedTime = useMemo(
    () =>
      daysRemaining(new Date(task.createdAt), new Date(), {
        excludeEndDate: true,
      }),
    [task]
  );

  const toBeCompletedIn = useMemo(() => {
    return daysRemaining(new Date(task.expectedCompletionDate), new Date());
  }, [task]);

  const completedOn = useMemo(() => {
    if (!task.completedOn) return null;
    return displayDate(task.completedOn);
  }, [task]);

  const taskCompletionDelayedBy = useMemo(() => {
    if (!task.completedOn) return null;
    return daysRemaining(task.expectedCompletionDate, task.completedOn);
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
          <FormText>Completed on: {completedOn}</FormText>
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
