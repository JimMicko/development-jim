// src/layout/MainLayout.jsx

import RoleProtectedRoute from "../routes/RoleProtectedRoute";
import UserRoutes from "../routes/UserRoutes";

const MainLayout = ({ user, onUpdateUser }) => {
  switch (user.role) {
    case "admin":
      return (
        <RoleProtectedRoute user={user} allowedRoles={["admin"]}>
          <UserRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
    default:
      return (
        <RoleProtectedRoute user={user} allowedRoles={[1]}>
          <UserRoutes user={user} onUpdateUser={onUpdateUser} />
        </RoleProtectedRoute>
      );
  }
};

export default MainLayout;
