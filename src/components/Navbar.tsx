import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { LANGS } from '../lib/translations'
import { site, mailto } from '../lib/site'
import { IconMail, IconMenu, IconClose, IconPhone, IconGrid } from './Icons'

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])

  const navCls = 'text-[11px] font-semibold uppercase tracking-[.14em] text-slate hover:text-ink transition-colors link-underline'

  return (
    <header className="sticky top-0 z-40 bg-paper/70 backdrop-blur-xl border-b border-ink/[.06]">
      <div className="max-w-site mx-auto px-gutter h-14 flex items-stretch justify-between gap-4">
        <div className="flex items-stretch gap-5 lg:gap-7 min-w-0">
          <Link to="/" className="self-center font-bold uppercase tracking-tight text-fl-base whitespace-nowrap" aria-label={`${site.name} — home`}>
            {site.name}<span className="text-ocean">.</span>
          </Link>

          <Link
            to="/#work"
            className="hidden sm:inline-flex items-center gap-2 -my-px bg-ink text-paper px-4 text-[11px] font-semibold uppercase tracking-[.14em] hover:bg-steel transition-colors duration-300"
          >
            <IconGrid size={14} /> {t('nav.work')}
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            <Link to="/#articles" className={navCls}>{t('nav.articles')}</Link>
            <Link to="/#about" className={navCls}>{t('nav.about')}</Link>
            <Link to="/#faq" className={navCls}>{t('nav.faq')}</Link>
            <Link to="/#call" className={navCls}>{t('nav.call')}</Link>
            <NavLink to="/contact" className={({ isActive }) => `${navCls} ${isActive ? 'text-ink' : ''}`}>{t('nav.contact')}</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <a href={site.whatsapp} target="_blank" rel="noreferrer" className="hidden xl:inline-flex items-center gap-2 text-[12px] font-medium text-ink tabular-nums">
            <IconPhone size={15} className="text-steel" /> {site.phoneDisplay}
          </a>

          <div className="relative">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
              className="appearance-none bg-transparent border border-line rounded-sm pl-2.5 pr-6 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-slate cursor-pointer hover:border-steel hover:text-ink transition-colors"
            >
              {LANGS.map(l => <option key={l.code} value={l.code}>{l.short}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-fog">▾</span>
          </div>

          <a
            href={mailto()}
            aria-label={`Email ${site.email}`}
            className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-steel transition-colors duration-300"
          >
            <IconMail size={16} />
          </a>

          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-label={t('nav.menu')}
            className="md:hidden w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:border-steel transition-colors"
          >
            {open ? <IconClose size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-smooth ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <nav className="border-t border-line bg-paper px-gutter py-4 grid gap-1 text-[12px] font-semibold uppercase tracking-[.14em]" aria-label="Mobile">
            <Link to="/#work" className="flex items-center justify-between py-2.5 border-b border-line text-steel">{t('nav.work')} <IconGrid size={15} /></Link>
            <Link to="/#articles" className="py-2.5 border-b border-line text-ink">{t('nav.articles')}</Link>
            <Link to="/#about" className="py-2.5 border-b border-line text-ink">{t('nav.about')}</Link>
            <Link to="/#faq" className="py-2.5 border-b border-line text-ink">{t('nav.faq')}</Link>
            <Link to="/#call" className="py-2.5 border-b border-line text-ink">{t('nav.call')}</Link>
            <Link to="/contact" className="py-2.5 border-b border-line text-ink">{t('nav.contact')}</Link>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2.5 text-slate normal-case tracking-normal font-medium">
              <IconPhone size={15} className="text-steel" /> {site.phoneDisplay}
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
