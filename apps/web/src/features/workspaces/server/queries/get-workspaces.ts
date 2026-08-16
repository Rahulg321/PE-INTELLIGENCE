import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { workspacesService } from '../workspaces-service'

export const getWorkspaces = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return workspacesService.list(context.user.id)
  })
