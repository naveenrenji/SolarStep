import React, { useEffect, useState } from "react";

import { getAllUsersApi } from "../../api/users";

import ErrorCard from "../shared/ErrorCard";
import Loader from "../shared/Loader";
import RouteHeader from "../shared/RouteHeader";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersApi();
      setUsers(data);
    } catch (error) {
      setError("Could not fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <RouteHeader headerText="Users" />
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorCard error={error} />
      ) : (
        <>Users Listing here: {users.toString()}</>
      )}
    </>
  );
};

export default Users;
