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
      // Allow CORS from specific origins (useful when testing from custom hostnames)
      // You can override via VITE_ALLOWED_ORIGINS (comma-separated)
      cors: (() => {
        const defaultAllowed = [
          'https://api-pathai.malick.wtf',
          'https://pathai.malick.wtf',
          'http://localhost:5173',
          'https://pathai.one',
        ];
        const envAllowed = (env.VITE_ALLOWED_ORIGINS || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        const allowed = Array.from(new Set([...defaultAllowed, ...envAllowed]));
        console.log('[Vite CORS] allowed origins:', allowed.join(','));
        return { origin: allowed };
      })(),
      hmr: {
        // if VITE_HOST or VITE_HMR_HOST is set to your LAN IP or hostname, HMR will use it; otherwise HMR will guess
        host: env.VITE_HMR_HOST || env.VITE_HOST || undefined,
      },
      // Allow specific hostnames to access the dev server (e.g., custom DNS / hosts entries)
      // VITE_ALLOWED_HOSTS can be set as a comma-separated list, e.g. 'path.malick.wtf,.example.com'
      allowedHosts: (() => {
        const defaultAllowed = ['path.malick.wtf', 'pathai.malick.wtf', 'pathai.one'];
        const envAllowed = (env.VITE_ALLOWED_HOSTS || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        return Array.from(new Set([...defaultAllowed, ...envAllowed]));
      })(),
      proxy: {
        '/api': {
          target: env.VITE_DEV_BACKEND_URL || 'http://localhost:3015',
          changeOrigin: true,
        },
      },
    },
  };
});
