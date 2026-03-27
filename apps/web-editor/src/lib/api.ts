import axios from "axios";

export const api = axios.create({
  // This points to your Gateway (Port 3000)
  baseURL: "http://localhost:3000/api",
});

// Automatically attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
