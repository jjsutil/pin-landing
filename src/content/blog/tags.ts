// Tag → URL slug for the blog's per-topic routes (I-012). Tags are display
// strings with spaces and accents ("Herramientas de IA", "Visión de compañía"),
// so they can't be URL segments as written.
//
// ES and EN carry different tag vocabularies ("Herramientas de IA" vs "AI
// Tools"), so tag routes are per-locale and deliberately NOT cross-linked — the
// language switch (src/scripts/main.ts) already sends any blog URL to the other
// locale's blog root, which degrades correctly on its own.

export function tagSlug(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface TagEntry {
  label: string;
  slug: string;
}

/**
 * Unique tags across `postTagLists`, in first-seen order (callers pass
 * date-sorted posts, so this is newest-first).
 *
 * Throws on a slug collision instead of returning it: two different tags
 * sharing one URL would silently make one of them unreachable, and a build
 * failure naming both is the cheapest possible way to never ship that.
 */
export function tagIndex(postTagLists: readonly (readonly string[])[]): TagEntry[] {
  const bySlug = new Map<string, string>();
  for (const tags of postTagLists) {
    for (const label of tags) {
      const slug = tagSlug(label);
      const seen = bySlug.get(slug);
      if (seen === undefined) bySlug.set(slug, label);
      else if (seen !== label) {
        throw new Error(
          `Blog tag slug collision: "${seen}" and "${label}" both become "${slug}". ` +
            `Rename one of them (src/content/blog/*/*.md frontmatter).`,
        );
      }
    }
  }
  return [...bySlug].map(([slug, label]) => ({ label, slug }));
}
