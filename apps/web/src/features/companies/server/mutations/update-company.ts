import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { companiesService } from '../companies-service'
import { updateCompanySchema } from '../../schemas'

export const updateCompany = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateCompanySchema)
  .handler(async ({ data, context }) =>
    companiesService.update(context.user.id, data),
  )
