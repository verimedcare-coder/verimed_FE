import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Support both VITE_* and existing REACT_APP_* environment variable prefixes
  envPrefix: ["VITE_", "REACT_APP_"],
  define: {
    "process.env": {
      REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "",
      REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL || "",
      NODE_ENV: process.env.NODE_ENV || "development",
    },
  },
  // Configure ESBuild to allow JSX parsing inside standard .js files during development/builds
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
