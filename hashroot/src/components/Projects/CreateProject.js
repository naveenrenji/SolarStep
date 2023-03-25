import React, { useState } from "react";
import axios from "axios";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/projects", {
        projectName,
        address,
      });
      setSuccess("Project created successfully!");
      setProjectName("");
      setAddress("");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Create a Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          />
        </div>
        <button type="submit">Create Project</button>
      </form>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </div>
  );
}

export default CreateProject;
