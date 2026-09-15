import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        allowedHosts: ['.ngrok-free.dev', '.ngrok.io'],
        client: {
            webSocketURL: 'https://cedar-flaky-getaway.ngrok-free.dev',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
