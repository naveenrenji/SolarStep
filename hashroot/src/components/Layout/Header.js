import React from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import useAuth from "../../hooks/useAuth";
import { USER_ROLES } from "../../constants";

const Header = () => {
  let auth = useAuth();
  let navigate = useNavigate();

  const dashboardLink =
    auth?.user?.role === USER_ROLES.ADMIN ? "/admin/dashboard" : "dashboard";

  const signOut = () => {
    auth.signOut(() => navigate("/"));
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Solar Step</Navbar.Brand>
        <Navbar.Toggle />
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
                <LinkContainer to={dashboardLink}>
                  <Nav.Link>Dashboard</Nav.Link>
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
