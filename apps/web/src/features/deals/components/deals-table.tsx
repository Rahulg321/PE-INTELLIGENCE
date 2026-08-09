import { useQuery } from '@tanstack/react-query'
import { getDeals } from '../server/queries/get-deals'
import { Skeleton } from '#/components/ui/skeleton'

export function DealsTable() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['deals'],
    queryFn: () => getDeals(),
  })

  if (isPending) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        {error.message}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-hairline p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No deals yet. Add your first one.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-card shadow-none">
      <table className="w-full text-sm">
        <thead className="bg-parchment text-left">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Name</th>
            <th className="px-4 py-2.5 font-semibold">Description</th>
            <th className="px-4 py-2.5 font-semibold">Amount</th>
            <th className="px-4 py-2.5 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((deal) => (
            <tr key={deal.id}>
              <td className="px-4 py-2.5 font-semibold">{deal.name}</td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {deal.description}
              </td>
              <td className="px-4 py-2.5">${deal.amount.toLocaleString()}</td>
              <td className="px-4 py-2.5">
                {deal.date.toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
