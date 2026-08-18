import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { dealsService } from '../deals-service'
import { createDealSchema } from '../../schemas'

export const createDeal = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createDealSchema)
  .handler(async ({ data, context }) => dealsService.create(context.user.id, data))
