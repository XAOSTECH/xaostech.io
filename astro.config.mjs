import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  adapter: cloudflare(),
  site: 'https://xaostech.io',
  // CSP is emitted from src/middleware.ts (static output: middleware runs at
  // the CF edge for SSR pages; pure-static HTML uses CF Pages headers).
});
