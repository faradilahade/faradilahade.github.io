import { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured, Project, Category, normalizeProject, sortProjects, Attachment } from '../../lib/supabase'
import { useSeo } from '../../lib/seo'
import ToolBadge from '../../components/ToolBadge'

type Draft = {
  id?: string
  title: string
  slug: string
  summary: string
  content: string
  category: Category
  tags: string
  tools: string
  keywords: string
  year: string
  role: string
  client: string
  external_url: string
  embed_url: string
  sort_order: string
  cover_url: string
  gallery: string[]
  attachments: Attachment[]
  published: boolean
  featured: boolean
}

const emptyDraft: Draft = {
  title: '', slug: '', summary: '', content: '', category: 'data',
  tags: '', tools: '', keywords: '', year: '', role: '', client: '',
  external_url: '', embed_url: '', sort_order: '0', cover_url: '',
  gallery: [], attachments: [], published: true, featured: false,
}

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

const splitList = (s: string) => Array.from(new Set(s.split(/[,\n;]/).map(x => x.trim()).filter(Boolean)))

/** Accepts a pasted <iframe …> snippet or a plain URL and returns the embed src. */
function parseEmbed(input: string): string {
  const m = input.match(/src=["']([^"']+)["']/i)
  return (m ? m[1] : input).trim()
}

function hint(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('column') && m.includes('does not exist')) {
    return `${msg} — run supabase/schema.sql again in the Supabase SQL Editor (it adds the new columns and is safe to re-run).`
  }
  if (m.includes('row-level security') || m.includes('permission denied')) {
    return `${msg} — your session may have expired. Sign out and in again, and make sure the policies from supabase/schema.sql are applied.`
  }
  if (m.includes('duplicate key') && m.includes('slug')) return 'That slug is already used by another project. Change the slug.'
  return msg
}

export default function Dashboard() {
  const nav = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useSeo({ title: 'Portfolio admin', description: 'Manage projects', noindex: true })

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) { setErr(hint(error.message)); return }
    setProjects(sortProjects((data ?? []).map(normalizeProject)))
  }, [])

  useEffect(() => {
    if (!supabaseConfigured) { nav('/admin', { replace: true }); return }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav('/admin', { replace: true })
      else load()
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav('/admin', { replace: true })
    })
    return () => sub.subscription.unsubscribe()
  }, [nav, load])

  async function signOut() {
    await supabase.auth.signOut()
    nav('/admin', { replace: true })
  }

  function startNew() {
    setDraft({ ...emptyDraft })
    setMsg(''); setErr('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startEdit(p: Project) {
    setDraft({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary ?? '',
      content: p.content ?? '',
      category: p.category,
      tags: p.tags.join(', '),
      tools: p.tools.join(', '),
      keywords: p.keywords.join(', '),
      year: p.year ? String(p.year) : '',
      role: p.role ?? '',
      client: p.client ?? '',
      external_url: p.external_url ?? '',
      embed_url: p.embed_url ?? '',
      sort_order: String(p.sort_order ?? 0),
      cover_url: p.cover_url ?? '',
      gallery: p.gallery,
      attachments: p.attachments,
      published: p.published,
      featured: p.featured,
    })
    setMsg(''); setErr('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function uploadFile(file: File, folder: string): Promise<string | null> {
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('portfolio').upload(path, file, { cacheControl: '31536000', upsert: false })
    if (error) { setErr(`Upload failed: ${error.message}. Make sure a public bucket named "portfolio" exists (Supabase → Storage).`); return null }
    const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !draft) return
    setUploading(true)
    const url = await uploadFile(file, 'covers')
    setUploading(false)
    if (url) setDraft(d => d && { ...d, cover_url: url })
    e.target.value = ''
  }

  async function handleGallery(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !draft) return
    setUploading(true)
    const urls: string[] = []
    for (const f of files) {
      const u = await uploadFile(f, 'gallery')
      if (u) urls.push(u)
    }
    setUploading(false)
    setDraft(d => d && { ...d, gallery: [...d.gallery, ...urls] })
    e.target.value = ''
  }

  async function handleAttachment(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !draft) return
    setUploading(true)
    const added: Attachment[] = []
    for (const f of files) {
      const u = await uploadFile(f, 'attachments')
      if (u) added.push({ name: f.name, url: u })
    }
    setUploading(false)
    setDraft(d => d && { ...d, attachments: [...d.attachments, ...added] })
    e.target.value = ''
  }

  const moveGallery = (i: number, dir: -1 | 1) => setDraft(d => {
    if (!d) return d
    const g = [...d.gallery]
    const j = i + dir
    if (j < 0 || j >= g.length) return d
    ;[g[i], g[j]] = [g[j], g[i]]
    return { ...d, gallery: g }
  })

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!draft) return
    setSaving(true); setMsg(''); setErr('')

    const yearNum = draft.year.trim() ? Number(draft.year) : null
    const payload = {
      title: draft.title.trim(),
      slug: slugify(draft.slug || draft.title),
      summary: draft.summary.trim() || null,
      content: draft.content.trim() || null,
      category: draft.category,
      tags: splitList(draft.tags),
      tools: splitList(draft.tools),
      keywords: splitList(draft.keywords),
      year: yearNum && Number.isFinite(yearNum) ? yearNum : null,
      role: draft.role.trim() || null,
      client: draft.client.trim() || null,
      external_url: draft.external_url.trim() || null,
      embed_url: draft.embed_url ? parseEmbed(draft.embed_url) : null,
      sort_order: Number(draft.sort_order) || 0,
      cover_url: draft.cover_url || null,
      gallery: draft.gallery,
      attachments: draft.attachments,
      published: draft.published,
      featured: draft.featured,
    }

    const q = draft.id
      ? supabase.from('projects').update(payload).eq('id', draft.id)
      : supabase.from('projects').insert(payload)

    const { error } = await q
    setSaving(false)
    if (error) { setErr(hint(error.message)); return }
    setMsg(draft.id ? 'Project updated.' : 'Project created.')
    setDraft(null)
    load()
  }

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    if (error) setErr(hint(error.message))
    else { setMsg('Project deleted.'); load() }
  }

  async function toggle(p: Project, field: 'published' | 'featured') {
    const { error } = await supabase.from('projects').update({ [field]: !p[field] }).eq('id', p.id)
    if (error) setErr(hint(error.message))
    load()
  }

  const field = 'w-full border border-mist rounded-lg px-3 py-2 bg-white text-ink focus:border-steel outline-none transition-colors'
  const label = 'block text-fl-xs uppercase tracking-wider text-slate mb-1.5'
  const btn = 'rounded-lg px-4 py-2 text-fl-sm transition-colors'

  return (
    <section className="page-enter max-w-5xl mx-auto px-gutter py-10 md:py-12 text-ink">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-fl-2xl">Portfolio admin</h1>
          <p className="text-fl-sm text-slate mt-1">{projects.length} project{projects.length === 1 ? '' : 's'} · <Link to="/" className="link-underline text-steel">view site</Link></p>
        </div>
        <div className="flex gap-3">
          <button onClick={startNew} className={`${btn} bg-ink text-paper hover:bg-steel`}>New project</button>
          <button onClick={signOut} className={`${btn} border border-mist text-slate hover:border-steel`}>Sign out</button>
        </div>
      </div>

      {msg && <p className="mt-4 text-fl-sm text-steel" role="status">{msg}</p>}
      {err && <p className="mt-4 text-fl-sm text-red-700 leading-relaxed rounded-lg border border-red-200 bg-red-50 p-3" role="alert">{err}</p>}

      {/* EDITOR */}
      {draft && (
        <form onSubmit={save} className="mt-8 border border-mist rounded-2xl p-5 md:p-7 bg-white space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-fl-xl">{draft.id ? 'Edit project' : 'New project'}</h2>
            {draft.id && <Link to={`/work/${draft.slug}`} target="_blank" className="link-underline text-fl-sm text-steel">Preview ↗</Link>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={label}>Title</label>
              <input required value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })}
                className={field} />
            </div>
            <div>
              <label className={label}>Slug (URL) — /work/…</label>
              <input required value={draft.slug} onChange={e => setDraft({ ...draft, slug: slugify(e.target.value) })} className={`${field} font-mono text-fl-sm`} />
            </div>
          </div>

          <div>
            <label className={label}>Summary — one or two sentences, shown on the card and used as the SEO description</label>
            <textarea rows={2} maxLength={220} value={draft.summary} onChange={e => setDraft({ ...draft, summary: e.target.value })} className={field} />
            <p className="text-right text-fl-xs text-slate mt-1">{draft.summary.length}/220</p>
          </div>

          <div>
            <label className={label}>Case study — one paragraph per line. Start a line with "## " for a heading, "- " for a bullet</label>
            <textarea rows={10} value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} className={`${field} leading-relaxed`} />
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            <div>
              <label className={label}>Field</label>
              <select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value as Category })} className={field}>
                <option value="data">Data</option>
                <option value="finance">Finance</option>
                <option value="risk">Risk</option>
              </select>
            </div>
            <div>
              <label className={label}>Year</label>
              <input inputMode="numeric" placeholder="2025" value={draft.year} onChange={e => setDraft({ ...draft, year: e.target.value.replace(/[^\d]/g, '').slice(0, 4) })} className={field} />
            </div>
            <div>
              <label className={label}>Client / organisation</label>
              <input placeholder="World Bank" value={draft.client} onChange={e => setDraft({ ...draft, client: e.target.value })} className={field} />
            </div>
            <div>
              <label className={label}>Your role</label>
              <input placeholder="Lead data scientist" value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })} className={field} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={label}>Tools used (comma separated)</label>
              <input value={draft.tools} onChange={e => setDraft({ ...draft, tools: e.target.value })} placeholder="Python, SQL, Airflow, dbt, BigQuery" className={field} />
              {splitList(draft.tools).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">{splitList(draft.tools).map(tl => <ToolBadge key={tl} name={tl} size="sm" />)}</div>
              )}
            </div>
            <div>
              <label className={label}>SEO keywords (comma separated)</label>
              <input value={draft.keywords} onChange={e => setDraft({ ...draft, keywords: e.target.value })} placeholder="forecasting, early warning system, time series" className={field} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={label}>Tags (short labels)</label>
              <input value={draft.tags} onChange={e => setDraft({ ...draft, tags: e.target.value })} placeholder="IFRS 17, Reserving" className={field} />
            </div>
            <div>
              <label className={label}>External link (Behance, GitHub, report…)</label>
              <input type="url" value={draft.external_url} onChange={e => setDraft({ ...draft, external_url: e.target.value })} placeholder="https://www.behance.net/gallery/…" className={field} />
            </div>
            <div>
              <label className={label}>Behance embed (paste the iframe code or its src URL)</label>
              <input value={draft.embed_url} onChange={e => setDraft({ ...draft, embed_url: e.target.value })} placeholder='<iframe src="https://www.behance.net/embed/project/…">' className={`${field} font-mono text-fl-xs`} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className={label}>Cover image (4:3 works best)</label>
              <input type="file" accept="image/*" onChange={handleCover} className="text-fl-sm" />
              {draft.cover_url && (
                <div className="mt-2 flex items-start gap-3">
                  <img src={draft.cover_url} alt="cover preview" className="h-24 aspect-[4/3] rounded-lg object-cover ring-1 ring-mist" />
                  <button type="button" onClick={() => setDraft({ ...draft, cover_url: '' })} className="text-red-700 text-fl-xs link-underline">remove</button>
                </div>
              )}
            </div>
            <div>
              <label className={label}>Gallery images (multiple)</label>
              <input type="file" accept="image/*" multiple onChange={handleGallery} className="text-fl-sm" />
              {draft.gallery.length > 0 && (
                <ul className="mt-2 grid grid-cols-3 gap-2">
                  {draft.gallery.map((g, i) => (
                    <li key={g} className="relative group">
                      <img src={g} alt="" className="aspect-[4/3] w-full rounded-md object-cover ring-1 ring-mist" />
                      <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">
                        <button type="button" onClick={() => moveGallery(i, -1)} className="bg-white/90 rounded px-1.5">←</button>
                        <button type="button" onClick={() => setDraft({ ...draft, gallery: draft.gallery.filter((_, x) => x !== i) })} className="bg-white/90 text-red-700 rounded px-1.5">✕</button>
                        <button type="button" onClick={() => moveGallery(i, 1)} className="bg-white/90 rounded px-1.5">→</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className={label}>Files (PDF, slides, data…)</label>
              <input type="file" multiple onChange={handleAttachment} className="text-fl-sm" />
              <ul className="mt-2 space-y-1 text-fl-sm">
                {draft.attachments.map((a, i) => (
                  <li key={a.url} className="flex items-center gap-2">
                    <a href={a.url} target="_blank" rel="noreferrer" className="link-underline text-steel truncate max-w-[220px]">{a.name}</a>
                    <button type="button" onClick={() => setDraft({ ...draft, attachments: draft.attachments.filter((_, x) => x !== i) })} className="text-red-700 text-fl-xs">remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {uploading && <p className="text-fl-xs text-slate animate-pulse">Uploading…</p>}

          <div className="flex flex-wrap items-center gap-6 text-fl-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.published} onChange={e => setDraft({ ...draft, published: e.target.checked })} /> Published</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.featured} onChange={e => setDraft({ ...draft, featured: e.target.checked })} /> Featured (shown first)</label>
            <label className="flex items-center gap-2">Order <input inputMode="numeric" value={draft.sort_order} onChange={e => setDraft({ ...draft, sort_order: e.target.value.replace(/[^\d-]/g, '') })} className="w-16 border border-mist rounded-md px-2 py-1 text-center" /> <span className="text-slate text-fl-xs">(lower first)</span></label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading} className={`${btn} bg-ink text-paper hover:bg-steel disabled:opacity-60`}>
              {saving ? 'Saving…' : draft.id ? 'Save changes' : 'Create project'}
            </button>
            <button type="button" onClick={() => setDraft(null)} className={`${btn} border border-mist text-slate hover:border-steel`}>Cancel</button>
          </div>
        </form>
      )}

      {/* LIST */}
      <div className="mt-10 divide-y divide-mist border-y border-mist">
        {projects.length === 0 && (
          <p className="py-8 text-slate text-fl-sm">No projects yet. Select "New project" to add your first one.</p>
        )}
        {projects.map(p => (
          <div key={p.id} className="py-4 flex flex-wrap items-center gap-4">
            <div className="w-16 aspect-[4/3] rounded-md bg-mist overflow-hidden shrink-0">
              {p.cover_url && <img src={p.cover_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="font-medium">{p.title}</p>
              <p className="text-fl-xs text-slate capitalize">
                {p.category}{p.year ? ` · ${p.year}` : ''} · /work/{p.slug} · {p.published ? 'Published' : 'Draft'}{p.featured ? ' · Featured' : ''}
                {p.tools.length > 0 && <span className="normal-case"> · {p.tools.length} tools</span>}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-fl-sm">
              <button onClick={() => toggle(p, 'published')} className="border border-mist px-3 py-1.5 rounded-md text-slate hover:border-steel">{p.published ? 'Unpublish' : 'Publish'}</button>
              <button onClick={() => toggle(p, 'featured')} className="border border-mist px-3 py-1.5 rounded-md text-slate hover:border-steel">{p.featured ? 'Unfeature' : 'Feature'}</button>
              <button onClick={() => startEdit(p)} className="border border-mist px-3 py-1.5 rounded-md text-slate hover:border-steel">Edit</button>
              <button onClick={() => remove(p)} className="border border-red-200 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
