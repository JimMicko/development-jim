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

const App = () => {
  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();

  // Function to update user information after successful login
  const handleLogin = useCallback(
    (userData) => {
      if (!userData) return;

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
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("loginToken");

      if (!token) {
        setUser(null); // mark user as not logged in
        setLoading(false); // indicate auth check is done
        navigate("/login"); // redirect to login
        return;
      }

      try {
        // Call validate endpoint with Authorization header automatically via axios interceptor
        await api.get(`/auth/validate`);

        navigate("/dashboard");
        handleLogin(JSON.parse(user)); // Update app user state with user info from backend
      } catch (err) {
        localStorage.clear(); // clear tokens if invalid
        handleLogin(false, null);
      }
    };

    validateToken();
  }, []);

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
