import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div>
      <Header />
      <Container style={{ marginTop: "2rem" }}>
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;
