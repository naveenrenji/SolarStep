import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import ViewProjectModal from "../shared/ViewProjectModal";
import { getPaginatedProjectsApi } from "../../api/projects";
import ErrorCard from "../shared/ErrorCard";
import ListPagination from "../shared/ListPagination";
import Loader from "../shared/Loader";
import RouteHeader from "../shared/RouteHeader";
import SearchAndCreateBar from "../shared/SearchAndCreateBar";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [viewProject, setViewProject] = useState();
  const mounted = React.useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      fetchProjects(1);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) {
      fetchProjects(currentPage, search);
    }
  }, [currentPage, search]);

  const fetchProjects = async (page, searchTxt) => {
    try {
      setPageLoading(true);
      const response = await getPaginatedProjectsApi({
        page,
        search: searchTxt,
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
      <RouteHeader headerText="Projects" />
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorCard error={error} />
      ) : (
        <div>
          <SearchAndCreateBar
            searchPlaceholder="id, name, email"
            createButtonText="+ Create a project"
            createLink="/projects/create"
            onSearch={handleSubmit}
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
                      <Button
                        variant="link"
                        onClick={() => {
                          setShowProjectModal(true);
                          setViewProject(project);
                        }}
                      >
                        View
                      </Button>
                      &nbsp;
                      <Button variant="link">Edit</Button>
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
          {showProjectModal && viewProject ? (
            <ViewProjectModal
              project={viewProject}
              show={showProjectModal}
              onClose={() => {
                setShowProjectModal(false);
                setViewProject();
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
