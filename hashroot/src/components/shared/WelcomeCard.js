import React from "react";
import useAuth from "../../hooks/useAuth";
import RouteHeader from "./RouteHeader";

const WelcomeCard = () => {
  const { user } = useAuth();
  return (
    <RouteHeader headerText={`Welcome ${user.firstName} ${user.lastName}`} />
  );
};

export default WelcomeCard;
