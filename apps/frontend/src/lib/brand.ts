/**
 * Central brand configuration.
 *
 * The company name is not finalised. To rebrand the entire marketing site,
 * change the values below — nothing else needs to be edited.
 *
 * Components must never hard-code the company name or domain; import from here.
 */

export const brand = {
  name: '[COMPANY NAME]',
  legalName: '[COMPANY NAME]',
  tagline: 'AI-native infrastructure for investment teams.',
  description:
    'An AI-native investment intelligence and workflow platform that connects your firm\u2019s data, workflows, and investment knowledge in one intelligent layer across the deal lifecycle.',
  domain: 'example.com',
  appUrl: 'app.example.com',
  contact: {
    email: 'hello@example.com',
  },
} as const

/** Absolute URL for a site path, e.g. siteUrl('/product'). */
export function siteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `https://${brand.domain}${normalized}`
}

/** Absolute URL for the application, e.g. 'https://app.example.com'. */
export const appUrl = `https://${brand.appUrl}`
