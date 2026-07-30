// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages build: GHPAGES=true injects site/base for project-page hosting
// at https://jjsutil.github.io/pin-landing/ (see docs/DEPLOY.md).
const GHPAGES = process.env.GHPAGES === 'true';

// https://astro.build/config
export default defineConfig({
  ...(GHPAGES ? { site: 'https://jjsutil.github.io', base: '/pin-landing' } : {}),
  // host: true → dev/preview listen on all interfaces (ngrok demo, docs/DEPLOY.md)
  server: { host: true },
  vite: {
    // astro preview behind ngrok: any external Host header is accepted
    preview: { allowedHosts: true },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
