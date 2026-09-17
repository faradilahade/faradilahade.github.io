import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE diisi otomatis oleh GitHub Actions:
// "/" untuk site username.github.io, "/nama-repo/" untuk project page
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
