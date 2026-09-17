/**
 * Single place for everything about the person and the site itself.
 * Edit here: every page, the footer, SEO tags and the contact buttons read from it.
 */
export const site = {
  name: 'Faradilah Ade',
  firstName: 'Faradilah',
  handle: 'faradilahade',
  email: 'pmb.faradilahade@gmail.com',
  phoneDisplay: '+62 8511 7575 990',
  whatsapp: 'https://wa.me/6285117575990',
  location: 'Jakarta, Indonesia',
  timezone: 'GMT+7',
  // Canonical production URL (user site). Runtime code also derives the live origin.
  url: 'https://faradilahade.github.io',
  avatar: 'avatar.jpg', // drop a square photo at public/avatar.jpg: falls back to a monogram
  ogImage: 'og.png',

  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/faradilahade', key: 'linkedin' },
    { label: 'Behance', href: 'https://www.behance.net/faradilahade', key: 'behance' },
    { label: 'anakaktuaria.org', href: 'https://anakaktuaria.org', key: 'web' },
    { label: 'Instagram', href: 'https://www.instagram.com/anakaktuaria.id', key: 'instagram' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@anakaktuaria.id', key: 'tiktok' },
    { label: 'YouTube', href: 'https://www.youtube.com/@KomunitasAnakAktuariaIndonesia', key: 'youtube' },
  ],

  /**
   * Admin sign-in accepts a username. A bare username is mapped to
   * `<username>@<adminEmailDomain>`: create that user once in Supabase → Authentication.
   * e.g. username "admin-fara" → admin-fara@faradilahade.github.io
   */
  adminEmailDomain: 'faradilahade.github.io',

  /**
   * Machine-translate project text into the visitor's language when no reviewed
   * translation is stored (free Google / MyMemory endpoints, cached in the browser).
   */
  autoTranslate: true,

  // Search terms the site should rank for: used in meta keywords and JSON-LD "knowsAbout"
  keywords: [
    'Faradilah Ade', 'actuarial data scientist', 'actuary Indonesia', 'data scientist Jakarta',
    'financial analytics', 'risk modelling', 'IFRS 17', 'insurance reserving', 'stress testing',
    'Tweedie GLM', 'forecasting', 'Python', 'SQL', 'Airflow', 'dbt', 'Google Cloud',
    'data engineering portfolio', 'actuarial consulting', 'Anak Aktuaria', 'World Bank data project',
  ],

  organizations: [
    'World Bank', 'Asian Development Bank', 'Zurich Topas Life', 'Indonesia Re',
    'Ministry of Public Works and Housing', 'Anak Aktuaria',
  ],
} as const

export type SiteLinkKey = typeof site.links[number]['key']

/** Live origin + base path: correct on localhost, project pages and the root user site. */
export function siteOrigin(): string {
  if (typeof window === 'undefined') return site.url + '/'
  const base = import.meta.env.BASE_URL || '/'
  return window.location.origin + (base.endsWith('/') ? base : base + '/')
}

export function absoluteUrl(path = ''): string {
  return siteOrigin() + path.replace(/^\/+/, '')
}

/** Builds a mailto: link with a prefilled subject and body. */
export function mailto(subject = '', body = ''): string {
  const q = new URLSearchParams()
  if (subject) q.set('subject', subject)
  if (body) q.set('body', body)
  const qs = q.toString().replace(/\+/g, '%20')
  return `mailto:${site.email}${qs ? `?${qs}` : ''}`
}

/** Public asset URL that respects the Vite base path (e.g. "/repo/" on project pages). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '')
}
