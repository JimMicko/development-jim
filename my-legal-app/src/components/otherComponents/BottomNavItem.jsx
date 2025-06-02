// src/components/otherComponents/BottomNavItem.jsx

import React from "react";
import { BottomNavigationAction, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";

const BottomNavItem = ({ label, value, icon, selected, setSelected, to }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <BottomNavigationAction
      label={label}
      value={value}
      icon={React.cloneElement(icon, {
        sx: {
          color: selected ? colors.greenAccent[400] : "inherit",
          transform: selected ? "scale(1.5)" : "scale(1)",
          transition: "transform 0.2s",
        },
      })}
      onClick={() => {
        setSelected(value);
        navigate(to);
      }}
      sx={{
        "& .MuiBottomNavigationAction-label": {
          color: selected ? colors.greenAccent[400] : "inherit",
          opacity: 1,
        },
        padding: 0,
      }}
    />
  );
};

export default BottomNavItem;
