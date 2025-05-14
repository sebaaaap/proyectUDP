import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Escuchar en todas las interfaces
    port: 5173,  // Puerto explícito
    strictPort: true,
    watch: {
      usePolling: true  // Necesario para algunos entornos Docker
    }
  }

})
