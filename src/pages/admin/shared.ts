import { supabase, Project, Category, Attachment, Lang4, Translations } from '../../lib/supabase'

export type Draft = {
  id?: string
  title: string
  slug: string
  summary: string
  content: string
  category: Category
  tags: string
  tools: string
  keywords: string
  year: string
  role: string
  client: string
  external_url: string
  embed_url: string
  sort_order: string
  cover_url: string
  gallery: string[]
  attachments: Attachment[]
  published: boolean
  featured: boolean
  translations: Translations
  source_lang: Lang4
  created_at?: string
  updated_at?: string
}

export const emptyDraft: Draft = {
  title: '', slug: '', summary: '', content: '', category: 'data',
  tags: '', tools: '', keywords: '', year: '', role: '', client: '',
  external_url: '', embed_url: '', sort_order: '0', cover_url: '',
  gallery: [], attachments: [], published: false, featured: false,
  translations: {}, source_lang: 'en',
}

export const LANG_LABEL: Record<Lang4, string> = { en: 'English', id: 'Indonesia', ja: '日本語', zh: '中文' }

export function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export const splitList = (s: string) => Array.from(new Set(s.split(/[,\n;]/).map(x => x.trim()).filter(Boolean)))

/** Accepts a pasted <iframe …> snippet or a plain URL and returns the embed src. */
export function parseEmbed(input: string): string {
  const m = input.match(/src=["']([^"']+)["']/i)
  return (m ? m[1] : input).trim()
}

export function hint(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('column') && m.includes('does not exist')) {
    return `${msg} — run supabase/schema.sql again in the Supabase SQL Editor (it adds the new columns and is safe to re-run).`
  }
  if (m.includes('row-level security') || m.includes('permission denied')) {
    return `${msg} — your session may have expired. Sign out and in again, and make sure the policies from supabase/schema.sql are applied.`
  }
  if (m.includes('duplicate key') && m.includes('slug')) return 'That slug is already used by another project. Change the slug.'
  if (m.includes('bucket not found')) return 'Storage bucket "portfolio" is missing. Run supabase/schema.sql again (it creates the bucket).'
  return msg
}

export function draftFromProject(p: Project): Draft {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary ?? '',
    content: p.content ?? '',
    category: p.category,
    tags: p.tags.join(', '),
    tools: p.tools.join(', '),
    keywords: p.keywords.join(', '),
    year: p.year ? String(p.year) : '',
    role: p.role ?? '',
    client: p.client ?? '',
    external_url: p.external_url ?? '',
    embed_url: p.embed_url ?? '',
    sort_order: String(p.sort_order ?? 0),
    cover_url: p.cover_url ?? '',
    gallery: p.gallery,
    attachments: p.attachments,
    published: p.published,
    featured: p.featured,
    translations: p.translations ?? {},
    source_lang: p.source_lang ?? 'en',
    created_at: p.created_at,
    updated_at: p.updated_at,
  }
}

/** Drops empty translation objects so the JSON stays tidy. */
function cleanTranslations(tr: Translations): Translations {
  const out: Translations = {}
  ;(Object.keys(tr) as Lang4[]).forEach(l => {
    const f = tr[l]
    if (!f) return
    const kept = {
      title: f.title?.trim() || undefined,
      summary: f.summary?.trim() || undefined,
      content: f.content?.trim() || undefined,
      role: f.role?.trim() || undefined,
    }
    if (kept.title || kept.summary || kept.content || kept.role) out[l] = kept
  })
  return out
}

export function payloadFromDraft(d: Draft) {
  const yearNum = d.year.trim() ? Number(d.year) : null
  return {
    title: d.title.trim(),
    slug: slugify(d.slug || d.title),
    summary: d.summary.trim() || null,
    content: d.content.trim() || null,
    category: d.category,
    tags: splitList(d.tags),
    tools: splitList(d.tools),
    keywords: splitList(d.keywords),
    year: yearNum && Number.isFinite(yearNum) ? yearNum : null,
    role: d.role.trim() || null,
    client: d.client.trim() || null,
    external_url: d.external_url.trim() || null,
    embed_url: d.embed_url ? parseEmbed(d.embed_url) : null,
    sort_order: Number(d.sort_order) || 0,
    cover_url: d.cover_url || null,
    gallery: d.gallery,
    attachments: d.attachments,
    published: d.published,
    featured: d.featured,
    translations: cleanTranslations(d.translations),
    source_lang: d.source_lang,
  }
}

export async function uploadFile(file: File, folder: string): Promise<{ url: string } | { error: string }> {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('portfolio').upload(path, file, { cacheControl: '31536000', upsert: false })
  if (error) return { error: hint(`Upload failed: ${error.message}`) }
  const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
  return { url: data.publicUrl }
}

// ---- local autosave (so a closed tab never loses a half-written case study) ----
export const localDraftKey = (id?: string) => `admin:draft:${id ?? 'new'}`
export function saveLocalDraft(d: Draft) {
  try { localStorage.setItem(localDraftKey(d.id), JSON.stringify({ at: Date.now(), draft: d })) } catch { /* ignore */ }
}
export function loadLocalDraft(id?: string): { at: number; draft: Draft } | null {
  try {
    const raw = localStorage.getItem(localDraftKey(id))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; draft: Draft }
    return parsed && parsed.draft ? parsed : null
  } catch { return null }
}
export function clearLocalDraft(id?: string) {
  try { localStorage.removeItem(localDraftKey(id)) } catch { /* ignore */ }
}

export function formatDate(iso?: string, locale = 'en-GB') {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Which languages have a stored translation (title present). */
export function translatedLangs(p: { translations: Translations; source_lang: Lang4 }): Lang4[] {
  return (Object.keys(p.translations ?? {}) as Lang4[]).filter(l => l !== p.source_lang && p.translations[l]?.title?.trim())
}
