import "react";
import SavingsIcon from "@mui/icons-material/Savings";
import { Link } from "react-router-dom";

import { ROUTES } from "../../routes";
import { Box, Typography } from "@mui/material";
import { DarkModeToggle } from "../DarkModeToggle/DarkModeToggle";

export function MenuBar() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",

        padding: "1rem",
        marginBottom: "1rem",

        bgcolor: "primary.main",
        textDecoration: "none",
      }}
    >
      <Link to={ROUTES.apex} className="menu-bar-start" style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}>
        <SavingsIcon
          fontSize="large"
          className="icon"
          sx={{
            display: "flex",
            marginRight: "1rem",
            color: "common.white",
          }}
        />

        <Typography
          variant="h5"
          color="common.white"
          sx={{
            display: "flex",
          }}
        >
          Bill Split
        </Typography>
      </Link>

      <div className="menu-bar-end">
        <DarkModeToggle />
      </div>
    </Box>
  );
}
