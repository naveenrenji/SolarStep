import { createContext } from "react";

const ProjectContext = createContext({
  project: {},
  updateProject: () => {},
});

export default ProjectContext;
