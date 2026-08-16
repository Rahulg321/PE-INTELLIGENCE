import { getCookie } from '@tanstack/react-start/server'
import { db } from 'db'
import { ACTIVE_WORKSPACE_COOKIE } from '../constants'

export const workspacesService = {
  async list(userId: string) {
    const workspaces = await db.query.workspaces.findMany({
      where: { ownerUserId: userId },
      columns: { id: true, name: true, slug: true },
      orderBy: { createdAt: 'asc' },
    })

    const cookieId = getCookie(ACTIVE_WORKSPACE_COOKIE)
    const activeWorkspaceId =
      workspaces.find((workspace) => workspace.id === cookieId)?.id ??
      workspaces.at(0)?.id ??
      null

    return { workspaces, activeWorkspaceId }
  },
}
