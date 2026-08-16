import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db, workspaces } from 'db'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { ACTIVE_WORKSPACE_COOKIE } from '../../constants'

const setActiveWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
})

export const setActiveWorkspace = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(setActiveWorkspaceSchema)
  .handler(async ({ data, context }) => {
    const rows = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(
        and(
          eq(workspaces.id, data.workspaceId),
          eq(workspaces.ownerUserId, context.user.id),
        ),
      )
      .limit(1)

    if (rows.length === 0) throw new Error('Workspace not found')

    const workspace = rows[0]

    setCookie(ACTIVE_WORKSPACE_COOKIE, workspace.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })

    return { workspaceId: workspace.id }
  })
