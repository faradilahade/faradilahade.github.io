import { useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Project, isImageUrl } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import { site, mailto, absoluteUrl } from '../lib/site'
import ToolBadge from './ToolBadge'
import { CAT_DOT } from './ProjectCard'
import {
  IconClose, IconMail, IconShare, IconTools, IconFile, IconExternal,
  IconChevronLeft, IconChevronRight, IconDownload, IconCheck,
} from './Icons'

type Props = {
  project: Project | null
  /** Ordered list the arrows navigate through */
  list: Project[]
  loading?: boolean
  onClose: () => void
  onNavigate: (slug: string) => void
}

/** Minimal formatting: "## " headings, "- " bullets, blank-line paragraphs. */
function renderContent(text: string): ReactNode[] {
  const lines = text.split(/\r?\n/)
  const out: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc pl-5 space-y-1.5 marker:text-brass">
          {list.map((li, i) => <li key={i}>{li}</li>)}
        </ul>,
      )
      list = []
    }
  }
  lines.forEach((raw, i) => {
    const line = raw.trim()
    if (!line) { flush(); return }
    if (line.startsWith('## ')) { flush(); out.push(<h2 key={i} className="font-display text-fl-xl text-ink pt-3">{line.slice(3)}</h2>); return }
    if (line.startsWith('# ')) { flush(); out.push(<h2 key={i} className="font-display text-fl-xl text-ink pt-3">{line.slice(2)}</h2>); return }
    if (/^[-•*]\s+/.test(line)) { list.push(line.replace(/^[-•*]\s+/, '')); return }
    flush()
    out.push(<p key={i}>{line}</p>)
  })
  flush()
  return out
}

export default function ProjectModal({ project, list, loading, onClose, onNavigate }: Props) {
  const { t, locale } = useLang()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [toast, setToast] = useState('')
  const [closing, setClosing] = useState(false)

  const idx = project ? list.findIndex(p => p.id === project.id) : -1
  const prev = idx > 0 ? list[idx - 1] : null
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null

  const requestClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(onClose, reduced ? 0 : 230)
  }, [closing, onClose])

  // Lock page scroll while open
  useEffect(() => {
    const { overflow, paddingRight } = document.body.style
    const sb = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (sb > 0) document.body.style.paddingRight = `${sb}px`
    return () => { document.body.style.overflow = overflow; document.body.style.paddingRight = paddingRight }
  }, [])

  // Keyboard: Esc closes, arrows navigate, Tab stays inside
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); return }
      if (e.key === 'ArrowRight' && next) { onNavigate(next.slug); return }
      if (e.key === 'ArrowLeft' && prev) { onNavigate(prev.slug); return }
      if (e.key === 'Tab') {
        const root = panelRef.current?.parentElement
        if (!root) return
        const focusables = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .filter(el => el.offsetParent !== null)
        if (focusables.length === 0) return
        const first = focusables[0], last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [next, prev, onNavigate, requestClose])

  // Focus + scroll to top when the project changes
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    panelRef.current?.scrollTo({ top: 0 })
  }, [project?.id])

  const gallery = useMemo(() => {
    if (!project) return []
    const fromAttachments = project.attachments.filter(a => isImageUrl(a.url)).map(a => a.url)
    return Array.from(new Set([...project.gallery, ...fromAttachments]))
  }, [project])

  const files = useMemo(
    () => (project ? project.attachments.filter(a => !isImageUrl(a.url)) : []),
    [project],
  )

  const keywords = useMemo(
    () => (project ? Array.from(new Set([...project.keywords, ...project.tags])) : []),
    [project],
  )

  const share = async () => {
    if (!project) return
    const url = absoluteUrl(`work/${project.slug}`)
    try {
      if (navigator.share) { await navigator.share({ title: `${project.title} — ${site.name}`, url }); return }
      await navigator.clipboard.writeText(url)
      setToast(t('modal.copied'))
      window.setTimeout(() => setToast(''), 1800)
    } catch { /* user cancelled */ }
  }

  const scrollTo = (id: string) => {
    panelRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const contactHref = project
    ? mailto(`${t('modal.subject')}${project.title}`, `Hi ${site.firstName},\n\nI saw "${project.title}" on your portfolio (${absoluteUrl(`work/${project.slug}`)}) and would like to talk about\n\n`)
    : mailto()

  const date = project ? new Date(project.created_at).toLocaleDateString(locale, { year: 'numeric', month: 'long' }) : ''

  const railBtn = (label: string, icon: ReactNode, onClick?: () => void, href?: string, extra = '') => {
    const inner = <><span>{icon}</span><span>{label}</span></>
    return href ? (
      <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className={`rail-btn ${extra}`}>{inner}</a>
    ) : (
      <button type="button" onClick={onClick} className={`rail-btn ${extra}`}>{inner}</button>
    )
  }

  // Rendered into <body> so no page-level stacking context (e.g. the route fade) can trap it under the navbar
  return createPortal(
    <div
      className={`fixed inset-0 z-[60] ${closing ? 'modal-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <div className="modal-backdrop absolute inset-0 bg-night/85 backdrop-blur-sm" onClick={requestClose} />

      {/* Close — always top right, like Behance */}
      <button
        ref={closeRef}
        type="button"
        onClick={requestClose}
        aria-label={t('modal.close')}
        className="absolute top-3 right-3 md:top-4 md:right-5 z-30 w-10 h-10 rounded-full bg-night/60 backdrop-blur ring-1 ring-paper/20 hover:bg-paper text-paper hover:text-night flex items-center justify-center transition-colors duration-300"
      >
        <IconClose size={20} />
      </button>

      {/* Desktop prev / next at the edges */}
      {prev && (
        <button
          type="button"
          onClick={() => onNavigate(prev.slug)}
          aria-label={`${t('modal.prev')}: ${prev.title}`}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper text-paper hover:text-night items-center justify-center transition-colors"
        >
          <IconChevronLeft size={22} />
        </button>
      )}

      <div className="absolute inset-x-0 top-0 md:top-[clamp(.75rem,3vh,2.25rem)] bottom-0 flex justify-center gap-5 md:px-[clamp(0px,2vw,2rem)]">
        {/* Panel — full-screen on phones, floating sheet on larger screens */}
        <div
          ref={panelRef}
          className="modal-panel relative w-full max-w-[1040px] h-full bg-paper text-ink md:rounded-t-2xl shadow-modal overflow-y-auto overflow-x-hidden scroll-quiet pb-24 md:pb-10"
        >
          {loading && (
            <div className="p-10 text-slate text-fl-sm animate-pulse">{t('work.loading')}</div>
          )}

          {!loading && !project && (
            <div className="p-10 md:p-16 text-center">
              <p className="font-display text-fl-2xl">{t('modal.notfound')}</p>
              <Link to="/" className="mt-6 inline-block link-underline text-steel">{t('modal.backToWork')}</Link>
            </div>
          )}

          {project && (
            <article key={project.id} className="animate-fade">
              {project.cover_url && (
                <figure className="relative bg-mist">
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    className="w-full max-h-[62vh] object-cover md:rounded-t-2xl"
                  />
                </figure>
              )}

              <div className="px-[clamp(1.25rem,5vw,4.5rem)] pt-[clamp(1.75rem,4vw,3.25rem)]">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fl-xs uppercase tracking-[.14em] text-slate">
                  <span className="inline-flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${CAT_DOT[project.category]}`} />
                    {t(`cat.${project.category}`)}
                  </span>
                  {project.year && <span>· {project.year}</span>}
                  {project.client && <span>· {project.client}</span>}
                </p>
                <h1 id="project-title" className="mt-3 font-display text-fl-3xl leading-[1.08] tracking-tight text-ink max-w-3xl">
                  {project.title}
                </h1>
                {project.summary && (
                  <p className="mt-5 text-fl-lg text-slate leading-relaxed max-w-2xl">{project.summary}</p>
                )}

                <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 border-y border-mist py-5 text-fl-sm">
                  {project.role && (<div><dt className="text-slate text-fl-xs uppercase tracking-wider">{t('modal.role')}</dt><dd className="mt-1 text-ink">{project.role}</dd></div>)}
                  {project.client && (<div><dt className="text-slate text-fl-xs uppercase tracking-wider">{t('modal.client')}</dt><dd className="mt-1 text-ink">{project.client}</dd></div>)}
                  <div><dt className="text-slate text-fl-xs uppercase tracking-wider">{t('modal.category')}</dt><dd className="mt-1 text-ink">{t(`cat.${project.category}`)}</dd></div>
                  <div><dt className="text-slate text-fl-xs uppercase tracking-wider">{project.year ? t('modal.year') : t('modal.published')}</dt><dd className="mt-1 text-ink">{project.year ?? date}</dd></div>
                </dl>

                {project.content && (
                  <div className="mt-8 md:mt-10 space-y-5 text-fl-base leading-[1.8] text-ink/90 max-w-3xl">
                    {renderContent(project.content)}
                  </div>
                )}

                {project.embed_url && (
                  <div className="mt-10 rounded-xl overflow-hidden ring-1 ring-mist bg-mist">
                    <iframe
                      src={project.embed_url}
                      title={`${project.title} — Behance`}
                      loading="lazy"
                      allowFullScreen
                      allow="clipboard-write"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="w-full aspect-[404/316] md:aspect-[16/9]"
                    />
                  </div>
                )}

                {gallery.length > 0 && (
                  <section className="mt-10 md:mt-12" aria-label={t('modal.gallery')}>
                    <div className="space-y-4 md:space-y-6">
                      {gallery.map((src, i) => (
                        <figure key={src} className="rounded-xl overflow-hidden bg-mist ring-1 ring-mist">
                          <img src={src} alt={`${project.title} — ${i + 1}`} loading="lazy" decoding="async" className="w-full h-auto" />
                        </figure>
                      ))}
                    </div>
                  </section>
                )}

                <div className="mt-10 md:mt-12 grid gap-8 md:grid-cols-2">
                  {project.tools.length > 0 && (
                    <section id="tools" className="scroll-mt-6">
                      <h2 className="text-fl-xs uppercase tracking-[.14em] text-slate">{t('modal.toolsTitle')}</h2>
                      <ul className="mt-3 flex flex-wrap gap-2.5">
                        {project.tools.map(tool => (
                          <li key={tool} className="inline-flex items-center gap-2 rounded-full border border-mist bg-white pl-1 pr-3 py-1 text-fl-sm">
                            <ToolBadge name={tool} size="sm" /> {tool}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {keywords.length > 0 && (
                    <section>
                      <h2 className="text-fl-xs uppercase tracking-[.14em] text-slate">{t('modal.keywords')}</h2>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {keywords.map(k => (
                          <li key={k} className="rounded-full bg-mist/70 text-slate px-3 py-1 text-fl-xs">{k}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                {files.length > 0 && (
                  <section id="files" className="mt-10 scroll-mt-6">
                    <h2 className="text-fl-xs uppercase tracking-[.14em] text-slate">{t('modal.attachments')}</h2>
                    <ul className="mt-3 divide-y divide-mist border-y border-mist">
                      {files.map((a, i) => (
                        <li key={i}>
                          <a href={a.url} target="_blank" rel="noreferrer" className="group flex items-center gap-3 py-3 text-fl-sm hover:text-steel transition-colors">
                            <IconFile size={18} className="text-slate group-hover:text-steel" />
                            <span className="flex-1 truncate">{a.name}</span>
                            <IconDownload size={16} className="text-slate opacity-60 group-hover:opacity-100" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-mist pt-8">
                  <a href={contactHref} className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-5 py-2.5 text-fl-sm hover:bg-steel transition-colors duration-300">
                    <IconMail size={16} /> {t('modal.ask')}
                  </a>
                  {project.external_url && (
                    <a href={project.external_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-fl-sm hover:border-brass hover:text-brass transition-colors duration-300">
                      {t('modal.viewExternal')} <IconExternal size={15} />
                    </a>
                  )}
                </div>

                {(prev || next) && (
                  <nav className="mt-10 grid sm:grid-cols-2 gap-3" aria-label="More projects">
                    {prev ? (
                      <button type="button" onClick={() => onNavigate(prev.slug)} className="group text-left rounded-xl border border-mist p-4 hover:border-steel transition-colors">
                        <span className="text-fl-xs text-slate uppercase tracking-wider">← {t('modal.prev')}</span>
                        <span className="mt-1 block font-display text-fl-lg leading-snug group-hover:text-steel transition-colors">{prev.title}</span>
                      </button>
                    ) : <span />}
                    {next && (
                      <button type="button" onClick={() => onNavigate(next.slug)} className="group text-right rounded-xl border border-mist p-4 hover:border-steel transition-colors">
                        <span className="text-fl-xs text-slate uppercase tracking-wider">{t('modal.next')} →</span>
                        <span className="mt-1 block font-display text-fl-lg leading-snug group-hover:text-steel transition-colors">{next.title}</span>
                      </button>
                    )}
                  </nav>
                )}
              </div>
            </article>
          )}
        </div>

        {/* Right rail — desktop */}
        {project && (
          <aside className="hidden md:flex flex-col items-center gap-5 pt-14 shrink-0 w-[68px]" aria-label="Project actions">
            {railBtn(t('modal.contact'), <IconMail size={20} />, undefined, contactHref, 'is-primary')}
            {project.tools.length > 0 && railBtn(t('modal.tools'), <IconTools size={20} />, () => scrollTo('tools'))}
            {files.length > 0 && railBtn(t('modal.files'), <IconFile size={20} />, () => scrollTo('files'))}
            {railBtn(t('modal.share'), toast ? <IconCheck size={20} /> : <IconShare size={20} />, share)}
            {project.external_url && railBtn(t('modal.open'), <IconExternal size={20} />, undefined, project.external_url)}
            <div className="w-6 border-t border-paper/15 my-1" />
            {next && (
              <button type="button" onClick={() => onNavigate(next.slug)} className="rail-btn" aria-label={`${t('modal.next')}: ${next.title}`}>
                <span><IconChevronRight size={22} /></span><span>{t('modal.next')}</span>
              </button>
            )}
          </aside>
        )}
      </div>

      {/* Bottom bar — mobile */}
      {project && (
        <div className="md:hidden absolute inset-x-0 bottom-0 z-30 bg-night/92 backdrop-blur border-t border-paper/10 px-2 py-2 flex items-center justify-around" role="toolbar" aria-label="Project actions">
          {railBtn(t('modal.contact'), <IconMail size={18} />, undefined, contactHref, 'is-primary')}
          {project.tools.length > 0 && railBtn(t('modal.tools'), <IconTools size={18} />, () => scrollTo('tools'))}
          {files.length > 0 && railBtn(t('modal.files'), <IconFile size={18} />, () => scrollTo('files'))}
          {railBtn(t('modal.share'), toast ? <IconCheck size={18} /> : <IconShare size={18} />, share)}
          {next && (
            <button type="button" onClick={() => onNavigate(next.slug)} className="rail-btn" aria-label={`${t('modal.next')}: ${next.title}`}>
              <span><IconChevronRight size={20} /></span><span>{t('modal.next')}</span>
            </button>
          )}
        </div>
      )}

      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-8 z-40 bg-paper text-ink text-fl-sm px-4 py-2 rounded-full shadow-lift animate-pop">
          {toast}
        </div>
      )}
    </div>,
    document.body,
  )
}
