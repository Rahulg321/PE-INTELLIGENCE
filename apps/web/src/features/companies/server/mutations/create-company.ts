import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { companiesService } from '../companies-service'
import { createCompanySchema } from '../../schemas'

export const createCompany = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createCompanySchema)
  .handler(async ({ data, context }) => companiesService.create(context.user.id, data))
