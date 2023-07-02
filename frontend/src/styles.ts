import { useLocalStorage } from "usehooks-ts";
import { createTheme } from "@mui/material"

import "@fontsource/noto-sans/300.css";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/700.css";

import "./index.scss";

export function useTheme() {
  return createTheme({
    palette: {
      primary: {
        main: "#0b3954",
        
      },
      secondary: {
        main: "#7768AE",
      }
    },
  });
}