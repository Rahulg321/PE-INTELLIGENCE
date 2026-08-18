import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { settingsService } from '../settings-service'

export const getSettings = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => settingsService.get(context.user.id))
