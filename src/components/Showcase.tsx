import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Project, Category, CATEGORIES } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import { site, mailto, asset } from '../lib/site'
import { useReveal } from '../hooks/useReveal'
import Banner from './Banner'
import ToolBadge from './ToolBadge'
import SectionTitle from './SectionTitle'
import { CAT_DOT } from './ProjectCard'
import { IconBriefcase, IconPin, IconGlobe, IconExternal, IconMail, IconArrowDown, IconLayers } from './Icons'

type Tab = 'all' | 'featured' | Category

function AvatarCircle({ size = 104 }: { size?: number }) {
  const [failed, setFailed] = useState(false)
  const initials = site.name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div className="relative rounded-full p-[3px] bg-gradient-to-br from-tide via-ocean to-brass shadow-glow" style={{ width: size, height: size }}>
      <div className="w-full h-full rounded-full overflow-hidden bg-graphite ring-4 ring-night flex items-center justify-center">
        {!failed ? (
          <img src={asset(site.avatar)} alt={`${site.name} portrait`} width={size} height={size} className="w-full h-full object-cover" onError={() => setFailed(true)} />
        ) : (
          <span className="font-display text-paper select-none" style={{ fontSize: size * 0.36 }}>{initials}</span>
        )}
      </div>
    </div>
  )
}

/** Light gradient placeholder (dark variant) for projects without a cover. */
function placeholder(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0
  const a = 200 + (h % 30)
  return { background: `linear-gradient(135deg, hsl(${a} 30% 24%) 0%, hsl(${a + 25} 35% 14%) 70%, #070D18 100%)` }
}

function Tile({ p, index }: { p: Project; index: number }) {
  const { t } = useLang()
  const { search } = useLocation()
  return (
    <Link
      to={{ pathname: `/work/${p.slug}`, search }}
      className={`group block reveal reveal-delay-${(index % 4) % 3 + 1} focus-visible:outline-none`}
      aria-label={`${p.title} — ${t('work.read')}`}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-md bg-graphite ring-1 ring-paper/10 transition-all duration-500 ease-smooth group-hover:ring-tide/60 group-hover:shadow-glow group-focus-visible:ring-tide"
        style={p.cover_url ? undefined : placeholder(p.slug)}
      >
        {p.cover_url ? (
          <img src={p.cover_url} alt={p.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]" />
        ) : (
          <div className="absolute inset-0 p-4 flex items-end">
            <span className="font-bold uppercase tracking-tight text-paper/85 text-fl-sm leading-snug clamp-2">{p.title}</span>
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-3.5 bg-gradient-to-t from-night/95 via-night/40 to-transparent opacity-0 translate-y-1 transition-all duration-500 ease-smooth group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100">
          <p className="text-fl-sm font-semibold text-paper leading-snug clamp-2">{p.title}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-fl-xs text-fog">
              <span className={`w-1.5 h-1.5 rounded-full ${CAT_DOT[p.category]}`} />
              {t(`cat.${p.category}`)}{p.year ? ` · ${p.year}` : ''}
            </span>
            {p.tools.length > 0 && (
              <span className="flex -space-x-1">
                {p.tools.slice(0, 3).map(tool => <ToolBadge key={tool} name={tool} size="sm" className="ring-2 ring-night rounded-md" />)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

type Props = { projects: Project[]; loading: boolean }

export default function Showcase({ projects, loading }: Props) {
  const { t } = useLang()
  const [tab, setTab] = useState<Tab>('all')

  const filtered = useMemo(() => {
    if (tab === 'all') return projects
    if (tab === 'featured') return projects.filter(p => p.featured)
    return projects.filter(p => p.category === tab)
  }, [projects, tab])

  const recent = useMemo(() => {
    const ts = (p: Project) => new Date(p.created_at).getTime()
    return [...filtered].sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || ts(b) - ts(a)).slice(0, 4)
  }, [filtered])

  const selected = useMemo(() => {
    const seen = new Set(recent.map(p => p.id))
    const feats = filtered.filter(p => p.featured && !seen.has(p.id))
    const rest = filtered.filter(p => !p.featured && !seen.has(p.id))
    return [...feats, ...rest].slice(0, 4)
  }, [filtered, recent])

  const stats = useMemo(() => ({
    projects: projects.length,
    tools: new Set(projects.flatMap(p => p.tools.map(x => x.toLowerCase()))).size,
    clients: new Set(projects.map(p => p.client).filter(Boolean)).size,
    fields: new Set(projects.map(p => p.category)).size,
  }), [projects])

  const toolCounts = useMemo(() => {
    const m = new Map<string, number>()
    projects.forEach(p => p.tools.forEach(tl => m.set(tl, (m.get(tl) ?? 0) + 1)))
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8)
  }, [projects])

  useReveal([tab, filtered.length, loading])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: t('showcase.tab.all') },
    { key: 'featured', label: t('showcase.tab.featured') },
    ...CATEGORIES.map(c => ({ key: c as Tab, label: t(`cat.${c}`) })),
  ]

  const emailHref = mailto(`Hello ${site.firstName} — from your portfolio`, `Hi ${site.firstName},\n\n`)

  return (
    <section id="showcase" className="relative bg-night text-paper scroll-mt-14 overflow-hidden">
      <div className="max-w-site mx-auto px-gutter pt-section">
        <div className="flex items-end justify-between gap-6 flex-wrap reveal">
          <div>
            <SectionTitle>{t('showcase.title')}</SectionTitle>
            <p className="mt-2 text-fl-sm text-fog max-w-xl leading-relaxed">{t('showcase.sub')}</p>
          </div>
          <a href="#work" className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-tide link-underline">
            {t('showcase.viewAll')} <IconArrowDown size={13} />
          </a>
        </div>
      </div>

      <div className="mt-8"><Banner className="h-[clamp(110px,16vw,200px)]" /></div>

      <div className="max-w-site mx-auto px-gutter pb-section">
        <div className="grid lg:grid-cols-[272px_minmax(0,1fr)] gap-x-12 xl:gap-x-16 gap-y-10">
          {/* ---- Profile sidebar (Behance-style) ---- */}
          <aside className="-mt-12 md:-mt-14 reveal">
            <AvatarCircle />
            <h3 className="mt-4 text-fl-xl font-bold tracking-tight">{site.name}</h3>
            <ul className="mt-3 space-y-1.5 text-fl-sm text-fog">
              <li className="flex items-center gap-2.5"><IconBriefcase size={15} className="shrink-0 text-fog/70" />{t('showcase.role')}</li>
              <li className="flex items-center gap-2.5"><IconLayers size={15} className="shrink-0 text-fog/70" />{t('showcase.org')}</li>
              <li className="flex items-center gap-2.5"><IconPin size={15} className="shrink-0 text-fog/70" />{site.location}</li>
              <li className="flex items-center gap-2.5"><IconGlobe size={15} className="shrink-0 text-fog/70" /><a href="https://anakaktuaria.org" target="_blank" rel="noreferrer" className="link-underline hover:text-paper">anakaktuaria.org</a></li>
            </ul>

            <div className="mt-4 rounded-lg bg-paper/5 border border-paper/10 px-3.5 py-3">
              <p className="flex items-center gap-2 text-fl-xs font-semibold text-paper">
                <span className="relative flex w-2 h-2"><span className="absolute inline-flex w-full h-full rounded-full bg-tide opacity-60 animate-ping [animation-duration:2.4s]" /><span className="relative inline-flex w-2 h-2 rounded-full bg-tide" /></span>
                {t('showcase.available')}
              </p>
              <p className="mt-0.5 text-fl-xs text-fog">{site.location} · {site.timezone}</p>
            </div>

            <a href={emailHref} className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-paper text-ink font-semibold text-fl-sm py-2.5 hover:bg-tide transition-colors duration-300">
              <IconMail size={15} /> {t('showcase.contact')}
            </a>

            <dl className="mt-6 divide-y divide-paper/10 border-y border-paper/10 text-fl-sm">
              {([['projects', stats.projects], ['tools', stats.tools], ['clients', stats.clients], ['fields', stats.fields]] as const).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2">
                  <dt className="text-fog">{t(`showcase.stat.${k}`)}</dt>
                  <dd className="font-semibold tabular-nums">{loading ? '–' : v}</dd>
                </div>
              ))}
            </dl>

            <p className="label-caps text-fog mt-7 mb-2">{t('showcase.web')}</p>
            <ul className="rounded-lg border border-paper/10 divide-y divide-paper/10 overflow-hidden">
              {site.links.map(l => (
                <li key={l.key}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 px-3.5 py-2.5 text-fl-sm text-paper/90 hover:bg-paper/5 transition-colors">
                    <span className="inline-flex items-center gap-2.5"><span className="w-5 h-5 rounded-full bg-paper/10 flex items-center justify-center text-[10px] font-bold text-tide">{l.label[0]}</span>{l.label}</span>
                    <IconExternal size={13} className="text-fog group-hover:text-tide transition-colors" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="label-caps text-fog mt-7 mb-2">{t('showcase.info')}</p>
            <p className="text-fl-sm text-paper/80 leading-relaxed">{t('hero.body')}</p>
          </aside>

          {/* ---- Work grid ---- */}
          <div className="lg:pt-8 min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-paper/10 reveal">
              <div role="tablist" aria-label={t('showcase.title')} className="flex gap-1 -mb-px overflow-x-auto">
                {tabs.map(tb => {
                  const on = tab === tb.key
                  return (
                    <button
                      key={tb.key} role="tab" aria-selected={on} onClick={() => setTab(tb.key)}
                      className={`relative px-3 sm:px-4 py-3 text-fl-sm whitespace-nowrap transition-colors duration-300 ${on ? 'text-paper font-semibold' : 'text-fog hover:text-paper'}`}
                    >
                      {tb.label}
                      <span className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-tide transition-transform duration-300 ease-smooth origin-left ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                    </button>
                  )
                })}
              </div>
              {toolCounts.length > 0 && (
                <div className="hidden md:flex items-start gap-2.5 pb-3" aria-label={t('modal.toolsTitle')}>
                  {toolCounts.map(([tool, n]) => (
                    <span key={tool} className="flex flex-col items-center gap-1" title={`${tool} · ${n}`}>
                      <ToolBadge name={tool} size="sm" />
                      <span className="text-[10px] text-fog leading-none tabular-nums">{n}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="mt-7 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" aria-busy="true">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/3] rounded-md bg-graphite animate-pulse" style={{ animationDelay: `${i * 70}ms` }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <p className="mt-10 text-fl-sm text-fog">{t('showcase.empty')}</p>
            ) : (
              <>
                <h4 className="mt-7 text-fl-sm font-semibold text-paper reveal">{t('showcase.recent')}</h4>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recent.map((p, i) => <Tile key={p.id} p={p} index={i} />)}
                </div>
                {selected.length > 0 && (
                  <>
                    <h4 className="mt-9 text-fl-sm font-semibold text-paper reveal">{t('showcase.selected')}</h4>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {selected.map((p, i) => <Tile key={p.id} p={p} index={i} />)}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
