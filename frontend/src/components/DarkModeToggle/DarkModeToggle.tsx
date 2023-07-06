import "react";

import BedtimeIcon from "@mui/icons-material/Bedtime";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import { Box, Switch, Tooltip } from "@mui/material";
import { ThemeMode, useTheme } from "../../styles";

export function DarkModeToggle() {
  const [_, themeMode, setThemeMode] = useTheme();

  return (
    <Tooltip
      title={`Switch theme from ${themeMode} mode to ${
        themeMode === ThemeMode.Light ? "dark" : "light"
      } mode`}
    >
      <Switch
        color="default"
        icon={<SwitchIcon checked />}
        checkedIcon={<SwitchIcon />}
        value={themeMode === ThemeMode.Dark}
        onChange={(e) =>
          e.target.checked
            ? setThemeMode(ThemeMode.Dark)
            : setThemeMode(ThemeMode.Light)
        }
      />
    </Tooltip>
  );
}

function SwitchIcon({ checked = false }: { readonly checked?: boolean }) {
  const icon = checked ? (
    <WbSunnyIcon color="primary" fontSize="small" />
  ) : (
    <BedtimeIcon color="primary" fontSize="small" />
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        // Needed to fix icons not aligning with normal switch icon
        position: "relative",
        top: "-0.2rem",
        left: "-0.3rem",

        padding: "0.2rem",

        bgcolor: "common.white",
        borderRadius: "1rem",
      }}
    >
      {icon}
    </Box>
  );
}
