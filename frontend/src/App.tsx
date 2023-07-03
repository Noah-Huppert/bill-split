import "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import "./styles";

import { ListBills } from "./pages/ListBills/ListBills";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { CreateBill } from "./pages/CreateBill/CreateBill";
import { ROUTES } from "./routes";
import { Page } from "./components/Page/Page";
import { ViewBill } from "./pages/ViewBill/ViewBill";
import { useTheme } from "./styles";
import { Toaster } from "./components/Toaster/Toaster";

const router = createHashRouter([
  {
    path: ROUTES.bills.apexList,
    element: (
      <Page>
        <ListBills />
      </Page>
    ),
  },
  {
    path: ROUTES.bills.list,
    element: (
      <Page>
        <ListBills />
      </Page>
    ),
  },
  {
    path: ROUTES.bills.create,
    element: (
      <Page>
        <CreateBill />
      </Page>
    ),
  },
  {
    path: ROUTES.bills.getById(":id"),
    element: (
      <Page>
        <ViewBill />
      </Page>
    ),
  },
]);

export function App() {
  const theme = useTheme()[0];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Toaster>
          <RouterProvider router={router}></RouterProvider>
        </Toaster>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
