import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve('./postcss.config.mjs'),
  },
  // Ensure Vite copies the `public` folder including _redirects
  publicDir: 'public',
  // Optional if your site is hosted at root
  base: '/',
})
