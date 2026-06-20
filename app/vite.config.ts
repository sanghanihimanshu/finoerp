import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['url', 'baseLocale'],
    }),
    TanStackRouterVite({ autoCodeSplitting: true }),
    tailwindcss(),
    viteReact(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
