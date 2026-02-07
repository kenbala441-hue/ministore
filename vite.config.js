import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,         // ne change pas de port si occupé
    open: true,               // ouvre automatiquement le navigateur
    hmr: {
      overlay: true,          // montre les erreurs dans le navigateur
    },
  },
  logLevel: 'info',           // 'info', 'warn', 'error' ou 'silent'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // import plus simple
    },
  },
  build: {
    sourcemap: true,          // permet de debugger avec DevTools
  },
  optimizeDeps: {
    esbuildOptions: {
      logLevel: 'debug',      // affiche plus de détails pour le debug
    },
  },
})