import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_URL?.replace(/\/$/, '');
  const proxy: Record<string, ProxyOptions> = {};

  if (apiTarget) {
    proxy['/api'] = {
      target: apiTarget,
      changeOrigin: true,
    };
  }

  return {
    plugins: [react()],
    server: {
      proxy,
    },
  };
});
