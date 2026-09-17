/**
 * Runs after `vite build`. Never fails the build.
 *  - 404.html  : SPA fallback so /work/<slug>, /articles/<slug> and /contact reload fine on GitHub Pages
 *  - .nojekyll : tells Pages not to run Jekyll on the output
 *  - sitemap.xml + robots.txt : fetched live from Supabase when credentials exist
 */
import { copyFileSync, writeFileSync, existsSync } from 'node:fs'

const dist = 'dist'
if (!existsSync(`${dist}/index.html`)) {
  console.warn('[postbuild] dist/index.html missing — skipping')
  process.exit(0)
}

copyFileSync(`${dist}/index.html`, `${dist}/404.html`)
writeFileSync(`${dist}/.nojekyll`, '')

const origin = (process.env.VITE_SITE_ORIGIN || 'https://faradilahade.github.io').replace(/\/+$/, '')
let base = process.env.VITE_BASE || '/'
if (!base.startsWith('/')) base = `/${base}`
if (!base.endsWith('/')) base = `${base}/`
const siteUrl = origin + base

function normalizeSupabaseUrl(raw) {
  if (!raw) return ''
  let u = raw.trim().replace(/\/+$/, '')
  u = u.replace(/\/(rest|auth|storage|realtime|functions|graphql)\/v1$/i, '').replace(/\/+$/, '')
  if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`
  return u
}

async function fetchSlugs(table = 'projects') {
  const url = normalizeSupabaseUrl(process.env.VITE_SUPABASE_URL)
  const key = (process.env.VITE_SUPABASE_ANON_KEY || '').trim()
  if (!url || !key) return []
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=slug,updated_at&published=eq.true&order=updated_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) { console.warn(`[postbuild] Supabase responded ${res.status} for ${table}; sitemap will skip it`); return [] }
    const rows = await res.json()
    return Array.isArray(rows) ? rows.filter(r => r && typeof r.slug === 'string') : []
  } catch (e) {
    console.warn(`[postbuild] could not fetch ${table} for sitemap:`, e?.message ?? e)
    return []
  }
}

const today = new Date().toISOString().slice(0, 10)
const slugs = await fetchSlugs('projects')
const articleSlugs = await fetchSlugs('articles')

const urls = [
  { loc: siteUrl, lastmod: today, priority: '1.0', changefreq: 'weekly' },
  { loc: `${siteUrl}articles`, lastmod: today, priority: '0.8', changefreq: 'weekly' },
  { loc: `${siteUrl}contact`, lastmod: today, priority: '0.7', changefreq: 'monthly' },
  ...articleSlugs.map(r => ({
    loc: `${siteUrl}articles/${encodeURIComponent(r.slug)}`,
    lastmod: (r.updated_at || today).slice(0, 10),
    priority: '0.7',
    changefreq: 'monthly',
  })),
  ...slugs.map(r => ({
    loc: `${siteUrl}work/${encodeURIComponent(r.slug)}`,
    lastmod: (r.updated_at || today).slice(0, 10),
    priority: '0.8',
    changefreq: 'monthly',
  })),
]

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
writeFileSync(`${dist}/sitemap.xml`, xml)

writeFileSync(`${dist}/robots.txt`, `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}sitemap.xml
`)

console.log(`[postbuild] 404.html, .nojekyll, robots.txt and sitemap.xml (${urls.length} urls) written for ${siteUrl}`)
