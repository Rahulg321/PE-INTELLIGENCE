import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { ACTIVE_WORKSPACE_COOKIE } from '#/features/workspaces/constants'
import { dashboardService } from '../dashboard-service'

export const getDashboardData = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const workspaceId = getCookie(ACTIVE_WORKSPACE_COOKIE)
    return dashboardService.getData(context.user.id, workspaceId)
  })
