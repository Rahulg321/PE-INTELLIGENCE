import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { updateWorkspaceSchema } from '../../schemas'
import { settingsService } from '../settings-service'

export const updateWorkspace = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateWorkspaceSchema)
  .handler(async ({ data, context }) =>
    settingsService.updateWorkspace(context.user.id, data),
  )
