import { useLocalStorage } from "usehooks-ts";
import { Theme, createTheme } from "@mui/material";

import "@fontsource/noto-sans/300.css";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/700.css";

import "./index.scss";

/**
 * Indicates if the color pallet is in dark or light mode.
 */
export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

const typography = {
  fontFamily: "Noto Sans",
};

// https://coolors.co/d972ff-090c9b-ff6663-e0ff4f-fefffe

const lightTheme = createTheme({
  typography,
  palette: {
    primary: {
      main: "#0b3954",
    },
    secondary: {
      main: "#7768AE",
    },
    background: {
      default: "#fefffe",
    },
    text: {
      primary: "#000000",
    },
  },
});

const darkTheme = createTheme({
  typography,
  palette: {
    mode: "dark",
    primary: {
      main: "#0b3954",
    },
    secondary: {
      main: "#7768AE",
    },
    background: {
      default: "#1a2027",
    },
    text: {
      primary: "#fefffe",
    },
  },
});

/**
 * Reads local storage to see if the user has selected either dark or light more, defaults to light mode.
 * @returns The color palette the user has selected
 */
export function useTheme(): [Theme, ThemeMode, (mode: ThemeMode) => void] {
  // Dark or light mode
  const [themeMode, setThemeModeStorage] = useLocalStorage(
    "theme_mode",
    ThemeMode.Light
  );

  const theme = themeMode === ThemeMode.Light ? lightTheme : darkTheme;
  const setThemeMode = (mode: ThemeMode) => setThemeModeStorage(mode);

  return [
    theme,
    themeMode === ThemeMode.Light ? ThemeMode.Light : ThemeMode.Dark,
    setThemeMode,
  ];
}

/**
 * Z-Indexes used in styling.
 */
export const Z_INDEXES = {
  /**
   * Standard website content.
   */
  normal: 1,

  /**
   * Alerts, should appear above all things.
   */
  alerts: 1000,
};
