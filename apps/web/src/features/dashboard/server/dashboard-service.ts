import { db } from 'db'

export const dashboardService = {
  async getData(userId: string) {
    const workspace = await db.query.workspaces.findFirst({
      where: { ownerUserId: userId },
    })
    if (!workspace) return null
    const mandate = await db.query.investmentMandates.findFirst({
      where: { workspaceId: workspace.id },
    })
    return { workspace, mandate }
  },
}
