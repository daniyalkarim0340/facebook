import api from "./axios.instance";

// -------------------
// REGISTER
// -------------------
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// LOGIN
// -------------------
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/users/login", userData, {
      withCredentials: true, // IMPORTANT for refresh cookie
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// LOGOUT
// -------------------
export const logoutUser = async () => {
  try {
    const response = await api.post("/users/logout", {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// REFRESH TOKEN
// -------------------
export const refreshToken = async () => {
  try {
    const response = await api.post("/users/refresh-token", {}, {
      withCredentials: true, // VERY IMPORTANT
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

// -------------------
// OTP
// -------------------
export const resendOtp = async (data) => {
  const res = await api.post("/resend-otp", data);
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await api.post("/users/verify-otp", data);
  return res.data;
};