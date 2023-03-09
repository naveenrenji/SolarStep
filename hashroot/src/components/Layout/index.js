import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div>
      <Header />
      <Container
        style={{
          marginTop: "calc(66px + 2rem)",
          marginBottom: "2rem",
          overflow: "scroll",
        }}
      >
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;
