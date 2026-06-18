import { Routes, Route } from "react-router-dom";

import LoginForm from "./pages/loginpage";
import RegisterPage from "./pages/registerpage";


import MainLayout from "./layout/mainlayout";
import ProtectedRoute from "./componets/protectedroute";
import VerifyOtpPage from "./componets/verfiyotp";

import ChatDashboard from "./pages/homepage";
import HomePortal from "./pages/ui.page";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* HOME */}
      <Route path="/" element={<HomePortal />} />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChatDashboard/>
            </MainLayout>
          </ProtectedRoute>
        }
      />

    

    </Routes>
  );
};

export default AppRoutes;