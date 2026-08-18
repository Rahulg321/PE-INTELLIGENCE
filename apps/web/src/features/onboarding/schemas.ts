import { z } from 'zod'

const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}([/?#]\S*)?$/i

export const mandateSchema = z
  .object({
    geography: z
      .array(z.string().trim().min(1))
      .min(1, 'Select at least one geography'),
    investmentTypes: z
      .array(z.string().trim().min(1))
      .min(1, 'Select at least one investment type'),
    minRevenue: z.coerce.number().int().nonnegative().optional(),
    maxRevenue: z.coerce.number().int().nonnegative().optional(),
    minEbitda: z.coerce
      .number()
      .int()
      .nonnegative('Enter a minimum EBITDA'),
    maxEbitda: z.coerce.number().int().nonnegative().optional(),
    preferredSectors: z.array(z.string().trim().min(1)).default([]),
    excludedSectors: z.array(z.string().trim().min(1)).default([]),
    noSectorPreference: z.boolean().default(false),
    criteria: z
      .record(z.string(), z.enum(['preferred', 'required']))
      .default({}),
    dealbreakers: z.array(z.string().trim().min(1)).default([]),
  })
  .superRefine((data, ctx) => {
    if (
      data.minRevenue != null &&
      data.maxRevenue != null &&
      data.minRevenue > data.maxRevenue
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxRevenue'],
        message: 'Maximum revenue must be greater than or equal to the minimum',
      })
    }
    if (
      data.maxEbitda != null &&
      data.minEbitda > data.maxEbitda
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxEbitda'],
        message: 'Maximum EBITDA must be greater than or equal to the minimum',
      })
    }
    const overlap = data.preferredSectors.filter((sector) =>
      data.excludedSectors.includes(sector),
    )
    if (overlap.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['preferredSectors'],
        message: `A sector can't be both preferred and excluded: ${overlap.join(', ')}`,
      })
    }
    if (!data.noSectorPreference && data.preferredSectors.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['preferredSectors'],
        message:
          'Select at least one preferred sector, or confirm you have no sector preference',
      })
    }
  })

export const onboardingSchema = z
  .object({
    firmName: z
      .string()
      .trim()
      .min(2, 'Enter your workspace name')
      .max(200),
    website: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || websiteRegex.test(v), {
        message: 'Enter a valid URL',
      })
      .transform((v) =>
        v && !/^https?:\/\//i.test(v) ? `https://${v}` : v,
      ),
  })
  .merge(mandateSchema)

export const onboardingSearchSchema = z.object({
  step: z.coerce.number().int().min(0).max(4).default(0).catch(0),
})

export const onboardingDraftDataSchema = z.object({
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
  noSectorPreference: z.boolean().default(false),
  criteria: z
    .record(z.string(), z.enum(['preferred', 'required']))
    .default({}),
  dealbreakers: z.array(z.string()).default([]),
})

export const onboardingDraftSchema = z.object({
  data: onboardingDraftDataSchema,
  step: z.number().int().min(0).max(4),
})

export type OnboardingInput = z.input<typeof onboardingSchema>
export type OnboardingOutput = z.output<typeof onboardingSchema>
export type MandateInput = z.input<typeof mandateSchema>
export type MandateOutput = z.output<typeof mandateSchema>
export type OnboardingSearch = z.infer<typeof onboardingSearchSchema>
export type OnboardingDraftData = z.infer<typeof onboardingDraftDataSchema>
export type OnboardingDraft = z.infer<typeof onboardingDraftSchema>
