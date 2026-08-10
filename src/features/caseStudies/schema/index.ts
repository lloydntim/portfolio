import { z } from 'zod';

export const caseStudySchema = z.object({
  slug: z.enum(['vocapp', 'vorwerk', 'guilds']),
  order: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: z.string(),
  summary: z.string(),
  role: z.string(),
  timeline: z.string(),
  stack: z.array(z.string()),
  challenge: z.string(),
  approach: z.string(),
  outcome: z.string(),
  quote: z.object({ text: z.string(), attribution: z.string().optional() }).optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  coverImage: z.object({ src: z.string(), alt: z.string() }),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
