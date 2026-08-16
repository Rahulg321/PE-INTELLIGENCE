import { z } from 'zod'

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  website: z.string().max(300).optional(),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
