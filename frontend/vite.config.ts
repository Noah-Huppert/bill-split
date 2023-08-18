import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      /**
       * Required for Windows + Docker development.
       */
      usePolling: true
    }
  },
});
