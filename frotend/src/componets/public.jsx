import { Navigate } from "react-router-dom";
import useAuthStore from "../app/datastore";

const PublicRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore.persist.hasHydrated();

  if (!hydrated) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // ✅ already logged in → send to AI page
  if (accessToken) {
    return <Navigate to="/ai" replace />;
  }

  return children;
};

export default PublicRoute;