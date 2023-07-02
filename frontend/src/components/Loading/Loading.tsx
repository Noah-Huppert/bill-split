import "react";

import "./Loading.scss";
import { CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <div className="loading-container">
      <CircularProgress />
    </div>
  )
}