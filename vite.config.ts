import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },

  server: {
    host: true,
    port: 3000,
  },
});
