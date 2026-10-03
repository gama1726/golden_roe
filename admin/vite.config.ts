import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:8000'
const hmrClientPort = process.env.VITE_HMR_CLIENT_PORT
const hmrHost = process.env.VITE_HMR_HOST
const hmrProtocol = process.env.VITE_HMR_PROTOCOL

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/admin/',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 5173,
    // Behind nginx on port 80/443 the browser has no explicit port, and Vite
    // otherwise falls back to ws://localhost:5173, which the visitor cannot open.
    hmr: hmrClientPort
      ? {
          protocol: hmrProtocol === 'wss' ? 'wss' : 'ws',
          ...(hmrHost ? { host: hmrHost } : {}),
          clientPort: Number(hmrClientPort),
        }
      : undefined,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: false },
      '/sanctum': { target: apiTarget, changeOrigin: false },
      '/storage': { target: apiTarget, changeOrigin: false },
    },
  },
})
