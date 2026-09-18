import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Project } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import { site, mailto, absoluteUrl } from '../lib/site'
import { IconArrowRight, IconMail } from './Icons'

/** Category accents: three steps of the same blue family. */
export const CAT_DOT: Record<string, string> = {
  data: 'bg-tide',
  finance: 'bg-ocean',
  risk: 'bg-steel',
}
export const CAT_GLOW: Record<string, string> = {
  data: 'from-tide/50',
  finance: 'from-ocean/40',
  risk: 'from-steel/35',
}

/** Light gradient placeholder: varies per project so the grid never looks templated. */
function placeholder(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0
  const a = 196 + (h % 18)
  return { background: `linear-gradient(135deg, hsl(${a} 45% 92%) 0%, hsl(${a + 15} 40% 82%) 100%)` }
}

const isNew = (p: Project) => Date.now() - new Date(p.created_at).getTime() < 365 * 864e5

function Badge({ children, tone = 'solid' }: { children: ReactNode; tone?: 'solid' | 'outline' }) {
  return (
    <span className={`inline-flex items-center h-5 px-2 rounded-sm text-[10px] font-semibold uppercase tracking-[.12em] ${
      tone === 'solid' ? 'bg-ink text-paper' : 'ring-1 ring-ink/15 text-slate bg-white/60'
    }`}>
      {children}
    </span>
  )
}

function Thumb({ p, className = '' }: { p: Project; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className}`} style={p.cover_url ? undefined : placeholder(p.slug)}>
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
        <div className="absolute inset-0 flex items-end p-4">
          <span className="font-bold uppercase tracking-tight text-ink/70 text-fl-base leading-tight clamp-2">{p.title}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="min-w-0">
      <dt className="label-caps">{label}</dt>
      <dd className="text-fl-xs text-ink/85 truncate mt-0.5">{value}</dd>
    </div>
  )
}

type Props = { p: Project; index?: number; view?: 'grid' | 'list' }

export default function ProjectCard({ p, index = 0, view = 'grid' }: Props) {
  const { t } = useLang()
  const { search } = useLocation()
  const delay = Math.min((index % 3) + 1, 3)
  // Carry the active filters (?field=…&q=…) into the modal URL so closing it restores the same view
  const open = { pathname: `/work/${p.slug}`, search }
  const when = p.year ?? new Date(p.created_at).getFullYear()
  const askHref = mailto(
    `${t('modal.subject')}${p.title}`,
    `Hi ${site.firstName},\n\nI saw "${p.title}" (${absoluteUrl(`work/${p.slug}`)}) and would like to ask about\n\n`,
  )
  const badges = (
    <div className="flex items-center gap-1.5">
      {p.featured && <Badge>{t('card.featured')}</Badge>}
      {isNew(p) && <Badge tone="outline">{t('card.new')}</Badge>}
    </div>
  )
  const stamp = (
    <div className="flex items-center gap-2 text-fl-sm font-semibold text-ink tabular-nums" title={t(`cat.${p.category}`)}>
      {when}
      <span className={`w-2 h-2 rounded-[2px] ${CAT_DOT[p.category]}`} aria-hidden="true" />
    </div>
  )
  const btnSolid = 'inline-flex items-center justify-center gap-2 bg-ink text-paper btn-text px-4 py-2.5 rounded-full hover:bg-steel transition-colors duration-300'
  const btnGhost = 'inline-flex items-center justify-center gap-2 ring-1 ring-ink/15 bg-white/60 text-slate btn-text px-4 py-2.5 rounded-full hover:ring-steel hover:text-steel transition-colors duration-300'

  if (view === 'list') {
    return (
      <article className={`reveal reveal-delay-${delay} group glass glass-hover grid grid-cols-[96px_1fr] sm:grid-cols-[168px_1fr_auto] gap-4 sm:gap-6 items-center p-3 sm:p-4`}>
        <Link to={open} className="block" aria-label={`${p.title}: ${t('work.read')}`}>
          <Thumb p={p} className="aspect-[4/3] rounded-xl" />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">{badges}{stamp}</div>
          <h3 className="mt-2 font-bold uppercase tracking-tight text-fl-base leading-snug clamp-2 text-ink">
            <Link to={open} className="hover:text-steel transition-colors">{p.title}</Link>
          </h3>
          <dl className="mt-3 hidden sm:grid grid-cols-3 gap-4">
            <Spec label={t('card.tools')} value={p.tools.join(', ')} />
            <Spec label={t('card.client')} value={p.client} />
            <Spec label={t('card.role')} value={p.role} />
          </dl>
        </div>
        <div className="col-span-2 sm:col-span-1 flex sm:flex-col gap-2">
          <Link to={open} className={`${btnSolid} flex-1`}>{t('card.open')}</Link>
          <a href={askHref} className={btnGhost}>{t('card.ask')}</a>
        </div>
      </article>
    )
  }

  return (
    <article className={`reveal reveal-delay-${delay} group relative glass glass-hover flex flex-col overflow-hidden`}>
      {/* soft category glow behind the thumbnail, like the reference's coloured tiles */}
      <div className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[130%] h-56 rounded-full bg-gradient-to-b ${CAT_GLOW[p.category]} to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700`} aria-hidden="true" />

      <div className="relative flex items-center justify-between gap-3 px-4 pt-4">
        {badges}
        {stamp}
      </div>

      <Link to={open} className="relative block mx-4 mt-3" aria-label={`${p.title}: ${t('work.read')}`}>
        <Thumb p={p} className="aspect-[4/3] rounded-xl ring-1 ring-ink/[.06]" />
      </Link>

      <div className="relative px-4 pt-4 flex-1">
        <h3 className="font-bold uppercase tracking-tight text-fl-base leading-snug clamp-2 text-ink">
          <Link to={open} className="hover:text-steel transition-colors">{p.title}</Link>
        </h3>
        <dl className="mt-3.5 space-y-2.5">
          <Spec label={t('card.tools')} value={p.tools.length ? p.tools.join(', ') : null} />
          <Spec label={t('card.client')} value={p.client} />
          <Spec label={t('card.role')} value={p.role} />
        </dl>
      </div>

      <div className="relative px-4 pb-4 pt-4 mt-auto grid grid-cols-[1fr_auto] gap-2">
        <Link to={open} className={btnSolid}>{t('card.open')}</Link>
        <a href={askHref} className={btnGhost} aria-label={`${t('card.ask')}: ${p.title}`}>{t('card.ask')}</a>
      </div>
    </article>
  )
}

/** Accent tile placed inside the grid. */
export function PromoTile() {
  const { t } = useLang()
  return (
    <div className="reveal relative overflow-hidden flex flex-col justify-between rounded-2xl p-6 min-h-[300px] text-paper bg-gradient-to-br from-steel via-[#2E5A7C] to-graphite ring-1 ring-ink/10 shadow-float grain">
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_100%_100%,rgba(143,195,227,.40),transparent_60%)]" aria-hidden="true" />
      <p className="relative label-caps text-paper/70">{t('promo.kicker')}</p>
      <div className="relative">
        <p className="h-display text-[clamp(2.2rem,3.6vw,3.4rem)]">{t('promo.title')}</p>
        <p className="mt-3 text-fl-sm text-paper/85 leading-relaxed max-w-[26ch]">{t('promo.body')}</p>
      </div>
      <a
        href={mailto(`Hello ${site.firstName}, from your portfolio`, `Hi ${site.firstName},\n\n`)}
        className="relative mt-6 inline-flex items-center justify-center gap-2 self-start bg-paper text-night btn-text px-4 py-2.5 rounded-full hover:bg-tide transition-colors duration-300 group"
      >
        <IconMail size={14} /> {t('promo.button')} <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  )
}
