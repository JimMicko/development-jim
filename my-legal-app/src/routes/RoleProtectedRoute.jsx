// src/routes/RoleProtectedRoute.jsx

import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleProtectedRoute;
