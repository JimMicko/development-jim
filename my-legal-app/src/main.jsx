// index.js
import { createRoot } from "react-dom/client";
import "./index.css"; // Importing the global styles
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

// Get the root element from the DOM
const container = document.getElementById("root");

// Create a root using React 18's createRoot
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <Router>
    <App />
  </Router>
  // </React.StrictMode>
);
// Note: React.StrictMode is commented out for simplicity, but you can enable it for development to help identify potential problems in your application.
