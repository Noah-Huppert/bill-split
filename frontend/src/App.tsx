import "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import "./styles";

import type { AppRouter } from "../../api/src/index";
import { ListBills } from "./pages/ListBills";
import ErrorBoundary from "./components/ErrorBoundary";
import { CreateBill } from "./pages/CreateBill";
import { ROUTES } from "./routes";
import { Page } from "./components/Page";

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

export function App() {
  return (
    <ErrorBoundary>
      
        <RouterProvider router={router}></RouterProvider>
    </ErrorBoundary>
  );
}