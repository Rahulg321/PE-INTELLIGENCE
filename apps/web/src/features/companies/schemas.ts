import { z } from 'zod'

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  website: z.string().max(300).optional(),
})

export const updateCompanySchema = createCompanySchema.extend({
  companyId: z.string().min(1),
})

export const deleteCompanySchema = z.object({
  companyId: z.string().min(1),
})

export const companySheetTabs = [
  'overview',
  'contacts',
  'deals',
  'activity',
  'agent',
] as const

export const companiesSearchSchema = z.object({
  companyId: z.string().min(1).optional().catch(undefined),
  tab: z.enum(companySheetTabs).optional().catch(undefined),
  add: z.enum(['contact']).optional().catch(undefined),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>
export type DeleteCompanyInput = z.infer<typeof deleteCompanySchema>
export type CompaniesSearch = z.infer<typeof companiesSearchSchema>
export type CompanySheetTab = (typeof companySheetTabs)[number]
export type CompanySheetAdd = CompaniesSearch['add']
