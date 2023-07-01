import { createHTTPServer } from "@trpc/server/adapters/standalone";

import { router } from "./trpc";
import { configFromEnv } from "./config";

const cfg = configFromEnv();
const appRouter = router({});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});
console.log(`Running API on :${cfg.port}`);
server.listen(cfg.port);
