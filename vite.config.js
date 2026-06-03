import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // silence deprecation warnings from sass
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
})
