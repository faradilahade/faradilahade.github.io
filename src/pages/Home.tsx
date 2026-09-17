import { useEffect, useMemo, useRef, useState, useCallback, ReactNode } from 'react'
import { Link, useLocation, useMatch, useNavigate, useSearchParams } from 'react-router-dom'
import { Project, Category, CATEGORIES, fetchPublishedProjects, sortProjects } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import { site, mailto, absoluteUrl } from '../lib/site'
import { useSeo, personJsonLd } from '../lib/seo'
import { useReveal } from '../hooks/useReveal'
import HeroVisual from '../components/HeroVisual'
import SectionTitle from '../components/SectionTitle'
import ProjectCard, { PromoTile } from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import Showcase from '../components/Showcase'
import { useLocalizedProjects } from '../hooks/useLocalized'
import Filters, { FilterState, emptyFilters, applyFilters, yearBoundsOf, activeFilterCount } from '../components/Filters'
import Faq, { faqItems } from '../components/Faq'
import BookCall from '../components/BookCall'
import {
  IconMail, IconWhatsapp, IconArrowDown, IconArrowRight, IconGrid, IconList, IconSearch, IconClose, IconFilter, IconExternal,
} from '../components/Icons'

type SortKey = 'featured' | 'newest' | 'oldest' | 'az'
type View = 'grid' | 'list'
const SORTS: SortKey[] = ['featured', 'newest', 'oldest', 'az']
const PAGE = 9

const HIGHLIGHTS = [
  { value: '240', key: 'stat.dams' },
  { value: '92%', key: 'stat.accuracy' },
  { value: '15,000', key: 'stat.policies' },
  { value: '350+', key: 'stat.members' },
]

function sortList(list: Project[], key: SortKey): Project[] {
  const arr = [...list]
  const ts = (p: Project) => new Date(p.created_at).getTime()
  switch (key) {
    case 'newest': return arr.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || ts(b) - ts(a))
    case 'oldest': return arr.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || ts(a) - ts(b))
    case 'az': return arr.sort((a, b) => a.title.localeCompare(b.title))
    default: return sortProjects(arr)
  }
}

export default function Home() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const match = useMatch('/work/:slug')
  const slug = match?.params.slug ?? null

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<FilterState>(() => {
    const field = searchParams.get('field') as Category | null
    return {
      ...emptyFilters,
      fields: field && (CATEGORIES as string[]).includes(field) ? [field] : [],
      q: searchParams.get('q') ?? '',
    }
  })
  const [sort, setSort] = useState<SortKey>('featured')
  const [view, setView] = useState<View>('grid')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const setFilters = useCallback((f: FilterState) => { setFiltersState(f); setPage(1) }, [])

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

  // Keep field + search in the URL so filtered views are shareable …
  const lastWritten = useRef<string | null>(null)
  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.fields.length === 1) next.set('field', filters.fields[0])
    if (filters.q.trim()) next.set('q', filters.q.trim())
    const str = next.toString()
    if (str !== searchParams.toString()) {
      lastWritten.current = str
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.fields, filters.q])

  // … and adopt them when navigation changes the URL (e.g. footer "Data" link while already on this page)
  useEffect(() => {
    const str = searchParams.toString()
    if (lastWritten.current !== null && str === lastWritten.current) return
    lastWritten.current = str
    const field = searchParams.get('field') as Category | null
    const q = searchParams.get('q') ?? ''
    setFiltersState(f => ({
      ...f,
      fields: field && (CATEGORIES as string[]).includes(field) ? [field] : (field === null && f.fields.length === 1 ? [] : f.fields),
      q,
    }))
    setPage(1)
  }, [searchParams])

  // Anchor navigation (/#work, /#faq …)
  useEffect(() => {
    if (!location.hash) return
    const el = document.getElementById(location.hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [location.key, location.hash])

  // Projects in the visitor's language (stored translations first, machine translation as fallback)
  const localized = useLocalizedProjects(projects)

  const bounds = useMemo(() => yearBoundsOf(projects), [projects])
  const catLabel = useCallback((c: Category) => t(`cat.${c}`), [t])
  const filtered = useMemo(() => applyFilters(localized, filters, bounds, catLabel), [localized, filters, bounds, catLabel])
  const sorted = useMemo(() => sortList(filtered, sort), [filtered, sort])
  const visible = useMemo(() => sorted.slice(0, page * PAGE), [sorted, page])
  const activeCount = activeFilterCount(filters, bounds)

  const active = slug ? localized.find(p => p.slug === slug) ?? null : null
  const closeModal = useCallback(() => navigate({ pathname: '/', search: location.search }), [navigate, location.search])
  const goTo = useCallback((s: string) => navigate({ pathname: `/work/${s}`, search: location.search }, { replace: true }), [navigate, location.search])

  useReveal([projects.length, visible.length, view, sort, loading])

  // ---- SEO -------------------------------------------------------
  const homeJsonLd = useMemo(() => {
    const ld: Record<string, unknown>[] = [personJsonLd(lang)]
    if (projects.length) {
      ld.push({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `${site.name} — ${t('work.title')}`,
        itemListElement: localized.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`work/${p.slug}`), name: p.title })),
      })
    }
    ld.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqItems(t).map(it => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
    })
    return ld
  }, [localized, lang, t])

  const projectJsonLd = useMemo(() => {
    if (!active) return undefined
    return {
      '@context': 'https://schema.org', '@type': 'CreativeWork',
      name: active.title, headline: active.title, description: active.summary ?? undefined,
      url: absoluteUrl(`work/${active.slug}`), image: active.cover_url ?? undefined,
      dateCreated: active.created_at, dateModified: active.updated_at, genre: t(`cat.${active.category}`),
      keywords: Array.from(new Set([...active.keywords, ...active.tags, ...active.tools])).join(', '),
      author: { '@type': 'Person', name: site.name, url: absoluteUrl('') },
      ...(active.client ? { sourceOrganization: { '@type': 'Organization', name: active.client } } : {}),
    }
  }, [active, t])

  const allTools = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tools))), [projects])

  useSeo(active
    ? {
        title: `${active.title} — ${t(`cat.${active.category}`)} case study`,
        description: active.summary ?? `${active.title} — a ${t(`cat.${active.category}`).toLowerCase()} project by ${site.name}.`,
        path: `work/${active.slug}`, type: 'article', image: active.cover_url,
        keywords: [...active.keywords, ...active.tags, ...active.tools, site.name], jsonLd: projectJsonLd,
      }
    : {
        title: t('seo.home.title'), description: t('seo.home.desc'), path: '', type: 'profile',
        keywords: [...site.keywords, ...allTools.slice(0, 15)], jsonLd: homeJsonLd,
      })

  const emailHref = mailto(`Hello ${site.firstName} — from your portfolio`, `Hi ${site.firstName},\n\n`)
  const crumb = filters.fields.length === 1 ? t(`cat.${filters.fields[0]}`) : t('work.all')

  // Grid items with the promo tile in the 6th slot (or at the end for short lists)
  const gridItems = useMemo<ReactNode[]>(() => {
    const items: ReactNode[] = visible.map((p, i) => <ProjectCard key={p.id} p={p} index={i} view={view} />)
    if (view === 'grid' && visible.length > 0) items.splice(Math.min(5, items.length), 0, <PromoTile key="promo" />)
    return items
  }, [visible, view])

  const btnSolid = 'group inline-flex items-center justify-center gap-2.5 bg-steel text-paper px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[.16em] rounded-sm hover:bg-ink transition-colors duration-300'
  const btnGhost = 'inline-flex items-center justify-center gap-2.5 border border-ink/20 text-ink px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[.16em] rounded-sm hover:border-steel hover:text-steel transition-colors duration-300'

  return (
    <div className="page-enter">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_100%_0%,rgba(143,195,227,.30),transparent_60%),radial-gradient(40%_50%_at_0%_100%,rgba(176,141,74,.10),transparent_60%)]" aria-hidden="true" />
        <div className="relative max-w-site mx-auto px-gutter pt-10 md:pt-16 pb-12 md:pb-16 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <p className="rise-1 label-caps text-steel">{t('hero.eyebrow')}</p>
            <h1 className="rise-2 mt-4 h-display text-[clamp(2.7rem,7.4vw,6.8rem)] text-ink">{site.name}</h1>
            <p className="rise-3 mt-5 font-display text-fl-xl text-ink/85 leading-snug max-w-xl">{t('hero.title')}</p>
            <p className="rise-3 mt-4 text-fl-base text-slate leading-relaxed max-w-xl">{t('hero.body')}</p>
            <div className="rise-4 mt-8 flex flex-wrap gap-3">
              <a href={emailHref} className={btnSolid}><IconMail size={15} /> {t('hero.cta')} <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></a>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className={btnGhost}><IconWhatsapp size={15} /> {t('hero.cta2')}</a>
              <a href="#showcase" className="inline-flex items-center gap-2 px-2 py-3.5 text-[11px] font-semibold uppercase tracking-[.16em] text-slate hover:text-ink transition-colors link-underline">{t('hero.cta3')} <IconArrowDown size={14} /></a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-line bg-white">
        <dl className="max-w-site mx-auto px-gutter grid grid-cols-2 md:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.key}
              className={`reveal reveal-delay-${(i % 3) + 1} py-6 md:py-8 md:px-8 md:first:pl-0 md:last:pr-0 ${
                i % 2 === 1 ? 'pl-5 border-l border-line' : 'pr-5'
              } ${i === 2 ? 'md:border-l md:border-line' : ''} ${i >= 2 ? 'border-t border-line md:border-t-0' : ''}`}
            >
              <dd className="font-display text-fl-3xl leading-none text-ink">{h.value}</dd>
              <dt className="mt-2 text-fl-xs text-slate leading-snug">{t(h.key)}</dt>
            </div>
          ))}
        </dl>
      </section>


      {/* ================= MY WORK (Behance-style showcase) ================= */}
      <Showcase projects={localized} loading={loading} />

      {/* ================= WORK ================= */}
      <section id="work" className="border-t border-line bg-frost/50 scroll-mt-20">
        <div className="max-w-site mx-auto px-gutter py-section">
          <p className="label-caps flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-ink transition-colors">{t('work.home')}</Link>
            <span>/</span>
            <span>{t('work.title')}</span>
            <span>/</span>
            <span className="text-ink">{crumb}</span>
          </p>

          <div className="mt-5 grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 xl:gap-12 items-start">
            {/* Sidebar */}
            <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-20 self-start bg-white lg:bg-transparent border lg:border-0 border-line rounded-xl lg:rounded-none p-4 lg:p-0`}>
              <Filters projects={projects} filters={filters} bounds={bounds} onChange={setFilters} />
            </aside>

            {/* Results */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pb-4 border-b border-line">
                <SectionTitle count={loading ? undefined : sorted.length}>{t('work.results')}</SectionTitle>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
                  <label className="relative flex-1 min-w-[180px] sm:w-64">
                    <span className="sr-only">{t('work.search')}</span>
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog pointer-events-none" />
                    <input
                      type="search" value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })}
                      placeholder={t('work.search')}
                      className="w-full bg-white border border-line rounded-sm pl-9 pr-8 py-2 text-fl-sm placeholder:text-fog/70 focus:border-steel outline-none transition-colors"
                    />
                    {filters.q && (
                      <button type="button" onClick={() => setFilters({ ...filters, q: '' })} aria-label={t('work.clear')} className="absolute right-2 top-1/2 -translate-y-1/2 text-fog hover:text-ink">
                        <IconClose size={14} />
                      </button>
                    )}
                  </label>

                  <div className="inline-flex border border-line rounded-sm bg-white overflow-hidden" role="group" aria-label="View">
                    <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label={t('view.grid')} className={`w-9 h-9 flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-steel text-paper' : 'text-slate hover:text-ink'}`}><IconGrid size={15} /></button>
                    <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label={t('view.list')} className={`w-9 h-9 flex items-center justify-center transition-colors border-l border-line ${view === 'list' ? 'bg-steel text-paper' : 'text-slate hover:text-ink'}`}><IconList size={15} /></button>
                  </div>

                  <label className="relative">
                    <span className="sr-only">{t('work.sortBy')}</span>
                    <select
                      value={sort} onChange={e => setSort(e.target.value as SortKey)}
                      className="appearance-none bg-white border border-line rounded-sm pl-3 pr-8 h-9 text-[11px] font-semibold uppercase tracking-[.12em] text-slate hover:text-ink cursor-pointer focus:border-steel outline-none"
                    >
                      {SORTS.map(s => <option key={s} value={s}>{t('work.sortBy')}: {t(`sort.${s}`)}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-fog">▾</span>
                  </label>

                  <button
                    type="button" onClick={() => setFiltersOpen(o => !o)} aria-expanded={filtersOpen}
                    className={`lg:hidden inline-flex items-center gap-2 h-9 px-3 border rounded-sm text-[11px] font-semibold uppercase tracking-[.12em] transition-colors ${filtersOpen ? 'bg-ink text-paper border-ink' : 'bg-white border-line text-slate hover:text-ink'}`}
                  >
                    <IconFilter size={14} /> {t('filter.title')}
                    {activeCount > 0 && <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] rounded-full bg-steel text-paper text-[9px] px-1">{activeCount}</span>}
                  </button>
                </div>
              </div>

              {/* Grid / list */}
              {loading ? (
                <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5" aria-busy="true" aria-label={t('work.loading')}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white border border-line rounded-xl p-4 animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
                      <div className="h-5 w-24 rounded bg-frost" />
                      <div className="mt-3 aspect-[4/3] rounded-lg bg-frost" />
                      <div className="mt-4 h-4 w-3/4 rounded bg-frost" />
                      <div className="mt-2 h-3 w-1/2 rounded bg-frost" />
                      <div className="mt-6 h-9 rounded bg-frost" />
                    </div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-line bg-white p-10 text-center text-slate text-fl-sm">
                  {t('work.empty')}
                  {loadError && loadError !== 'not-configured' && <p className="mt-2 text-fl-xs text-fog">({loadError})</p>}
                </div>
              ) : sorted.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-line bg-white p-10 text-center text-fl-sm text-slate">
                  {t('work.noresults')}
                  <button type="button" onClick={() => setFilters({ ...emptyFilters })} className="block mx-auto mt-3 text-steel font-medium link-underline">{t('filter.reset')}</button>
                </div>
              ) : (
                <>
                  <div className={view === 'grid' ? 'mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'mt-6 space-y-3'}>
                    {gridItems}
                  </div>
                  {sorted.length > visible.length && (
                    <div className="mt-8 flex justify-center">
                      <button type="button" onClick={() => setPage(p => p + 1)} className={`${btnGhost} bg-white`}>
                        {t('work.viewMore')} <span className="text-fog tabular-nums">({sorted.length - visible.length})</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="scroll-mt-20">
        <div className="max-w-site mx-auto px-gutter py-section grid lg:grid-cols-[1fr_1.7fr] gap-10 lg:gap-16">
          <div className="reveal">
            <SectionTitle>{t('about.title')}</SectionTitle>
            <p className="mt-5 h-display text-[clamp(1.7rem,3vw,2.6rem)] text-ink">{t('about.lead')}</p>
            <p className="mt-5 text-fl-sm text-slate leading-relaxed">{t('about.proof')}</p>
            <p className="label-caps mt-7 mb-2.5">{t('about.web')}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {site.links.map(l => (
                <a key={l.key} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-fl-sm text-ink hover:text-steel transition-colors link-underline">
                  {l.label} <IconExternal size={12} className="text-fog" />
                </a>
              ))}
            </div>
          </div>
          <ol className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {CATEGORIES.map((k, i) => (
              <li key={k} className={`reveal reveal-delay-${i + 1} border-t-2 border-ink pt-4`}>
                <span className="text-fl-xs text-fog tabular-nums">0{i + 1}</span>
                <h3 className="mt-2 font-bold uppercase tracking-tight text-fl-lg">{t(`pillar.${k}.title`)}</h3>
                <p className="mt-2.5 text-fl-sm text-slate leading-relaxed">{t(`pillar.${k}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Faq />
      <BookCall />

      {slug && (
        <ProjectModal project={active} list={sorted} loading={loading} onClose={closeModal} onNavigate={goTo} />
      )}
    </div>
  )
}
