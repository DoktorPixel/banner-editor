import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      // Важно для корректного предварительного бандлинга после установки форка
      "react-sortable-tree",
      "react-sortable-tree-theme-file-explorer",
    ],
  },
  build: {
    outDir: "dist",
  },
});
