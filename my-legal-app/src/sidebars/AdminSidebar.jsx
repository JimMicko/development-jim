// src/sidebars/AdminSidebar.jsx

import { useEffect, useState, useMemo } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

import {
  Box,
  IconButton,
  Typography,
  useTheme,
  BottomNavigation,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import GavelIcon from "@mui/icons-material/Gavel";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../theme";
import BottomNavItem from "../components/otherComponents/BottomNavItem";
import Item from "../components/otherComponents/Item";

const AdminSidebar = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathToTitleMap = useMemo(
    () => ({
      "/dashboard/": "Dashboard",
      "/dashboard/deliverables": "Case Deliverables",
      "/dashboard/case-management": "Case Management",
      "/dashboard/client-management": "Client Management",
      "/dashboard/legal-service-agreements": "Legal Service Agreements",
      "/dashboard/settings": "Settings",
      "/dashboard/calendar": "Calendar",
    }),
    []
  );

  const initialSelected = pathToTitleMap[location.pathname] || "Dashboard";
  const [selected, setSelected] = useState(initialSelected);
  const [profilePictureSrc, setProfilePictureSrc] = useState(null);

  useEffect(() => {
    const currentTitle = pathToTitleMap[location.pathname] || "Dashboard";
    setSelected(currentTitle);
  }, [location, pathToTitleMap]);

  useEffect(() => {
    const convertUint8ArrayToBlob = () => {
      // If no picture data, use fallback image
      if (
        !user ||
        !user.employeePicture ||
        !user.employeePicture.profile_picture ||
        !user.employeePicture.profile_picture.data
      ) {
        setProfilePictureSrc("/unknown.png"); // ✅ fallback image in public/
        return;
      }

      const uint8Array = new Uint8Array(
        user.employeePicture.profile_picture.data
      );
      const blob = new Blob([uint8Array], { type: "image/jpeg" });

      const reader = new FileReader();
      reader.onload = () => {
        setProfilePictureSrc(reader.result);
      };
      reader.readAsDataURL(blob);
    };

    convertUint8ArrayToBlob();
  }, [user]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto", // Enable horizontal scrolling
        whiteSpace: "nowrap", // Prevent items from wrapping to the next line
        position: "fixed",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE 10+
        bottom: 0,
        zIndex: 1300,
        backgroundColor: colors.goldAccent[400], // Full background in gold
      }}
    >
      <BottomNavigation
        value={selected}
        onChange={(event, newValue) => {
          setSelected(newValue);
        }}
        sx={{
          display: "inline-flex", // Align items in a single row
          flexDirection: "row",
          "& .Mui-selected": {
            color: colors.greenAccent[400], // Apply custom color to selected action
          },
        }}
      >
        <BottomNavItem
          label="Dashboard"
          value="Dashboard"
          icon={DashboardIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={""}
        />
        <BottomNavItem
          label="Deliverables"
          value="Deliverables"
          icon={AssignmentTurnedInIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"deliverables"}
        />
        <BottomNavItem
          label="Case"
          value="Case"
          icon={GavelIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"case-management"}
        />
        <BottomNavItem
          label="Clients"
          value="Clients"
          icon={PeopleIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"client-management"}
        />
        <BottomNavItem
          label="LSA"
          value="LSA"
          icon={DescriptionIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"legal-service-agreements"}
        />
        <BottomNavItem
          label="Settings"
          value="Settings"
          icon={SettingsIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"settings"}
        />
        <BottomNavItem
          label="Calendar"
          value="Calendar"
          icon={CalendarTodayOutlinedIcon}
          selected={selected}
          setSelected={setSelected}
          navigate={"calendar"}
        />
      </BottomNavigation>
    </Box>
  ) : (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square" style={{ height: "calc(100vh - 64px)" }}>
          <MenuItem
            onClick={handleCollapse}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "0 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h4" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={handleCollapse}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && user && profilePictureSrc && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={profilePictureSrc}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user.designation}
                </Typography>
              </Box>
            </Box>
          )}

          {isCollapsed && user && profilePictureSrc && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="50px"
                  height="50px"
                  src={profilePictureSrc}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* // Dashboard */}
            <Item
              title="Dashboard"
              to=""
              icon={<DashboardIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            {/* // Deliverables */}
            <Item
              title="Case Deliverables"
              to="deliverables"
              icon={<AssignmentTurnedInIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            {/* // Case Management */}
            <Item
              title="Case Management"
              to="case-management"
              icon={<GavelIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            {/* // Client Management */}
            <Item
              title="Client Management"
              to="client-management"
              icon={<PeopleIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            {/* // Legal Agreements */}
            <Item
              title="Legal Service Agreements"
              to="legal-service-agreements"
              icon={<DescriptionIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
            {/* // Settings */}
            <Item
              title="Settings"
              to="settings"
              icon={<SettingsIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />

            <Item
              title="Calendar"
              to="calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={isCollapsed}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;
