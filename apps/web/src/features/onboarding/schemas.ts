import { z } from 'zod'

const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}([/?#]\S*)?$/i

export const onboardingSchema = z.object({
  firmName: z.string().trim().min(1).max(200),
  website: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || websiteRegex.test(v), {
      message: 'Invalid URL',
    })
    .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v)),
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

export const onboardingSearchSchema = z.object({
  step: z.coerce.number().int().min(0).max(3).default(0).catch(0),
})

const onboardingDraftDataSchema = z.object({
  firmName: z.string().default(''),
  website: z.string().default(''),
  geography: z.array(z.string()).default([]),
  investmentTypes: z.array(z.string()).default([]),
  minRevenue: z.string().default(''),
  maxRevenue: z.string().default(''),
  minEbitda: z.string().default(''),
  maxEbitda: z.string().default(''),
  preferredSectors: z.array(z.string()).default([]),
  excludedSectors: z.array(z.string()).default([]),
  criteria: z
    .record(z.string(), z.enum(['required', 'preferred', 'neutral']))
    .default({}),
})

export const onboardingDraftSchema = z.object({
  data: onboardingDraftDataSchema,
  step: z.number().int().min(0).max(3),
})

export type OnboardingInput = z.input<typeof onboardingSchema>
export type OnboardingOutput = z.output<typeof onboardingSchema>
export type OnboardingSearch = z.infer<typeof onboardingSearchSchema>
export type OnboardingDraftData = z.infer<typeof onboardingDraftDataSchema>
export type OnboardingDraft = z.infer<typeof onboardingDraftSchema>
