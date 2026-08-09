import { db, deals } from 'db'
import type { NewDealInput } from '../schemas'

export const dealsService = {
    async getDeals(userId: string) {
        const items = await db.query.deals.findMany({
            where: { userId },
            orderBy: (table, { desc }) => [desc(table.date)],
        })
        return items
    },

    async createDeal(userId: string, data: NewDealInput) {
        const [deal] = await db
            .insert(deals)
            .values({
                id: crypto.randomUUID(),
                userId,
                name: data.name,
                description: data.description,
                amount: data.amount,
                date: data.date,
            })
            .returning()
        return deal
    },
}
