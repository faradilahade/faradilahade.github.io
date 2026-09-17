import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { LANGS } from '../lib/translations'
import { site, mailto } from '../lib/site'
import { IconMail } from './Icons'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `link-underline text-fl-sm transition-colors ${
      isActive
        ? (isAdmin ? 'text-ink font-medium' : 'text-paper font-medium')
        : (isAdmin ? 'text-slate hover:text-ink' : 'text-fog hover:text-paper')
    }`

  const shell = isAdmin
    ? 'bg-paper/90 border-mist text-ink'
    : 'bg-night/80 border-paper/10 text-paper'

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${shell} transition-colors`}>
      <div className="max-w-site mx-auto px-gutter h-14 md:h-16 flex items-center justify-between gap-3">
        <Link to="/" className="font-display text-fl-lg tracking-tight whitespace-nowrap" aria-label={`${site.name} — home`}>
          {site.name}<span className="text-brass">.</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8" aria-label="Primary">
          <NavLink to="/" end className={linkCls}>{t('nav.work')}</NavLink>
          <NavLink to="/contact" className={linkCls}>{t('nav.contact')}</NavLink>

          <a
            href={mailto()}
            className={`hidden sm:inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-fl-xs font-medium transition-all duration-300 ease-smooth ${
              isAdmin ? 'bg-ink text-paper hover:bg-steel' : 'bg-paper/10 text-paper hover:bg-brass hover:text-night'
            }`}
            aria-label={`Email ${site.email}`}
          >
            <IconMail size={15} /> {t('profile.emailMe')}
          </a>

          <div className="relative">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
              className={`appearance-none bg-transparent border rounded-full pl-3 pr-7 py-1 text-fl-xs cursor-pointer transition-colors ${
                isAdmin ? 'border-mist text-slate hover:border-steel' : 'border-paper/20 text-fog hover:border-tide hover:text-paper'
              }`}
            >
              {LANGS.map(l => (
                <option key={l.code} value={l.code} className="text-ink">{l.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] opacity-70">▾</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
