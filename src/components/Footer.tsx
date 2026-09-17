import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { site } from '../lib/site'

export default function Footer() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const year = new Date().getFullYear()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <footer className={`border-t ${isAdmin ? 'border-mist bg-paper text-slate' : 'border-paper/10 bg-night text-fog'}`}>
      <div className="max-w-site mx-auto px-gutter py-10 md:py-12 grid gap-8 md:grid-cols-[1.2fr_2fr_1fr] items-start text-fl-sm">
        <div>
          <p className={`font-display text-fl-lg ${isAdmin ? 'text-ink' : 'text-paper'}`}>
            {site.name}<span className="text-brass">.</span>
          </p>
          <p className="mt-1.5 max-w-xs leading-relaxed">{t('footer.tagline')}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2.5">
          <a className="link-underline" href={`mailto:${site.email}`}>{site.email}</a>
          {site.links.map(l => (
            <a key={l.key} className="link-underline" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </nav>

        <div className="md:text-right space-y-1.5">
          <p>© {year} {site.name} · {t('footer.rights')}</p>
          <p className="text-fl-xs opacity-60">
            {site.location} · {site.timezone} · <Link to="/admin" className="link-underline">{t('nav.admin')}</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
