import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { contactsService } from '../contacts-service'
import { createContactSchema } from '../../schemas'

export const createContact = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createContactSchema)
  .handler(async ({ data, context }) =>
    contactsService.create(context.user.id, data),
  )
