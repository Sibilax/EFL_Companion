import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],  // This ensures the React plugin is used
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern', // Switch to modern API for Dart Sass
      },
    },
  },
});
