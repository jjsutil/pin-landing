import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog collection (I-001, planning/plans/E01-blog.md). Content-layer glob loader
// over plain Markdown — no MDX, no CMS.
const schema = z.object({
  title: z.string(),
  excerpt: z.string(),
  publishDate: z.coerce.date(),
  author: z.string(),
  tags: z.array(z.string()),
  draft: z.boolean().default(false),
  readingMinutes: z.number(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog/es' }),
  schema,
});

// English blog (I-011) — translated counterparts of the ES posts, English
// slugs via filename. Cross-linked to their ES original via translations.ts.
const blogEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog/en' }),
  schema,
});

export const collections = { blog, blogEn };
