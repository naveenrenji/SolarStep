import React from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";

import useAuth from "../../hooks/useAuth";
import { SolarStep } from "../../assets/images";
import { USER_ROLES } from "../../constants";

const Header = () => {
  let auth = useAuth();
  let navigate = useNavigate();

  const signOut = () => {
    auth.signOut(() => navigate("/"));
  };

  return (
    <Navbar bg="primary" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <Stack direction="horizontal" gap={2}>
              <Image
                roundedCircle
                src={SolarStep}
                className="img-thumbnail"
                style={{ height: "40px" }}
              />
              Solar Step
            </Stack>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <div
          style={{
            marginLeft: "320px",
            color: "white",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          {auth?.user?.role?.toUpperCase()}
        </div>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <LinkContainer to="/">
              <Nav.Link>Homepage</Nav.Link>
            </LinkContainer>
            {!auth.user ? (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            ) : (
              <>
                <LinkContainer to="/dashboard">
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/projects">
                  <Nav.Link>Projects</Nav.Link>
                </LinkContainer>

                {[
                  USER_ROLES.ADMIN,
                  USER_ROLES.SALES_REP,
                  USER_ROLES.GENERAL_CONTRACTOR,
                ].includes(auth?.user?.role) ? (
                  <LinkContainer to="/users">
                    <Nav.Link>Users</Nav.Link>
                  </LinkContainer>
                ) : (
                  <></>
                )}
                <LinkContainer to="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={signOut}>Sign out</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
