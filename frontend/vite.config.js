import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true, // Escucha en todas las interfaces (incluyendo red local)
		port: 5173, // Puedes dejarlo si quieres mantener el puerto por defecto
	}
});