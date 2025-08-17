import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",          
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default axiosInstance;
