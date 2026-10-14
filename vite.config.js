import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      // In development, forward /api calls to the shop-backend service.
      proxy: {
        '/api': env.BACKEND_URL || 'http://localhost:4000',
      },
    },
  };
});
