import { useMemo, useState } from 'react'
import { Project } from '../../lib/supabase'
import { CAT_DOT } from '../../components/ProjectCard'
import { IconEdit, IconTrash, IconCopy, IconEye, IconStar, IconSearch, IconArrowUp, IconArrowDown, IconPlus } from '../../components/Icons'
import { formatDate, translatedLangs } from './shared'

type Status = 'all' | 'published' | 'draft' | 'featured'

type Props = {
  projects: Project[]
  busyId?: string | null
  onNew: () => void
  onEdit: (p: Project) => void
  onDelete: (p: Project) => void
  onToggle: (p: Project, field: 'published' | 'featured') => void
  onDuplicate: (p: Project) => void
  onReorder: (p: Project, dir: -1 | 1) => void
  previewHref: (p: Project) => string
}

export default function ProjectsTable({ projects, busyId, onNew, onEdit, onDelete, onToggle, onDuplicate, onReorder, previewHref }: Props) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<Status>('all')

  const counts = useMemo(() => ({
    all: projects.length,
    published: projects.filter(p => p.published).length,
    draft: projects.filter(p => !p.published).length,
    featured: projects.filter(p => p.featured).length,
  }), [projects])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return projects.filter(p => {
      if (status === 'published' && !p.published) return false
      if (status === 'draft' && p.published) return false
      if (status === 'featured' && !p.featured) return false
      if (needle) {
        const hay = [p.title, p.slug, p.client ?? '', p.category, ...p.tools, ...p.tags, ...p.keywords].join(' ').toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [projects, q, status])

  const iconBtn = 'w-8 h-8 rounded-md border border-line flex items-center justify-center text-slate hover:text-ink hover:border-steel transition-colors disabled:opacity-40'

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 btn-text">
          {(['all', 'published', 'draft', 'featured'] as Status[]).map(s => (
            <button key={s} type="button" onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-md transition-colors ${status === s ? 'bg-ink text-paper' : 'text-slate hover:text-ink hover:bg-white'}`}>
              {s} <span className={`ml-1 tabular-nums ${status === s ? 'text-paper/70' : 'text-fog'}`}>{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="relative">
            <IconSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fog" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects…" className="pl-8 pr-3 py-2 w-56 border border-line rounded-lg bg-white text-fl-sm focus:border-steel outline-none" />
          </label>
          <button type="button" onClick={onNew} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-steel text-paper btn-text hover:bg-ink"><IconPlus size={14} /> New</button>
        </div>
      </div>

      <div className="mt-4 bg-white border border-line rounded-2xl overflow-hidden">
        {shown.length === 0 ? (
          <div className="p-10 text-center text-fl-sm text-slate">
            {projects.length === 0 ? (
              <>No projects yet. <button type="button" onClick={onNew} className="text-steel font-semibold link-underline">Create your first one</button>.</>
            ) : 'Nothing matches this filter.'}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((p, i) => {
              const langs = translatedLangs(p)
              const busy = busyId === p.id
              return (
                <li key={p.id} className={`grid grid-cols-[56px_1fr] md:grid-cols-[72px_minmax(0,1fr)_auto] gap-3 md:gap-5 items-center px-4 py-3 ${busy ? 'opacity-60' : ''}`}>
                  <button type="button" onClick={() => onEdit(p)} className="block w-14 md:w-[72px] aspect-[4/3] rounded-md overflow-hidden bg-frost ring-1 ring-line">
                    {p.cover_url && <img src={p.cover_url} alt="" className="w-full h-full object-cover" />}
                  </button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => onEdit(p)} className="font-semibold text-fl-sm text-ink hover:text-steel text-left truncate max-w-full">{p.title}</button>
                      <span className={`inline-flex items-center h-5 px-2 rounded-sm text-[10px] font-semibold uppercase tracking-[.1em] ${p.published ? 'bg-steel/10 text-steel' : 'bg-frost text-fog'}`}>{p.published ? 'Published' : 'Draft'}</span>
                      {p.featured && <span className="inline-flex items-center gap-1 h-5 px-2 rounded-sm text-[10px] font-semibold uppercase tracking-[.1em] bg-ocean/15 text-steel"><IconStar size={10} /> Featured</span>}
                    </div>
                    <p className="mt-1 text-[11px] text-fog flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="inline-flex items-center gap-1.5 capitalize"><span className={`w-1.5 h-1.5 rounded-full ${CAT_DOT[p.category]}`} />{p.category}</span>
                      {p.year && <span>· {p.year}</span>}
                      {p.client && <span>· {p.client}</span>}
                      <span>· /work/{p.slug}</span>
                      <span>· updated {formatDate(p.updated_at)}</span>
                      <span className="inline-flex items-center gap-1">· <span className="uppercase">{p.source_lang}</span>{langs.length > 0 && <span className="text-steel uppercase">+ {langs.join(' ')}</span>}</span>
                      {p.tools.length > 0 && <span>· {p.tools.length} tools</span>}
                    </p>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-wrap items-center gap-1.5 justify-end">
                    <button type="button" disabled={i === 0 || busy} onClick={() => onReorder(p, -1)} className={iconBtn} aria-label="Move up"><IconArrowUp size={14} /></button>
                    <button type="button" disabled={i === shown.length - 1 || busy} onClick={() => onReorder(p, 1)} className={iconBtn} aria-label="Move down"><IconArrowDown size={14} /></button>
                    <button type="button" disabled={busy} onClick={() => onToggle(p, 'featured')} className={`${iconBtn} ${p.featured ? 'text-steel border-steel/50' : ''}`} aria-label={p.featured ? 'Unfeature' : 'Feature'}><IconStar size={14} /></button>
                    <button type="button" disabled={busy} onClick={() => onToggle(p, 'published')} className={`px-2.5 h-8 rounded-md border btn-text transition-colors ${p.published ? 'border-line text-slate hover:border-steel' : 'border-steel text-steel hover:bg-steel hover:text-paper'}`}>{p.published ? 'Unpublish' : 'Publish'}</button>
                    <a href={previewHref(p)} target="_blank" rel="noreferrer" className={iconBtn} aria-label="Preview"><IconEye size={14} /></a>
                    <button type="button" disabled={busy} onClick={() => onDuplicate(p)} className={iconBtn} aria-label="Duplicate"><IconCopy size={14} /></button>
                    <button type="button" onClick={() => onEdit(p)} className={`${iconBtn} border-ink/30 text-ink`} aria-label="Edit"><IconEdit size={14} /></button>
                    <button type="button" disabled={busy} onClick={() => onDelete(p)} className={`${iconBtn} hover:border-red-300 hover:text-red-700`} aria-label="Delete"><IconTrash size={14} /></button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
