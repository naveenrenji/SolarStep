import React from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Header = () => {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth?.user) {
    return <p>You are not logged in.</p>;
  }

  const signOut = () => {
    auth.signOut(() => navigate("/"));
  };

  return (
    <p>
      Welcome {auth.user.firstName} {auth.user.lastName}!{" "}
      <button onClick={signOut}>Sign out</button>
    </p>
  );
};

export default Header;
