import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Article } from '../lib/articles'
import { useLang } from '../contexts/LanguageContext'
import { readingMinutes } from '../lib/richtext'
import { IconArrowRight } from './Icons'

function placeholder(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0
  const a = 196 + (h % 18)
  return { background: `linear-gradient(135deg, hsl(${a} 45% 92%) 0%, hsl(${a + 15} 40% 82%) 100%)` }
}

type Props = { a: Article; index?: number; featuredLayout?: boolean }

/** Glass article card for the Articles tab. */
export default function ArticleCard({ a, index = 0, featuredLayout = false }: Props) {
  const { t, locale } = useLang()
  const { search } = useLocation()
  const [loaded, setLoaded] = useState(false)
  const to = { pathname: `/articles/${a.slug}`, search }
  const date = new Date(a.published_at).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
  const minutes = readingMinutes(a.content ?? '')
  const delay = Math.min((index % 3) + 1, 3)

  return (
    <article className={`reveal reveal-delay-${delay} group relative glass glass-hover overflow-hidden flex flex-col ${featuredLayout ? 'sm:col-span-2 sm:grid sm:grid-cols-2' : ''}`}>
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[130%] h-56 rounded-full bg-gradient-to-b from-ocean/40 to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
      <Link to={to} className={`relative block overflow-hidden ${featuredLayout ? 'sm:h-full' : 'mx-4 mt-4 rounded-xl ring-1 ring-ink/[.06]'}`} aria-label={`${a.title} — ${t('articles.read')}`}>
        <div className={`relative overflow-hidden ${featuredLayout ? 'h-full min-h-[220px]' : 'aspect-[16/10]'}`} style={a.cover_url ? undefined : placeholder(a.slug)}>
          {a.cover_url ? (
            <img src={a.cover_url} alt={a.title} loading="lazy" decoding="async" onLoad={() => setLoaded(true)}
              className={`img-fade ${loaded ? 'is-loaded' : ''} w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]`} />
          ) : (
            <div className="absolute inset-0 p-5 flex items-end">
              <span className="font-bold uppercase tracking-tight text-ink/70 text-fl-lg leading-tight clamp-3">{a.title}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="relative p-4 md:p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] uppercase tracking-[.14em] text-fog font-semibold">
          {a.featured && <span className="inline-flex items-center h-5 px-2 rounded-sm bg-ink text-paper">{t('card.featured')}</span>}
          {a.tags.slice(0, 2).map(tag => <span key={tag} className="text-steel">{tag}</span>)}
        </div>
        <h3 className="mt-2.5 font-bold tracking-tight text-fl-lg leading-snug text-ink clamp-2">
          <Link to={to} className="hover:text-steel transition-colors">{a.title}</Link>
        </h3>
        {a.summary && <p className="mt-2 text-fl-sm text-slate leading-relaxed clamp-3">{a.summary}</p>}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 text-fl-xs text-fog tabular-nums">
          <span>{date} · {minutes} {t('articles.minRead')}</span>
          <Link to={to} className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-ink hover:text-steel transition-colors group/link">
            {t('articles.read')} <IconArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
