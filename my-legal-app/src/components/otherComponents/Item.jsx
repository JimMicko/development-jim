import { MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Item = ({ title, to, icon, selected, setSelected, collapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelected(title);
    navigate(to);
  };

  return (
    <MenuItem
      active={selected === title}
      onClick={handleClick}
      icon={icon}
      style={{
        color: selected === title ? colors.grey[100] : colors.goldAccent[100],
        backgroundColor:
          selected === title ? colors.goldAccent[500] : "transparent",
        display: "flex",
        alignItems: "center",
      }}
      rootStyles={{
        "&:hover": {
          color: colors.goldAccent[300],
          backgroundColor:
            selected === title ? colors.goldAccent[500] : "transparent",
        },
      }}
    >
      {!collapsed && (
        <Typography
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {title}
        </Typography>
      )}
    </MenuItem>
  );
};

export default Item;
