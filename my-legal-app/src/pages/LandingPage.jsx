// src/pages/LandingPage.jsx

import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div className="login-page">
      <div className="landing-page-container">
        <div className="landing-page-content">
          <img
            src={`/logo.png`}
            alt=""
            style={{ width: "100px", height: "auto" }}
          />
          {isMobile && (
            <h1 style={{ fontSize: "20px" }}>
              ARPA LAW OFFICE <br />
              <i>LEGAL MANAGEMENT SYSTEM</i>
            </h1>
          )}
          {!isMobile && (
            <h1 style={{ fontSize: "36px" }}>
              ARPA LAW OFFICE <br />
              <i>LEGAL MANAGEMENT SYSTEM</i>
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
