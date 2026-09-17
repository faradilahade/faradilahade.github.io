import { createClient } from '@supabase/supabase-js'

/**
 * Accepts the project URL in any of the forms people tend to paste:
 *   https://xxxx.supabase.co
 *   https://xxxx.supabase.co/
 *   https://xxxx.supabase.co/rest/v1/     <- caused "Invalid path specified in request URL"
 *   xxxx.supabase.co
 * and returns the bare project URL the client expects.
 */
export function normalizeSupabaseUrl(raw?: string): string {
  if (!raw) return ''
  let u = raw.trim().replace(/\/+$/, '')
  u = u.replace(/\/(rest|auth|storage|realtime|functions|graphql)\/v1$/i, '')
  u = u.replace(/\/+$/, '')
  if (u && !/^https?:\/\//i.test(u)) u = `https://${u}`
  return u
}

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined)
const anon = ((import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? '').trim()

/** False when the build has no Supabase credentials: pages still render, admin explains what to do. */
export const supabaseConfigured = Boolean(url && anon)

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anon || 'missing-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true } },
)

export type Category = 'data' | 'finance' | 'risk'
export const CATEGORIES: Category[] = ['data', 'finance', 'risk']

export type Lang4 = 'en' | 'id' | 'ja' | 'zh'
export const LANG4: Lang4[] = ['en', 'id', 'ja', 'zh']

export type Attachment = { name: string; url: string }

/** Fields that can be translated per project. Proper nouns (client, tools) stay as written. */
export type TranslatedFields = { title?: string; summary?: string; content?: string; role?: string }
export type Translations = Partial<Record<Lang4, TranslatedFields>>

export type I18nInfo = {
  lang: Lang4
  /** original = shown in its source language; stored = admin-reviewed translation; auto = machine translated at runtime */
  mode: 'original' | 'stored' | 'auto'
  original: { title: string; summary: string | null; content: string | null; role: string | null }
}

export type Project = {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string | null
  category: Category
  tags: string[]
  tools: string[]
  keywords: string[]
  gallery: string[]
  year: number | null
  role: string | null
  client: string | null
  external_url: string | null
  embed_url: string | null
  sort_order: number
  cover_url: string | null
  attachments: Attachment[]
  published: boolean
  featured: boolean
  translations: Translations
  source_lang: Lang4
  created_at: string
  updated_at: string
  /** Present on copies produced by localizeItem() (hooks/useLocalized) */
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
        role: typeof f.role === 'string' ? f.role : undefined,
      }
    }
  }
  return out
}

/** Fills in defaults so rows from an older schema (missing the new columns) still render. */
export function normalizeProject(raw: Record<string, unknown>): Project {
  const cat = String(raw.category ?? 'data').toLowerCase()
  const src = String(raw.source_lang ?? 'en').toLowerCase()
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    slug: String(raw.slug ?? ''),
    summary: (raw.summary as string | null) ?? null,
    content: (raw.content as string | null) ?? null,
    category: (CATEGORIES as string[]).includes(cat) ? (cat as Category) : 'data',
    tags: strArr(raw.tags),
    tools: strArr(raw.tools),
    keywords: strArr(raw.keywords),
    gallery: strArr(raw.gallery),
    year: typeof raw.year === 'number' ? raw.year : raw.year ? Number(raw.year) || null : null,
    role: (raw.role as string | null) ?? null,
    client: (raw.client as string | null) ?? null,
    external_url: (raw.external_url as string | null) ?? null,
    embed_url: (raw.embed_url as string | null) ?? null,
    sort_order: typeof raw.sort_order === 'number' ? raw.sort_order : 0,
    cover_url: (raw.cover_url as string | null) ?? null,
    attachments: Array.isArray(raw.attachments) ? (raw.attachments as Attachment[]) : [],
    published: Boolean(raw.published),
    featured: Boolean(raw.featured),
    translations: normalizeTranslations(raw.translations),
    source_lang: (LANG4 as string[]).includes(src) ? (src as Lang4) : 'en',
    created_at: String(raw.created_at ?? new Date().toISOString()),
    updated_at: String(raw.updated_at ?? raw.created_at ?? new Date().toISOString()),
  }
}

/** Featured first, then manual order, then newest. Done in JS so older schemas never break the query. */
export function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

/** Loads every published project. Returns [] (never throws) when Supabase is unreachable. */
export async function fetchPublishedProjects(): Promise<{ projects: Project[]; error: string | null }> {
  if (!supabaseConfigured) return { projects: [], error: 'not-configured' }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) return { projects: [], error: error.message }
    return { projects: sortProjects((data ?? []).map(normalizeProject)), error: null }
  } catch (e) {
    return { projects: [], error: e instanceof Error ? e.message : 'unknown' }
  }
}

/** Image attachments are shown in the gallery too. */
export function isImageUrl(u: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(u)
}
