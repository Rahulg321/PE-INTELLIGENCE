import type React from 'react'
import { brand, siteUrl } from '~/lib/brand'
import { contentUpdatedAt, pageMirrorPath } from '~/content/site'

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
  /** ISO date the page content was last modified. Defaults to the site-wide content date. */
  dateModified?: string
  /** JSON-LD schema type for the page. Defaults to WebPage. */
  jsonLdType?: string
  /** Markdown mirror path override. Defaults to `/docs/<canonical>.md`. */
  mdMirror?: string
}

export interface SeoResult {
  meta: HeadMeta[]
  links: HeadLink[]
  scripts: HeadScript[]
}

interface Crumb {
  name: string
  path: string
}

/** Breadcrumbs from a canonical path, e.g. '/workflows/screening' → Home > Workflows > Screening. */
function breadcrumbsFromPath(path: string): Crumb[] {
  const parts = path.split('/').filter(Boolean)
  const crumbs: Crumb[] = [{ name: 'Home', path: '/' }]
  let acc = ''
  for (const part of parts) {
    acc += `/${part}`
    const name = part
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    crumbs.push({ name, path: acc })
  }
  return crumbs
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
  dateModified = contentUpdatedAt,
  jsonLdType = 'WebPage',
  mdMirror,
}: SeoOptions): SeoResult {
  const canonicalHref = canonical ? siteUrl(canonical) : undefined
  const mirrorHref = mdMirror ?? (canonical ? pageMirrorPath(canonical) : undefined)

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
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: brand.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalHref ?? siteUrl('/') },
    ...(image ? [{ property: 'og:image', content: image }] : []),
  ]

  const links: HeadLink[] = [
    ...(canonicalHref ? [{ rel: 'canonical', href: canonicalHref }] : []),
    // Only point at a markdown mirror on indexable content pages (legal pages
    // are noindexed and have no mirror).
    ...(index && mirrorHref
      ? [{ rel: 'alternate', type: 'text/markdown', href: mirrorHref }]
      : []),
  ]

  const scripts: HeadScript[] = []
  if (canonicalHref) {
    const pageSchema: JsonLd = {
      '@context': 'https://schema.org',
      '@type': jsonLdType,
      name: title,
      headline: title,
      url: canonicalHref,
      dateModified,
    }
    if (description) {
      pageSchema.description = description
    }

    const breadcrumb: JsonLd = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsFromPath(canonical ?? '/').map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: siteUrl(crumb.path),
      })),
    }

    scripts.push(...ldJson({ '@graph': [pageSchema, breadcrumb] }))
  }

  return { meta, links, scripts }
}

/**
 * Build a JSON-LD structured-data script for a route `head()`:
 *
 *   head: () => ({ ...seo(...), scripts: ldJson(schema) })
 */
export function ldJson(ld: JsonLd): HeadScript[] {
  return [{ type: 'application/ld+json', children: JSON.stringify(ld) }]
}

/**
 * FAQPage JSON-LD from the shared FAQ content. Emits the questions verbatim so
 * agents can answer them directly from the markup.
 */
export function faqLdJson(
  items: readonly { question: string; answer: string }[],
): HeadScript[] {
  return ldJson({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  })
}
