import { z } from 'zod'

/** Shared validation for the demo-request form (server + client). */
export const demoRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z
    .email('Enter a valid work email')
    .trim()
    .min(1, 'Work email is required')
    .max(200),
  firm: z.string().trim().max(160).optional().default(''),
  role: z.string().trim().max(120).optional().default(''),
  firmType: z.string().trim().max(120).optional().default(''),
  dealVolume: z.string().trim().max(120).optional().default(''),
  workflow: z.string().trim().max(240).optional().default(''),
  problem: z.string().trim().max(1000).optional().default(''),
  notes: z.string().trim().max(2000).optional().default(''),
})

export type DemoRequest = z.infer<typeof demoRequestSchema>
