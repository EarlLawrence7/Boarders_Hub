import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configure server proxy (if needed for backend API or Groq)
    proxy: {
      '/api': 'http://localhost:5000', // Change based on your actual server setup
    },
  },
  define: {
    // Ensures process.env works as expected in Vite
    'process.env': process.env,
  },
  build: {
    outDir: 'dist', // Customize build output directory
    sourcemap: true, // Optional: Enable source maps for debugging
  },
  envPrefix: 'VITE_', // Only expose environment variables with VITE_ prefix
})
