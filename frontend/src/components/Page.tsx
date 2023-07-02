import { ReactNode } from "react";
import { MenuBar } from "./MenuBar/MenuBar";
import Container from "@mui/material/Container";

export function Page({
  children,
}: {
  readonly children: ReactNode,
}) {
  return (
    <>
      <MenuBar />
      <Container>
        {children}
      </Container>
    </>
  );
}