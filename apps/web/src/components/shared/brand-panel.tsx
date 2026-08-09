interface BrandPanelProps {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function BrandPanel({
  eyebrow = 'PE Intelligence',
  title,
  subtitle,
  children,
}: BrandPanelProps) {
  return (
    <aside className="relative hidden overflow-hidden bg-tile-1 text-on-dark lg:flex lg:flex-col lg:justify-between lg:p-16">
      <div className="relative z-10">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary text-on-dark">
          <span className="text-base font-semibold">PE</span>
        </span>
        {eyebrow && <p className="mt-8 text-sm font-semibold tracking-[-0.224px] text-muted-on-dark">{eyebrow}</p>}
        <h2 className="mt-3 max-w-md text-[40px] font-semibold leading-[1.1]">{title}</h2>
        {subtitle && (
          <p className="mt-4 max-w-sm text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-on-dark">
            {subtitle}
          </p>
        )}
      </div>

      {children && <div className="relative z-10">{children}</div>}

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 -top-40 size-[480px] rounded-full bg-action/25 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 size-[420px] rounded-full bg-action/15 blur-[100px]" />
        <div className="absolute right-10 top-24 size-72 rounded-full border border-on-dark/10" />
        <div className="absolute right-16 top-36 size-44 rounded-full border border-on-dark/10" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(circle at 70% 20%, black, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(circle at 70% 20%, black, transparent 72%)',
          }}
        />
      </div>
    </aside>
  )
}
