import { z } from 'zod'

export const dealStatusValues = [
  'NEW',
  'ACTIVE',
  'ON_HOLD',
  'PASSED',
  'LOST',
  'WON',
] as const

export const dealStageValues = [
  'INITIAL_REVIEW',
  'SCREENING',
  'DILIGENCE',
  'IC',
  'LOI',
  'CLOSING',
  'CLOSED',
] as const

export const dealTypeValues = [
  'CONTROL_MAJORITY',
  'MINORITY',
  'BUYOUT',
  'GROWTH',
  'SPECIAL_SITUATIONS',
] as const

export const createDealSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  companyId: z.string().min(1, 'Company is required'),
  status: z.enum(dealStatusValues).optional(),
  stage: z.enum(dealStageValues).optional(),
  dealType: z.enum(dealTypeValues).optional(),
  source: z.string().max(100).optional(),
})

export type DealStatus = (typeof dealStatusValues)[number]
export type DealStage = (typeof dealStageValues)[number]
export type DealType = (typeof dealTypeValues)[number]

export type CreateDealInput = z.infer<typeof createDealSchema>

export const dealSheetTabs = [
  'overview',
  'contacts',
  'activity',
  'agent',
] as const

export const dealsSearchSchema = z.object({
  dealId: z.string().min(1).optional().catch(undefined),
  tab: z.enum(dealSheetTabs).optional().catch(undefined),
})

export type DealsSearch = z.infer<typeof dealsSearchSchema>
export type DealSheetTab = (typeof dealSheetTabs)[number]
