import { z } from 'zod';
export const Job = z.object({
  company: z.string(),
  title: z.string(),
  start: z.string(), // ISO like "2023-01"
  end: z.string().optional(),
  summary: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});
export const Education = z.object({
  school: z.string(),
  degree: z.string(),
  start: z.string(),
  end: z.string(),
});
export const CV = z.object({
  basics: z.object({
    name: z.string(),
    title: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url().optional(),
    summary: z.string().optional(),
  }),
  skills: z.array(z.string()).default([]),
  work: z.array(Job).default([]),
  education: z.array(Education).default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        link: z.string().url().optional(),
        description: z.string().optional(),
        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),
});

export type CV = z.infer<typeof CV>;
