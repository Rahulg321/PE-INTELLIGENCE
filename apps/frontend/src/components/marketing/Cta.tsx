import { track, type AnalyticsEventName } from '~/lib/analytics'
import { Button, type ButtonVariant, type ButtonSize } from './Button'

interface CtaProps {
  /** Event name to track on click */
  event: AnalyticsEventName
  /** Current route path */
  page: string
  /** Section of the page the CTA lives in */
  section: string
  /** Where the CTA appears, e.g. 'navbar' | 'hero' | 'lifecycle' | 'final-cta' */
  source: string
  location?: string
  campaign?: string
  label: string
  to?: string
  href?: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/** A CTA that records its click with page/section/source/campaign context. */
export function Cta({
  event,
  page,
  section,
  source,
  location,
  campaign,
  label,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className,
}: CtaProps) {
  return (
    <Button
      to={to}
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() =>
        track(event, { page, section, source, location, campaign })
      }
    >
      {label}
    </Button>
  )
}
