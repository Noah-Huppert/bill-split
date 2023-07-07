import "react";

import { Box, CircularProgress, SxProps, Theme } from "@mui/material";

export function Loading({
  sx={},
}: {
  readonly sx?: SxProps<Theme>
}) {
  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
