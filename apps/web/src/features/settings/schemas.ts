import { z } from 'zod'
import { mandateSchema } from '#/features/onboarding/schemas'
import { RESEARCH_MODEL_IDS } from './constants'

const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}([/?#]\S*)?$/i

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(2, 'Enter a workspace name').max(200),
  website: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || websiteRegex.test(value), {
      message: 'Enter a valid URL',
    })
    .transform((value) => {
      if (!value) return undefined
      return /^https?:\/\//i.test(value) ? value : `https://${value}`
    }),
})

export const updateContextKeySchema = z.object({
  key: z.string().trim().min(1, 'Paste a Context API key'),
})

export const updateResearchModelSchema = z.object({
  model: z.enum(RESEARCH_MODEL_IDS),
})

export const updateMandateSchema = mandateSchema

export type UpdateWorkspaceInput = z.input<typeof updateWorkspaceSchema>
export type UpdateWorkspaceData = z.output<typeof updateWorkspaceSchema>
export type UpdateContextKeyInput = z.infer<typeof updateContextKeySchema>
export type UpdateResearchModelInput = z.infer<typeof updateResearchModelSchema>
export type UpdateMandateInput = z.input<typeof updateMandateSchema>
export type UpdateMandateData = z.output<typeof updateMandateSchema>
