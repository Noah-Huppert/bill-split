import "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import "./styles";

import type { AppRouter } from "../../api/src/index";
import { Home } from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import Container from "@mui/material/Container";
import { MenuBar } from "./components/MenuBar";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    children: [],
  },
]);

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8000",
    }),
  ],
});

export function App() {
  return (
    <ErrorBoundary>
      <MenuBar />
      <Container>
        <RouterProvider router={router}></RouterProvider>
      </Container>
    </ErrorBoundary>
  );
}