import API from "api/axios.config";
import { useUser } from "context/UserContext";
import { useEffect } from "react";

const WithAxios = ({ children }) => {
  const { logout } = useUser();

  useEffect(() => {
    const requestInterceptor = API.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });


    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  return children;
};

export default WithAxios;
