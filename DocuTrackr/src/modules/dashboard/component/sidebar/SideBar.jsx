import { useState } from 'react';
import './sidebar.css';

function SideBar({ onButtonClick, userData }) {
  const [formsOpen, setFormsOpen] = useState(false);

  const toggleForms = () => {
    setFormsOpen(!formsOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="d-flex align-items-center ">
          <div className="rounded-circle shadow bg-secondary" style={{ width: '55px', height: '50px' }}></div>
          <div className="shadow rounded px-3 py-1">
            <p className="mb-0 text-white fw-medium">
              {userData.firstName} {userData.lastName}
            </p>
          </div>
        </div>
        <div className="sidebar-submenu">
          <a href="#" onClick={() => onButtonClick("deliverables")}>Deliverables</a>
          <a href="#" onClick={() => onButtonClick("cases")}>Cases</a>
          {/* <a href="#" onClick={() => onButtonClick("stages")}>Stages Form</a> */}
          <a href="#" onClick={() => onButtonClick("clients")}>Clients</a>
          <a href="#" onClick={() => onButtonClick("lsa")}>Legal Service Agreement</a>
        </div>
      </div>
      {/* <a href="#">Profile</a>
      <a href="#">Logout</a> */}
    </div>
  );
}

export default SideBar;
