import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { ACTIVE_WORKSPACE_COOKIE } from '../../constants'
import { workspacesService } from '../workspaces-service'

const setActiveWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
})

export const setActiveWorkspace = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(setActiveWorkspaceSchema)
  .handler(async ({ data, context }) => {
    const workspace = await workspacesService.getWorkspace(context.user.id, data.workspaceId)

    setCookie(ACTIVE_WORKSPACE_COOKIE, workspace.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })

    return { workspaceId: workspace.id }
  })
