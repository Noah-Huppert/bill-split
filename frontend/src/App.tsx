import "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import "./styles";

import { ListBills } from "./pages/ListBills/ListBills";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { CreateBill } from "./pages/CreateBill/CreateBill";
import { ROUTES } from "./routes";
import { Page } from "./components/Page/Page";
import { ViewBill } from "./pages/ViewBill/ViewBill";
import { useTheme } from "./styles";

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
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <RouterProvider router={router}></RouterProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
