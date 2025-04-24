import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../utils/utils";

const PrivateRoute = ({ children }) => {
  const isAdmin = isUserLoggedIn();

  return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRoute;
