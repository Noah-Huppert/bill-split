import "react";
import SavingsIcon from "@mui/icons-material/Savings";
import { Link } from "react-router-dom";

import { ROUTES } from "../../routes";
import "./MenuBar.scss";
import { Box, Typography } from "@mui/material";
import { DarkModeToggle } from "../DarkModeToggle/DarkModeToggle";

export function MenuBar() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
      }}
      className="padding-1 margin-bottom-1 menu-bar"
    >
      <Link to={ROUTES.apex} className="menu-bar-start">
        <Box
          sx={{
            color: "common.white",
          }}
        >
          <SavingsIcon fontSize="large" className="icon" />
        </Box>

        <Typography variant="h5" color="common.white">
          Bill Split
        </Typography>
      </Link>

      <div className="menu-bar-end">
        <DarkModeToggle />
      </div>
    </Box>
  );
}
