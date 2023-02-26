import React, { useMemo, useState, useCallback, useEffect } from "react";
import { clearFromStorage, getFromStorage, setToStorage } from "../../utils";
import { USER_LOCAL_STORAGE_KEY } from "../../constants";
import AuthContext from "../../config/AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getFromStorage(USER_LOCAL_STORAGE_KEY) || null);
  }, []);

  const signIn = useCallback(async (loggedInUser, callback) => {
    setUser(loggedInUser);
    setToStorage(USER_LOCAL_STORAGE_KEY, loggedInUser);
    callback();
  }, []);

  const signOut = useCallback(async (callback) => {
    setUser();
    clearFromStorage(USER_LOCAL_STORAGE_KEY);
    callback();
  }, []);

  const authValues = useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
