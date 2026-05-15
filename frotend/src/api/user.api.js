import api from "./axios.instance";

// -------------------
// REGISTER
// -------------------
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
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
    const response = await api.post("/login", userData);
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
    const response = await api.post("/logout");
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
    const response = await api.post("/refresh-token");
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Network Error");
  }
};

export const resendOtp  = async (data) => {
  const res = await api.post("/resend-otp", data);
  return res.data;
};


export const verifyOtp = async (data) => {
  const res = await api.post("/verify-otp", data);
  return res.data;
};