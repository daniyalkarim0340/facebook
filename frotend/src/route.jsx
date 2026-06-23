import { Routes, Route } from "react-router-dom";

import LoginForm from "./pages/loginpage";
import RegisterPage from "./pages/registerpage";
import VerifyOtpPage from "./componets/verfiyotp";

import MainLayout from "./layout/mainlayout";
import ProtectedRoute from "./componets/protectedroute";


import ChatDashboard from "./pages/homepage";
import HomePortal from "./pages/ui.page";
import PublicRoute from "./componets/public";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* HOME */}
      <Route path="/" element={<HomePortal />} />

      {/* PROTECTED AI ROUTE */}
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChatDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;