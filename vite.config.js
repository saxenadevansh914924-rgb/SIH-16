import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS === "true" ? "/SIH-16/" : "/",
  server: { host: "127.0.0.1", proxy: { "/api": "http://127.0.0.1:3001" } },
});
