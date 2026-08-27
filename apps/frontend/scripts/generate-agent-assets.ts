/**
 * Generates the AI-agent discovery assets for the marketing site:
 *   - public/robots.txt  (explicit AI-bot allow + real sitemap URL)
 *   - public/sitemap.xml (all indexable pages with <lastmod>)
 *   - public/sitemap.md  (human/agent-readable index)
 *   - public/llms.txt    (markdown mirror index for LLM agents)
 *
 * Everything derives from the single source of truth in
 * `src/content/site.ts` (publicPages) + `src/lib/brand.ts`, so the files can
 * never drift from the routes. Run before `vite build` (wired into `build`).
 *
 *   bun run scripts/generate-agent-assets.ts
 */
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { brand, siteUrl } from '../src/lib/brand'
import { pageMirrorPath, publicPages } from '../src/content/site'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(scriptDir, '..')
const publicDir = resolve(appRoot, 'public')

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const pages = publicPages.map((page) => ({
  page,
  mirror: pageMirrorPath(page.path),
}))

for (const { page, mirror } of pages) {
  if (!existsSync(resolve(publicDir, mirror.slice(1)))) {
    throw new Error(
      `[generate-agent-assets] Markdown mirror missing for ${page.path}: expected ${mirror}. ` +
        `Create it under apps/frontend/public.`,
    )
  }
}

async function write(name: string, contents: string): Promise<void> {
  await mkdir(publicDir, { recursive: true })
  const file = resolve(publicDir, name)
  await writeFile(file, contents, 'utf8')
  console.log(`[generate-agent-assets] wrote ${file.replace(appRoot, '.')}`)
}

// --- robots.txt ------------------------------------------------------------
const robots = `# ${brand.name} — robot access policy
# AI agents are explicitly welcome; none of the AI bots below are blocked.

User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${siteUrl('/sitemap.xml')}
`

// --- sitemap.xml -----------------------------------------------------------
const urls = pages
  .map(
    ({ page }) =>
      `  <url><loc>${xmlEscape(siteUrl(page.path))}</loc><lastmod>${page.lastmod}</lastmod></url>`,
  )
  .join('\n')

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${brand.name} sitemap — generated from src/content/site.ts -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

// --- sitemap.md ------------------------------------------------------------
const topLevel = pages.filter(
  ({ page }) => page.path === '/' || page.path.split('/').filter(Boolean).length === 1,
)
const workflows = pages.filter(
  ({ page }) => page.path.split('/').filter(Boolean).length === 2 && page.path.startsWith('/workflows'),
)

const sitemapMd = `# Sitemap

> ${brand.description}

## Top-level pages

${topLevel
  .map(({ page }) => {
    const label =
      page.path === '/' ? 'Home' : page.title.replace(/ —.*$/, '')
    return `- [${label}](${page.path})`
  })
  .join('\n')}

## Workflows

${workflows
  .map(({ page }) => {
    const label = page.path.split('/').pop() ?? ''
    const name = label
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return `- [${name}](${page.path})`
  })
  .join('\n')}
`

// --- llms.txt --------------------------------------------------------------
const llmsTxt = `# ${brand.name}

> ${brand.description}

## Documentation

${pages
  .map(({ page, mirror }) => {
    const label =
      page.path === '/'
        ? 'Home'
        : (page.path.split('/').pop() ?? '').replace(/-/g, ' ')
    return `- [${label}](${mirror})`
  })
  .join('\n')}
`

await write('robots.txt', robots)
await write('sitemap.xml', sitemapXml)
await write('sitemap.md', sitemapMd)
await write('llms.txt', llmsTxt)
