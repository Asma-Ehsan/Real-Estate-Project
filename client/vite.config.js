import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  // Configure Vite development server to use a proxy for API requests
  server: {
    // Proxy forwards frontend API requests to backend server to avoid CORS issues during development
    proxy:{ 

      // Redirect all requests starting with /api to the backend server running on localhost:3000
      "/api" : {
        target: "http://localhost:3000",
        changeOrigin: true,
        //false means it won’t check SSL certificates. 
        secure: false,
      }
    }
  },
  plugins: [react(),tailwindcss()],
})
