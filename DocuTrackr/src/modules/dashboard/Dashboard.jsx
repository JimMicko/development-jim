import { useState, useEffect } from "react";
import SideBar from "./component/sidebar/SideBar.jsx";
import Deliverables from "./component/deliverables/Deliverables.jsx";
import Cases from "./component/cases/Cases.jsx";
import Stages from "./component/stages/Stages.jsx";
import Clients from "./component/clients/clients.jsx";
import Lsa from "./component/LSA/Lsa.jsx"; // Import the LSA component

import "./dashboard-styles.css"; // Import the CSS file for styling

function Dashboard({ user }) {
  const [currentPage, setCurrentPage] = useState("deliverables"); // Default to "deliverables"
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (page) => {
    setCurrentPage(page);
  };

  // console.log("User:", user);

  return (
    <div id="dashboard">
      <div className="test">
        <img src="/logo.png" alt="ARPA Logo" className="logo" />
        <h1 className="dashboard-title">ARPA LAW OFFICE</h1>
        <div className="clock">{time}</div>
      </div>

      <SideBar onButtonClick={handleButtonClick} userData={user} />

      {currentPage === "deliverables" && <Deliverables userData={user} />}
      {currentPage === "cases" && <Cases />}
      {currentPage === "stages" && <Stages />}
      {currentPage === "clients" && <Clients />}
      {currentPage === "lsa" && <Lsa />}
    </div>
  );
}

export default Dashboard;
