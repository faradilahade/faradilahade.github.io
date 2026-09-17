import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Lang, dictionaries } from '../lib/translations'

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<Ctx | null>(null)

function detectLang(): Lang {
  const saved = localStorage.getItem('lang') as Lang | null
  if (saved && ['en', 'id', 'ja', 'zh'].includes(saved)) return saved
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith('id')) return 'id'
  if (nav.startsWith('ja')) return 'ja'
  if (nav.startsWith('zh')) return 'zh'
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => { setLangState(detectLang()) }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l
  }

  const t = (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
