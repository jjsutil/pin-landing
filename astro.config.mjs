// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages build: GHPAGES=true injects site/base for project-page hosting
// at https://jjsutil.github.io/pin-landing/ (see docs/DEPLOY.md).
//
// ⚠️ DO NOT MERGE this integration to `main` until the production domain and
// launch are decided — see the PR this shipped in. Whatever `site` resolves to
// at merge time is what search engines index as canonical; that must not be
// the GitHub Pages demo URL.
const GHPAGES = process.env.GHPAGES === 'true';

// Draft posts still build (so a direct link works pre-publish — see
// src/pages/blog/[slug].astro) but must never reach the sitemap. Frontmatter
// is plain YAML; a line-level check is enough here and avoids a new dependency.
/** @param {string} dir */
function draftSlugs(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.md'))
    .filter((f) => /^draft:\s*true\s*$/m.test(readFileSync(`${dir}/${f.name}`, 'utf8')))
    .map((f) => f.name.replace(/\.md$/, ''));
}
const excludedSlugs = [
  ...draftSlugs('./src/content/blog/es').map((s) => `/blog/${s}/`),
  ...draftSlugs('./src/content/blog/en').map((s) => `/en/blog/${s}/`),
];

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
  // Sitemap needs `site` to emit absolute URLs, so it's only wired up for the
  // GHPAGES build — a plain `npm run build`/`npm run dev` (no `site` set)
  // stays exactly as before.
  integrations: GHPAGES
    ? [sitemap({ filter: (page) => !excludedSlugs.some((slug) => page.endsWith(slug)) })]
    : [],
});
