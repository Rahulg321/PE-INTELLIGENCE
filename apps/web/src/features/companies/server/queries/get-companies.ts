import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { companiesService } from '../companies-service'

export const getCompanies = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => companiesService.list(context.user.id))
