import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set the base path for GitHub Pages deployment.
  // The repository name is 'sustainable-living-platform-' so base must match.
  base: '/sustainable-living-platform-/',
  plugins: [react()],
})
