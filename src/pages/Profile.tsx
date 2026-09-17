import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import { Project, Category, CATEGORIES, fetchPublishedProjects } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import { site, mailto, absoluteUrl } from '../lib/site'
import { useSeo, personJsonLd } from '../lib/seo'
import { useReveal } from '../hooks/useReveal'
import Banner from '../components/Banner'
import Avatar from '../components/Avatar'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import ToolBadge from '../components/ToolBadge'
import { IconMail, IconWhatsapp, IconPin, IconBriefcase, IconGlobe, IconExternal, IconSearch, IconClose, IconArrowRight } from '../components/Icons'

type Filter = 'all' | Category

const HIGHLIGHTS = [
  { value: '240', key: 'stat.dams' },
  { value: '92%', key: 'stat.accuracy' },
  { value: '15,000', key: 'stat.policies' },
  { value: '350+', key: 'stat.members' },
]

function countBy(list: string[]): [string, number][] {
  const m = new Map<string, number>()
  list.forEach(x => {
    const k = x.trim()
    if (!k) return
    m.set(k, (m.get(k) ?? 0) + 1)
  })
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

export default function Profile() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const match = useMatch('/work/:slug')
  const slug = match?.params.slug ?? null

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [cat, setCat] = useState<Filter>('all')
  const [q, setQ] = useState('')
  const [tag, setTag] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchPublishedProjects().then(r => {
      if (!alive) return
      setProjects(r.projects)
      setLoadError(r.error)
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return projects.filter(p => {
      if (cat !== 'all' && p.category !== cat) return false
      if (tag) {
        const bag = [...p.tags, ...p.keywords, ...p.tools].map(s => s.toLowerCase())
        if (!bag.includes(tag.toLowerCase())) return false
      }
      if (needle) {
        const hay = [p.title, p.summary ?? '', p.client ?? '', p.role ?? '', ...p.tags, ...p.keywords, ...p.tools, t(`cat.${p.category}`)]
          .join(' ').toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [projects, cat, q, tag, t])

  const isFiltering = cat !== 'all' || q.trim() !== '' || tag !== null
  const featured = useMemo(() => (isFiltering ? [] : projects.filter(p => p.featured)), [projects, isFiltering])
  const rest = useMemo(
    () => (isFiltering ? filtered : projects.filter(p => !p.featured)),
    [filtered, projects, isFiltering],
  )

  const toolCounts = useMemo(() => countBy(projects.flatMap(p => p.tools)), [projects])
  const topTags = useMemo(() => countBy(projects.flatMap(p => [...p.tags, ...p.keywords])).slice(0, 9), [projects])
  const fields = useMemo(() => new Set(projects.map(p => p.category)).size, [projects])

  const active = slug ? projects.find(p => p.slug === slug) ?? null : null

  const closeModal = useCallback(() => navigate('/', { replace: false }), [navigate])
  const goTo = useCallback((s: string) => navigate(`/work/${s}`, { replace: true }), [navigate])

  useReveal([projects.length, filtered.length, cat, q, tag])

  // ---- SEO -------------------------------------------------------
  const homeJsonLd = useMemo(() => {
    const ld: Record<string, unknown>[] = [personJsonLd(lang)]
    if (projects.length) {
      ld.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${site.name} — ${t('work.title')}`,
        itemListElement: projects.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, url: absoluteUrl(`work/${p.slug}`), name: p.title,
        })),
      })
    }
    return ld
  }, [projects, lang, t])

  const projectJsonLd = useMemo(() => {
    if (!active) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: active.title,
      headline: active.title,
      description: active.summary ?? undefined,
      url: absoluteUrl(`work/${active.slug}`),
      image: active.cover_url ?? undefined,
      dateCreated: active.created_at,
      dateModified: active.updated_at,
      genre: t(`cat.${active.category}`),
      keywords: Array.from(new Set([...active.keywords, ...active.tags, ...active.tools])).join(', '),
      author: { '@type': 'Person', name: site.name, url: absoluteUrl('') },
      ...(active.client ? { sourceOrganization: { '@type': 'Organization', name: active.client } } : {}),
    }
  }, [active, t])

  useSeo(
    active
      ? {
          title: `${active.title} — ${t(`cat.${active.category}`)} case study`,
          description: active.summary ?? `${active.title} — a ${t(`cat.${active.category}`).toLowerCase()} project by ${site.name}.`,
          path: `work/${active.slug}`,
          type: 'article',
          image: active.cover_url,
          keywords: [...active.keywords, ...active.tags, ...active.tools, site.name],
          jsonLd: projectJsonLd,
        }
      : {
          title: t('seo.home.title'),
          description: t('seo.home.desc'),
          path: '',
          type: 'profile',
          keywords: [...site.keywords, ...toolCounts.slice(0, 12).map(([k]) => k)],
          jsonLd: homeJsonLd,
        },
  )

  const emailHref = mailto(`Hello ${site.firstName} — from your portfolio`, `Hi ${site.firstName},\n\n`)

  return (
    <div className="page-enter">
      <Banner className="h-[clamp(150px,24vw,300px)]" />

      <div className="max-w-site mx-auto px-gutter">
        <div className="grid lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] gap-x-12 xl:gap-x-16 gap-y-10 lg:gap-y-8">

          {/* ---------------- Sidebar: identity (always above the grid) ---------------- */}
          <aside className="order-1 lg:order-none lg:col-start-1 lg:row-start-1 -mt-14 md:-mt-16">
            <Avatar size={112} className="rise-1" />

            <div className="mt-5 rise-2">
              <h1 className="font-display text-fl-2xl leading-tight tracking-tight">{site.name}</h1>
              <p className="mt-1.5 text-fl-sm text-sand">{t('profile.role')}</p>

              <ul className="mt-4 space-y-2 text-fl-sm text-fog">
                <li className="flex items-center gap-2.5"><IconBriefcase size={16} className="text-fog/70 shrink-0" />{t('profile.org')}</li>
                <li className="flex items-center gap-2.5"><IconPin size={16} className="text-fog/70 shrink-0" />{t('profile.location')}</li>
                <li className="flex items-center gap-2.5">
                  <IconGlobe size={16} className="text-fog/70 shrink-0" />
                  <a href="https://anakaktuaria.org" target="_blank" rel="noreferrer" className="link-underline hover:text-paper">anakaktuaria.org</a>
                </li>
              </ul>

              <p className="mt-4 inline-flex items-center gap-2 text-fl-xs text-tide">
                <span className="relative flex w-2 h-2"><span className="absolute inline-flex w-full h-full rounded-full bg-tide opacity-60 animate-ping [animation-duration:2.4s]" /><span className="relative inline-flex w-2 h-2 rounded-full bg-tide" /></span>
                {t('profile.available')}
              </p>
            </div>

            <div className="mt-6 flex gap-2.5 rise-3">
              <a
                href={emailHref}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brass text-night font-medium px-4 py-2.5 text-fl-sm hover:bg-sand transition-colors duration-300"
              >
                <IconMail size={16} /> {t('profile.emailMe')}
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/20 px-4 py-2.5 text-fl-sm text-paper hover:border-tide hover:text-tide transition-colors duration-300"
              >
                <IconWhatsapp size={16} /> <span className="sm:hidden lg:inline">{t('profile.whatsapp')}</span>
              </a>
            </div>

            <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-paper/10 py-4 text-center rise-4">
              <div><dt className="text-fl-xs text-fog">{t('profile.projects')}</dt><dd className="font-display text-fl-xl">{loading ? '–' : projects.length}</dd></div>
              <div><dt className="text-fl-xs text-fog">{t('profile.toolsCount')}</dt><dd className="font-display text-fl-xl">{loading ? '–' : toolCounts.length}</dd></div>
              <div><dt className="text-fl-xs text-fog">{t('profile.fields')}</dt><dd className="font-display text-fl-xl">{loading ? '–' : fields}</dd></div>
            </dl>
          </aside>

          {/* ---------------- Sidebar: details (below the grid on phones, left column on desktop) ---------------- */}
          <aside className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 self-start">
            <section className="reveal" aria-labelledby="hl">
              <h2 id="hl" className="text-fl-xs uppercase tracking-[.16em] text-fog">{t('profile.highlights')}</h2>
              <ul className="mt-3 space-y-3.5">
                {HIGHLIGHTS.map(h => (
                  <li key={h.key} className="grid grid-cols-[minmax(72px,auto)_1fr] gap-3 items-baseline">
                    <span className="font-display text-fl-xl text-sand leading-none">{h.value}</span>
                    <span className="text-fl-xs text-fog leading-snug">{t(h.key)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-7 reveal" aria-labelledby="web">
              <h2 id="web" className="text-fl-xs uppercase tracking-[.16em] text-fog">{t('profile.onweb')}</h2>
              <ul className="mt-3 rounded-xl border border-paper/10 divide-y divide-paper/10 overflow-hidden">
                {site.links.map(l => (
                  <li key={l.key}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 px-3.5 py-2.5 text-fl-sm hover:bg-paper/5 transition-colors">
                      <span className="text-paper/90">{l.label}</span>
                      <IconExternal size={14} className="text-fog group-hover:text-tide transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-7 reveal" aria-labelledby="about">
              <h2 id="about" className="text-fl-xs uppercase tracking-[.16em] text-fog">{t('profile.about')}</h2>
              <p className="mt-3 text-fl-sm text-paper/85 leading-relaxed">{t('profile.bio')}</p>
              <p className="mt-3 text-fl-xs text-fog leading-relaxed">{t('profile.proof')}</p>
            </section>
          </aside>

          {/* ---------------- Main ---------------- */}
          <main className="order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:pt-8 min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
              <div className="rise-2">
                <h2 className="font-display text-fl-2xl leading-tight">{t('work.title')}</h2>
                <p className="mt-1.5 text-fl-sm text-fog max-w-md">{t('work.sub')}</p>
              </div>

              {toolCounts.length > 0 && (
                <div className="rise-3" aria-label={t('profile.tools')}>
                  <p className="sr-only">{t('profile.tools')}</p>
                  <div className="flex flex-wrap gap-2.5 max-w-xl justify-start md:justify-end">
                    {toolCounts.slice(0, 9).map(([tool, n]) => (
                      <span key={tool} className="flex flex-col items-center gap-1" title={`${tool} · ${n}`}>
                        <ToolBadge name={tool} />
                        <span className="text-[10px] text-fog leading-none">{n}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs + search */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-paper/10 rise-3">
              <div className="flex gap-1 -mb-px overflow-x-auto" role="tablist" aria-label="Category">
                {(['all', ...CATEGORIES] as Filter[]).map(c => {
                  const on = cat === c
                  return (
                    <button
                      key={c}
                      role="tab"
                      aria-selected={on}
                      onClick={() => setCat(c)}
                      className={`relative px-3 sm:px-4 py-2.5 text-fl-sm whitespace-nowrap transition-colors duration-300 ${on ? 'text-paper' : 'text-fog hover:text-paper'}`}
                    >
                      {c === 'all' ? t('work.all') : t(`cat.${c}`)}
                      <span className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-brass transition-transform duration-300 ease-smooth origin-left ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                    </button>
                  )
                })}
              </div>

              <label className="relative ml-auto w-full sm:w-72 pb-2 sm:pb-0">
                <span className="sr-only">{t('work.search')}</span>
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 sm:-translate-y-[60%] text-fog pointer-events-none" />
                <input
                  type="search"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder={t('work.search')}
                  className="w-full rounded-full bg-paper/5 border border-paper/10 pl-9 pr-9 py-2 text-fl-sm placeholder:text-fog/70 focus:border-tide/60 focus:bg-paper/10 outline-none transition-colors"
                />
                {q && (
                  <button type="button" onClick={() => setQ('')} aria-label={t('work.clear')} className="absolute right-2.5 top-1/2 -translate-y-1/2 sm:-translate-y-[60%] text-fog hover:text-paper">
                    <IconClose size={16} />
                  </button>
                )}
              </label>
            </div>

            {/* Keyword chips, like Behance's related-search pills */}
            {topTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 rise-4">
                {topTags.map(([k]) => {
                  const on = tag?.toLowerCase() === k.toLowerCase()
                  return (
                    <button
                      key={k}
                      onClick={() => setTag(on ? null : k)}
                      aria-pressed={on}
                      className={`rounded-full px-3.5 py-1.5 text-fl-xs border transition-all duration-300 ease-smooth ${
                        on ? 'bg-ocean text-night border-ocean' : 'bg-ink/60 text-paper/85 border-paper/10 hover:border-tide/50 hover:text-paper'
                      }`}
                    >
                      {k}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Grid(s) */}
            {loading ? (
              <div className="mt-9 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8" aria-busy="true" aria-label={t('work.loading')}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="aspect-[4/3] rounded-xl bg-graphite" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-graphite" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-graphite/70" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-paper/15 p-10 text-center text-fog text-fl-sm">
                {t('work.empty')}
                {loadError && loadError !== 'not-configured' && <p className="mt-2 text-fl-xs opacity-60">({loadError})</p>}
              </div>
            ) : (
              <>
                {featured.length > 0 && (
                  <section className="mt-9" aria-labelledby="featured">
                    <h3 id="featured" className="text-fl-sm font-medium text-paper mb-4 flex items-center gap-3">
                      {t('work.featured')} <span className="h-px flex-1 bg-paper/10" />
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                      {featured.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
                    </div>
                  </section>
                )}

                <section className="mt-9" aria-labelledby="allwork">
                  <h3 id="allwork" className="text-fl-sm font-medium text-paper mb-4 flex items-center gap-3">
                    {isFiltering ? `${t('work.results')} · ${filtered.length}` : t('work.recent')} <span className="h-px flex-1 bg-paper/10" />
                    {isFiltering && (
                      <button onClick={() => { setCat('all'); setQ(''); setTag(null) }} className="text-fl-xs text-fog hover:text-paper link-underline">{t('work.clear')}</button>
                    )}
                  </h3>
                  {rest.length === 0 ? (
                    <p className="text-fog text-fl-sm py-8">{t('work.noresults')}</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                      {rest.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Behance */}
            {site.behanceEmbeds.length > 0 && (
              <section className="mt-section reveal" aria-labelledby="behance">
                <div className="flex items-end justify-between gap-6 flex-wrap">
                  <div>
                    <h2 id="behance" className="font-display text-fl-xl">{t('work.behance')}</h2>
                    <p className="mt-1 text-fl-sm text-fog">{t('work.behance_sub')}</p>
                  </div>
                  <a href={site.links.find(l => l.key === 'behance')?.href} target="_blank" rel="noreferrer" className="link-underline text-fl-sm text-tide inline-flex items-center gap-1.5">
                    {t('work.viewOnBehance')} <IconExternal size={14} />
                  </a>
                </div>
                <div className="mt-6 grid sm:grid-cols-2 gap-5">
                  {site.behanceEmbeds.map(e => (
                    <div key={e.id} className="rounded-xl overflow-hidden bg-graphite ring-1 ring-paper/10 hover:ring-tide/40 transition-shadow duration-500 hover:shadow-glow">
                      <iframe
                        src={e.src}
                        title={`Behance project ${e.id}`}
                        loading="lazy"
                        allowFullScreen
                        allow="clipboard-write"
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full aspect-[404/316] bg-graphite"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="mt-section mb-section relative overflow-hidden rounded-2xl bg-graphite grain ring-1 ring-paper/10 reveal">
              <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_100%_0%,rgba(92,157,201,.22),transparent_60%)]" aria-hidden="true" />
              <div className="relative p-[clamp(1.5rem,4vw,3.5rem)] grid md:grid-cols-[1fr_auto] gap-8 items-center">
                <div>
                  <h2 className="font-display text-fl-2xl leading-tight max-w-xl">{t('cta.title')}</h2>
                  <p className="mt-3 text-fl-base text-fog max-w-lg">{t('cta.body')}</p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                  <a href={emailHref} className="group inline-flex items-center justify-center gap-2 rounded-full bg-brass text-night font-medium px-6 py-3 text-fl-sm hover:bg-sand transition-colors duration-300">
                    <IconMail size={17} /> {t('cta.button')}
                    <IconArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/20 px-6 py-3 text-fl-sm hover:border-tide hover:text-tide transition-colors duration-300">
                    {t('nav.contact')}
                  </Link>
                </div>
              </div>
              <p className="relative px-[clamp(1.5rem,4vw,3.5rem)] pb-6 -mt-2 text-fl-xs text-fog">
                <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
              </p>
            </section>
          </main>
        </div>
      </div>

      {slug && (
        <ProjectModal
          project={active}
          list={filtered.length ? filtered : projects}
          loading={loading}
          onClose={closeModal}
          onNavigate={goTo}
        />
      )}
    </div>
  )
}
