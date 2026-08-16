import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { companiesService } from '../companies-service'

const getCompanySchema = z.object({
  companyId: z.string().min(1),
})

export const getCompany = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(getCompanySchema)
  .handler(async ({ data, context }) =>
    companiesService.get(context.user.id, data.companyId),
  )
