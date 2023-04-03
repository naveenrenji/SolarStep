import React from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { PROJECT_STATUSES } from "../constants";

import useAuth from "../hooks/useAuth";
import useProject from "../hooks/useProject";

const TaskLayout = ({ children }) => {
  let auth = useAuth();
  const { project } = useProject();
  let location = useLocation();

  if (!auth?.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!project) {
    toast("Project not found", { type: toast.TYPE.ERROR });
    return <Navigate to="/dashboard" replace />;
  }

  if (project?.status !== PROJECT_STATUSES.INSTALLATION_STARTED) {
    toast("Project installation not started yet", { type: toast.TYPE.WARNING });
    return <Navigate to={`/projects/${project._id}`} replace />;
  }

  return children;
};

export default TaskLayout;
