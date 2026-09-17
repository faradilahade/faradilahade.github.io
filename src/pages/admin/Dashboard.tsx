import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Project } from '../../lib/supabase'

type Draft = {
  id?: string
  title: string
  slug: string
  summary: string
  content: string
  category: 'data' | 'finance' | 'risk'
  tags: string
  cover_url: string
  attachments: { name: string; url: string }[]
  published: boolean
  featured: boolean
}

const emptyDraft: Draft = {
  title: '', slug: '', summary: '', content: '',
  category: 'data', tags: '', cover_url: '',
  attachments: [], published: true, featured: false,
}

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export default function Dashboard() {
  const nav = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    setProjects((data as Project[]) ?? [])
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav('/admin')
      else load()
    })
  }, [nav, load])

  async function signOut() {
    await supabase.auth.signOut()
    nav('/admin')
  }

  function startNew() {
    setDraft({ ...emptyDraft })
    setMsg('')
  }

  function startEdit(p: Project) {
    setDraft({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary ?? '',
      content: p.content ?? '',
      category: p.category,
      tags: (p.tags ?? []).join(', '),
      cover_url: p.cover_url ?? '',
      attachments: p.attachments ?? [],
      published: p.published,
      featured: p.featured,
    })
    setMsg('')
    window.scrollTo({ top: 0 })
  }

  async function uploadFile(file: File, folder: string): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from('portfolio').upload(path, file)
    if (error) { setMsg(`Upload failed: ${error.message}`); return null }
    const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !draft) return
    setUploading(true)
    const url = await uploadFile(file, 'covers')
    setUploading(false)
    if (url) setDraft({ ...draft, cover_url: url })
  }

  async function handleAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !draft) return
    setUploading(true)
    const url = await uploadFile(file, 'attachments')
    setUploading(false)
    if (url) setDraft({ ...draft, attachments: [...draft.attachments, { name: file.name, url }] })
  }

  function removeAttachment(i: number) {
    if (!draft) return
    setDraft({ ...draft, attachments: draft.attachments.filter((_, idx) => idx !== i) })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!draft) return
    setSaving(true)
    setMsg('')

    const payload = {
      title: draft.title,
      slug: draft.slug || slugify(draft.title),
      summary: draft.summary || null,
      content: draft.content || null,
      category: draft.category,
      tags: draft.tags.split(',').map(t => t.trim()).filter(Boolean),
      cover_url: draft.cover_url || null,
      attachments: draft.attachments,
      published: draft.published,
      featured: draft.featured,
    }

    const q = draft.id
      ? supabase.from('projects').update(payload).eq('id', draft.id)
      : supabase.from('projects').insert(payload)

    const { error } = await q
    setSaving(false)
    if (error) { setMsg(`Save failed: ${error.message}`); return }
    setMsg(draft.id ? 'Project updated.' : 'Project created.')
    setDraft(null)
    load()
  }

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    if (error) setMsg(`Delete failed: ${error.message}`)
    else { setMsg('Project deleted.'); load() }
  }

  async function togglePublish(p: Project) {
    await supabase.from('projects').update({ published: !p.published }).eq('id', p.id)
    load()
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Portfolio admin</h1>
        <div className="flex gap-3">
          <button onClick={startNew} className="bg-ink text-paper px-4 py-2 rounded-md text-sm hover:bg-steel transition-colors">
            New project
          </button>
          <button onClick={signOut} className="border border-mist px-4 py-2 rounded-md text-sm text-slate hover:border-steel transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {msg && <p className="mt-4 text-sm text-steel">{msg}</p>}

      {/* EDITOR */}
      {draft && (
        <form onSubmit={save} className="mt-8 border border-mist rounded-lg p-6 bg-white space-y-5">
          <h2 className="font-display text-2xl">{draft.id ? 'Edit project' : 'New project'}</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate mb-1">Title</label>
              <input
                required value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })}
                className="w-full border border-mist rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-slate mb-1">Slug (URL)</label>
              <input
                required value={draft.slug}
                onChange={e => setDraft({ ...draft, slug: slugify(e.target.value) })}
                className="w-full border border-mist rounded-md px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate mb-1">Summary (shown on cards)</label>
            <textarea
              rows={2} value={draft.summary}
              onChange={e => setDraft({ ...draft, summary: e.target.value })}
              className="w-full border border-mist rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-slate mb-1">Content (one paragraph per line)</label>
            <textarea
              rows={8} value={draft.content}
              onChange={e => setDraft({ ...draft, content: e.target.value })}
              className="w-full border border-mist rounded-md px-3 py-2 leading-relaxed"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-slate mb-1">Category</label>
              <select
                value={draft.category}
                onChange={e => setDraft({ ...draft, category: e.target.value as Draft['category'] })}
                className="w-full border border-mist rounded-md px-3 py-2 bg-white"
              >
                <option value="data">Data</option>
                <option value="finance">Finance</option>
                <option value="risk">Risk</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate mb-1">Tags (comma separated)</label>
              <input
                value={draft.tags}
                onChange={e => setDraft({ ...draft, tags: e.target.value })}
                placeholder="Python, Airflow, IFRS 17"
                className="w-full border border-mist rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate mb-1">Cover image</label>
              <input type="file" accept="image/*" onChange={handleCover} className="text-sm" />
              {uploading && <p className="text-xs text-slate mt-1">Uploading…</p>}
              {draft.cover_url && (
                <img src={draft.cover_url} alt="cover preview" className="mt-2 h-28 rounded-md object-cover" />
              )}
            </div>
            <div>
              <label className="block text-sm text-slate mb-1">Attachments (PDF, images, files)</label>
              <input type="file" onChange={handleAttachment} className="text-sm" />
              <ul className="mt-2 space-y-1 text-sm">
                {draft.attachments.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <a href={a.url} target="_blank" rel="noreferrer" className="link-underline text-steel truncate max-w-[220px]">{a.name}</a>
                    <button type="button" onClick={() => removeAttachment(i)} className="text-red-700 text-xs">remove</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.published} onChange={e => setDraft({ ...draft, published: e.target.checked })} />
              Published
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.featured} onChange={e => setDraft({ ...draft, featured: e.target.checked })} />
              Featured on home
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading} className="bg-ink text-paper px-5 py-2.5 rounded-md text-sm hover:bg-steel transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : draft.id ? 'Save changes' : 'Create project'}
            </button>
            <button type="button" onClick={() => setDraft(null)} className="border border-mist px-5 py-2.5 rounded-md text-sm text-slate">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* LIST */}
      <div className="mt-10 divide-y divide-mist border-t border-b border-mist">
        {projects.length === 0 && (
          <p className="py-8 text-slate text-sm">No projects yet. Select "New project" to add your first one.</p>
        )}
        {projects.map(p => (
          <div key={p.id} className="py-4 flex flex-wrap items-center gap-4">
            <div className="w-14 h-14 rounded-md bg-mist overflow-hidden shrink-0">
              {p.cover_url && <img src={p.cover_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-slate capitalize">
                {p.category} · /{p.slug} · {p.published ? 'Published' : 'Draft'}{p.featured ? ' · Featured' : ''}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => togglePublish(p)} className="border border-mist px-3 py-1.5 rounded-md text-slate hover:border-steel">
                {p.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => startEdit(p)} className="border border-mist px-3 py-1.5 rounded-md text-slate hover:border-steel">
                Edit
              </button>
              <button onClick={() => remove(p)} className="border border-red-200 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
