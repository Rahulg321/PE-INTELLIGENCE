import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { dealsService } from '../deals-service'
import { newDealSchema } from '../../schemas'

export const createDeal = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(newDealSchema)
  .handler(async ({ data, context }) => {
    return dealsService.createDeal(context.user.id, data)
  })
