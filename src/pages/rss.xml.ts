import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { T } from '../i18n';

// Needs `site` for absolute item links — only meaningful for the GHPAGES build,
// same as the sitemap. Without it (local/default build), skip cleanly instead
// of throwing and breaking `npm run build`.
export const GET: APIRoute = async (context) => {
  if (!context.site) return new Response('RSS requires `site` to be configured.', { status: 404 });
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // normalize: strip if present, always add exactly one below
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
  return rss({
    title: T.es['title'],
    description: T.es['meta.desc'],
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.publishDate,
      link: `${base}/blog/${post.id}/`,
    })),
  });
};
