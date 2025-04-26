import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [
				tailwindcss,
				autoprefixer,
			],
		},
	},
	server: {
		allowedHosts: ['whosee.me'],
		proxy: {
			'/api': {
				target: `http://localhost:${process.env.VITE_API_PORT || 3900}`,
				changeOrigin: true,
				secure: false
			},
			'/static': {
				target: `http://localhost:${process.env.VITE_API_PORT || 3900}`,
				changeOrigin: true,
				secure: false
			}
		}
	},
});
