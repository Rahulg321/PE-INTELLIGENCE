import { z } from 'zod'

export const onboardingSchema = z.object({
  firmName: z.string().min(1).max(200),
  website: z.string().url().optional().or(z.literal('')),
  geography: z.array(z.string()).min(1),
  investmentTypes: z.array(z.string()).min(1),
  minRevenue: z.coerce.number().int().positive().optional(),
  maxRevenue: z.coerce.number().int().positive().optional(),
  minEbitda: z.coerce.number().int().positive().optional(),
  maxEbitda: z.coerce.number().int().positive().optional(),
  preferredSectors: z.array(z.string()).min(1),
  excludedSectors: z.array(z.string()).default([]),
  criteria: z.record(z.string(), z.enum(['required', 'preferred', 'neutral'])),
})

export type OnboardingInput = z.input<typeof onboardingSchema>
export type OnboardingOutput = z.output<typeof onboardingSchema>
