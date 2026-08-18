import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { dealsService } from '../deals-service'

export const getDeals = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => dealsService.list(context.user.id))
