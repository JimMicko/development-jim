// src/components/otherComponents/Header.jsx

import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="20px">
      <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="h5" color={colors.goldAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
