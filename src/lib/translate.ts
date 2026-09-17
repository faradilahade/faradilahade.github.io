/**
 * Free machine translation used in two places:
 *  - the admin editor ("Auto-translate"), whose results are reviewed and stored in the database;
 *  - the public site, as a runtime fallback when a project has no stored translation yet.
 *
 * Providers are tried in order and every result is cached in memory and localStorage,
 * so a visitor's browser asks each provider at most once per text.
 */
import type { Lang4 } from './supabase'
import { site } from './site'

type Provider = {
  name: string
  limit: number // max characters per request
  run: (text: string, from: Lang4, to: Lang4) => Promise<string>
}

const GOOGLE_CODES: Record<Lang4, string> = { en: 'en', id: 'id', ja: 'ja', zh: 'zh-CN' }
const MYMEMORY_CODES: Record<Lang4, string> = { en: 'en', id: 'id', ja: 'ja', zh: 'zh-CN' }

const withTimeout = (ms: number) => (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(ms) : undefined)

const google: Provider = {
  name: 'google',
  limit: 1400,
  async run(text, from, to) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${GOOGLE_CODES[from]}&tl=${GOOGLE_CODES[to]}&q=${encodeURIComponent(text)}`
    const res = await fetch(url, { signal: withTimeout(12_000) })
    if (!res.ok) throw new Error(`google ${res.status}`)
    const json = (await res.json()) as unknown
    const parts = Array.isArray(json) && Array.isArray(json[0]) ? (json[0] as unknown[][]) : null
    if (!parts) throw new Error('google: unexpected response')
    const out = parts.map(p => (Array.isArray(p) && typeof p[0] === 'string' ? p[0] : '')).join('')
    if (!out.trim()) throw new Error('google: empty')
    return out
  },
}

const mymemory: Provider = {
  name: 'mymemory',
  limit: 450,
  async run(text, from, to) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${MYMEMORY_CODES[from]}|${MYMEMORY_CODES[to]}&de=${encodeURIComponent(site.email)}`
    const res = await fetch(url, { signal: withTimeout(12_000) })
    if (!res.ok) throw new Error(`mymemory ${res.status}`)
    const json = (await res.json()) as { responseStatus?: number | string; responseData?: { translatedText?: string } }
    if (String(json.responseStatus) !== '200' || !json.responseData?.translatedText) throw new Error('mymemory: no result')
    const out = json.responseData.translatedText
    if (/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(out)) throw new Error('mymemory: limit')
    return out
  },
}

const PROVIDERS: Provider[] = [google, mymemory]

// ---- cache ----------------------------------------------------------
const mem = new Map<string, string>()
function hash(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(36)
}
const cacheKey = (text: string, from: Lang4, to: Lang4) => `tr1:${from}:${to}:${hash(text)}:${text.length}`
function cacheGet(k: string): string | null {
  if (mem.has(k)) return mem.get(k)!
  try { const v = localStorage.getItem(k); if (v) { mem.set(k, v); return v } } catch { /* blocked */ }
  return null
}
function cacheSet(k: string, v: string) {
  mem.set(k, v)
  try { localStorage.setItem(k, v) } catch { /* full or blocked */ }
}

// ---- chunking -------------------------------------------------------
/** Splits a paragraph into sentence-ish pieces no longer than `limit` characters. */
function chunk(text: string, limit: number): string[] {
  if (text.length <= limit) return [text]
  const sentences = text.split(/(?<=[.!?。！？])\s+/u)
  const out: string[] = []
  let cur = ''
  for (const s of sentences) {
    if (s.length > limit) {
      if (cur) { out.push(cur); cur = '' }
      for (let i = 0; i < s.length; i += limit) out.push(s.slice(i, i + limit))
      continue
    }
    if ((cur + ' ' + s).trim().length > limit) { out.push(cur.trim()); cur = s }
    else cur = (cur ? cur + ' ' : '') + s
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

async function translateViaProviders(text: string, from: Lang4, to: Lang4): Promise<string> {
  let lastErr: unknown = null
  for (const p of PROVIDERS) {
    try {
      const pieces = chunk(text, p.limit)
      const results: string[] = []
      for (const piece of pieces) results.push(await p.run(piece, from, to))
      return results.join(' ')
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('translation failed')
}

/** Translates a single-line text (title, summary sentence, role). Cached. */
export async function translateText(text: string, from: Lang4, to: Lang4): Promise<string> {
  const src = text.trim()
  if (!src || from === to) return text
  const k = cacheKey(src, from, to)
  const hit = cacheGet(k)
  if (hit) return hit
  const out = (await translateViaProviders(src, from, to)).trim()
  cacheSet(k, out)
  return out
}

/**
 * Translates multi-line case-study text line by line, preserving the light markup the
 * renderer understands ("## " headings, "- " bullets, "> " quotes, numbered lists, blank lines).
 */
export async function translateLines(
  text: string, from: Lang4, to: Lang4, onProgress?: (done: number, total: number) => void,
): Promise<string> {
  if (!text.trim() || from === to) return text
  const lines = text.split(/\r?\n/)
  const out: string[] = []
  const total = lines.filter(l => l.trim()).length
  let done = 0
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { out.push(''); continue }
    const m = line.match(/^(#{1,3}\s+|[-•*]\s+|>\s+|\d+[.)]\s+)(.*)$/)
    const prefix = m ? m[1] : ''
    const body = m ? m[2] : line
    const translated = body.trim() ? await translateText(body, from, to) : body
    out.push(prefix + translated)
    done++
    onProgress?.(done, total)
  }
  return out.join('\n')
}

export type FieldSet = { title: string; summary: string | null; content: string | null; role: string | null }

/** Translates every translatable field of a project. Errors bubble up so the caller can report them. */
export async function translateFields(
  fields: FieldSet, from: Lang4, to: Lang4, onProgress?: (label: string, done: number, total: number) => void,
): Promise<{ title: string; summary?: string; content?: string; role?: string }> {
  const title = await translateText(fields.title, from, to)
  onProgress?.('title', 1, 1)
  const summary = fields.summary?.trim() ? await translateLines(fields.summary, from, to) : undefined
  onProgress?.('summary', 1, 1)
  const role = fields.role?.trim() ? await translateText(fields.role, from, to) : undefined
  onProgress?.('role', 1, 1)
  const content = fields.content?.trim()
    ? await translateLines(fields.content, from, to, (d, tot) => onProgress?.('content', d, tot))
    : undefined
  return { title, summary, content, role }
}

/** Small helper to run async jobs with limited concurrency (used for runtime card translation). */
export function createQueue(concurrency = 2) {
  let active = 0
  const waiting: (() => void)[] = []
  const next = () => { active--; waiting.shift()?.() }
  return async function run<T>(job: () => Promise<T>): Promise<T> {
    if (active >= concurrency) await new Promise<void>(r => waiting.push(r))
    active++
    try { return await job() } finally { next() }
  }
}
