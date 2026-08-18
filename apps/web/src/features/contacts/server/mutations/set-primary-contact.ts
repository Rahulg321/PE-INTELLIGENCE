import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { contactsService } from '../contacts-service'

const setPrimaryContactSchema = z.object({
  contactId: z.string().min(1),
})

export const setPrimaryContact = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(setPrimaryContactSchema)
  .handler(async ({ data, context }) =>
    contactsService.setPrimary(context.user.id, data.contactId),
  )
