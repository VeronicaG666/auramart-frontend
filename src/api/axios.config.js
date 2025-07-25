// client/api/axios.config.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://auramart-backend.onrender.com/api", 
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["auth-token"] = token.replace(/"/g, "");
  }
  return config;
});

export default API;
