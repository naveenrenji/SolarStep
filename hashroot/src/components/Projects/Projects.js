import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { FaEdit, FaRegWindowMaximize } from "react-icons/fa";

import { getPaginatedProjectsApi } from "../../api/projects";
import { PROJECT_STATUSES } from "../../constants";

import ErrorCard from "../shared/ErrorCard";
import ListPagination from "../shared/ListPagination";
import Loader from "../shared/Loader";
import RouteHeader from "../shared/RouteHeader";
import SearchAndCreateBar from "../shared/SearchAndCreateBar";
import ViewProjectModal from "../shared/ViewProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState();
  const mounted = React.useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      fetchProjects(1);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) {
      fetchProjects(currentPage, search, selectedStatuses);
    }
  }, [currentPage, search, selectedStatuses]);

  const fetchProjects = async (page, searchTxt, statuses) => {
    try {
      setPageLoading(true);
      const response = await getPaginatedProjectsApi({
        page,
        search: searchTxt,
        statuses,
      });
      setProjects(response.projects);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError(error);
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = (searchTxt, statuses) => {
    setCurrentPage(1);
    setSearch(searchTxt);
    setSelectedStatuses(statuses);
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, [currentPage]);

  return (
    <div>
      <RouteHeader headerText="Projects" />
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorCard error={error} />
      ) : (
        <div>
          <SearchAndCreateBar
            searchPlaceholder="Name, User Email"
            createButtonText="+ Create a project"
            createLink="/projects/create"
            onSearch={handleSubmit}
            options={Object.values(PROJECT_STATUSES).map((status) => ({
              label: status,
              value: status,
            }))}
          />
          <Table striped responsive>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length ? (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project._id}</td>
                    <td>{project.projectName}</td>
                    <td>{project.address?.streetAddress}</td>
                    <td>{project.user.email}</td>
                    <td>
                      <FaRegWindowMaximize
                        variant="link"
                        onClick={() => {
                          setShowProjectModal(true);
                          setSelectedProject(project);
                        }}
                        title="View"
                        className="m-1"
                        style={{ cursor: "pointer" }}
                      />
                      &nbsp;
                      <FaEdit
                        title="Edit"
                        className="m-1"
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} rowSpan={3} className="text-center">
                    No projects available yet
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
          {showProjectModal && selectedProject ? (
            <ViewProjectModal
              project={selectedProject}
              show={showProjectModal}
              onClose={() => {
                setShowProjectModal(false);
                setSelectedProject();
              }}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
