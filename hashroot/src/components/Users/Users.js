import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import { getPaginatedUsersApi } from "../../api/users";
import ErrorCard from "../shared/ErrorCard";
import ListPagination from "../shared/ListPagination";
import Loader from "../shared/Loader";
import RouteHeader from "../shared/RouteHeader";
import SearchAndCreateBar from "../shared/SearchAndCreateBar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState("");

  const mounted = React.useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      fetchUsers(1);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) {
      fetchUsers(currentPage, search);
    }
  }, [currentPage, search]);

  const fetchUsers = async (page, searchTxt) => {
    try {
      setPageLoading(true);
      const response = await getPaginatedUsersApi({
        page,
        search: searchTxt,
      });
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError("Could not fetch users");
      console.log(error);
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = (searchTxt) => {
    setCurrentPage(1);
    setSearch(searchTxt);
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, [currentPage]);

  return (
    <div>
      <RouteHeader headerText="Users" />
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorCard error={error} />
      ) : (
        <div>
          <SearchAndCreateBar
            searchPlaceholder="id, name, email"
            createButtonText="+ Create a User"
            createLink="/users/create"
            onSearch={handleSubmit}
          />
          <Table striped responsive>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button variant="link">View</Button>&nbsp;
                      <Button variant="link">Edit</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} rowSpan={3} className="text-center">
                    No Users available yet
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <ListPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageClick={handlePageClick}
            loading={pageLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
