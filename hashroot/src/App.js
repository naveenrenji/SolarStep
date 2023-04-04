import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import "react-datepicker/dist/react-datepicker.css";

import { AuthProvider, RequiresAuth } from "./hoc/Authentication";
import { USER_ROLES } from "./constants";

import Homepage from "./components/Homepage/Homepage";
import Layout from "./components/Layout";
import { Login } from "./components/Authentication";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/shared/NotFound";
import Profile from "./components/Profile";
import { Projects, CreateProject, Project } from "./components/Projects";
import { CreateUser, Users } from "./components/Users";
import { CreateTask, Tasks } from "./components/Tasks";
import ProjectLayout from "./hoc/ProjectLayout";
import TaskLayout from "./hoc/TaskLayout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequiresAuth>
                <Dashboard />
              </RequiresAuth>
            }
          />
          <Route path="/users" element={<Outlet />}>
            <Route
              index
              element={
                <RequiresAuth
                  roles={[
                    USER_ROLES.ADMIN,
                    USER_ROLES.SALES_REP,
                    USER_ROLES.GENERAL_CONTRACTOR,
                  ]}
                >
                  <Users />
                </RequiresAuth>
              }
            />
            <Route
              path="create"
              element={
                <RequiresAuth
                  roles={[
                    USER_ROLES.ADMIN,
                    USER_ROLES.SALES_REP,
                    USER_ROLES.GENERAL_CONTRACTOR,
                  ]}
                >
                  <CreateUser />
                </RequiresAuth>
              }
            />
          </Route>
          <Route path="/projects" element={<Outlet />}>
            <Route
              index
              element={
                <RequiresAuth>
                  <Projects />
                </RequiresAuth>
              }
            />
            <Route
              path="create"
              element={
                <RequiresAuth roles={[USER_ROLES.SALES_REP, USER_ROLES.ADMIN]}>
                  <CreateProject />
                </RequiresAuth>
              }
            />
            <Route
              path=":projectId"
              element={
                <RequiresAuth>
                  <ProjectLayout />
                </RequiresAuth>
              }
            >
              <Route
                index
                element={
                  <RequiresAuth>
                    <Project />
                  </RequiresAuth>
                }
              />
              <Route
                path="tasks"
                element={
                  <TaskLayout>
                    <Outlet />
                  </TaskLayout>
                }
              >
                <Route
                  index
                  element={
                    <RequiresAuth>
                      <Tasks />
                    </RequiresAuth>
                  }
                />
                <Route
                  path="create"
                  element={
                    <RequiresAuth
                      roles={[
                        USER_ROLES.ADMIN,
                        USER_ROLES.GENERAL_CONTRACTOR,
                        USER_ROLES.SALES_REP,
                      ]}
                    >
                      <CreateTask />
                    </RequiresAuth>
                  }
                />
              </Route>
            </Route>
          </Route>
          <Route
            path="/profile"
            element={
              <RequiresAuth>
                <Profile />
              </RequiresAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer autoClose={5000} />
    </AuthProvider>
  );
}

export default App;
