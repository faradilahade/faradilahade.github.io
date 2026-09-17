import { useMemo, useState, ReactNode } from 'react'
import { Project, Category, CATEGORIES, isImageUrl } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import RangeSlider from './RangeSlider'
import { IconChevronDown } from './Icons'

export type Deliverable = 'casestudy' | 'gallery' | 'files' | 'behance'
export const DELIVERABLES: Deliverable[] = ['casestudy', 'gallery', 'files', 'behance']

export type FilterState = {
  q: string
  fields: Category[]
  tools: string[]
  clients: string[]
  keywords: string[]
  deliverables: Deliverable[]
  /** null = untouched (full range) */
  year: [number, number] | null
}

export const emptyFilters: FilterState = {
  q: '', fields: [], tools: [], clients: [], keywords: [], deliverables: [], year: null,
}

export function hasDeliverable(p: Project, d: Deliverable): boolean {
  switch (d) {
    case 'casestudy': return Boolean(p.content && p.content.trim())
    case 'gallery': return p.gallery.length > 0 || p.attachments.some(a => isImageUrl(a.url))
    case 'files': return p.attachments.some(a => !isImageUrl(a.url))
    case 'behance': return Boolean(p.embed_url) || /behance\.net/i.test(p.external_url ?? '')
  }
}

export function yearBoundsOf(projects: Project[]): [number, number] | null {
  const ys = projects.map(p => p.year).filter((y): y is number => typeof y === 'number' && Number.isFinite(y))
  if (!ys.length) return null
  return [Math.min(...ys), Math.max(...ys)]
}

export function isYearNarrowed(f: FilterState, bounds: [number, number] | null): boolean {
  return Boolean(f.year && bounds && (f.year[0] > bounds[0] || f.year[1] < bounds[1]))
}

export function activeFilterCount(f: FilterState, bounds: [number, number] | null): number {
  return (f.fields.length ? 1 : 0) + (f.tools.length ? 1 : 0) + (f.clients.length ? 1 : 0)
    + (f.keywords.length ? 1 : 0) + (f.deliverables.length ? 1 : 0) + (isYearNarrowed(f, bounds) ? 1 : 0)
    + (f.q.trim() ? 1 : 0)
}

export function applyFilters(
  projects: Project[], f: FilterState, bounds: [number, number] | null, catLabel: (c: Category) => string,
): Project[] {
  const needle = f.q.trim().toLowerCase()
  const lower = (s: string) => s.toLowerCase()
  const narrowed = isYearNarrowed(f, bounds)
  return projects.filter(p => {
    if (f.fields.length && !f.fields.includes(p.category)) return false
    if (f.tools.length) {
      const have = p.tools.map(lower)
      if (!f.tools.some(tl => have.includes(lower(tl)))) return false
    }
    if (f.clients.length && !(p.client && f.clients.includes(p.client))) return false
    if (f.keywords.length) {
      const have = [...p.tags, ...p.keywords].map(lower)
      if (!f.keywords.some(k => have.includes(lower(k)))) return false
    }
    if (f.deliverables.length && !f.deliverables.every(d => hasDeliverable(p, d))) return false
    if (narrowed && f.year) {
      if (p.year == null) return false
      if (p.year < f.year[0] || p.year > f.year[1]) return false
    }
    if (needle) {
      const hay = [
        p.title, p.summary ?? '', p.client ?? '', p.role ?? '', ...p.tags, ...p.keywords, ...p.tools, catLabel(p.category),
        p._i18n?.original.title ?? '', p._i18n?.original.summary ?? '',
        ...Object.values(p.translations ?? {}).flatMap(tr => [tr?.title ?? '', tr?.summary ?? '']),
      ].join(' ').toLowerCase()
      if (!hay.includes(needle)) return false
    }
    return true
  })
}

function countBy(list: string[]): [string, number][] {
  const m = new Map<string, number>()
  list.forEach(x => { const k = x.trim(); if (k) m.set(k, (m.get(k) ?? 0) + 1) })
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

const toggle = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])

function Section({ title, badge, defaultOpen = true, children }: { title: string; badge?: number; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/10">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="w-full flex items-center justify-between py-3.5 text-left group">
        <span className="label-caps text-paper/80 flex items-center gap-2">
          {title}
          {badge ? <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] rounded-full bg-tide text-night text-[9px] px-1 tabular-nums">{badge}</span> : null}
        </span>
        <span className={`w-6 h-6 rounded-full ring-1 ring-white/15 flex items-center justify-center text-paper/50 group-hover:ring-tide/60 group-hover:text-tide transition-all duration-300 ${open ? 'rotate-180' : ''}`}>
          <IconChevronDown size={13} />
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-smooth ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden"><div className="pb-4">{children}</div></div>
      </div>
    </div>
  )
}

type Option = { value: string; label: string; count: number }

function CheckList({ options, selected, onToggle, max = 6 }: { options: Option[]; selected: string[]; onToggle: (v: string) => void; max?: number }) {
  const { t } = useLang()
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? options : options.slice(0, max)
  return (
    <>
      <ul className="space-y-0.5">
        {shown.map(o => {
          const on = selected.includes(o.value)
          return (
            <li key={o.value}>
              <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
                <input type="checkbox" checked={on} onChange={() => onToggle(o.value)} className="w-4 h-4 rounded-sm accent-tide shrink-0" />
                <span className={`flex-1 truncate text-fl-sm ${on ? 'text-paper font-medium' : 'text-paper/65 group-hover:text-paper'} transition-colors`}>{o.label}</span>
                <span className="text-fl-xs text-paper/40 tabular-nums">{o.count}</span>
              </label>
            </li>
          )
        })}
      </ul>
      {options.length > max && (
        <button type="button" onClick={() => setExpanded(e => !e)} className="mt-1.5 text-fl-xs font-medium text-tide link-underline">
          {expanded ? t('filter.showLess') : t('filter.showAll')} {expanded ? '' : `(${options.length})`}
        </button>
      )}
    </>
  )
}

type Props = {
  projects: Project[]
  filters: FilterState
  bounds: [number, number] | null
  onChange: (f: FilterState) => void
}

export default function Filters({ projects, filters, bounds, onChange }: Props) {
  const { t } = useLang()

  const fieldOpts = useMemo<Option[]>(() => CATEGORIES
    .map(c => ({ value: c, label: t(`cat.${c}`), count: projects.filter(p => p.category === c).length }))
    .filter(o => o.count > 0), [projects, t])
  const toolOpts = useMemo<Option[]>(() => countBy(projects.flatMap(p => p.tools)).map(([v, n]) => ({ value: v, label: v, count: n })), [projects])
  const clientOpts = useMemo<Option[]>(() => countBy(projects.map(p => p.client ?? '')).map(([v, n]) => ({ value: v, label: v, count: n })), [projects])
  const keywordOpts = useMemo<Option[]>(() => countBy(projects.flatMap(p => [...p.tags, ...p.keywords])).map(([v, n]) => ({ value: v, label: v, count: n })), [projects])
  const deliverableOpts = useMemo<Option[]>(() => DELIVERABLES
    .map(d => ({ value: d, label: t(`deliverable.${d}`), count: projects.filter(p => hasDeliverable(p, d)).length }))
    .filter(o => o.count > 0), [projects, t])

  const yearValue: [number, number] | null = bounds ? (filters.year ?? bounds) : null
  const active = activeFilterCount(filters, bounds)

  return (
    <div className="text-paper">
      <div className="flex items-center justify-between pb-3 border-b border-white/25">
        <span className="font-bold uppercase tracking-tight text-fl-sm">{t('filter.title')}</span>
        {active > 0 && <span className="text-fl-xs text-paper/50">{active} {t('filter.active')}</span>}
      </div>

      {bounds && yearValue && bounds[1] > bounds[0] && (
        <Section title={t('filter.year')} badge={isYearNarrowed(filters, bounds) ? 1 : 0}>
          <RangeSlider
            min={bounds[0]} max={bounds[1]} value={yearValue} label={t('filter.year')}
            onChange={v => onChange({ ...filters, year: v[0] === bounds[0] && v[1] === bounds[1] ? null : v })}
          />
        </Section>
      )}

      {fieldOpts.length > 0 && (
        <Section title={t('filter.field')} badge={filters.fields.length}>
          <CheckList options={fieldOpts} selected={filters.fields} onToggle={v => onChange({ ...filters, fields: toggle(filters.fields, v as Category) })} />
        </Section>
      )}

      {toolOpts.length > 0 && (
        <Section title={t('filter.tools')} badge={filters.tools.length}>
          <CheckList options={toolOpts} selected={filters.tools} onToggle={v => onChange({ ...filters, tools: toggle(filters.tools, v) })} />
        </Section>
      )}

      {clientOpts.length > 0 && (
        <Section title={t('filter.client')} badge={filters.clients.length}>
          <CheckList options={clientOpts} selected={filters.clients} onToggle={v => onChange({ ...filters, clients: toggle(filters.clients, v) })} />
        </Section>
      )}

      {keywordOpts.length > 0 && (
        <Section title={t('filter.keywords')} badge={filters.keywords.length} defaultOpen={false}>
          <CheckList options={keywordOpts} selected={filters.keywords} onToggle={v => onChange({ ...filters, keywords: toggle(filters.keywords, v) })} max={8} />
        </Section>
      )}

      {deliverableOpts.length > 0 && (
        <Section title={t('filter.deliverables')} badge={filters.deliverables.length} defaultOpen={false}>
          <CheckList options={deliverableOpts} selected={filters.deliverables} onToggle={v => onChange({ ...filters, deliverables: toggle(filters.deliverables, v as Deliverable) })} />
        </Section>
      )}

      <button
        type="button"
        disabled={active === 0}
        onClick={() => onChange({ ...emptyFilters })}
        className="mt-5 w-full ring-1 ring-white/15 py-3 text-[11px] font-semibold uppercase tracking-[.14em] text-paper/70 hover:ring-tide/60 hover:text-paper disabled:opacity-40 disabled:hover:ring-white/15 disabled:hover:text-paper/70 transition-colors rounded-full"
      >
        {t('filter.reset')}
      </button>
    </div>
  )
}
