import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { updateContextKeySchema } from '../../schemas'
import { settingsService } from '../settings-service'

export const updateContextKey = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateContextKeySchema)
  .handler(async ({ data, context }) =>
    settingsService.updateContextKey(context.user.id, data.key),
  )
