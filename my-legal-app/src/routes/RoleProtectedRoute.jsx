// src/routes/RoleProtectedRoute.jsx

import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user || !allowedRoles.includes(user.userType)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleProtectedRoute;
