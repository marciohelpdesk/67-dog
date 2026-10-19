import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {seoPlugin} from './seo-plugin.ts';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio preview
      hmr: false,
      watch: null,
    },
  };
});
