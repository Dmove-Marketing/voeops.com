import { defineConfig } from 'astro/config';

export default defineConfig({
  // Output estático (padrão) — gera HTML puro
  output: 'static',

  // View Transitions habilitadas
  prefetch: false,

  // Build otimizado
  build: {
    inlineStylesheets: 'always',
  },

  // Dev server
  server: {
    port: 4321,
  },
});
