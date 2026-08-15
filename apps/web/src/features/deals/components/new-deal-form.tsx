import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDeal } from '../server/mutations/create-deal'
import type { NewDealFormInput } from '../schemas'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

export function NewDealForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (input: NewDealFormInput) => createDeal({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const canSubmit = name !== '' && description !== '' && amount !== '' && date !== ''

  return (
    <Card className="rounded-lg border shadow-none">
      <CardHeader>
        <CardTitle className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          Add a deal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!canSubmit) return
            mutation.mutate(
              {
                name,
                description,
                amount,
                date,
              },
              {
                onSuccess: () => {
                  setName('')
                  setDescription('')
                  setAmount('')
                  setDate('')
                },
              },
            )
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="deal-name" className="text-xs font-semibold tracking-[-0.224px]">
              Name
            </Label>
            <Input
              id="deal-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Acme Corp"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deal-description" className="text-xs font-semibold tracking-[-0.224px]">
              Description
            </Label>
            <Textarea
              id="deal-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does this company do?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="deal-amount" className="text-xs font-semibold tracking-[-0.224px]">
                Amount (USD)
              </Label>
              <Input
                id="deal-amount"
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="1000000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deal-date" className="text-xs font-semibold tracking-[-0.224px]">
                Date
              </Label>
              <Input
                id="deal-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={!canSubmit || mutation.isPending}>
            {mutation.isPending ? 'Adding…' : 'Add Deal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
