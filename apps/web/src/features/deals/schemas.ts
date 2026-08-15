import { z } from 'zod'

export const newDealSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    amount: z.coerce.number().min(0),
    date: z.coerce.date(),
})

export type NewDealInput = z.infer<typeof newDealSchema>
export type NewDealFormInput = z.input<typeof newDealSchema>