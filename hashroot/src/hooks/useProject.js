import { useContext } from "react";
import ProjectContext from "../config/ProjectContext";

const useProject = () => useContext(ProjectContext);

export default useProject;
