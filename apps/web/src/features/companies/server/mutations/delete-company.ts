import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { companiesService } from '../companies-service'
import { deleteCompanySchema } from '../../schemas'

export const deleteCompany = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(deleteCompanySchema)
  .handler(async ({ data, context }) =>
    companiesService.delete(context.user.id, data.companyId),
  )
