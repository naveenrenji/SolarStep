import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <Container
        style={{
          paddingTop: "calc(66px + 2rem)",
          paddingBottom: "2rem",
          height: "100vh"
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
