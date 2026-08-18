import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { contactsService } from '../contacts-service'

export const getContacts = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => contactsService.list(context.user.id))
