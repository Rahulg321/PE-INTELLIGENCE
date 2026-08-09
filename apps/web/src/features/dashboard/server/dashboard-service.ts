import { db } from 'db'

export const dashboardService = {
  async getData(userId: string) {
    const firm = await db.query.firms.findFirst({
      where: { ownerUserId: userId },
    })
    if (!firm) return null
    const mandate = await db.query.investmentMandates.findFirst({
      where: { firmId: firm.id },
    })
    return { firm, mandate }
  },
}
