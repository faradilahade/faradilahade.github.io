import { Link, NavLink } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { LANGS } from '../lib/translations'

export default function Navbar() {
  const { lang, setLang, t } = useLang()

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `link-underline text-sm ${isActive ? 'text-ink font-medium' : 'text-slate'}`

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-mist">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight">
          Faradilah Ade<span className="text-brass">.</span>
        </Link>

        <nav className="flex items-center gap-7">
          <NavLink to="/work" className={linkCls}>{t('nav.work')}</NavLink>
          <NavLink to="/contact" className={linkCls}>{t('nav.contact')}</NavLink>

          <div className="relative">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
              className="appearance-none bg-transparent border border-mist rounded-full pl-3 pr-7 py-1 text-sm text-slate cursor-pointer hover:border-steel transition-colors"
            >
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate text-xs">▾</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
