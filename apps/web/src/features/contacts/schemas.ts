import { z } from 'zod'

export const createContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(200),
  lastName: z.string().max(200).optional(),
  title: z.string().max(200).optional(),
  email: z.string().max(300).optional(),
  phone: z.string().max(50).optional(),
  companyId: z.string().min(1, 'Company is required'),
})

export const contactSheetTabs = [
  'overview',
  'deals',
  'activity',
  'agent',
] as const

export const contactsSearchSchema = z.object({
  contactId: z.string().min(1).optional().catch(undefined),
  tab: z.enum(contactSheetTabs).optional().catch(undefined),
})

export type CreateContactInput = z.infer<typeof createContactSchema>
export type ContactsSearch = z.infer<typeof contactsSearchSchema>
export type ContactSheetTab = (typeof contactSheetTabs)[number]

export function isContactSheetTab(value: string): value is ContactSheetTab {
  return (contactSheetTabs as readonly string[]).includes(value)
}
