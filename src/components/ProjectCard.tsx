import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Project } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import ToolBadge from './ToolBadge'

export const CAT_DOT: Record<string, string> = {
  data: 'bg-ocean',
  finance: 'bg-brass',
  risk: 'bg-clay',
}

/** Soft gradient placeholder — different per project so the grid never looks templated. */
function placeholder(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0
  const a = h % 360
  const b = (a + 40 + (h % 60)) % 360
  return {
    background: `linear-gradient(135deg, hsl(${a} 28% 22%) 0%, hsl(${b} 34% 14%) 60%, #070D18 100%)`,
  }
}

type Props = {
  p: Project
  index?: number
}

export default function ProjectCard({ p, index = 0 }: Props) {
  const { t } = useLang()
  const [loaded, setLoaded] = useState(false)
  const delay = Math.min((index % 4) + 1, 3)
  const meta = [t(`cat.${p.category}`), p.year ? String(p.year) : null].filter(Boolean).join(' · ')

  return (
    <article className={`reveal reveal-delay-${delay}`}>
      <Link
        to={`/work/${p.slug}`}
        state={{ fromGrid: true }}
        className="group block focus-visible:outline-none"
        aria-label={`${p.title} — ${t('work.read')}`}
      >
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-graphite ring-1 ring-paper/5 transition-all duration-500 ease-smooth group-hover:ring-tide/40 group-hover:shadow-glow group-hover:-translate-y-1 group-focus-visible:ring-brass"
          style={p.cover_url ? undefined : placeholder(p.slug)}
        >
          {p.cover_url ? (
            <img
              src={p.cover_url}
              alt={p.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              className={`img-fade ${loaded ? 'is-loaded' : ''} w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]`}
            />
          ) : (
            <div className="absolute inset-0 flex items-end p-5">
              <span className="font-display text-paper/80 text-fl-xl leading-tight clamp-2">{p.title}</span>
            </div>
          )}

          {/* hover veil with summary + tools */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 md:p-5 bg-gradient-to-t from-night/90 via-night/40 to-transparent opacity-0 translate-y-2 transition-all duration-500 ease-smooth group-hover:opacity-100 group-hover:translate-y-0">
            {p.summary && <p className="text-fl-sm text-paper/90 leading-snug clamp-2">{p.summary}</p>}
            {p.tools.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tools.slice(0, 5).map(tool => <ToolBadge key={tool} name={tool} size="sm" />)}
                {p.tools.length > 5 && <span className="text-fl-xs text-fog self-center">+{p.tools.length - 5}</span>}
              </div>
            )}
          </div>

          {p.featured && (
            <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[.14em] font-medium bg-night/70 backdrop-blur text-sand border border-sand/30 rounded-full px-2.5 py-1">
              {t('work.featured')}
            </span>
          )}
        </div>

        <div className="mt-3">
          <h3 className="font-display text-fl-base md:text-fl-lg leading-snug text-paper clamp-2 transition-colors duration-300 group-hover:text-tide">
            {p.title}
          </h3>
          {p.client && <p className="mt-1 text-fl-xs text-paper/70 truncate">{p.client}</p>}
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="text-fl-xs text-fog flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${CAT_DOT[p.category]}`} />
              <span className="truncate">{meta}</span>
            </p>
            {p.tools.length > 0 && (
              <div className="hidden sm:flex -space-x-1.5 shrink-0" aria-hidden="true">
                {p.tools.slice(0, 3).map(tool => (
                  <ToolBadge key={tool} name={tool} size="sm" className="ring-2 ring-night rounded-md" />
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
