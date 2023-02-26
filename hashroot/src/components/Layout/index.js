import { Outlet, Link } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div>
      <Header />

      <ul>
        <li>
          <Link to="/">Homepage</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
};

export default Layout;
