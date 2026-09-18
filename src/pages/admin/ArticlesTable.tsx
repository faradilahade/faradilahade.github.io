import { useMemo, useState } from 'react'
import { Article } from '../../lib/articles'
import { IconEdit, IconTrash, IconEye, IconStar, IconSearch, IconPlus, IconCopy } from '../../components/Icons'
import { formatDate, translatedLangs } from './shared'

type Status = 'all' | 'published' | 'draft' | 'featured'

type Props = {
  articles: Article[]
  busyId?: string | null
  missingTable?: boolean
  onNew: () => void
  onEdit: (a: Article) => void
  onDelete: (a: Article) => void
  onToggle: (a: Article, field: 'published' | 'featured') => void
  onDuplicate: (a: Article) => void
  previewHref: (a: Article) => string
}

export default function ArticlesTable({ articles, busyId, missingTable, onNew, onEdit, onDelete, onToggle, onDuplicate, previewHref }: Props) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<Status>('all')

  const counts = useMemo(() => ({
    all: articles.length,
    published: articles.filter(a => a.published).length,
    draft: articles.filter(a => !a.published).length,
    featured: articles.filter(a => a.featured).length,
  }), [articles])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return articles.filter(a => {
      if (status === 'published' && !a.published) return false
      if (status === 'draft' && a.published) return false
      if (status === 'featured' && !a.featured) return false
      if (needle) {
        const hay = [a.title, a.slug, a.summary ?? '', ...a.tags].join(' ').toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [articles, q, status])

  const iconBtn = 'w-8 h-8 rounded-md border border-line flex items-center justify-center text-slate hover:text-ink hover:border-steel transition-colors disabled:opacity-40'

  return (
    <div>
      {missingTable && (
        <div className="mb-4 rounded-xl border border-steel/30 bg-steel/10 px-4 py-3 text-fl-sm leading-relaxed">
          The <span className="font-mono text-[12px]">articles</span> table does not exist yet. Open Supabase → SQL Editor, paste the whole of <span className="font-mono text-[12px]">supabase/schema.sql</span> and run it once (it is safe to re-run). Then reload this page.
        </div>
      )}

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
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search articles…" className="pl-8 pr-3 py-2 w-56 border border-line rounded-lg bg-white text-fl-sm focus:border-steel outline-none" />
          </label>
          <button type="button" onClick={onNew} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-steel text-paper btn-text hover:bg-ink"><IconPlus size={14} /> New</button>
        </div>
      </div>

      <div className="mt-4 bg-white border border-line rounded-2xl overflow-hidden">
        {shown.length === 0 ? (
          <div className="p-10 text-center text-fl-sm text-slate">
            {articles.length === 0 ? (
              <>No articles yet. <button type="button" onClick={onNew} className="text-steel font-semibold link-underline">Write your first one</button>.</>
            ) : 'Nothing matches this filter.'}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map(a => {
              const langs = translatedLangs(a)
              const busy = busyId === a.id
              return (
                <li key={a.id} className={`grid grid-cols-[56px_1fr] md:grid-cols-[72px_minmax(0,1fr)_auto] gap-3 md:gap-5 items-center px-4 py-3 ${busy ? 'opacity-60' : ''}`}>
                  <button type="button" onClick={() => onEdit(a)} className="block w-14 md:w-[72px] aspect-[4/3] rounded-md overflow-hidden bg-frost ring-1 ring-line">
                    {a.cover_url && <img src={a.cover_url} alt="" className="w-full h-full object-cover" />}
                  </button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => onEdit(a)} className="font-semibold text-fl-sm text-ink hover:text-steel text-left truncate max-w-full">{a.title}</button>
                      <span className={`inline-flex items-center h-5 px-2 rounded-sm text-[10px] font-semibold uppercase tracking-[.1em] ${a.published ? 'bg-steel/10 text-steel' : 'bg-frost text-fog'}`}>{a.published ? 'Published' : 'Draft'}</span>
                      {a.featured && <span className="inline-flex items-center gap-1 h-5 px-2 rounded-sm text-[10px] font-semibold uppercase tracking-[.1em] bg-ocean/15 text-steel"><IconStar size={10} /> Featured</span>}
                    </div>
                    <p className="mt-1 text-[11px] text-fog flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span>{formatDate(a.published_at)}</span>
                      {a.tags.length > 0 && <span>· {a.tags.join(', ')}</span>}
                      <span>· /articles/{a.slug}</span>
                      <span>· updated {formatDate(a.updated_at)}</span>
                      <span className="inline-flex items-center gap-1">· <span className="uppercase">{a.source_lang}</span>{langs.length > 0 && <span className="text-steel uppercase">+ {langs.join(' ')}</span>}</span>
                    </p>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-wrap items-center gap-1.5 justify-end">
                    <button type="button" disabled={busy} onClick={() => onToggle(a, 'featured')} className={`${iconBtn} ${a.featured ? 'text-steel border-steel/50' : ''}`} aria-label={a.featured ? 'Unfeature' : 'Feature'}><IconStar size={14} /></button>
                    <button type="button" disabled={busy} onClick={() => onToggle(a, 'published')} className={`px-2.5 h-8 rounded-md border btn-text transition-colors ${a.published ? 'border-line text-slate hover:border-steel' : 'border-steel text-steel hover:bg-steel hover:text-paper'}`}>{a.published ? 'Unpublish' : 'Publish'}</button>
                    <a href={previewHref(a)} target="_blank" rel="noreferrer" className={iconBtn} aria-label="Preview"><IconEye size={14} /></a>
                    <button type="button" disabled={busy} onClick={() => onDuplicate(a)} className={iconBtn} aria-label="Duplicate"><IconCopy size={14} /></button>
                    <button type="button" onClick={() => onEdit(a)} className={`${iconBtn} border-ink/30 text-ink`} aria-label="Edit"><IconEdit size={14} /></button>
                    <button type="button" disabled={busy} onClick={() => onDelete(a)} className={`${iconBtn} hover:border-red-300 hover:text-red-700`} aria-label="Delete"><IconTrash size={14} /></button>
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
