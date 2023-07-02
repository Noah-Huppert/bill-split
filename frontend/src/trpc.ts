import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "../../api/src/index";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8000",
    }),
  ],
});
