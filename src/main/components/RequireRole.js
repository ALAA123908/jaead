import React from "react";
import { Navigate } from "react-router-dom";

function RequireRole({ role, children }) {
  const userRole = localStorage.getItem("role");
  if (userRole === role) {
    return children;
  }
  return <Navigate to="/login" replace />;
}

export default RequireRole;
