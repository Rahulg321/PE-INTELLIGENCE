import type React from 'react'
import { brand, siteUrl } from '~/lib/brand'

type HeadMeta = React.JSX.IntrinsicElements['meta']
type HeadLink = React.JSX.IntrinsicElements['link']
type HeadScript = React.JSX.IntrinsicElements['script']

/** JSON-LD value: a concrete recursive type for structured data. */
export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonLdValue[]
  | { [key: string]: JsonLdValue }

export type JsonLd = { [key: string]: JsonLdValue }

export interface SeoOptions {
  /** Page <title> */
  title: string
  /** Meta description (recommended ~150-160 chars) */
  description?: string
  keywords?: string
  /** Optional social image URL (absolute) */
  image?: string
  /** Optional canonical path, e.g. '/workflows/screening' */
  canonical?: string
  /** Set false on pages that should not be indexed (e.g. legal pages) */
  index?: boolean
}

export interface SeoResult {
  meta: HeadMeta[]
  links: HeadLink[]
}

/**
 * Build per-page head tags. Combine with a route's `head()`:
 *
 *   head: () => ({ ...seo({ title, description, canonical }) })
 */
export function seo({
  title,
  description,
  keywords,
  image,
  canonical,
  index = true,
}: SeoOptions): SeoResult {
  const canonicalHref = canonical ? siteUrl(canonical) : undefined

  const meta: HeadMeta[] = [
    { title },
    { name: 'description', content: description },
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
    ...(index ? [] : [{ name: 'robots', content: 'noindex, nofollow' }]),
    {
      name: 'twitter:card',
      content: image ? 'summary_large_image' : 'summary',
    },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...(image ? [{ name: 'twitter:image', content: image }] : []),
    { name: 'og:type', content: 'website' },
    { name: 'og:site_name', content: brand.name },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:url', content: canonicalHref ?? siteUrl('/') },
    ...(image ? [{ name: 'og:image', content: image }] : []),
  ]

  const links: HeadLink[] = canonicalHref
    ? [{ rel: 'canonical', href: canonicalHref }]
    : []

  return { meta, links }
}

/**
 * Build a JSON-LD structured-data script for a route `head()`:
 *
 *   head: () => ({ ...seo(...), scripts: ldJson(schema) })
 */
export function ldJson(ld: JsonLd): HeadScript[] {
  return [{ type: 'application/ld+json', children: JSON.stringify(ld) }]
}
