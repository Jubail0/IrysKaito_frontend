
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Attach token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("userJWT");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;