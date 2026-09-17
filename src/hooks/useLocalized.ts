import { useEffect, useMemo, useRef, useState } from 'react'
import { Lang4, TranslatedFields, Translations, I18nInfo } from '../lib/supabase'
import { translateText, translateLines, createQueue } from '../lib/translate'
import { useLang } from '../contexts/LanguageContext'
import { site } from '../lib/site'

const queue = createQueue(2)

/** Anything with translatable text: projects and articles both satisfy this. */
export type Localizable = {
  id: string
  title: string
  summary: string | null
  content: string | null
  role: string | null
  source_lang: Lang4
  translations: Translations
  updated_at: string
  _i18n?: I18nInfo
}

/**
 * Returns a copy of the item in the requested language.
 * Stored (admin-reviewed) translations win; otherwise machine-translated fields passed in
 * `auto` are used; otherwise the original text is kept and mode stays "original".
 */
export function localizeItem<T extends Localizable>(p: T, lang: Lang4, auto?: TranslatedFields): T {
  const original = { title: p.title, summary: p.summary, content: p.content, role: p.role }
  if (lang === p.source_lang) return { ...p, _i18n: { lang, mode: 'original', original } }
  const stored = p.translations[lang]
  if (stored?.title?.trim()) {
    return {
      ...p,
      title: stored.title,
      summary: stored.summary?.trim() ? stored.summary : p.summary,
      content: stored.content?.trim() ? stored.content : p.content,
      role: stored.role?.trim() ? stored.role : p.role,
      _i18n: { lang, mode: 'stored', original },
    }
  }
  if (auto?.title?.trim()) {
    return {
      ...p,
      title: auto.title,
      summary: auto.summary?.trim() ? auto.summary : p.summary,
      content: auto.content?.trim() ? auto.content : p.content,
      role: auto.role?.trim() ? auto.role : p.role,
      _i18n: { lang, mode: 'auto', original },
    }
  }
  return { ...p, _i18n: { lang, mode: 'original', original } }
}

/**
 * Returns the list in the visitor's language.
 * Stored translations are applied instantly; for items without one, title/summary/role are
 * machine-translated in the background (when site.autoTranslate is on) and swapped in when ready.
 */
export function useLocalizedList<T extends Localizable>(items: T[]): T[] {
  const { lang } = useLang()
  const target = lang as Lang4
  const [auto, setAuto] = useState<Record<string, TranslatedFields>>({})
  const inflight = useRef(new Set<string>())

  useEffect(() => {
    if (!site.autoTranslate) return
    let cancelled = false
    const pending = items.filter(p => p.source_lang !== target && !p.translations[target]?.title?.trim())
    pending.forEach(p => {
      const key = `${p.id}:${target}`
      if (auto[key] || inflight.current.has(key)) return
      inflight.current.add(key)
      queue(async () => {
        try {
          const [title, summary, role] = await Promise.all([
            translateText(p.title, p.source_lang, target),
            p.summary?.trim() ? translateLines(p.summary, p.source_lang, target) : Promise.resolve(undefined),
            p.role?.trim() ? translateText(p.role, p.source_lang, target) : Promise.resolve(undefined),
          ])
          if (!cancelled) setAuto(prev => ({ ...prev, [key]: { title, summary, role } }))
        } catch {
          /* keep the original text */
        } finally {
          inflight.current.delete(key)
        }
      })
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, target])

  return useMemo(
    () => items.map(p => localizeItem(p, target, auto[`${p.id}:${target}`])),
    [items, target, auto],
  )
}

export const useLocalizedProjects = useLocalizedList
export const useLocalizedArticles = useLocalizedList

/**
 * For the reading modals: translates the long-form content at runtime when no stored
 * translation exists. Returns the content to show plus a "translating" flag.
 */
export function useLocalizedContent(item: Localizable | null): { content: string | null; translating: boolean } {
  const { lang } = useLang()
  const target = lang as Lang4
  const [state, setState] = useState<{ key: string; content: string } | null>(null)
  const [translating, setTranslating] = useState(false)

  const needs = Boolean(
    item && site.autoTranslate && item._i18n && item._i18n.mode !== 'stored'
    && item.source_lang !== target && item._i18n.original.content?.trim(),
  )
  const key = item ? `${item.id}:${item.updated_at}:${target}` : ''

  useEffect(() => {
    if (!item || !needs) return
    if (state?.key === key) return
    let cancelled = false
    setTranslating(true)
    translateLines(item._i18n!.original.content!, item.source_lang, target)
      .then(c => { if (!cancelled) setState({ key, content: c }) })
      .catch(() => { /* fall back to original */ })
      .finally(() => { if (!cancelled) setTranslating(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, needs])

  if (!item) return { content: null, translating: false }
  if (!needs) return { content: item.content, translating: false }
  return { content: state?.key === key ? state.content : item.content, translating: translating && state?.key !== key }
}
