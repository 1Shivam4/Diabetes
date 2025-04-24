import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import Landing from "../pages/Landing";
import UserLayout from "../components/layout/UserLayout";
import Login from "../pages/Login";
import PrivateRoute from "./UsersRoutes";
import UserReport from "../pages/UserReport";
import Test from "../pages/Test";

const RoutesList = [
  { path: "/", component: <Landing /> },
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Login /> },
];

const UserRoutesList = [
  { path: "/user", component: <UserReport /> },
  { path: "/user/test", component: <Test /> },
];

function AllRoutes() {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith("/user");

  return (
    <>
      {isUserRoute ? (
        <UserLayout>
          <Routes>
            {UserRoutesList.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute>{route.component}</PrivateRoute>}
              />
            ))}
          </Routes>
        </UserLayout>
      ) : (
        <Layout>
          <Routes>
            {RoutesList.map((route, index) => (
              <Route key={index} path={route.path} element={route.component} />
            ))}
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <AllRoutes />
    </Router>
  );
}
