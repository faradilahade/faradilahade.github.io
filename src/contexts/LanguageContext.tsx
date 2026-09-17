import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react'
import { Lang, LANGS, dictionaries } from '../lib/translations'

type Ctx = {
  lang: Lang
  locale: string
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<Ctx | null>(null)

const VALID: Lang[] = ['en', 'id', 'ja', 'zh']

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved && VALID.includes(saved)) return saved
  } catch { /* storage may be blocked */ }
  const nav = (navigator.language || 'en').toLowerCase()
  if (nav.startsWith('id')) return 'id'
  if (nav.startsWith('ja')) return 'ja'
  if (nav.startsWith('zh')) return 'zh'
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (typeof window === 'undefined' ? 'en' : detectLang()))

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch { /* ignore */ }
  }, [])

  const t = useCallback(
    (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key,
    [lang],
  )

  const value = useMemo<Ctx>(() => ({
    lang,
    locale: LANGS.find(l => l.code === lang)?.locale ?? 'en-US',
    setLang,
    t,
  }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
