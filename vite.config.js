import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    // Support both VITE_* and existing REACT_APP_* environment variable prefixes
    envPrefix: ["VITE_", "REACT_APP_"],
    define: {
      "process.env": {
        REACT_APP_API_BASE_URL: JSON.stringify(
          env.REACT_APP_API_BASE_URL ||
            process.env.REACT_APP_API_BASE_URL ||
            "",
        ),
        REACT_APP_BASE_URL: JSON.stringify(
          env.REACT_APP_BASE_URL || process.env.REACT_APP_BASE_URL || "",
        ),
        NODE_ENV: JSON.stringify(env.NODE_ENV || process.env.NODE_ENV || mode),
      },
    },
    // Configure ESBuild to allow JSX parsing inside standard .js files during development/builds
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react-router-dom",
        "antd",
        "@ant-design/icons",
        "@tanstack/react-query",
        "@ant-design/plots",
        "axios",
        "dayjs",
      ],
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: "dist",
    },
  };
});
