// src/App.jsx

import { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import api from "../api";
import Navbar from "./layout/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./layout/MainLayout";
import LoadingSpinner from "./components/otherComponents/LoadingSpinner";

const App = () => {
  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to update user information after successful login
  const handleLogin = (userData) => {
    setUser(userData);

    navigate("/dashboard"); // Redirect to the default dashboard

    setLoading(false); // Set loading to false after user data is set and navigation is done
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // useEffect(() => {
  //   // Only fetch session data if user is not already set
  //   if (!user && location.pathname.startsWith("/dashboard")) {
  //     setLoading(true);
  //     api
  //       .get("/api/session", { withCredentials: true }) // use relative path
  //       .then((response) => {
  //         setUser(response.data.user);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching session data:", error);
  //         navigate("/");
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  // }, [location.pathname, navigate, user]);

  if (loading) {
    return <LoadingSpinner theme={theme} />;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar user={user} onUpdateUser={handleUpdateUser} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          {user ? (
            <Route
              path="/dashboard/*"
              element={
                <MainLayout user={user} onUpdateUser={handleUpdateUser} />
              }
            />
          ) : (
            <Route path="" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
