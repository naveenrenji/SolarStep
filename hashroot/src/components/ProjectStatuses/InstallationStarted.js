import React, { useCallback, useEffect, useMemo } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import { LinkContainer } from "react-router-bootstrap";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import useProject from "../../hooks/useProject";
import ConfirmationModal from "../shared/ConfirmationModal";

import SubmitButton from "../shared/SubmitButton";
import { moveToValidatingPermitsApi } from "../../api/projectStatuses";
import { getTaskAnalyticsApi } from "../../api/tasks";
import { toast } from "react-toastify";
import Loader from "../shared/Loader";

const InstallationStarted = () => {
  const auth = useAuth();
  const { project, updateProject } = useProject();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [taskAnalytics, setTaskAnalytics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getTaskAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const { analytics } = await getTaskAnalyticsApi({
        projectId: project._id,
      });
      setTaskAnalytics(analytics);
    } catch (error) {
      toast(
        error?.response?.data?.message ||
          error.message ||
          "Could not get task analytics",
        {
          type: toast.TYPE.ERROR,
        }
      );
    } finally {
      setLoading(false);
    }
  }, [project._id]);

  useEffect(() => {
    getTaskAnalytics();
  }, [getTaskAnalytics]);

  const totalTasks = useMemo(() => {
    if (!taskAnalytics) return 0;
    return (
      taskAnalytics.todo + taskAnalytics.inProgress + taskAnalytics.completed
    );
  }, [taskAnalytics]);

  const incompleteTasks = useMemo(() => {
    if (!taskAnalytics) return 0;
    return taskAnalytics.todo + taskAnalytics.inProgress;
  }, [taskAnalytics]);

  const completeInstallation = async () => {
    if (totalTasks === 0) {
      throw new Error("Please create tasks before moving to next state");
    }
    if (incompleteTasks > 0) {
      throw new Error(
        "All tasks must be completed before moving to next state"
      );
    }
    return await moveToValidatingPermitsApi(project._id, {
      installationCompletedOn: new Date(),
    });
  };

  const hasMoveAccess = React.useMemo(() => {
    return [USER_ROLES.ADMIN, USER_ROLES.SALES_REP].includes(auth.user.role);
  }, [auth.user.role]);

  return (
    <Card className="shadow-sm mt-3 h-100 project-status position-relative">
      {loading ? <Loader /> : <></>}
      <Card.Body
        className="mb-0 flex-1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Card.Text>The project installation is in progress.</Card.Text>
        <div style={{ textAlign: "center" }}>
          <Card.Text>
            You currently have {incompleteTasks} incomplete tasks out of{" "}
            {totalTasks} tasks.
          </Card.Text>
          <LinkContainer to={`/projects/${project._id}/tasks`}>
            <Button variant="link">View Tasks</Button>
          </LinkContainer>
          <Button variant="link" onClick={getTaskAnalytics}>
            Refresh Tasks
          </Button>
          {showConfirmationModal ? (
            <ConfirmationModal
              key="accept"
              show={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
              onConfirm={completeInstallation}
              afterConfirm={(updatedProject) => updateProject(updatedProject)}
              title="Are you sure you want to move to next state?"
              body="All your tasks must be completed before you can move to next state. Your installation will be marked as completed once you move to next state."
              confirmText="Yes, move to next state"
              cancelText="No, cancel"
              type="primary"
            />
          ) : (
            <></>
          )}
        </div>
      </Card.Body>
      {hasMoveAccess ? (
        <Card.Footer>
          <SubmitButton
            onClick={() => setShowConfirmationModal(true)}
            className="ml-3"
            disabled={project.incompleteTasks > 0}
          >
            Complete Installation
          </SubmitButton>
        </Card.Footer>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default InstallationStarted;
