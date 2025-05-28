import { useState } from 'react';
import Dashboard from "../dashboard/Dashboard.jsx";
import Login from "../login/Login.jsx";

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Handle login result: set the login status and store the user data
  const handleLoginResult = (status, data) => {
    setIsLoggedIn(status);
    setUserData(data);  // Save user data
  };
  
  return isLoggedIn ? (
    <Dashboard user={userData} />  // Pass the user data to the Dashboard
  ) : (
    <Login onLoginResult={handleLoginResult} />
  );
}

export default Main;
