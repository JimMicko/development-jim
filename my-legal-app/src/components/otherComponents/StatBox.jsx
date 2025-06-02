// src/components/otherComponents/StatBox.jsx

import { Box, Typography, useTheme } from "@mui/material";
import ProgressCircle from "./ProgressCircle";
import { tokens } from "../../theme";

const StatBox = ({
  title,
  subtitle,
  icon,
  progress,
  progress2,
  progress3,
  progressColor,
  progressColor2,
  progressColor3,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 20px">
      <Box display="flex" gap="10px">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle
            progress={progress}
            progress2={progress2}
            progress3={progress3}
            progressColor={progressColor}
            progressColor2={progressColor2}
            progressColor3={progressColor3}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography
            variant="h4"
            sx={{ color: colors.goldAccent[200], fontWeight: "bold" }}
          >
            {subtitle}
          </Typography>
          <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ color: colors.goldAccent[300] }}
          >
            {/* {increase} */}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
