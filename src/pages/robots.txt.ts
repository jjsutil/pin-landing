import type { APIRoute } from 'astro';

// Sitemap line only makes sense once a real `site` is configured (astro.config.mjs
// only sets it for the GHPAGES build today) — see the DO-NOT-MERGE note there.
// `site` alone is just the origin (no base path) — GitHub Pages project hosting
// serves under /pin-landing/, so BASE_URL has to be folded in too, same as
// every other absolute-URL builder in this codebase (see src/scripts/main.ts).
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // strip trailing slash if present, always add exactly one below
  const sitemapUrl = site ? new URL(`${base}/sitemap-index.xml`, site) : null;
  const body = ['User-agent: *', 'Allow: /', sitemapUrl ? `Sitemap: ${sitemapUrl}` : null]
    .filter((line): line is string => line !== null)
    .join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
