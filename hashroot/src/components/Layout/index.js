import { Outlet, Link } from "react-router-dom";
import { USER_ROLES } from "../../constants";
import useAuth from "../../hooks/useAuth";
import Header from "./Header";

const Layout = () => {
  const { user } = useAuth();
  const dashboardLink =
    user?.role === USER_ROLES.ADMIN ? "/admin/dashboard" : "dashboard";

  return (
    <div>
      <Header />

      <ul>
        <li>
          <Link to="/">Homepage</Link>
        </li>
        {!user ? (
          <li>
            <Link to="/login">Login</Link>
          </li>
        ) : (
          <>
            <li>
              <Link to={dashboardLink}>Dashboard</Link>
            </li>
          </>
        )}
      </ul>

      <Outlet />
    </div>
  );
};

export default Layout;
