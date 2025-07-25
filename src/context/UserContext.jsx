import { createContext, useContext, useEffect, useState } from "react";
import WithAxios from "helpers/WithAxios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token && !user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token, user]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(true);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        logout,
      }}
    >
      <WithAxios>{children}</WithAxios>
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
