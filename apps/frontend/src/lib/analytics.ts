/**
 * Lightweight, dependency-free analytics.
 *
 * Intentionally has no third-party scripts. Events are tracked through a
 * pluggable provider:
 *
 *  1. In development, events are logged to the console.
 *  2. In production, events are forwarded to `window.__analytics` if a provider
 *     has registered one (e.g. a snippet added later), otherwise they are
 *     dropped. If `PUBLIC_ANALYTICS_ENDPOINT` is set (in apps/frontend/.env),
 *     events are also sent as JSON beacons to that endpoint.
 *
 * All calls are client-only and must be guarded by `typeof window` checks by
 * callers (or via the `track` guard below).
 */

export type AnalyticsEventName =
  | 'page_view'
  | 'hero_cta_clicked'
  | 'demo_requested'
  | 'product_viewed'
  | 'workflow_viewed'
  | 'ai_viewed'
  | 'integration_viewed'
  | 'security_viewed'
  | 'resource_viewed'
  | 'contact_started'
  | 'contact_submitted'

export interface AnalyticsContext {
  /** Route path, e.g. '/workflows/screening'. */
  page: string
  /** Section or component the event originated from. */
  section?: string
  /** CTA source, e.g. 'navbar' | 'hero' | 'lifecycle' | 'final-cta'. */
  source?: string
  /** Optional campaign identifier. */
  campaign?: string
  /** Where the CTA appeared on the page, e.g. 'above-fold'. */
  location?: string
}

export interface AnalyticsEvent extends AnalyticsContext {
  name: AnalyticsEventName
  /** ISO timestamp of when the event occurred. */
  ts: string
}

type AnalyticsProvider = (event: AnalyticsEvent) => void

const BEACON_PATH = '/api/analytics'
const queue: AnalyticsEvent[] = []
let registered: AnalyticsProvider | null = null

export function registerAnalytics(provider: AnalyticsProvider): void {
  registered = provider
  const pending = queue.splice(0)
  for (const event of pending) registered(event)
}

export function track(
  name: AnalyticsEventName,
  context: AnalyticsContext,
): void {
  // `import.meta.env.SSR` is statically replaced by Vite in the server build,
  // so this module never touches the DOM (or queues events) server-side.
  if (import.meta.env.SSR) return
  const event: AnalyticsEvent = {
    name,
    ts: new Date().toISOString(),
    ...context,
  }

  if (import.meta.env.DEV) {
    console.debug('[analytics]', event)
  }

  if (registered) {
    registered(event)
  } else {
    queue.push(event)
  }

  // SAFETY: `PUBLIC_ANALYTICS_ENDPOINT` may be unset; `navigator.sendBeacon` is
  // guaranteed on the client (we already returned during SSR), so this is a
  // best-effort delivery that must never throw.
  const endpoint = import.meta.env.PUBLIC_ANALYTICS_ENDPOINT as
    string | undefined
  if (endpoint) {
    const url = `${endpoint}${BEACON_PATH}`
    try {
      navigator.sendBeacon(url, JSON.stringify(event))
    } catch {
      /* beacons are best-effort; never break the page */
    }
  }
}
