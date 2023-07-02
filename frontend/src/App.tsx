import "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import "./styles";

import type { AppRouter } from "../../api/src/index";
import { ListBills } from "./pages/ListBills/ListBills";
import ErrorBoundary from "./components/ErrorBoundary";
import { CreateBill } from "./pages/CreateBill/CreateBill";
import { ROUTES } from "./routes";
import { Page } from "./components/Page";
import { createTheme, ThemeProvider } from "@mui/material";

const router = createHashRouter([
  {
    path: ROUTES.bills.apexList,
    element: <Page><ListBills /></Page>
  },
  {
    path: ROUTES.bills.list,
    element: <Page><ListBills /></Page>
  },
  {
    path: ROUTES.bills.create,
    element: <Page><CreateBill /></Page>
  },
]);

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8000",
    }),
  ],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#0b3954",
    },
    secondary: {
      main: "#7768AE",
    }
  },
})

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
          <RouterProvider router={router}></RouterProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}