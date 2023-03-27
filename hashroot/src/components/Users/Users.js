import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { FaEdit, FaRegWindowMaximize } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import { deleteUserApi, getPaginatedUsersApi } from "../../api/users";
import { USER_ROLES } from "../../constants";
import DeleteConfirmationModal from "../shared/DeleteConfirmationModal";
import EditUserModal from "../shared/EditUserModal";
import ErrorCard from "../shared/ErrorCard";
import ListPagination from "../shared/ListPagination";
import Loader from "../shared/Loader";
import RouteHeader from "../shared/RouteHeader";
import SearchAndCreateBar from "../shared/SearchAndCreateBar";
import ViewUserModal from "../shared/ViewUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);

  const mounted = React.useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      fetchUsers(1);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) {
      fetchUsers(currentPage, search, selectedRoles);
    }
  }, [currentPage, search, selectedRoles]);

  const fetchUsers = async (page, searchTxt, roles) => {
    try {
      setPageLoading(true);
      const response = await getPaginatedUsersApi({
        page,
        search: searchTxt,
        roles,
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

  const handleSubmit = (searchTxt, selectedRoles) => {
    setCurrentPage(1);
    setSearch(searchTxt);
    setSelectedRoles(selectedRoles);
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
            searchPlaceholder="Name, Email"
            createButtonText="+ Create a User"
            createLink="/users/create"
            onSearch={handleSubmit}
            options={Object.values(USER_ROLES).map((role) => ({
              value: role,
              label: role,
            }))}
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
                      <FaRegWindowMaximize
                        onClick={() => {
                          setShowViewUserModal(true);
                          setSelectedUser(user);
                        }}
                        title="View"
                        className="m-1"
                        style={{ cursor: "pointer" }}
                      />
                      &nbsp;
                      {user.canEdit ? (
                        <>
                          <FaEdit
                            title="Edit"
                            onClick={() => {
                              setShowEditUserModal(true);
                              setSelectedUser(user);
                            }}
                            className="m-1"
                            style={{ cursor: "pointer" }}
                          />
                          <MdDeleteForever
                            title="Delete"
                            onClick={() => {
                              setShowDeleteUserModal(true);
                              setSelectedUser(user);
                            }}
                            className="m-1"
                            style={{ cursor: "pointer" }}
                          />
                        </>
                      ) : (
                        <></>
                      )}
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
          {showViewUserModal && selectedUser && (
            <ViewUserModal
              show={showViewUserModal}
              onClose={() => {
                setShowViewUserModal(false);
                setSelectedUser();
              }}
              user={selectedUser}
            />
          )}
          {showEditUserModal && selectedUser && (
            <EditUserModal
              show={showEditUserModal}
              onClose={() => {
                setShowViewUserModal(false);
                setSelectedUser();
              }}
              user={selectedUser}
              afterSave={(updatedUser) => {
                setUsers((state) =>
                  state.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                  )
                );
              }}
            />
          )}
          {showDeleteUserModal && selectedUser && (
            <DeleteConfirmationModal
              show={showDeleteUserModal}
              onClose={() => {
                setShowDeleteUserModal(false);
                setSelectedUser();
              }}
              title="Delete User"
              message="Are you sure you want to delete this user?"
              item={selectedUser}
              onConfirm={deleteUserApi}
              afterDelete={(deletedUser) => {
                setUsers((state) =>
                  state.filter((user) => user._id !== deletedUser._id)
                );
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
