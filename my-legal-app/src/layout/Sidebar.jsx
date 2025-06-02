// src/layout/Sidebar.jsx

import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import AdminSidebar from "../sidebars/AdminSidebar";

const Sidebar = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let sidebar;

  switch (user.userType) {
    case "GEN":
      sidebar = <AdminSidebar user={user} />;
      break;
    default:
      sidebar = <AdminSidebar user={user} />;
  }

  return (
    <div>
      {isMobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: "64px",
          }}
        >
          {/* Bottom navigation bar */}
          {sidebar}

          {/* Main content area */}
          <div
            style={{
              width: "100%",
              height: "calc(100vh - 126px)", // Adjust for margin-top
              overflowY: "scroll",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            {/* Outlet component to render nested routes */}
            <div style={{ overflow: "none" }}>
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", width: "100%", marginTop: "64px" }}>
          <div style={{ width: "270px" }}>{sidebar}</div>
          <div
            style={{
              width: "calc(100% - 270px)",
              height: "calc(100vh - 64px)",
              overflowY: "scroll",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            <Outlet style={{ overflow: "none" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
