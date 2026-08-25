import { Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { ErrorComponent } from '@tanstack/react-router'
import { brand } from '~/lib/brand'
import { BrandMark } from '~/components/marketing/BrandMark'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 py-20 text-center">
      <div className="flex items-center gap-2.5">
        <BrandMark className="h-6 w-6 text-ink" />
        <span className="text-[15px] font-semibold tracking-[-0.28px] text-ink">
          {brand.name}
        </span>
      </div>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted-48">
        Something went wrong
      </p>
      <h1 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] text-ink sm:text-4xl">
        We could not load this page.
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-[1.5] text-ink-muted-48">
        An unexpected error occurred. Try again, or return to the homepage.
      </p>
      <div className="mt-6 max-w-md text-left">
        <ErrorComponent error={error} />
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="inline-flex items-center justify-center rounded-full bg-primary px-[22px] py-[11px] text-[15px] font-semibold text-white transition hover:bg-primary-focus active:scale-95"
        >
          Try Again
        </button>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-primary px-[22px] py-[11px] text-[15px] font-semibold text-primary transition hover:bg-primary/5 active:scale-95"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
