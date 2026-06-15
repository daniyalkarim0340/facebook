import { Navigate } from "react-router-dom";
import useAuthStore from "../app/datastore";

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;