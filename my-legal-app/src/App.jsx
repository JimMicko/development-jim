// src/App.jsx

import { useState, useEffect, useCallback } from "react";
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
  const handleLogin = useCallback(
    (userData) => {
      console.log("Logging in:", userData);
      localStorage.setItem("user", JSON.stringify(userData)); // persist
      setUser(userData);
      setLoading(false);
      navigate("/dashboard");
    },
    [navigate]
  );

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

  useEffect(() => {
    fetch("http://193.203.161.251:4242/auth/validate", {
      method: "GET",
      credentials: "include", // Important for cookies
    })
      .then(async (response) => {
        if (response.status === 200) {
          const user = await response.json(); // or handle the returned user data
          handleLogin(user); // Update state
          navigate("/dashboard"); // Redirect to dashboard
        } else if (response.status === 401) {
          navigate("/login"); // Not authenticated
        }
      })
      .catch((error) => {
        console.error("Persistent login error:", error);
        navigate("/login");
      });
  }, [navigate, handleLogin]);

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
