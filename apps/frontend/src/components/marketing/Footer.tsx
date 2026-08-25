import { Link } from '@tanstack/react-router'
import { brand } from '~/lib/brand'
import { footerColumns } from '~/content/site'
import { BrandMark } from './BrandMark'

export function Footer() {
  return (
    <footer className="bg-parchment px-6 py-14 sm:py-16">
      <div className="marketing-container">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-6 w-6 text-ink" />
              <span className="text-[15px] font-semibold tracking-[-0.28px] text-ink">
                {brand.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.5] text-ink-muted-48">
              {brand.tagline}
            </p>
            <p className="mt-4 text-[13px] text-ink-muted-48">
              <a
                href={`mailto:${brand.contact.email}`}
                className="transition hover:text-ink"
              >
                {brand.contact.email}
              </a>
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-semibold text-ink">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-[13px] leading-[1.6] text-ink-muted-48 transition hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-hairline pt-6">
          <p className="text-[12px] text-ink-muted-48">
            Copyright © {new Date().getFullYear()} {brand.legalName}. All rights
            reserved. Product and company name are placeholders until branding
            is finalised.
          </p>
        </div>
      </div>
    </footer>
  )
}
