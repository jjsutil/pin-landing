import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog collection (I-001, planning/plans/E01-blog.md). Content-layer glob loader
// over plain Markdown — no MDX, no CMS. ES only for v1 (see epic anti-scope).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog/es' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean(),
    readingMinutes: z.number(),
  }),
});

export const collections = { blog };
