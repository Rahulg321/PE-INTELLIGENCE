import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { ACTIVE_WORKSPACE_COOKIE } from '../../constants'
import { workspacesService } from '../workspaces-service'

const deleteWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
})

export const deleteWorkspace = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(deleteWorkspaceSchema)
  .handler(async ({ data, context }) => {
    const { remainingCount } = await workspacesService.delete(
      context.user.id,
      data.workspaceId,
    )

    const activeId = workspacesService.getActiveCookie()
    if (activeId === data.workspaceId) {
      setCookie(ACTIVE_WORKSPACE_COOKIE, '', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 0,
      })
    }

    return { remainingCount }
  })
