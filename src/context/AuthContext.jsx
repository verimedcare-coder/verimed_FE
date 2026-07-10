import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearAuthStorage,
} from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback((newToken, userData) => {
    setToken(newToken);
    setStoredUser(userData);
    setTokenState(newToken);
    setUserState(userData);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setTokenState(null);
    setUserState(null);
  }, []);

  useEffect(() => {
    // Keep state in sync if storage changes
    const storedToken = getToken();
    if (storedToken !== token) {
      setTokenState(storedToken);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
