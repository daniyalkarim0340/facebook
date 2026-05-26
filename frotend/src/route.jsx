import { Routes, Route } from "react-router-dom";

import LoginForm from "./pages/loginpage";
import RegisterPage from "./pages/registerpage";
import Home from "./pages/homepage";


import MainLayout from "./layout/mainlayout";
import ProtectedRoute from "./componets/protectedroute";
import VerifyOtpPage from "./componets/verfiyotp";
import FacebookProfile from "./componets/profile";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* HOME */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <FacebookProfile/>
            </MainLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;