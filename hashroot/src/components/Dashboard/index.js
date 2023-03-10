import React from "react";
import Stack from "react-bootstrap/Stack";

import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import NotFound from "../shared/NotFound";
import ProjectsCard from "../shared/ProjectsCard";
import UsersCard from "../shared/UsersCard";
import WelcomeCard from "../shared/WelcomeCard";

const DashboardCards = () => {
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

const Dashboard = () => {
  return (
    <Stack gap={3}>
      <WelcomeCard />
      <Stack gap={3} style={{ marginBottom: "16px" }}>
        <DashboardCards />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
