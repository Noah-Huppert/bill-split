import { useLocalStorage } from "usehooks-ts";
import { Theme, createTheme } from "@mui/material";

import "@fontsource/noto-sans/300.css";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/700.css";

import "./index.scss";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}
const lightTheme = createTheme({
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

export function useTheme(): [Theme, ThemeMode, (mode: ThemeMode) => void] {
  // Dark or light mode
  const [themeMode, setThemeModeStorage] = useLocalStorage(
    "theme_mode",
    ThemeMode.Light
  );

  const theme = themeMode === ThemeMode.Light ? lightTheme : darkTheme;
  const setThemeMode = (mode: ThemeMode) => setThemeModeStorage(mode);

  return [theme, themeMode === ThemeMode.Light ? ThemeMode.Light : ThemeMode.Dark, setThemeMode];
}
