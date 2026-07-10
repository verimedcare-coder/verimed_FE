import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getToken } from "../utils/storage";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const token = getToken();

  if (!isAuthenticated && !token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
