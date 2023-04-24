import React from "react";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";

import { getProjectEnergyUsageApi } from "../../api/projects";

import ProjectSelect from "../shared/ProjectSelect";
import RouteHeader from "../shared/RouteHeader";
import Loader from "../shared/Loader";

const ProjectDashboard = () => {
  const [project, setProject] = React.useState({});
  const [loading, setLoading] = React.useState(null);

  const onProjectSelect = async ({ _id }) => {
    try {
      setLoading(true);
      setProject();
      const project = await getProjectEnergyUsageApi(_id);
      setProject(project);
    } catch (e) {
      toast(
        e?.response?.data?.error ||
          e?.message ||
          "Could not fetch enegry usage data",
        { type: toast.TYPE.ERROR }
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-100">
      <RouteHeader
        headerText={
          "Energy Usage" +
          (project?._id ? ` ${project?.projectName || project?._id}` : "")
        }
      />
      <div className="mt-3">
        <ProjectSelect onSelect={onProjectSelect} />

        <Card className="shadow-sm mt-3 h-100">
          <Card.Body
            className="mb-0"
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading ? (
              <Loader />
            ) : project ? (
              <>Write code here</>
            ) : (
              <p style={{ textAlign: "center", marginBottom: 0 }}>
                No project selected
              </p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboard;
