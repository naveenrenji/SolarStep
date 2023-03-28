import { createContext } from "react";

const AuthContext = createContext({
  user: {},
  signIn: () => {},
  signOut: () => {},
  updateProfile: () => {},
});

export default AuthContext;
