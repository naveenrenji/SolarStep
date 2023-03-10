import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <Container
        style={{
          marginTop: "calc(66px + 2rem)",
          paddingBottom: "2rem",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
