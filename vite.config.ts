import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    root: 'frontend',
    plugins: [TanStackRouterVite(), react(), tailwindcss()],
    server: {
        proxy: {
            '/auth': {
                target: 'http://127.0.0.1:8000',
            },
            '/docs': {
                target: 'http://127.0.0.1:8000',
            },
            '/openapi.json': {
                target: 'http://127.0.0.1:8000',
            },
            '/api': {
                target: 'http://127.0.0.1:8000',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './frontend/src'),
        },
    },
});
