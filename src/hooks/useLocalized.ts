import { useEffect, useMemo, useRef, useState } from 'react'
import { Project, Lang4, TranslatedFields, localizeProject } from '../lib/supabase'
import { translateText, translateLines, createQueue } from '../lib/translate'
import { useLang } from '../contexts/LanguageContext'
import { site } from '../lib/site'

const queue = createQueue(2)

/**
 * Returns the projects in the visitor's language.
 * Stored translations are applied instantly; for projects without one, title/summary/role are
 * machine-translated in the background (when site.autoTranslate is on) and swapped in when ready.
 */
export function useLocalizedProjects(projects: Project[]): Project[] {
  const { lang } = useLang()
  const target = lang as Lang4
  const [auto, setAuto] = useState<Record<string, TranslatedFields>>({})
  const inflight = useRef(new Set<string>())

  useEffect(() => {
    if (!site.autoTranslate) return
    let cancelled = false
    const pending = projects.filter(p => p.source_lang !== target && !p.translations[target]?.title?.trim())
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
  }, [projects, target])

  return useMemo(
    () => projects.map(p => localizeProject(p, target, auto[`${p.id}:${target}`])),
    [projects, target, auto],
  )
}

/**
 * For the modal: translates the long-form content of a project at runtime when no stored
 * translation exists. Returns the content to show plus a "translating" flag.
 */
export function useLocalizedContent(project: Project | null): { content: string | null; translating: boolean } {
  const { lang } = useLang()
  const target = lang as Lang4
  const [state, setState] = useState<{ key: string; content: string } | null>(null)
  const [translating, setTranslating] = useState(false)

  const needs = Boolean(
    project && site.autoTranslate && project._i18n && project._i18n.mode !== 'stored'
    && project.source_lang !== target && project._i18n.original.content?.trim(),
  )
  const key = project ? `${project.id}:${project.updated_at}:${target}` : ''

  useEffect(() => {
    if (!project || !needs) return
    if (state?.key === key) return
    let cancelled = false
    setTranslating(true)
    translateLines(project._i18n!.original.content!, project.source_lang, target)
      .then(c => { if (!cancelled) setState({ key, content: c }) })
      .catch(() => { /* fall back to original */ })
      .finally(() => { if (!cancelled) setTranslating(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, needs])

  if (!project) return { content: null, translating: false }
  if (!needs) return { content: project.content, translating: false }
  return { content: state?.key === key ? state.content : project.content, translating: translating && state?.key !== key }
}
