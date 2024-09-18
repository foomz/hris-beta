import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "http://localhost:8000/api",  // Base URL for Django backend
});

// Add a request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");  // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
