import { getCookie } from '@tanstack/react-start/server'
import { and, eq, isNotNull, lt } from 'drizzle-orm'
import { db, workspaces } from 'db'
import { ACTIVE_WORKSPACE_COOKIE } from '../constants'

export const workspacesService = {
  async list(userId: string) {
    const rows = await db.query.workspaces.findMany({
      where: { ownerUserId: userId, deletedAt: { isNull: true } },
      columns: { id: true, name: true, slug: true },
      orderBy: { createdAt: 'asc' },
    })

    const cookieId = getCookie(ACTIVE_WORKSPACE_COOKIE)
    const activeWorkspaceId =
      rows.find((workspace) => workspace.id === cookieId)?.id ??
      rows.at(0)?.id ??
      null

    return { workspaces: rows, activeWorkspaceId }
  },

  async getWorkspace(userId: string, workspaceId: string) {
    const workspace = await db.query.workspaces.findFirst({
      where: {
        id: workspaceId,
        ownerUserId: userId,
        deletedAt: { isNull: true },
      },
    })
    if (!workspace) throw new Error('Workspace not found')
    return workspace
  },

  async requireActiveId(userId: string) {
    const { activeWorkspaceId } = await this.list(userId)
    if (!activeWorkspaceId) throw new Error('No workspace selected')
    return activeWorkspaceId
  },

  getActiveCookie() {
    return getCookie(ACTIVE_WORKSPACE_COOKIE)
  },

  async delete(userId: string, workspaceId: string) {
    const workspace = await this.getWorkspace(userId, workspaceId)

    await db
      .update(workspaces)
      .set({
        deletedAt: new Date(),
        deletedBy: userId,
      })
      .where(
        and(
          eq(workspaces.id, workspace.id),
          eq(workspaces.ownerUserId, userId),
        ),
      )

    const { workspaces: remaining } = await this.list(userId)
    return { remainingCount: remaining.length }
  },

  async purgeSoftDeleted(before: Date) {
    const deleted = await db
      .delete(workspaces)
      .where(and(isNotNull(workspaces.deletedAt), lt(workspaces.deletedAt, before)))
      .returning({ id: workspaces.id })
    return deleted.length
  },
}
