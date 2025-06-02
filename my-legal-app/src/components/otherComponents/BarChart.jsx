import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { mockBarData as data } from "./mockData";
import { tokens } from "../../theme";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            background: colors.grey[900], // Dark background in dark mode
            color: colors.grey[100], // Light text for readability
            fontSize: 12,
          },
        },
      }}
      keys={["Civil Cases", "Criminal Cases", "Consultations"]}
      indexBy="month"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }} // Use Nivo's default color scheme
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "month",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "number of cases",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={({ color }) => {
        // If bar color is light, use dark text; else white
        // Simple heuristic: check luminance
        const luminance =
          0.2126 * parseInt(color.slice(1, 3), 16) +
          0.7152 * parseInt(color.slice(3, 5), 16) +
          0.0722 * parseInt(color.slice(5, 7), 16);

        return luminance > 140 ? "#000000" : "#ffffff";
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 120,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Nivo bar chart showing law firm cases and consultations"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in month: " + e.indexValue
      }
    />
  );
};

export default BarChart;
