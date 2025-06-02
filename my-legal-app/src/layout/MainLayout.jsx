// src/layout/MainLayout.jsx

import RoleProtectedRoute from "../routes/RoleProtectedRoute";
import UserRoutes from "../routes/UserRoutes";

const MainLayout = ({ user, onUpdateUser }) => {
  switch (user.userType) {
    case "ADMIN":
      return (
        <RoleProtectedRoute user={user} allowedRoles={["ADMIN"]}>
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
