import React, { useMemo, useState, useCallback, useEffect } from "react";
import { clearFromStorage, getFromStorage, setToStorage } from "../../utils";
import { USER_LOCAL_STORAGE_KEY } from "../../constants";
import AuthContext from "../../config/AuthContext";
import Loader from "../../components/shared/Loader";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    setUser(getFromStorage(USER_LOCAL_STORAGE_KEY) || null);
    setAppLoaded(true);
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

  const updateProfile = useCallback(async (updatedUser, callback) => {
    const userFromStorage = getFromStorage(USER_LOCAL_STORAGE_KEY);
    setUser(state => ({...state, ...updatedUser}));
    setToStorage(USER_LOCAL_STORAGE_KEY, {...userFromStorage, ...updatedUser});
    if (callback) {
      callback()
    }
  }, []);

  const authValues = useMemo(
    () => ({ user, signIn, signOut , updateProfile}),
    [user, signIn, signOut, updateProfile]
  );

  return (
    <AuthContext.Provider value={authValues}>
      {appLoaded ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
