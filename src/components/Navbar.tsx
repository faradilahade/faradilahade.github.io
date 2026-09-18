import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { LANGS } from '../lib/translations'
import { site, mailto } from '../lib/site'
import { IconMail, IconMenu, IconClose, IconPhone, IconGrid, IconLanguage, IconChevronDown } from './Icons'

/** Language switcher: the button shows each language in its own script; the list explains, in that language, that the site can be read in it. */
function LanguageMenu() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANGS.find(l => l.code === lang) ?? LANGS[0]

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        aria-label={`${t('nav.language')}: ${current.native}`} title={current.hint}
        className="inline-flex items-center gap-1.5 h-9 pl-3 pr-2.5 rounded-full ring-1 ring-ink/10 bg-white/60 text-[11px] font-semibold tracking-[.08em] text-slate hover:ring-steel hover:text-ink transition-colors duration-300"
      >
        <IconLanguage size={14} className="text-steel" />
        <span lang={current.code}>{current.short}</span>
        <IconChevronDown size={12} className={`text-fog transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        role="listbox" aria-label={t('nav.language')}
        className={`absolute right-0 top-full mt-2 w-72 glass p-1.5 z-50 origin-top-right transition-all duration-300 ease-smooth ${open ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
      >
        {LANGS.map(l => {
          const on = l.code === lang
          return (
            <button
              key={l.code} type="button" role="option" aria-selected={on} lang={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors duration-300 ${on ? 'bg-ink text-paper' : 'text-ink hover:bg-white/90'}`}
            >
              <span className={`mt-0.5 min-w-[3.2rem] text-[11px] font-semibold tracking-[.08em] ${on ? 'text-paper/70' : 'text-steel'}`}>{l.short}</span>
              <span className="min-w-0">
                <span className="block text-fl-sm font-semibold leading-tight">{l.native}</span>
                <span className={`block mt-0.5 text-[11px] leading-snug ${on ? 'text-paper/70' : 'text-slate'}`}>{l.hint}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Navbar() {
  const { lang, setLang, t } = useLang()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])

  const navCls = 'btn-text text-slate hover:text-ink transition-colors link-underline'

  return (
    <header className="sticky top-0 z-40 bg-paper/70 backdrop-blur-xl border-b border-ink/[.06]">
      <div className="max-w-site mx-auto px-gutter h-14 flex items-stretch justify-between gap-4">
        <div className="flex items-stretch gap-5 lg:gap-7 min-w-0">
          <Link to="/" className="self-center font-bold uppercase tracking-tight text-fl-base whitespace-nowrap" aria-label={`${site.name}: home`}>
            {site.name}<span className="text-ocean">.</span>
          </Link>

          <Link
            to="/#work"
            className="hidden sm:inline-flex items-center gap-2 -my-px bg-ink text-paper px-4 btn-text hover:bg-steel transition-colors duration-300"
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

          <LanguageMenu />

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
          <nav className="border-t border-line bg-paper px-gutter py-4 grid gap-1 btn-text" aria-label="Mobile">
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
