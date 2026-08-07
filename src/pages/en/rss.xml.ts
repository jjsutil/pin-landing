import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { T } from '../../i18n';

// English counterpart of /rss.xml.ts — see that file for the `site` guard rationale.
export const GET: APIRoute = async (context) => {
  if (!context.site) return new Response('RSS requires `site` to be configured.', { status: 404 });
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const posts = (await getCollection('blogEn', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
  return rss({
    title: T.en['title'],
    description: T.en['meta.desc'],
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.publishDate,
      link: `${base}/en/blog/${post.id}/`,
    })),
  });
};
