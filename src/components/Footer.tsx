import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { site } from '../lib/site'
import { CATEGORIES } from '../lib/supabase'
import Wordmark from './Wordmark'
import { IconArrowUp, IconExternal } from './Icons'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()
  const head = 'label-caps text-ink mb-4'
  const item = 'block py-1 text-fl-sm text-slate hover:text-ink transition-colors'

  return (
    <footer className="border-t border-line bg-paper">
      <div className="max-w-site mx-auto px-gutter py-12 md:py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-bold uppercase tracking-tight text-fl-base">{site.name}<span className="text-brass">.</span></p>
          <p className="mt-2 text-fl-sm text-slate leading-relaxed max-w-xs">{t('hero.eyebrow')}</p>
          <p className="mt-4 text-fl-xs text-fog leading-relaxed">
            {site.location} · {site.timezone}<br />{t('footer.replies')}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.14em] text-slate hover:text-ink transition-colors group"
          >
            <span className="w-9 h-9 rounded-sm border border-line flex items-center justify-center group-hover:border-steel group-hover:text-steel transition-colors"><IconArrowUp size={15} /></span>
            {t('footer.scrollUp')}
          </button>
        </div>

        <nav aria-label={t('footer.work')}>
          <h4 className={head}>{t('footer.work')}</h4>
          <Link to="/#work" className={item}>{t('work.all')}</Link>
          {CATEGORIES.map(c => (
            <Link key={c} to={`/?field=${c}#work`} className={item}>{t(`cat.${c}`)}</Link>
          ))}
          <a href={site.links.find(l => l.key === 'behance')?.href} target="_blank" rel="noreferrer" className={item}>Behance</a>
        </nav>

        <nav aria-label={t('footer.about')}>
          <h4 className={head}>{t('footer.about')}</h4>
          <Link to="/#about" className={item}>{t('nav.about')}</Link>
          <Link to="/#faq" className={item}>{t('nav.faq')}</Link>
          <Link to="/#call" className={item}>{t('nav.call')}</Link>
          <Link to="/contact" className={item}>{t('nav.contact')}</Link>
          <Link to="/admin" className={`${item} text-fog`}>{t('nav.admin')}</Link>
        </nav>

        <div>
          <h4 className={head}>{t('footer.contacts')}</h4>
          <div className="grid grid-cols-2 gap-x-4">
            {site.links.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer" className={`${item} inline-flex items-center gap-1.5`}>
                {l.label} <IconExternal size={11} className="text-fog" />
              </a>
            ))}
          </div>
          <p className="label-caps text-ink mt-6 mb-2">{t('footer.consultation')}</p>
          <a href={site.whatsapp} target="_blank" rel="noreferrer" className="block text-fl-base font-semibold text-steel hover:text-ink transition-colors tabular-nums">{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`} className="block text-fl-base font-semibold text-steel hover:text-ink transition-colors break-all">{site.email}</a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-site mx-auto px-gutter py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-fl-xs text-fog">
          <p>© {year} {site.name} · {t('footer.rights')}</p>
          <p className="font-display italic text-slate">{t('footer.tagline')}</p>
        </div>
      </div>

      <Wordmark />
    </footer>
  )
}
