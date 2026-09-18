import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Article } from '../lib/articles'
import { useLang } from '../contexts/LanguageContext'
import { site, absoluteUrl } from '../lib/site'
import { renderContent, readingMinutes } from '../lib/richtext'
import { useLocalizedContent } from '../hooks/useLocalized'
import { IconClose, IconShare, IconExternal, IconChevronLeft, IconChevronRight, IconCheck, IconLanguage } from './Icons'

type Props = {
  article: Article | null
  list: Article[]
  loading?: boolean
  onClose: () => void
  onNavigate: (slug: string) => void
}

/** Reading sheet for an article: same behaviour as the project modal (Esc, arrows, focus trap, share). */
export default function ArticleModal({ article, list, loading, onClose, onNavigate }: Props) {
  const { t, locale } = useLang()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [toast, setToast] = useState('')
  const [closing, setClosing] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)

  const idx = article ? list.findIndex(a => a.id === article.id) : -1
  const prev = idx > 0 ? list[idx - 1] : null
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null

  const { content: autoContent, translating } = useLocalizedContent(article)

  const requestClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(onClose, reduced ? 0 : 230)
  }, [closing, onClose])

  useEffect(() => {
    const { overflow, paddingRight } = document.body.style
    const sb = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (sb > 0) document.body.style.paddingRight = `${sb}px`
    return () => { document.body.style.overflow = overflow; document.body.style.paddingRight = paddingRight }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); return }
      if (e.key === 'ArrowRight' && next) { onNavigate(next.slug); return }
      if (e.key === 'ArrowLeft' && prev) { onNavigate(prev.slug); return }
      if (e.key === 'Tab') {
        const root = panelRef.current?.parentElement
        if (!root) return
        const focusables = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null)
        if (!focusables.length) return
        const first = focusables[0], last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [next, prev, onNavigate, requestClose])

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    panelRef.current?.scrollTo({ top: 0 })
    setShowOriginal(false)
  }, [article?.id])

  const share = async () => {
    if (!article) return
    const url = absoluteUrl(`articles/${article.slug}`)
    try {
      if (navigator.share) { await navigator.share({ title: `${article.title} | ${site.name}`, url }); return }
      await navigator.clipboard.writeText(url)
      setToast(t('modal.copied'))
      window.setTimeout(() => setToast(''), 1800)
    } catch { /* user cancelled */ }
  }

  const i18n = article?._i18n
  const isTranslated = Boolean(article && i18n && (i18n.mode !== 'original' || (autoContent && autoContent !== article.content)))
  const view = article ? (
    showOriginal && i18n
      ? { title: i18n.original.title, summary: i18n.original.summary, content: i18n.original.content }
      : { title: article.title, summary: article.summary, content: autoContent ?? article.content }
  ) : null
  const autoMode = Boolean(article && i18n && (i18n.mode === 'auto' || (i18n.mode === 'original' && autoContent && autoContent !== article.content)))
  const date = article ? new Date(article.published_at).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return createPortal(
    <div className={`fixed inset-0 z-[60] ${closing ? 'modal-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="article-title">
      <div className="modal-backdrop absolute inset-0 bg-night/85 backdrop-blur-sm" onClick={requestClose} />

      <button ref={closeRef} type="button" onClick={requestClose} aria-label={t('modal.close')}
        className="absolute top-3 right-3 md:top-4 md:right-5 z-30 w-10 h-10 rounded-full bg-night/60 backdrop-blur ring-1 ring-paper/20 hover:bg-paper text-paper hover:text-night flex items-center justify-center transition-colors duration-300">
        <IconClose size={20} />
      </button>

      {prev && (
        <button type="button" onClick={() => onNavigate(prev.slug)} aria-label={`${t('modal.prev')}: ${prev.title}`}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper text-paper hover:text-night items-center justify-center transition-colors">
          <IconChevronLeft size={22} />
        </button>
      )}
      {next && (
        <button type="button" onClick={() => onNavigate(next.slug)} aria-label={`${t('modal.next')}: ${next.title}`}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper text-paper hover:text-night items-center justify-center transition-colors">
          <IconChevronRight size={22} />
        </button>
      )}

      <div className="absolute inset-x-0 top-0 md:top-[clamp(.75rem,3vh,2.25rem)] bottom-0 flex justify-center md:px-[clamp(0px,2vw,2rem)]">
        <div ref={panelRef} className="modal-panel relative w-full max-w-[860px] h-full bg-paper text-ink md:rounded-t-2xl shadow-modal overflow-y-auto overflow-x-hidden scroll-quiet pb-16 md:pb-10">
          {loading && <div className="p-10 text-slate text-fl-sm animate-pulse">{t('articles.loading')}</div>}

          {!loading && !article && (
            <div className="p-10 md:p-16 text-center">
              <p className="h-display text-fl-2xl">{t('articles.notfound')}</p>
              <Link to="/articles" className="mt-6 inline-block link-underline text-steel">{t('articles.back')}</Link>
            </div>
          )}

          {article && view && (
            <article key={article.id} className="animate-fade">
              {article.cover_url && (
                <figure className="relative bg-frost">
                  <img src={article.cover_url} alt={view.title} className="w-full max-h-[56vh] object-cover md:rounded-t-2xl" />
                </figure>
              )}
              <div className="px-[clamp(1.25rem,5vw,4.5rem)] pt-[clamp(1.75rem,4vw,3rem)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 label-caps">
                    <span className="text-ink">{t('articles.title')}</span>
                    <span>· {date}</span>
                    <span>· {readingMinutes(view.content ?? '')} {t('articles.minRead')}</span>
                  </p>
                  {isTranslated && (
                    <button type="button" onClick={() => setShowOriginal(o => !o)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 btn-text text-slate hover:border-steel hover:text-steel transition-colors">
                      <IconLanguage size={13} />
                      {translating ? t('modal.translating') : autoMode ? t('modal.autoTranslated') : t('modal.translation')}
                      <span className="text-fog">·</span>
                      <span className="text-steel">{showOriginal ? t('modal.showTranslated') : t('modal.showOriginal')}</span>
                    </button>
                  )}
                </div>

                <h1 id="article-title" className="mt-3 font-bold tracking-tight text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.05] text-ink max-w-3xl">{view.title}</h1>
                {view.summary && <p className="mt-5 text-fl-xl text-ink/75 leading-snug max-w-2xl">{view.summary}</p>}

                {article.tags.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('articles.tags')}>
                    {article.tags.map(tag => <li key={tag} className="rounded-full bg-frost text-steel px-3 py-1 text-fl-xs font-medium">{tag}</li>)}
                  </ul>
                )}

                {view.content && (
                  <div className={`mt-8 md:mt-10 space-y-5 text-fl-base leading-[1.85] text-ink/90 max-w-3xl transition-opacity duration-300 ${translating && !showOriginal ? 'opacity-60' : ''}`}>
                    {renderContent(view.content)}
                  </div>
                )}

                <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
                  <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full bg-steel text-paper px-5 py-3 btn-text hover:bg-ink transition-colors duration-300">
                    {toast ? <IconCheck size={15} /> : <IconShare size={15} />} {toast || t('modal.share')}
                  </button>
                  {article.external_url && (
                    <a href={article.external_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 btn-text hover:border-steel hover:text-steel transition-colors duration-300">
                      {t('articles.external')} <IconExternal size={15} />
                    </a>
                  )}
                </div>

                {(prev || next) && (
                  <nav className="mt-10 grid sm:grid-cols-2 gap-3" aria-label="More articles">
                    {prev ? (
                      <button type="button" onClick={() => onNavigate(prev.slug)} className="group text-left rounded-xl border border-line p-4 hover:border-steel transition-colors">
                        <span className="label-caps">← {t('modal.prev')}</span>
                        <span className="mt-1 block font-semibold tracking-tight text-fl-sm leading-snug group-hover:text-steel transition-colors">{prev.title}</span>
                      </button>
                    ) : <span />}
                    {next && (
                      <button type="button" onClick={() => onNavigate(next.slug)} className="group text-right rounded-xl border border-line p-4 hover:border-steel transition-colors">
                        <span className="label-caps">{t('modal.next')} →</span>
                        <span className="mt-1 block font-semibold tracking-tight text-fl-sm leading-snug group-hover:text-steel transition-colors">{next.title}</span>
                      </button>
                    )}
                  </nav>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
