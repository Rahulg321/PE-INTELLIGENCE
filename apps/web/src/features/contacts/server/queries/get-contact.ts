import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { contactsService } from '../contacts-service'

const getContactSchema = z.object({
  contactId: z.string().min(1),
})

export const getContact = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(getContactSchema)
  .handler(async ({ data, context }) =>
    contactsService.get(context.user.id, data.contactId),
  )
