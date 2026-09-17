import { supabase, supabaseConfigured, Lang4, LANG4, Translations, I18nInfo } from './supabase'

/**
 * Articles: short posts managed from the admin panel (add / edit / delete).
 * They share the translation shape of projects so the same localisation hooks apply.
 */
export type Article = {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string | null
  cover_url: string | null
  tags: string[]
  external_url: string | null
  published: boolean
  featured: boolean
  published_at: string
  translations: Translations
  source_lang: Lang4
  created_at: string
  updated_at: string
  /** Articles have no "role"; kept so the shared localisation helpers type-check. */
  role: null
  _i18n?: I18nInfo
}

const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : []

function normalizeTranslations(v: unknown): Translations {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
  const out: Translations = {}
  for (const l of LANG4) {
    const t = (v as Record<string, unknown>)[l]
    if (t && typeof t === 'object') {
      const f = t as Record<string, unknown>
      out[l] = {
        title: typeof f.title === 'string' ? f.title : undefined,
        summary: typeof f.summary === 'string' ? f.summary : undefined,
        content: typeof f.content === 'string' ? f.content : undefined,
      }
    }
  }
  return out
}

export function normalizeArticle(raw: Record<string, unknown>): Article {
  const src = String(raw.source_lang ?? 'en').toLowerCase()
  const created = String(raw.created_at ?? new Date().toISOString())
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    slug: String(raw.slug ?? ''),
    summary: (raw.summary as string | null) ?? null,
    content: (raw.content as string | null) ?? null,
    cover_url: (raw.cover_url as string | null) ?? null,
    tags: strArr(raw.tags),
    external_url: (raw.external_url as string | null) ?? null,
    published: Boolean(raw.published),
    featured: Boolean(raw.featured),
    published_at: String(raw.published_at ?? created),
    translations: normalizeTranslations(raw.translations),
    source_lang: (LANG4 as string[]).includes(src) ? (src as Lang4) : 'en',
    created_at: created,
    updated_at: String(raw.updated_at ?? created),
    role: null,
  }
}

/** Featured first, then newest by publish date. */
export function sortArticles(list: Article[]): Article[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  })
}

/** True when the error means the table has not been created yet (schema.sql not run). */
export function isMissingArticlesTable(msg: string | null | undefined): boolean {
  const m = (msg ?? '').toLowerCase()
  return m.includes('articles') && (m.includes('does not exist') || m.includes('could not find') || m.includes('schema cache'))
}

/** Loads every published article. Never throws; an empty list is returned when Supabase is unreachable. */
export async function fetchPublishedArticles(): Promise<{ articles: Article[]; error: string | null }> {
  if (!supabaseConfigured) return { articles: [], error: 'not-configured' }
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
    if (error) return { articles: [], error: error.message }
    return { articles: sortArticles((data ?? []).map(normalizeArticle)), error: null }
  } catch (e) {
    return { articles: [], error: e instanceof Error ? e.message : 'unknown' }
  }
}
