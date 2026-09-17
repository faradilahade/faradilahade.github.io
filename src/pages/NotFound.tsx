import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useSeo } from '../lib/seo'
import { IconArrowLeft } from '../components/Icons'

export default function NotFound() {
  const { t } = useLang()
  useSeo({ title: t('notfound.title'), description: t('notfound.body'), noindex: true })
  return (
    <section className="page-enter max-w-site mx-auto px-gutter py-section text-center">
      <p className="font-display text-fl-4xl text-paper/20 leading-none">404</p>
      <h1 className="mt-4 font-display text-fl-2xl">{t('notfound.title')}</h1>
      <p className="mt-3 text-fog max-w-md mx-auto">{t('notfound.body')}</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full border border-paper/20 px-5 py-2.5 text-fl-sm hover:border-tide hover:text-tide transition-colors">
        <IconArrowLeft size={16} /> {t('notfound.back')}
      </Link>
    </section>
  )
}
