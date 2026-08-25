import { Link } from '@tanstack/react-router'
import { brand } from '~/lib/brand'
import { BrandMark } from '~/components/marketing/BrandMark'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 py-20 text-center">
      <Link
        to="/"
        className="flex items-center gap-2.5"
        aria-label={`${brand.name} home`}
      >
        <BrandMark className="h-6 w-6 text-ink" />
        <span className="text-[15px] font-semibold tracking-[-0.28px] text-ink">
          {brand.name}
        </span>
      </Link>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted-48">
        Error 404
      </p>
      <h1 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] text-ink sm:text-4xl">
        The page you are looking for does not exist.
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-[1.5] text-ink-muted-48">
        {children
          ? null
          : 'The link may be outdated, or the page may have moved. Head back to the homepage to explore the platform.'}
      </p>
      {children ? (
        <div className="mt-8 text-[15px] text-ink-muted-80">{children}</div>
      ) : null}
      <Link
        to="/"
        className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-[22px] py-[11px] text-[15px] font-semibold text-white transition hover:bg-primary-focus active:scale-95"
      >
        Back to homepage
      </Link>
    </div>
  )
}
