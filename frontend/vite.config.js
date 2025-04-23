import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: true, // Escucha en todas las interfaces (incluyendo red local)
    port: 5173, // Puedes dejarlo si quieres mantener el puerto por defecto
  }
})