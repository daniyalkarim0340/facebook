import { Navigate } from "react-router-dom";
import useAuthStore from "../app/datastore";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  console.log("i amnew user ahhaha",user);
  

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;