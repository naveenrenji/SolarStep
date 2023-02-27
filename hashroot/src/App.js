import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import { AuthProvider, RequiresAuth } from "./hoc/Authentication";

import Homepage from "./components/Homepage/Homepage";
import Layout from "./components/Layout";
import {Login, Signup} from "./components/Authentication";
import SolarDashboard from "./components/SolarDashboard/SolarDashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <RequiresAuth>
                <SolarDashboard />
              </RequiresAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
