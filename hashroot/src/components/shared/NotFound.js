import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div>
      The route you are looking for does not exist. Please{" "}
      <Link to={!user ? "/" : "/dashboard"}>click here</Link> to go back to{" "}
      {!user ? "home" : "dashboard"}
    </div>
  );
};

export default NotFound;
