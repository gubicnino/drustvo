import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// V razvoju /api in /uploads preusmerimo na lokalni PHP API (php -S localhost:8000 serve.php).
// V produkciji sta na isti domeni kot SPA, zato relativne poti delujejo same od sebe.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8000", changeOrigin: true },
      "/uploads": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});
