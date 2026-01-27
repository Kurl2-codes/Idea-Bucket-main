import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Merge process.env (system/docker) and loadEnv (files)
  const env = { ...process.env, ...loadEnv(mode, '.', '') };

  const proxyTarget = 'http://backend:8000';
  console.log(`[Vite] Force Proxying /api to ${proxyTarget}`);
  console.log(`[Vite] Mode: ${mode}`);

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: ['host.docker.internal', 'localhost', '127.0.0.1', 'ideabucket-frontend'],
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_API_URL': JSON.stringify('') // Force relative paths in browser
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
