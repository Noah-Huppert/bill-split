import "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import "./styles";

import type { AppRouter } from "../../api/src/index";
import { Home } from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";

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
      url: "http://api:8000",
    }),
  ],
});

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router}></RouterProvider>
    </ErrorBoundary>
  );
}

export default App;
