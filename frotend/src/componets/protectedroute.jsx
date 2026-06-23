import { Navigate } from "react-router-dom";
import useAuthStore from "../app/datastore";

const ProtectedRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);


  
  const hydrated = useAuthStore.persist.hasHydrated();



  // wait until Zustand loads from localStorage
  if (!hydrated) {

    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        Loading...
      </div>
      
    );
      
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;