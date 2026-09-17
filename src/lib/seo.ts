import { useEffect } from 'react'
import { site, absoluteUrl, asset } from './site'

type SeoInput = {
  title: string
  description: string
  /** Path relative to the site root, e.g. "work/my-project" */
  path?: string
  type?: 'website' | 'article' | 'profile'
  image?: string | null
  keywords?: string[]
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Keeps <head> in sync with the current page: title, description, canonical,
 * Open Graph / Twitter cards and a JSON-LD block. No extra dependency needed.
 */
export function useSeo(input: SeoInput) {
  const {
    title, description, path = '', type = 'website', image, keywords, jsonLd, noindex,
  } = input

  useEffect(() => {
    const url = absoluteUrl(path)
    const img = image || absoluteUrl(asset(site.ogImage).replace(/^\//, ''))
    const fullTitle = title.includes(site.name) ? title : `${title} — ${site.name}`

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    if (keywords?.length) upsertMeta('name', 'keywords', Array.from(new Set(keywords)).join(', '))
    upsertLink('canonical', url)

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', img)
    upsertMeta('property', 'og:site_name', site.name)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', img)

    const id = 'ld-page'
    let script = document.getElementById(id) as HTMLScriptElement | null
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = id
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else if (script) {
      script.remove()
    }
    // Serialise object/array inputs so a new reference with equal content does not re-run the effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, type, image, noindex, JSON.stringify(jsonLd ?? null), (keywords ?? []).join('|')])
}

/** Person schema shared by the profile and contact pages. */
export function personJsonLd(lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: absoluteUrl(''),
    image: absoluteUrl(asset(site.avatar).replace(/^\//, '')),
    email: `mailto:${site.email}`,
    jobTitle: 'Actuarial Data Scientist',
    description:
      'Actuarial data scientist building data pipelines, financial models and risk frameworks for finance, insurance and public-sector institutions.',
    address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
    knowsLanguage: ['en', 'id', 'ja', 'zh'],
    inLanguage: lang,
    knowsAbout: [...site.keywords],
    sameAs: site.links.map(l => l.href),
    worksFor: { '@type': 'Organization', name: 'Anak Aktuaria', url: 'https://anakaktuaria.org' },
  }
}
