import React from "react";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import NotFound from "../shared/NotFound";
import ProjectsCard from "../shared/ProjectsCard";
import UsersCard from "../shared/UsersCard";

const Dashboard = () => {
  const { user } = useAuth();
  switch (user?.role) {
    case USER_ROLES.ADMIN:
      return <UsersCard />;
    case USER_ROLES.GENERAL_CONTRACTOR:
    case USER_ROLES.SALES_REP:
      return (
        <>
          <UsersCard />
          <ProjectsCard />
        </>
      );
    case USER_ROLES.CUSTOMER:
    case USER_ROLES.WORKER:
      return <ProjectsCard />;
    default:
      return <NotFound />;
  }
};

export default Dashboard;
