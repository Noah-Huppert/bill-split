import { createHTTPServer } from "@trpc/server/adapters/standalone";
import mongoose from "mongoose";

import { router } from "./trpc";
import { configFromEnv } from "./config";
import { endpoints } from "./endpoints.ts";

const appRouter = router(endpoints);

export type AppRouter = typeof appRouter;

async function main() {
    // Load configuration
    const cfg = configFromEnv();

    // Connect to MongoDB
    console.log("Connecting to MongoDB");
    await mongoose.connect(cfg.mongoURI);
    console.log("Connected to MongoDB");

    // Setup TRPC
    const server = createHTTPServer({
        router: appRouter,
    });

    console.log(`Running API on :${cfg.port}`);
    await new Promise(() => server.listen(cfg.port));
}

main().catch((e) => {
    console.error(`Failed to run entrypoint: ${e}`);
}).then(() => {
    console.log("Done");
})