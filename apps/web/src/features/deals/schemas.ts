import { z } from 'zod'

export const newDealSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    amount: z.number().min(0),
    date: z.date(),
})