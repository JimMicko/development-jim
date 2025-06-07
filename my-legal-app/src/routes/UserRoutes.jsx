// src/routes/UserRoutes.jsx

import { Route, Routes } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Dashboard from "../components/Dashboard";
import Calendar from "../components/Calendar";

const UserRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<Sidebar user={user} />}>
      <Route path="" element={<Dashboard user={user} />} />
      <Route path="calendar" element={<Calendar />} />
    </Route>
  </Routes>
);

export default UserRoutes;
