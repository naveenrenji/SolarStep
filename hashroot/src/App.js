import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import "./App.css";
import { AuthProvider, RequiresAuth } from "./hoc/Authentication";
import { USER_ROLES } from "./constants";

import Homepage from "./components/Homepage/Homepage";
import Layout from "./components/Layout";
import { Login, Signup } from "./components/Authentication";
import SolarDashboard from "./components/SolarDashboard/SolarDashboard";
import NotFound from "./components/shared/NotFound";
import AdminDashboard from "./components/Admin/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequiresAuth role={USER_ROLES.ADMIN}>
                <Outlet />
              </RequiresAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="create-user" element={<Signup />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <RequiresAuth>
                <SolarDashboard />
              </RequiresAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
