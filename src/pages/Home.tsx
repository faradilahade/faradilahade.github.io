import { useEffect, useMemo, useRef, useState, useCallback, ReactNode } from 'react'
import { Link, useLocation, useMatch, useNavigate, useSearchParams } from 'react-router-dom'
import { Project, Category, CATEGORIES, fetchPublishedProjects, sortProjects } from '../lib/supabase'
import { Article, fetchPublishedArticles } from '../lib/articles'
import { useLang } from '../contexts/LanguageContext'
import { site, absoluteUrl } from '../lib/site'
import { useSeo, personJsonLd } from '../lib/seo'
import { useReveal } from '../hooks/useReveal'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import ProjectCard, { PromoTile, CAT_DOT } from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import ArticleCard from '../components/ArticleCard'
import ArticleModal from '../components/ArticleModal'
import { useLocalizedProjects, useLocalizedArticles } from '../hooks/useLocalized'
import Filters, { FilterState, emptyFilters, applyFilters, yearBoundsOf, activeFilterCount } from '../components/Filters'
import Faq, { faqItems } from '../components/Faq'
import BookCall from '../components/BookCall'
import {
  IconGrid, IconList, IconSearch, IconClose, IconFilter, IconExternal,
} from '../components/Icons'

type SortKey = 'featured' | 'newest' | 'oldest' | 'az'
type View = 'grid' | 'list'
const SORTS: SortKey[] = ['featured', 'newest', 'oldest', 'az']
const PAGE = 9

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

/** Section heading in the same register as the hero: thin tracked kicker + bold display title. */
function SectionHead({ kicker, title, sub, aside }: { kicker: string; title: string; sub?: string; aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 reveal">
      <div className="max-w-2xl">
        <p className="kicker">{kicker}</p>
        <h2 className="mt-2 h-display name-gradient text-[clamp(2rem,4.4vw,3.6rem)] tracking-[-0.03em]">{title}</h2>
        {sub && <p className="mt-3 text-fl-sm text-slate leading-relaxed">{sub}</p>}
      </div>
      {aside}
    </div>
  )
}

export default function Home() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const matchWork = useMatch('/work/:slug')
  const matchArticle = useMatch('/articles/:slug')
  const slug = matchWork?.params.slug ?? null
  const articleSlug = matchArticle?.params.slug ?? null

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
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
  const [articleQuery, setArticleQuery] = useState('')
  const [articleTag, setArticleTag] = useState<string | null>(null)

  const setFilters = useCallback((f: FilterState) => { setFiltersState(f); setPage(1) }, [])

  useEffect(() => {
    let alive = true
    fetchPublishedProjects().then(r => {
      if (!alive) return
      setProjects(r.projects)
      setLoadError(r.error)
      setLoading(false)
    })
    fetchPublishedArticles().then(r => {
      if (!alive) return
      setArticles(r.articles)
      setArticlesLoading(false)
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

  // Anchor navigation (/#work, /#articles, /#faq …)
  useEffect(() => {
    if (!location.hash) return
    const el = document.getElementById(location.hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [location.key, location.hash])

  // Content in the visitor's language (stored translations first, machine translation as fallback)
  const localized = useLocalizedProjects(projects)
  const localizedArticles = useLocalizedArticles(articles)

  const bounds = useMemo(() => yearBoundsOf(projects), [projects])
  const catLabel = useCallback((c: Category) => t(`cat.${c}`), [t])
  const filtered = useMemo(() => applyFilters(localized, filters, bounds, catLabel), [localized, filters, bounds, catLabel])
  const sorted = useMemo(() => sortList(filtered, sort), [filtered, sort])
  const visible = useMemo(() => sorted.slice(0, page * PAGE), [sorted, page])
  const activeCount = activeFilterCount(filters, bounds)

  const articleTags = useMemo(() => {
    const m = new Map<string, number>()
    articles.forEach(a => a.tags.forEach(tg => m.set(tg, (m.get(tg) ?? 0) + 1)))
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tg]) => tg)
  }, [articles])
  const shownArticles = useMemo(() => {
    const needle = articleQuery.trim().toLowerCase()
    return localizedArticles.filter(a => {
      if (articleTag && !a.tags.includes(articleTag)) return false
      if (!needle) return true
      const hay = [a.title, a.summary ?? '', ...a.tags, a._i18n?.original.title ?? '', a._i18n?.original.summary ?? ''].join(' ').toLowerCase()
      return hay.includes(needle)
    })
  }, [localizedArticles, articleQuery, articleTag])

  const active = slug ? localized.find(p => p.slug === slug) ?? null : null
  const activeArticle = articleSlug ? localizedArticles.find(a => a.slug === articleSlug) ?? null : null
  const closeModal = useCallback(() => navigate({ pathname: '/', search: location.search }), [navigate, location.search])
  const goTo = useCallback((s: string) => navigate({ pathname: `/work/${s}`, search: location.search }, { replace: true }), [navigate, location.search])
  const goToArticle = useCallback((s: string) => navigate({ pathname: `/articles/${s}`, search: location.search }, { replace: true }), [navigate, location.search])

  useReveal([projects.length, visible.length, view, sort, loading, shownArticles.length, articlesLoading])

  // ---- SEO -------------------------------------------------------
  const homeJsonLd = useMemo(() => {
    const ld: Record<string, unknown>[] = [personJsonLd(lang)]
    if (projects.length) {
      ld.push({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `${site.name} | ${t('work.title')}`,
        itemListElement: localized.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`work/${p.slug}`), name: p.title })),
      })
    }
    if (articles.length) {
      ld.push({
        '@context': 'https://schema.org', '@type': 'Blog', name: `${site.name} | ${t('articles.title')}`, url: absoluteUrl('#articles'),
        blogPost: localizedArticles.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: absoluteUrl(`articles/${a.slug}`), datePublished: a.published_at, author: { '@type': 'Person', name: site.name } })),
      })
    }
    ld.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqItems(t).map(it => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
    })
    return ld
  }, [localized, localizedArticles, articles.length, projects.length, lang, t])

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

  const articleJsonLd = useMemo(() => {
    if (!activeArticle) return undefined
    return {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: activeArticle.title, description: activeArticle.summary ?? undefined,
      url: absoluteUrl(`articles/${activeArticle.slug}`), image: activeArticle.cover_url ?? undefined,
      datePublished: activeArticle.published_at, dateModified: activeArticle.updated_at,
      keywords: activeArticle.tags.join(', '),
      author: { '@type': 'Person', name: site.name, url: absoluteUrl('') },
    }
  }, [activeArticle])

  const allTools = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tools))), [projects])

  useSeo(active
    ? {
        title: `${active.title} | ${t(`cat.${active.category}`)} case study`,
        description: active.summary ?? `${active.title}, a ${t(`cat.${active.category}`).toLowerCase()} project by ${site.name}.`,
        path: `work/${active.slug}`, type: 'article', image: active.cover_url,
        keywords: [...active.keywords, ...active.tags, ...active.tools, site.name], jsonLd: projectJsonLd,
      }
    : activeArticle
      ? {
          title: activeArticle.title,
          description: activeArticle.summary ?? `${activeArticle.title}, ${t('articles.title')} by ${site.name}.`,
          path: `articles/${activeArticle.slug}`, type: 'article', image: activeArticle.cover_url,
          keywords: [...activeArticle.tags, site.name], jsonLd: articleJsonLd,
        }
      : {
          title: t('seo.home.title'), description: t('seo.home.desc'), path: '', type: 'profile',
          keywords: [...site.keywords, ...allTools.slice(0, 15)], jsonLd: homeJsonLd,
        })

  const crumb = filters.fields.length === 1 ? t(`cat.${filters.fields[0]}`) : t('work.all')

  // Grid items with the promo tile in the 6th slot (or at the end for short lists)
  const gridItems = useMemo<ReactNode[]>(() => {
    const items: ReactNode[] = visible.map((p, i) => <ProjectCard key={p.id} p={p} index={i} view={view} />)
    if (view === 'grid' && visible.length > 0) items.splice(Math.min(5, items.length), 0, <PromoTile key="promo" />)
    return items
  }, [visible, view])

  const btnGhost = 'inline-flex items-center justify-center gap-2.5 ring-1 ring-ink/15 bg-white/60 text-slate px-6 py-3.5 btn-text rounded-full hover:ring-steel hover:text-steel transition-colors duration-300'
  const emptyBox = 'mt-6 glass p-10 text-center text-fl-sm text-slate'
  const toggleBtn = (on: boolean) => `w-9 h-9 flex items-center justify-center transition-colors ${on ? 'bg-ink text-paper' : 'text-slate hover:text-ink'}`

  const skeleton = (n: number) => (
    <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5" aria-busy="true" aria-label={t('work.loading')}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="glass p-4 animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="h-5 w-24 rounded bg-ink/[.06]" />
          <div className="mt-3 aspect-[4/3] rounded-xl bg-ink/[.06]" />
          <div className="mt-4 h-4 w-3/4 rounded bg-ink/[.06]" />
          <div className="mt-2 h-3 w-1/2 rounded bg-ink/[.06]" />
          <div className="mt-6 h-9 rounded-full bg-ink/[.06]" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="page-enter">
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= WORK ================= */}
      <section id="work" className="relative scroll-mt-16">
        <div className="max-w-site mx-auto px-gutter pt-6 pb-section">
          <p className="label-caps flex items-center gap-2 flex-wrap reveal">
            <Link to="/" className="hover:text-ink transition-colors">{t('work.home')}</Link>
            <span>/</span>
            <span>{t('work.title')}</span>
            <span>/</span>
            <span className="text-ink">{crumb}</span>
          </p>

          <div className="mt-4">
            <SectionHead
              kicker={CATEGORIES.map(c => t(`cat.${c}`)).join(' · ')}
              title={t('work.title')}
              sub={t('work.sub')}
              aside={(
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('filter.field')}>
                  <button type="button" onClick={() => setFilters({ ...filters, fields: [] })} className={`chip ${filters.fields.length === 0 ? 'chip-on' : 'chip-off'}`}>{t('work.chip.all')}</button>
                  {CATEGORIES.map(c => {
                    const on = filters.fields.length === 1 && filters.fields[0] === c
                    const n = projects.filter(p => p.category === c).length
                    return (
                      <button key={c} type="button" onClick={() => setFilters({ ...filters, fields: on ? [] : [c] })} className={`chip ${on ? 'chip-on' : 'chip-off'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${on ? 'bg-tide' : CAT_DOT[c]}`} aria-hidden="true" />
                        {t(`cat.${c}`)}
                        {!loading && <span className={`tabular-nums ${on ? 'text-paper/60' : 'text-fog'}`}>{n}</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            />
          </div>

          <div className="mt-8 grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 xl:gap-12 items-start">
            {/* Sidebar */}
            <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-20 self-start glass p-5 reveal`}>
              <Filters projects={projects} filters={filters} bounds={bounds} onChange={setFilters} />
            </aside>

            {/* Results */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pb-4 border-b border-ink/[.08] reveal">
                <SectionTitle count={loading ? undefined : sorted.length} as="h3">{t('work.results')}</SectionTitle>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
                  <label className="relative flex-1 min-w-[180px] sm:w-64">
                    <span className="sr-only">{t('work.search')}</span>
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog pointer-events-none" />
                    <input
                      type="search" value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })}
                      placeholder={t('work.search')}
                      className="glass-input w-full pl-9 pr-8 py-2 text-fl-sm"
                    />
                    {filters.q && (
                      <button type="button" onClick={() => setFilters({ ...filters, q: '' })} aria-label={t('work.clear')} className="absolute right-2 top-1/2 -translate-y-1/2 text-fog hover:text-ink">
                        <IconClose size={14} />
                      </button>
                    )}
                  </label>

                  <div className="inline-flex rounded-lg glass-input overflow-hidden" role="group" aria-label="View">
                    <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label={t('view.grid')} className={toggleBtn(view === 'grid')}><IconGrid size={15} /></button>
                    <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label={t('view.list')} className={toggleBtn(view === 'list')}><IconList size={15} /></button>
                  </div>

                  <label className="relative">
                    <span className="sr-only">{t('work.sortBy')}</span>
                    <select
                      value={sort} onChange={e => setSort(e.target.value as SortKey)}
                      className="glass-input appearance-none pl-3 pr-8 h-9 btn-text text-slate hover:text-ink cursor-pointer"
                    >
                      {SORTS.map(s => <option key={s} value={s}>{t('work.sortBy')}: {t(`sort.${s}`)}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-fog">▾</span>
                  </label>

                  <button
                    type="button" onClick={() => setFiltersOpen(o => !o)} aria-expanded={filtersOpen}
                    className={`lg:hidden inline-flex items-center gap-2 h-9 px-3 rounded-lg btn-text transition-colors ${filtersOpen ? 'bg-ink text-paper' : 'glass-input text-slate hover:text-ink'}`}
                  >
                    <IconFilter size={14} /> {t('filter.title')}
                    {activeCount > 0 && <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] rounded-full bg-ink text-paper text-[9px] px-1">{activeCount}</span>}
                  </button>
                </div>
              </div>

              {/* Grid / list */}
              {loading ? skeleton(6) : projects.length === 0 ? (
                <div className={emptyBox}>
                  {t('work.empty')}
                  {loadError && loadError !== 'not-configured' && <p className="mt-2 text-fl-xs text-fog">({loadError})</p>}
                </div>
              ) : sorted.length === 0 ? (
                <div className={emptyBox}>
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
                      <button type="button" onClick={() => setPage(p => p + 1)} className={btnGhost}>
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

      {/* ================= ARTICLES ================= */}
      <section id="articles" className="relative scroll-mt-16">
        <div className="max-w-site mx-auto px-gutter pb-section">
          <SectionHead
            kicker={t('articles.kicker')}
            title={t('articles.title')}
            sub={t('articles.sub')}
            aside={(
              <label className="relative w-full sm:w-72">
                <span className="sr-only">{t('articles.search')}</span>
                <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog pointer-events-none" />
                <input type="search" value={articleQuery} onChange={e => setArticleQuery(e.target.value)} placeholder={t('articles.search')} className="glass-input w-full pl-9 pr-8 py-2.5 text-fl-sm" />
                {articleQuery && (
                  <button type="button" onClick={() => setArticleQuery('')} aria-label={t('work.clear')} className="absolute right-2 top-1/2 -translate-y-1/2 text-fog hover:text-ink"><IconClose size={14} /></button>
                )}
              </label>
            )}
          />

          {articleTags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2 reveal" role="group" aria-label={t('articles.tags')}>
              <button type="button" onClick={() => setArticleTag(null)} className={`chip ${articleTag === null ? 'chip-on' : 'chip-off'}`}>{t('work.chip.all')}</button>
              {articleTags.slice(0, 10).map(tg => (
                <button key={tg} type="button" onClick={() => setArticleTag(articleTag === tg ? null : tg)} className={`chip ${articleTag === tg ? 'chip-on' : 'chip-off'}`}>{tg}</button>
              ))}
            </div>
          )}

          {articlesLoading ? skeleton(3) : articles.length === 0 ? (
            <div className={emptyBox}>{t('articles.empty')}</div>
          ) : shownArticles.length === 0 ? (
            <div className={emptyBox}>
              {t('articles.noresults')}
              <button type="button" onClick={() => { setArticleQuery(''); setArticleTag(null) }} className="block mx-auto mt-3 text-steel font-medium link-underline">{t('filter.reset')}</button>
            </div>
          ) : (
            <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {shownArticles.map((a, i) => <ArticleCard key={a.id} a={a} index={i} featuredLayout={i === 0 && a.featured && shownArticles.length > 1} />)}
            </div>
          )}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="scroll-mt-16 relative">
        <div className="max-w-site mx-auto px-gutter pb-section grid lg:grid-cols-[1fr_1.7fr] gap-10 lg:gap-16">
          <div className="reveal">
            <p className="kicker">{t('about.title')}</p>
            <h2 className="mt-2 h-display name-gradient text-[clamp(1.8rem,3.4vw,2.8rem)] tracking-[-0.03em]">{t('about.lead')}</h2>
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
          <ol className="grid sm:grid-cols-3 gap-4 lg:gap-5">
            {CATEGORIES.map((k, i) => (
              <li key={k} className={`reveal reveal-delay-${i + 1} glass glass-hover p-5 md:p-6`}>
                <div className="flex items-center justify-between">
                  <span className="text-fl-xs text-fog tabular-nums">0{i + 1}</span>
                  <span className={`w-2 h-2 rounded-full ${CAT_DOT[k]}`} aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-bold uppercase tracking-tight text-fl-lg">{t(`pillar.${k}.title`)}</h3>
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
      {articleSlug && (
        <ArticleModal article={activeArticle} list={localizedArticles} loading={articlesLoading} onClose={closeModal} onNavigate={goToArticle} />
      )}
    </div>
  )
}
