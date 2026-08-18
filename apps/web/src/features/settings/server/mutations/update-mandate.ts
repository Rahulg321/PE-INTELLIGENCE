import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { updateMandateSchema } from '../../schemas'
import { settingsService } from '../settings-service'

export const updateMandate = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateMandateSchema)
  .handler(async ({ data, context }) =>
    settingsService.updateMandate(context.user.id, data),
  )
