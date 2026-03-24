// vite.config.js — VERSION PRO STABLE & MOBILE SAFE

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true, // ✅ permet accès via téléphone (IP locale)
    port: 5173,
    strictPort: true,
    open: false, // ❌ éviter bug mobile + navigateur auto

    cors: true,

    hmr: {
      protocol: "ws",
      host: "0.0.0.0", // ✅ FIX websocket mobile
      port: 5173,
      clientPort: 5173,
      overlay: true,
    },

    watch: {
      usePolling: true, // ✅ FIX Android / Termux
    },
  },

  preview: {
    host: true,
    port: 5173,
    strictPort: true,
  },

  build: {
    sourcemap: mode !== "production",

    chunkSizeWarningLimit: 1200,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }

          // 🔥 découpage intelligent
          if (id.includes("screens/Home")) return "home";
          if (id.includes("screens/RegisterProfile")) return "register";
          if (id.includes("screens/author")) return "author";
          if (id.includes("screens/admin")) return "admin";
          if (id.includes("components")) return "components";
        },
      },
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],

    esbuildOptions: {
      logLevel: "silent", // 🔇 éviter spam console
    },
  },

  logLevel: "info",
}));