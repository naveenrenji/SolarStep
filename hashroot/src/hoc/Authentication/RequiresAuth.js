import React from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NoAccess from "../../components/shared/NoAccess";
import { USER_ROLES } from "../../constants";

import useAuth from "../../hooks/useAuth";

const RequiresAuth = ({ children, roles = Object.values(USER_ROLES) }) => {
  let auth = useAuth();
  let location = useLocation();

  if (!auth?.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes(auth?.user.role)) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <NoAccess />;
  }

  return children;
};

export default RequiresAuth;
