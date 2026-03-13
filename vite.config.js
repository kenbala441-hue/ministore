import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  logLevel: 'info',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // tout ce qui est dans node_modules → chunk séparé
          }
          // On peut ajouter des chunks spécifiques pour les écrans lourds
          if (id.includes('screens/Home')) return 'home';
          if (id.includes('screens/RegisterProfile')) return 'register';
          if (id.includes('screens/author')) return 'author';
          if (id.includes('screens/admin')) return 'admin';
        },
      },
    },
    chunkSizeWarningLimit: 1000, // warning seulement > 1MB
  },
  optimizeDeps: {
    esbuildOptions: {
      logLevel: 'debug',
    },
  },
})