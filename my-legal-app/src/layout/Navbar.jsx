// src/layout/Navbar.jsx

import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../theme";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Check if the current route is either "/signup" or "/login"
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/";

  const handleLogout = () => {
    try {
      // Clear local and session storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear all cookies (including path and domain variations)
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        // Clear cookie for current path
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

        // Clear cookie for root path explicitly
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;

        // Optional: clear cookie for other common paths if you know them
        // document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/somePath`;
      });

      // Replace history entry so back button won’t navigate back
      const loginRoute = "/login";
      window.history.replaceState(null, "", loginRoute);

      // Navigate to login and reload app to clear all state
      navigate(loginRoute, { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Client-side logout error:", error);
    }
  };

  // Function to get the current time in "08:05:25 PM" format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    // Set initial time
    setCurrentTime(getCurrentTime());

    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ padding: "10px" }}>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <img
            alt="profile-user"
            width="40px"
            height="40px"
            src={`/logo.png`}
            style={{ cursor: "pointer" }}
          ></img>
          <Typography
            p="0 0 0 10px"
            variant="h4"
            fontFamily="Times New Roman"
            fontWeight="bold"
            color="#ffbf00"
            style={{ textDecoration: "none" }}
          >
            ARPA LAW OFFICE
          </Typography>
        </Box>
        {location.pathname === "/attendance" && !isMobile && (
          <Box display="flex" alignItems="center" mr={2}>
            <Typography variant="h6" sx={{ fontSize: "40px" }}>
              {currentTime}
            </Typography>
          </Box>
        )}
        <Box display="flex">
          <IconButton
            onClick={colorMode.toggleColorMode}
            style={{ color: colors.greenAccent[500] }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Box>
        {!isAuthPage && (
          <Box display="flex" gap={2}>
            <Button onClick={handleLogout} color="inherit">
              <Typography variant="h5" style={{ marginLeft: "10px" }}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </Typography>
            </Button>
          </Box>
        )}

        {isAuthPage && (
          <>
            <Box sx={{ display: { xs: "none", md: "flex" } }} gap={2}>
              <Button component={Link} to="/" color="inherit">
                <Typography variant="h5">Home</Typography>
              </Button>
              <Button component={Link} to="/login" color="inherit">
                <Typography variant="h5">Login</Typography>
              </Button>
              <Button component={Link} to="/signup" color="inherit">
                <Typography variant="h5">Signup</Typography>
              </Button>
            </Box>
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <List>
                <ListItem
                  button
                  component={Link}
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  to="/signup"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Signup" />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
