import { db } from 'db'


export const dealsService = {
    async getDeals(userId: string) {
        const deals = await db.query.deals.findMany({
            where: { userId },
        })
        return deals
    },
}