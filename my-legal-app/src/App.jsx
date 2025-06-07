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

import axios from "axios";

const ipAddress = import.meta.env.VITE_IP_ADDRESS;
const contextRoot = import.meta.env.VITE_CONTEXT_ROOT;

const App = () => {
  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to update user information after successful login
  const handleLogin = useCallback(
    (userData) => {
      if (!userData) return;

      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.loginToken) {
        localStorage.setItem("loginToken", userData.loginToken);
      }

      if (userData.refreshToken) {
        localStorage.setItem("refreshToken", userData.refreshToken);
      }

      setUser(userData);
      setLoading(false);
      navigate("/dashboard");
    },
    [navigate]
  );

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const validateToken = async () => {
      const user_id = localStorage.getItem("user_id");
      console.log(user_id);
      const token = localStorage.getItem("loginToken");
      console.log(token);
      const token2 = localStorage.getItem("refreshToken");
      console.log(token2);
      if (!token) {
        handleLogin(false, null);
        return;
      }

      try {
        // Call validate endpoint with Authorization header automatically via axios interceptor
        const res = await api.get(`/auth/auth/validate/${user_id}`);
        console.log("Validate response:", res.data);
        handleLogin(res.data.user); // Update app user state with user info from backend
      } catch (err) {
        console.log("Token validation failed", err);
        localStorage.clear(); // clear tokens if invalid
        handleLogin(false, null);
      }
    };

    validateToken();
  }, []);

  useEffect(() => {
    const loginToken = localStorage.getItem("loginToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user_id = localStorage.getItem("user_id");
    console.log("Stored loginToken:", loginToken);
    console.log("Stored refreshToken:", refreshToken);
    console.log("Stored user_id:", user_id);
  }, []); // run on mount

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
