import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { dealsService } from '../deals-service'

const getDealSchema = z.object({
  dealId: z.string().min(1),
})

export const getDeal = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(getDealSchema)
  .handler(async ({ data, context }) =>
    dealsService.get(context.user.id, data.dealId),
  )
