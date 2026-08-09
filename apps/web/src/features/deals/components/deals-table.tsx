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
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        {error.message}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No deals yet. Add your first one.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 font-medium">Description</th>
            <th className="px-4 py-2 font-medium">Amount</th>
            <th className="px-4 py-2 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((deal) => (
            <tr key={deal.id}>
              <td className="px-4 py-2 font-medium">{deal.name}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {deal.description}
              </td>
              <td className="px-4 py-2">${deal.amount.toLocaleString()}</td>
              <td className="px-4 py-2">
                {deal.date.toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
