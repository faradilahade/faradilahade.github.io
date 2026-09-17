import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured, Project, normalizeProject, sortProjects } from '../../lib/supabase'
import { Article, normalizeArticle, sortArticles, isMissingArticlesTable } from '../../lib/articles'
import { site, absoluteUrl } from '../../lib/site'
import { useSeo } from '../../lib/seo'
import { IconHome, IconLayers, IconPlus, IconUser, IconExternal, IconLogout, IconMenu, IconClose, IconFile, IconEdit } from '../../components/Icons'
import Overview from './Overview'
import ProjectsTable from './ProjectsTable'
import ProjectEditor from './ProjectEditor'
import ArticlesTable from './ArticlesTable'
import ArticleEditor from './ArticleEditor'
import AccountPanel from './AccountPanel'
import {
  Draft, emptyDraft, draftFromProject, payloadFromDraft, hint, clearLocalDraft, slugify,
  ArticleDraft, emptyArticleDraft, draftFromArticle, payloadFromArticleDraft, clearLocalArticle,
} from './shared'

type View = 'overview' | 'projects' | 'editor' | 'articles' | 'articleEditor' | 'account'

export default function Dashboard() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesMissing, setArticlesMissing] = useState(false)
  const [view, setView] = useState<View>('overview')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [articleDraft, setArticleDraft] = useState<ArticleDraft | null>(null)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useSeo({ title: 'Portfolio admin', description: 'Manage projects and articles', noindex: true })

  const notify = useCallback((kind: 'ok' | 'err', text: string) => {
    setToast({ kind, text })
    if (kind === 'ok') window.setTimeout(() => setToast(null), 3500)
  }, [])

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) { notify('err', hint(error.message)); return }
    setProjects(sortProjects((data ?? []).map(normalizeProject)))
  }, [notify])

  const loadArticles = useCallback(async () => {
    const { data, error } = await supabase.from('articles').select('*').order('published_at', { ascending: false })
    if (error) {
      if (isMissingArticlesTable(error.message)) { setArticlesMissing(true); setArticles([]); return }
      notify('err', hint(error.message)); return
    }
    setArticlesMissing(false)
    setArticles(sortArticles((data ?? []).map(normalizeArticle)))
  }, [notify])

  useEffect(() => {
    if (!supabaseConfigured) { nav('/admin', { replace: true }); return }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav('/admin', { replace: true })
      else { setEmail(data.session.user.email ?? ''); load(); loadArticles() }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav('/admin', { replace: true })
    })
    return () => sub.subscription.unsubscribe()
  }, [nav, load, loadArticles])

  useEffect(() => { window.scrollTo({ top: 0 }) }, [view])

  async function signOut() {
    await supabase.auth.signOut()
    nav('/admin', { replace: true })
  }

  // ---- projects -----------------------------------------------------------
  const startNew = () => { setDraft({ ...emptyDraft }); setView('editor'); setToast(null) }
  const startEdit = (p: Project) => { setDraft(draftFromProject(p)); setView('editor'); setToast(null) }
  const cancelEdit = () => { setDraft(null); setView('projects') }

  const updateDraft = (u: Draft | ((d: Draft) => Draft)) =>
    setDraft(d => (d ? (typeof u === 'function' ? u(d) : u) : d))

  async function save(publish?: boolean) {
    if (!draft) return
    setSaving(true)
    const payload = payloadFromDraft(publish === undefined ? draft : { ...draft, published: publish ? true : draft.published })
    const q = draft.id
      ? supabase.from('projects').update(payload).eq('id', draft.id)
      : supabase.from('projects').insert(payload)
    const { error } = await q
    setSaving(false)
    if (error) { notify('err', hint(error.message)); return }
    clearLocalDraft(draft.id)
    notify('ok', draft.id ? (payload.published ? 'Project updated and live.' : 'Draft saved.') : (payload.published ? 'Project published.' : 'Draft created.'))
    setDraft(null)
    setView('projects')
    load()
  }

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    setBusyId(p.id)
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    setBusyId(null)
    if (error) notify('err', hint(error.message))
    else { notify('ok', 'Project deleted.'); load() }
  }

  async function toggle(p: Project, field: 'published' | 'featured') {
    setBusyId(p.id)
    const { error } = await supabase.from('projects').update({ [field]: !p[field] }).eq('id', p.id)
    setBusyId(null)
    if (error) notify('err', hint(error.message))
    load()
  }

  async function duplicate(p: Project) {
    setBusyId(p.id)
    const base = payloadFromDraft(draftFromProject(p))
    const payload = { ...base, title: `${p.title} (copy)`, slug: slugify(`${p.slug}-copy-${Math.random().toString(36).slice(2, 6)}`), published: false, featured: false }
    const { error } = await supabase.from('projects').insert(payload)
    setBusyId(null)
    if (error) notify('err', hint(error.message))
    else { notify('ok', 'Duplicated as a draft.'); load() }
  }

  /** Swap with the neighbour in the current order; normalise sort_order to the list index. */
  async function reorder(p: Project, dir: -1 | 1) {
    const list = [...projects]
    const i = list.findIndex(x => x.id === p.id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= list.length) return
    ;[list[i], list[j]] = [list[j], list[i]]
    setBusyId(p.id)
    const updates = list.map((x, idx) => (x.sort_order !== idx ? supabase.from('projects').update({ sort_order: idx }).eq('id', x.id) : null)).filter(Boolean)
    const results = await Promise.all(updates as PromiseLike<{ error: { message: string } | null }>[])
    setBusyId(null)
    const failed = results.find(r => r.error)
    if (failed?.error) notify('err', hint(failed.error.message))
    load()
  }

  // ---- articles -----------------------------------------------------------
  const startNewArticle = () => { setArticleDraft({ ...emptyArticleDraft, published_at: new Date().toISOString().slice(0, 10) }); setView('articleEditor'); setToast(null) }
  const startEditArticle = (a: Article) => { setArticleDraft(draftFromArticle(a)); setView('articleEditor'); setToast(null) }
  const cancelArticle = () => { setArticleDraft(null); setView('articles') }
  const updateArticleDraft = (u: ArticleDraft | ((d: ArticleDraft) => ArticleDraft)) =>
    setArticleDraft(d => (d ? (typeof u === 'function' ? u(d) : u) : d))

  async function saveArticle(publish?: boolean) {
    if (!articleDraft) return
    setSaving(true)
    const payload = payloadFromArticleDraft(publish === undefined ? articleDraft : { ...articleDraft, published: publish ? true : articleDraft.published })
    const q = articleDraft.id
      ? supabase.from('articles').update(payload).eq('id', articleDraft.id)
      : supabase.from('articles').insert(payload)
    const { error } = await q
    setSaving(false)
    if (error) { notify('err', hint(error.message)); return }
    clearLocalArticle(articleDraft.id)
    notify('ok', articleDraft.id ? (payload.published ? 'Article updated and live.' : 'Draft saved.') : (payload.published ? 'Article published.' : 'Draft created.'))
    setArticleDraft(null)
    setView('articles')
    loadArticles()
  }

  async function removeArticle(a: Article) {
    if (!confirm(`Delete "${a.title}"? This cannot be undone.`)) return
    setBusyId(a.id)
    const { error } = await supabase.from('articles').delete().eq('id', a.id)
    setBusyId(null)
    if (error) notify('err', hint(error.message))
    else { notify('ok', 'Article deleted.'); loadArticles() }
  }

  async function toggleArticle(a: Article, field: 'published' | 'featured') {
    setBusyId(a.id)
    const { error } = await supabase.from('articles').update({ [field]: !a[field] }).eq('id', a.id)
    setBusyId(null)
    if (error) notify('err', hint(error.message))
    loadArticles()
  }

  async function duplicateArticle(a: Article) {
    setBusyId(a.id)
    const base = payloadFromArticleDraft(draftFromArticle(a))
    const payload = { ...base, title: `${a.title} (copy)`, slug: slugify(`${a.slug}-copy-${Math.random().toString(36).slice(2, 6)}`), published: false, featured: false }
    const { error } = await supabase.from('articles').insert(payload)
    setBusyId(null)
    if (error) notify('err', hint(error.message))
    else { notify('ok', 'Duplicated as a draft.'); loadArticles() }
  }

  const previewHref = (p: Project) => absoluteUrl(`work/${p.slug}`)
  const articleHref = (a: Article) => absoluteUrl(`articles/${a.slug}`)
  const drafts = projects.filter(p => !p.published).length + articles.filter(a => !a.published).length

  const navItem = (key: View, icon: JSX.Element, label: string, count?: number) => (
    <button
      type="button"
      onClick={() => { setView(key); setMenuOpen(false); if (key !== 'editor') setDraft(null); if (key !== 'articleEditor') setArticleDraft(null) }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-fl-sm transition-colors ${view === key ? 'bg-ink text-paper' : 'text-slate hover:bg-white hover:text-ink'}`}
    >
      {icon}<span className="flex-1 text-left">{label}</span>
      {typeof count === 'number' && <span className={`text-[11px] tabular-nums ${view === key ? 'text-paper/70' : 'text-fog'}`}>{count}</span>}
    </button>
  )

  const isEditing = view === 'editor' || view === 'articleEditor'
  const heading: Record<View, [string, string]> = {
    overview: ['Dashboard', 'Overview'], projects: ['Content', 'Projects'], editor: ['Content', 'Project'],
    articles: ['Content', 'Articles'], articleEditor: ['Content', 'Article'], account: ['Settings', 'Account'],
  }

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="border-b lg:border-b-0 lg:border-r border-line bg-frost/60 lg:min-h-screen">
        <div className="px-4 h-14 flex items-center justify-between lg:justify-start gap-3 border-b border-line">
          <Link to="/" className="font-bold uppercase tracking-tight text-fl-sm">{site.name}<span className="text-ocean">.</span> <span className="text-fog font-medium normal-case tracking-normal">Admin</span></Link>
          <button type="button" onClick={() => setMenuOpen(o => !o)} className="lg:hidden w-9 h-9 rounded-md border border-line flex items-center justify-center" aria-label="Menu">{menuOpen ? <IconClose size={16} /> : <IconMenu size={16} />}</button>
        </div>
        <nav className={`${menuOpen ? 'block' : 'hidden'} lg:block p-3 space-y-1`}>
          {navItem('overview', <IconHome size={16} />, 'Overview')}

          <p className="px-3 pt-3 pb-1 label-caps">Work</p>
          {navItem('projects', <IconLayers size={16} />, 'Projects', projects.length)}
          <button type="button" onClick={() => { startNew(); setMenuOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-fl-sm transition-colors ${view === 'editor' ? 'bg-ink text-paper' : 'text-slate hover:bg-white hover:text-ink'}`}>
            <IconPlus size={16} /><span className="flex-1 text-left">{view === 'editor' && draft?.id ? 'Editing project…' : 'New project'}</span>
          </button>

          <p className="px-3 pt-3 pb-1 label-caps">Articles</p>
          {navItem('articles', <IconFile size={16} />, 'Articles', articles.length)}
          <button type="button" onClick={() => { startNewArticle(); setMenuOpen(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-fl-sm transition-colors ${view === 'articleEditor' ? 'bg-ink text-paper' : 'text-slate hover:bg-white hover:text-ink'}`}>
            <IconEdit size={16} /><span className="flex-1 text-left">{view === 'articleEditor' && articleDraft?.id ? 'Editing article…' : 'New article'}</span>
          </button>

          <div className="pt-3 mt-3 border-t border-line space-y-1">
            {navItem('account', <IconUser size={16} />, 'Account')}
            <a href={site.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-fl-sm text-slate hover:bg-white hover:text-ink"><IconExternal size={15} /> View site</a>
            <button type="button" onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-fl-sm text-slate hover:bg-white hover:text-ink"><IconLogout size={15} /> Sign out</button>
          </div>
          <p className="px-3 pt-4 text-[11px] text-fog leading-relaxed">{email}<br />{drafts > 0 ? `${drafts} draft${drafts === 1 ? '' : 's'} waiting` : 'Everything is published'}</p>
        </nav>
      </aside>

      {/* Main */}
      <main className="px-4 md:px-6 py-6 min-w-0">
        {!isEditing && (
          <header className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <p className="label-caps">{heading[view][0]}</p>
              <h1 className="mt-1 h-display text-fl-2xl">{heading[view][1]}</h1>
            </div>
            {view === 'articles' ? (
              <button type="button" onClick={startNewArticle} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-steel text-paper text-[11px] font-semibold uppercase tracking-[.12em] hover:bg-ink"><IconPlus size={14} /> New article</button>
            ) : view !== 'account' && (
              <button type="button" onClick={startNew} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-steel text-paper text-[11px] font-semibold uppercase tracking-[.12em] hover:bg-ink"><IconPlus size={14} /> New project</button>
            )}
          </header>
        )}

        {toast && (
          <div className={`mb-5 rounded-xl border px-4 py-3 text-fl-sm flex items-start justify-between gap-4 ${toast.kind === 'ok' ? 'border-steel/30 bg-steel/10 text-ink' : 'border-red-200 bg-red-50 text-red-700'}`} role={toast.kind === 'ok' ? 'status' : 'alert'}>
            <span className="leading-relaxed">{toast.text}</span>
            <button type="button" onClick={() => setToast(null)} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss"><IconClose size={14} /></button>
          </div>
        )}

        {view === 'overview' && (
          <Overview
            projects={projects} articles={articles} articlesMissing={articlesMissing}
            onNew={startNew} onOpenProjects={() => setView('projects')} onEdit={startEdit}
            onNewArticle={startNewArticle} onOpenArticles={() => setView('articles')} onEditArticle={startEditArticle}
          />
        )}
        {view === 'projects' && (
          <ProjectsTable
            projects={projects} busyId={busyId} onNew={startNew} onEdit={startEdit} onDelete={remove}
            onToggle={toggle} onDuplicate={duplicate} onReorder={reorder} previewHref={previewHref}
          />
        )}
        {view === 'editor' && draft && (
          <ProjectEditor draft={draft} onChange={updateDraft} onSave={save} onCancel={cancelEdit} saving={saving} previewHref={draft.slug ? absoluteUrl(`work/${draft.slug}`) : undefined} />
        )}
        {view === 'articles' && (
          <ArticlesTable
            articles={articles} busyId={busyId} missingTable={articlesMissing} onNew={startNewArticle} onEdit={startEditArticle}
            onDelete={removeArticle} onToggle={toggleArticle} onDuplicate={duplicateArticle} previewHref={articleHref}
          />
        )}
        {view === 'articleEditor' && articleDraft && (
          <ArticleEditor draft={articleDraft} onChange={updateArticleDraft} onSave={saveArticle} onCancel={cancelArticle} saving={saving} previewHref={articleDraft.slug ? absoluteUrl(`articles/${articleDraft.slug}`) : undefined} />
        )}
        {view === 'account' && <AccountPanel email={email} onSignOut={signOut} />}
      </main>
    </div>
  )
}
