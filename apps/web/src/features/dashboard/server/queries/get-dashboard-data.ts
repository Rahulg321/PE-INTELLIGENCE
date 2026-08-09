import { createServerFn } from '@tanstack/react-start'
import { getSessionUser } from '#/features/auth/server/get-session-user'
import { dashboardService } from '../dashboard-service'

export const getDashboardData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getSessionUser()
    if (!user) return null
    return dashboardService.getData(user.id)
  },
)
