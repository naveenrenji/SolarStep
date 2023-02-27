import { useContext } from "react";
import AuthContext from "../config/AuthContext";

const useAuth = () => useContext(AuthContext);

export default useAuth;
