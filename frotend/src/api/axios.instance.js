import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/users", // your backend URL
  withCredentials: true, // important for cookies/auth
});

export default api;