import { brand } from '~/lib/brand'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <article className="px-6 py-16 sm:py-20">
      <div className="marketing-container max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted-48">
          Legal
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-[13px] text-ink-muted-48">
          Last updated: {updated} · {brand.legalName}
        </p>
        <div className="mt-10 space-y-6 border-t border-hairline pt-8 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:first:mt-0 [&_p]:text-[15px] [&_p]:leading-[1.6] [&_p]:text-ink-muted-80 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-[15px] [&_li]:leading-[1.6] [&_li]:text-ink-muted-80 [&_a]:text-primary [&_a]:hover:text-primary-focus">
          {children}
        </div>
      </div>
    </article>
  )
}
