import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="bg-canvas text-ink">
      <GlobalNav />

      <Hero />

      <FeatureTile />

      <DarkTile />

      <Footer />
    </div>
  )
}

function GlobalNav() {
  return (
    <nav className="sticky top-0 z-50 h-11 bg-black text-white">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <a href="/" className="text-sm font-semibold tracking-tight">
          PE Intelligence
        </a>
        <div className="flex items-center gap-5 text-xs text-gray-300">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#product" className="transition hover:text-white">
            Product
          </a>
          <a
            href="#"
            className="rounded-sm bg-ink px-4 py-1.5 text-xs text-white transition hover:bg-ink-muted-80 active:scale-95"
          >
            Sign in
          </a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="bg-canvas px-6 py-20 text-center sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold leading-[1.07] tracking-[-0.28px] sm:text-6xl">
          Smarter deal sourcing.
          <br />
          Powered by data.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-2xl font-normal leading-[1.14] text-ink-muted-80 sm:text-3xl">
          PE Intelligence centralizes your mandates, companies, and deal flow in
          one quiet, powerful workspace.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#"
            className="rounded-full bg-primary px-[22px] py-[11px] text-[17px] text-white transition active:scale-95"
          >
            Get started
          </a>
          <a
            href="#product"
            className="rounded-full border border-primary px-[22px] py-[11px] text-[17px] text-primary transition active:scale-95"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  )
}

function FeatureTile() {
  const features = [
    {
      title: 'Mandates',
      copy: 'Encode your investment strategy once and match every opportunity against it.',
    },
    {
      title: 'Companies',
      copy: 'Own the facts — financials, contacts, and history — separate from the deal.',
    },
    {
      title: 'Deal flow',
      copy: 'Track each opportunity with its own economics, financing, and status.',
    },
  ]

  return (
    <section id="features" className="bg-parchment px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl font-semibold tracking-[-0.374px] sm:text-4xl">
          Everything in one place.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-hairline bg-canvas p-6"
            >
              <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
                {f.title}
              </h3>
              <p className="mt-3 text-[17px] leading-[1.47] tracking-[-0.374px] text-ink-muted-80">
                {f.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DarkTile() {
  return (
    <section id="product" className="bg-tile-1 px-6 py-24 text-center text-white">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl font-semibold leading-[1.1] sm:text-4xl">
          Built for the firm, not the spreadsheet.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-2xl font-normal leading-[1.5] text-body-muted">
          No more scattered trackers. A single source of truth for your whole
          investment lifecycle.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#"
            className="rounded-full bg-primary px-[22px] py-[11px] text-[17px] text-white transition active:scale-95"
          >
            Get started
          </a>
          <a
            href="#features"
            className="text-[17px] text-primary-on-dark transition hover:underline"
          >
            See features
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-parchment px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <p className="text-sm font-semibold text-ink">PE Intelligence</p>
          <div className="flex gap-8 text-xs text-ink-muted-48">
            <a href="#features" className="transition hover:text-ink">
              Features
            </a>
            <a href="#product" className="transition hover:text-ink">
              Product
            </a>
            <a href="#" className="transition hover:text-ink">
              Contact
            </a>
          </div>
        </div>
        <p className="mt-10 text-xs text-ink-muted-48">
          Copyright © {new Date().getFullYear()} PE Intelligence. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
