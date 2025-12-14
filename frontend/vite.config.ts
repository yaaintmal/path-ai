import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
//adding import for tailwindcss using vite plugin
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: '0.0.0.0', // bind to all network interfaces so dev server is reachable from LAN
      port: Number(env.VITE_PORT || 5173),
      strictPort: false,
      cors: true,
      hmr: {
        // if VITE_HOST is set to your LAN IP, HMR will use it; otherwise HMR will guess
        host: env.VITE_HOST || undefined,
      },
    },
  };
});
