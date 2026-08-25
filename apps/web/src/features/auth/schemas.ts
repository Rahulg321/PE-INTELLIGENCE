import { z } from 'zod'

export const loginSearchSchema = z.object({
  reset: z.literal('success').optional().catch(undefined),
})

export const verifyEmailSearchSchema = z.object({
  token: z.string().min(1).optional().catch(undefined),
  callbackURL: z.string().min(1).optional().catch(undefined),
})

export type LoginSearch = z.infer<typeof loginSearchSchema>
export type VerifyEmailSearch = z.infer<typeof verifyEmailSearchSchema>
