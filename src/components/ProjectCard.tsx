import { Link } from 'react-router-dom'
import { Project } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'

const catColor: Record<string, string> = {
  data: 'text-steel border-steel',
  finance: 'text-brass border-brass',
  risk: 'text-ink border-ink',
}

export default function ProjectCard({ p }: { p: Project }) {
  const { t } = useLang()
  return (
    <Link
      to={`/work/${p.slug}`}
      className="group block border-b border-mist py-8 first:pt-0 transition-colors"
    >
      <div className="grid md:grid-cols-[1fr_2fr_auto] gap-4 md:gap-8 items-start">
        <div className="aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-mist rounded-sm">
          {p.cover_url ? (
            <img
              src={p.cover_url}
              alt={p.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-4xl text-slate/40">
              {p.title.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <span className={`inline-block text-xs border rounded-full px-2.5 py-0.5 mb-3 capitalize ${catColor[p.category] ?? catColor.data}`}>
            {p.category}
          </span>
          <h3 className="font-display text-2xl leading-snug group-hover:text-steel transition-colors">
            {p.title}
          </h3>
          {p.summary && <p className="mt-2 text-slate leading-relaxed max-w-prose">{p.summary}</p>}
          {p.tags?.length > 0 && (
            <p className="mt-3 text-xs text-slate/70">{p.tags.join('  ·  ')}</p>
          )}
        </div>
        <span className="hidden md:block text-sm text-brass self-center whitespace-nowrap link-underline">
          {t('work.read')}
        </span>
      </div>
    </Link>
  )
}
