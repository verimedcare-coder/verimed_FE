import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAdminUser } from "../constants/constants";

const RoleRoute = ({ requireAdmin = false }) => {
  const { user } = useAuth();

  if (requireAdmin && !isAdminUser(user)) {
    return <Navigate to="/overview" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
