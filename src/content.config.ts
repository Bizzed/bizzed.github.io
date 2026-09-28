import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog content collection. Add markdown files to src/content/blog/ and
// they'll be type-checked against this schema.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Bizzed AI'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };