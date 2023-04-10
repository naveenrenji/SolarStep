import { createContext } from "react";

const ProjectContext = createContext({
  project: {},
  authorizations: {},
  updateProject: () => {},
});

export default ProjectContext;
