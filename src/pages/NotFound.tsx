import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useSeo } from '../lib/seo'
import { IconArrowLeft } from '../components/Icons'

export default function NotFound() {
  const { t } = useLang()
  useSeo({ title: t('notfound.title'), description: t('notfound.body'), noindex: true })
  return (
    <section className="page-enter max-w-site mx-auto px-gutter py-section text-center">
      <p className="h-display text-[clamp(5rem,16vw,12rem)] text-line leading-none">404</p>
      <h1 className="mt-4 h-display text-fl-2xl">{t('notfound.title')}</h1>
      <p className="mt-3 text-slate max-w-md mx-auto">{t('notfound.body')}</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 border border-ink/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[.16em] rounded-full hover:border-steel hover:text-steel transition-colors">
        <IconArrowLeft size={15} /> {t('notfound.back')}
      </Link>
    </section>
  )
}
