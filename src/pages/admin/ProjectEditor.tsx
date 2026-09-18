import { useEffect, useMemo, useRef, useState } from 'react'
import { Category, Lang4, LANG4, TranslatedFields } from '../../lib/supabase'
import { translateFields } from '../../lib/translate'
import { renderContent, wordCount, readingMinutes } from '../../lib/richtext'
import ToolBadge from '../../components/ToolBadge'
import { CAT_DOT } from '../../components/ProjectCard'
import { IconClose, IconEye, IconLanguage, IconArrowLeft, IconArrowRight, IconCheck, IconExternal } from '../../components/Icons'
import { Card, Dropzone, field, label, FORMAT_BUTTONS, applyFormat, FormatKind } from './ui'
import {
  Draft, LANG_LABEL, slugify, splitList, uploadFile, saveLocalDraft, loadLocalDraft, clearLocalDraft,
} from './shared'

type Updater = Draft | ((d: Draft) => Draft)

type Props = {
  draft: Draft
  onChange: (u: Updater) => void
  onSave: (publish?: boolean) => void
  onCancel: () => void
  saving: boolean
  previewHref?: string
}

export default function ProjectEditor({ draft, onChange, onSave, onCancel, saving, previewHref }: Props) {
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const [restore, setRestore] = useState<{ at: number; draft: Draft } | null>(null)
  const [tLang, setTLang] = useState<Lang4>(() => LANG4.find(l => l !== draft.source_lang) ?? 'id')
  const [tBusy, setTBusy] = useState<string>('')
  const [tErr, setTErr] = useState('')
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const isNew = !draft.id

  // ---- autosave to localStorage -----------------------------------
  useEffect(() => {
    const saved = loadLocalDraft(draft.id)
    if (saved && JSON.stringify(saved.draft) !== JSON.stringify(draft) && (saved.draft.title || saved.draft.content)) setRestore(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id])
  useEffect(() => {
    const h = window.setTimeout(() => { if (draft.title || draft.content || draft.summary) saveLocalDraft(draft) }, 800)
    return () => window.clearTimeout(h)
  }, [draft])

  const set = (patch: Partial<Draft>) => onChange(d => ({ ...d, ...patch }))

  // ---- uploads ------------------------------------------------------
  async function upload(files: File[], folder: string, apply: (urls: { url: string; name: string }[]) => void) {
    setUploading(true); setUploadErr('')
    const done: { url: string; name: string }[] = []
    for (const f of files) {
      const r = await uploadFile(f, folder)
      if ('error' in r) { setUploadErr(r.error); break }
      done.push({ url: r.url, name: f.name })
    }
    setUploading(false)
    if (done.length) apply(done)
  }

  // ---- content toolbar ---------------------------------------------
  function format(kind: FormatKind) {
    const ta = contentRef.current
    if (!ta) return
    const { value, cursor } = applyFormat(ta, kind)
    set({ content: value })
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(cursor, cursor) })
  }

  // ---- translations ---------------------------------------------------
  const targets = LANG4.filter(l => l !== draft.source_lang)
  useEffect(() => { if (tLang === draft.source_lang) setTLang(targets[0]) }, [draft.source_lang, tLang, targets])

  async function translateTo(langs: Lang4[]) {
    setTErr('')
    for (const l of langs) {
      try {
        setTBusy(`${LANG_LABEL[l]} …`)
        const res = await translateFields(
          { title: draft.title, summary: draft.summary || null, content: draft.content || null, role: draft.role || null },
          draft.source_lang, l,
          (part, done, total) => setTBusy(`${LANG_LABEL[l]} · ${part}${total > 1 ? ` ${done}/${total}` : ''}`),
        )
        onChange(d => ({ ...d, translations: { ...d.translations, [l]: res } }))
      } catch (e) {
        setTErr(`Could not translate to ${LANG_LABEL[l]}: ${e instanceof Error ? e.message : 'network error'}. Try again in a minute or write it by hand.`)
      }
    }
    setTBusy('')
  }
  const setTr = (l: Lang4, patch: Partial<TranslatedFields>) =>
    onChange(d => ({ ...d, translations: { ...d.translations, [l]: { ...(d.translations[l] ?? {}), ...patch } } }))

  // ---- preview ------------------------------------------------------
  const tools = useMemo(() => splitList(draft.tools), [draft.tools])
  const keywords = useMemo(() => Array.from(new Set([...splitList(draft.keywords), ...splitList(draft.tags)])), [draft.keywords, draft.tags])
  const words = wordCount(draft.content)
  const canSave = draft.title.trim().length > 0 && !uploading && !saving

  const preview = (
    <div className="bg-white border border-line rounded-2xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-line flex items-center justify-between btn-text text-fog">
        <span className="inline-flex items-center gap-1.5"><IconEye size={13} /> Live preview</span>
        <span className="tabular-nums normal-case tracking-normal font-medium">{words} words · {readingMinutes(draft.content)} min read</span>
      </div>
      {draft.cover_url ? <img src={draft.cover_url} alt="" className="w-full aspect-[16/9] object-cover" /> : <div className="aspect-[16/9] bg-frost flex items-center justify-center text-fog text-fl-xs">Cover image</div>}
      <div className="p-5 md:p-7">
        <p className="label-caps flex flex-wrap items-center gap-x-2">
          <span className="inline-flex items-center gap-1.5 text-ink"><span className={`w-1.5 h-1.5 rounded-full ${CAT_DOT[draft.category]}`} />{draft.category}</span>
          {draft.year && <span>· {draft.year}</span>}{draft.client && <span>· {draft.client}</span>}
        </p>
        <h2 className="mt-2 h-display text-fl-2xl text-ink">{draft.title || 'Untitled project'}</h2>
        {draft.summary && <p className="mt-3 text-fl-lg text-ink/80 leading-snug">{draft.summary}</p>}
        {draft.content ? (
          <div className="mt-6 space-y-4 text-fl-sm leading-[1.8] text-ink/90">{renderContent(draft.content)}</div>
        ) : (
          <p className="mt-6 text-fl-sm text-fog">Your case study will appear here as you write.</p>
        )}
        {draft.gallery.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2">{draft.gallery.map(g => <img key={g} src={g} alt="" className="aspect-[4/3] w-full object-cover rounded-lg" />)}</div>
        )}
        {(tools.length > 0 || keywords.length > 0) && (
          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            {tools.length > 0 && <div><p className="label-caps">Tools used</p><ul className="mt-2 flex flex-wrap gap-2">{tools.map(tl => <li key={tl} className="inline-flex items-center gap-1.5 rounded-full border border-line pl-1 pr-2.5 py-0.5 text-fl-xs"><ToolBadge name={tl} size="sm" />{tl}</li>)}</ul></div>}
            {keywords.length > 0 && <div><p className="label-caps">Keywords</p><ul className="mt-2 flex flex-wrap gap-1.5">{keywords.map(k => <li key={k} className="rounded-full bg-frost text-slate px-2.5 py-0.5 text-fl-xs">{k}</li>)}</ul></div>}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-paper/95 backdrop-blur border-b border-line flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onCancel} className="w-9 h-9 rounded-lg border border-line flex items-center justify-center text-slate hover:text-ink hover:border-steel" aria-label="Back"><IconArrowLeft size={16} /></button>
          <div className="min-w-0">
            <p className="font-bold uppercase tracking-tight text-fl-sm truncate">{isNew ? 'New project' : 'Edit project'}</p>
            <p className="text-[11px] text-fog truncate">{draft.published ? 'Published' : 'Draft'}{draft.featured ? ' · Featured' : ''} · autosaves locally while you type</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="lg:hidden inline-flex border border-line rounded-lg overflow-hidden btn-text">
            <button type="button" onClick={() => setMobileTab('edit')} className={`px-3 py-2 ${mobileTab === 'edit' ? 'bg-ink text-paper' : 'text-slate'}`}>Edit</button>
            <button type="button" onClick={() => setMobileTab('preview')} className={`px-3 py-2 border-l border-line ${mobileTab === 'preview' ? 'bg-ink text-paper' : 'text-slate'}`}>Preview</button>
          </div>
          {previewHref && !isNew && <a href={previewHref} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line btn-text text-slate hover:text-ink hover:border-steel"><IconExternal size={13} /> View</a>}
          <button type="button" disabled={!canSave} onClick={() => onSave(false)} className="px-3.5 py-2 rounded-lg border border-line bg-white btn-text text-ink hover:border-steel disabled:opacity-50">
            {saving ? 'Saving…' : draft.published ? 'Save' : 'Save draft'}
          </button>
          <button type="button" disabled={!canSave} onClick={() => onSave(true)} className="px-3.5 py-2 rounded-lg bg-steel text-paper btn-text hover:bg-ink disabled:opacity-50">
            {draft.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {restore && (
        <div className="mt-4 rounded-xl border border-steel/40 bg-steel/10 px-4 py-3 text-fl-sm flex flex-wrap items-center justify-between gap-3">
          <span>Unsaved changes from {new Date(restore.at).toLocaleString()} were found on this device.</span>
          <span className="flex gap-2">
            <button type="button" onClick={() => { onChange(restore.draft); setRestore(null) }} className="px-3 py-1.5 rounded-md bg-ink text-paper btn-text">Restore</button>
            <button type="button" onClick={() => { clearLocalDraft(draft.id); setRestore(null) }} className="px-3 py-1.5 rounded-md border border-line btn-text text-slate">Discard</button>
          </span>
        </div>
      )}
      {uploadErr && <p className="mt-4 text-fl-sm text-red-700 rounded-lg border border-red-200 bg-red-50 p-3" role="alert">{uploadErr}</p>}

      <div className="mt-5 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-6 items-start">
        {/* ------------- FORM ------------- */}
        <div className={`space-y-5 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
          <Card title="Story">
            <textarea
              rows={1}
              value={draft.title}
              onChange={e => {
                const el = e.target
                el.style.height = 'auto'
                el.style.height = `${el.scrollHeight}px`
                const v = el.value.replace(/\n/g, ' ')
                onChange(d => ({ ...d, title: v, slug: d.id ? d.slug : slugify(v) }))
              }}
              onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
              ref={el => { if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` } }}
              placeholder="Title: say what you built and for whom"
              className="w-full bg-transparent border-0 border-b border-line focus:border-steel outline-none py-2 text-fl-2xl font-bold tracking-tight leading-tight placeholder:text-fog/50 resize-none overflow-hidden"
            />
            <textarea
              rows={2} maxLength={220} value={draft.summary} onChange={e => set({ summary: e.target.value })}
              placeholder="Summary: one or two sentences with a measurable result. Shown on cards and used as the SEO description."
              className="mt-3 w-full bg-transparent border-0 border-b border-line focus:border-steel outline-none py-2 text-fl-lg leading-snug placeholder:text-fog/50 placeholder:text-fl-sm resize-none"
            />
            <p className="mt-1 text-right text-[11px] text-fog tabular-nums">{draft.summary.length}/220</p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate">
              {FORMAT_BUTTONS.map(([k, lbl]) => (
                <button key={k} type="button" onClick={() => format(k)} className={`px-2.5 py-1.5 rounded-md border border-line bg-paper hover:border-steel hover:text-ink ${k === 'italic' ? 'italic' : ''}`}>{lbl}</button>
              ))}
              <span className="ml-auto text-fog font-medium tabular-nums">{words} words · {readingMinutes(draft.content)} min</span>
            </div>
            <textarea
              ref={contentRef}
              rows={16} value={draft.content} onChange={e => set({ content: e.target.value })}
              placeholder={'Write the case study. One paragraph per line.\n\n## Context\nWhat problem did the client have?\n\n## What I built\n- bullet points work\n- **bold**, *italic*, [links](https://…)\n\n> A short quote or key result.'}
              className={`${field} mt-2 leading-relaxed font-body text-fl-sm`}
            />
          </Card>

          <Card title="Media">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <span className={label}>Cover image (4:3 or 16:9)</span>
                {draft.cover_url ? (
                  <div className="relative group">
                    <img src={draft.cover_url} alt="cover" className="w-full aspect-[4/3] object-cover rounded-lg ring-1 ring-line" />
                    <button type="button" onClick={() => set({ cover_url: '' })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-red-700 flex items-center justify-center shadow" aria-label="Remove cover"><IconClose size={14} /></button>
                  </div>
                ) : (
                  <Dropzone accept="image/*" busy={uploading} onFiles={f => upload(f, 'covers', u => set({ cover_url: u[0].url }))}>Drop an image or <span className="text-steel font-semibold">browse</span></Dropzone>
                )}
              </div>
              <div>
                <span className={label}>Gallery images (shown stacked in the pop-up)</span>
                <Dropzone accept="image/*" multiple busy={uploading} onFiles={f => upload(f, 'gallery', u => onChange(d => ({ ...d, gallery: [...d.gallery, ...u.map(x => x.url)] })))}>Drop several images or <span className="text-steel font-semibold">browse</span></Dropzone>
                {draft.gallery.length > 0 && (
                  <ul className="mt-3 grid grid-cols-3 gap-2">
                    {draft.gallery.map((g, i) => (
                      <li key={g} className="relative group">
                        <img src={g} alt="" className="aspect-[4/3] w-full rounded-md object-cover ring-1 ring-line" />
                        <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">
                          <button type="button" onClick={() => onChange(d => { const g2 = [...d.gallery]; if (i > 0) [g2[i - 1], g2[i]] = [g2[i], g2[i - 1]]; return { ...d, gallery: g2 } })} className="bg-white/90 rounded px-1.5">←</button>
                          <button type="button" onClick={() => onChange(d => ({ ...d, gallery: d.gallery.filter((_, x) => x !== i) }))} className="bg-white/90 text-red-700 rounded px-1.5">✕</button>
                          <button type="button" onClick={() => onChange(d => { const g2 = [...d.gallery]; if (i < g2.length - 1) [g2[i + 1], g2[i]] = [g2[i], g2[i + 1]]; return { ...d, gallery: g2 } })} className="bg-white/90 rounded px-1.5">→</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-5">
              <span className={label}>Files & documents (PDF, slides, notebooks, data)</span>
              <Dropzone multiple busy={uploading} onFiles={f => upload(f, 'attachments', u => onChange(d => ({ ...d, attachments: [...d.attachments, ...u] })))}>Drop files or <span className="text-steel font-semibold">browse</span></Dropzone>
              {draft.attachments.length > 0 && (
                <ul className="mt-3 divide-y divide-line border-y border-line text-fl-sm">
                  {draft.attachments.map((a, i) => (
                    <li key={a.url} className="flex items-center gap-3 py-2">
                      <a href={a.url} target="_blank" rel="noreferrer" className="flex-1 truncate link-underline text-steel">{a.name}</a>
                      <button type="button" onClick={() => onChange(d => ({ ...d, attachments: d.attachments.filter((_, x) => x !== i) }))} className="text-red-700 btn-text">remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card title="Details">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className={label}>Field</span>
                <select value={draft.category} onChange={e => set({ category: e.target.value as Category })} className={field}>
                  <option value="data">Data</option><option value="finance">Finance</option><option value="risk">Risk</option>
                </select>
              </div>
              <div><span className={label}>Year</span><input inputMode="numeric" placeholder="2025" value={draft.year} onChange={e => set({ year: e.target.value.replace(/[^\d]/g, '').slice(0, 4) })} className={field} /></div>
              <div><span className={label}>Client / organisation</span><input placeholder="World Bank" value={draft.client} onChange={e => set({ client: e.target.value })} className={field} /></div>
              <div><span className={label}>Your role</span><input placeholder="Lead data scientist" value={draft.role} onChange={e => set({ role: e.target.value })} className={field} /></div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <span className={label}>Tools used (comma separated), shown as badges</span>
                <input value={draft.tools} onChange={e => set({ tools: e.target.value })} placeholder="Python, SQL, Airflow, dbt, BigQuery" className={field} />
                {tools.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{tools.map(tl => <ToolBadge key={tl} name={tl} size="sm" />)}</div>}
              </div>
              <div>
                <span className={label}>SEO keywords (comma separated)</span>
                <input value={draft.keywords} onChange={e => set({ keywords: e.target.value })} placeholder="time series forecasting, early warning system" className={field} />
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              <div><span className={label}>Tags (short labels)</span><input value={draft.tags} onChange={e => set({ tags: e.target.value })} placeholder="IFRS 17, Reserving" className={field} /></div>
              <div><span className={label}>External link (Behance, GitHub, report…)</span><input type="url" value={draft.external_url} onChange={e => set({ external_url: e.target.value })} placeholder="https://" className={field} /></div>
              <div><span className={label}>Behance embed (iframe code or src URL)</span><input value={draft.embed_url} onChange={e => set({ embed_url: e.target.value })} placeholder='<iframe src="https://www.behance.net/embed/project/…">' className={`${field} font-mono text-[12px]`} /></div>
            </div>
            <div className="mt-4">
              <span className={label}>Slug (URL): /work/…</span>
              <input value={draft.slug} onChange={e => set({ slug: slugify(e.target.value) })} className={`${field} font-mono text-[12px]`} />
            </div>
          </Card>

          <Card
            title="Translations"
            aside={<span className="inline-flex items-center gap-1.5 text-[11px] text-fog"><IconLanguage size={13} /> EN · ID · JA · ZH</span>}
          >
            <p className="text-fl-xs text-slate leading-relaxed">
              Visitors see the site in their own language automatically. Write the project once in its source language, click <strong>Auto-translate</strong>, then review and edit each language before publishing. Projects without a stored translation are machine-translated in the visitor's browser as a fallback.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-fl-sm">
                <span className="label-caps">Source language</span>
                <select value={draft.source_lang} onChange={e => set({ source_lang: e.target.value as Lang4 })} className="border border-line rounded-lg px-2.5 py-1.5 bg-white text-fl-sm">
                  {LANG4.map(l => <option key={l} value={l}>{LANG_LABEL[l]}</option>)}
                </select>
              </label>
              <button type="button" disabled={!!tBusy || !draft.title.trim()} onClick={() => translateTo(targets)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-ink text-paper btn-text hover:bg-steel disabled:opacity-50">
                <IconLanguage size={14} /> {tBusy ? tBusy : 'Auto-translate to all languages'}
              </button>
            </div>
            {tErr && <p className="mt-3 text-fl-xs text-red-700">{tErr}</p>}

            <div className="mt-5 flex gap-1 border-b border-line">
              {targets.map(l => {
                const has = Boolean(draft.translations[l]?.title?.trim())
                return (
                  <button key={l} type="button" onClick={() => setTLang(l)} className={`relative px-3 py-2 text-fl-sm inline-flex items-center gap-1.5 ${tLang === l ? 'text-ink font-semibold' : 'text-slate hover:text-ink'}`}>
                    {LANG_LABEL[l]} {has && <IconCheck size={12} className="text-steel" />}
                    <span className={`absolute left-2 right-2 -bottom-px h-[2px] bg-steel transition-transform origin-left ${tLang === l ? 'scale-x-100' : 'scale-x-0'}`} />
                  </button>
                )
              })}
            </div>
            {targets.includes(tLang) && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] text-fog">Editing the {LANG_LABEL[tLang]} version. Leave a field empty to fall back to the source text.</p>
                  <span className="flex gap-2">
                    <button type="button" disabled={!!tBusy} onClick={() => translateTo([tLang])} className="px-2.5 py-1.5 rounded-md border border-line btn-text text-slate hover:border-steel hover:text-ink disabled:opacity-50">Retranslate</button>
                    <button type="button" onClick={() => onChange(d => { const tr = { ...d.translations }; delete tr[tLang]; return { ...d, translations: tr } })} className="px-2.5 py-1.5 rounded-md border border-line btn-text text-slate hover:border-red-300 hover:text-red-700">Clear</button>
                  </span>
                </div>
                <input value={draft.translations[tLang]?.title ?? ''} onChange={e => setTr(tLang, { title: e.target.value })} placeholder={`Title (${LANG_LABEL[tLang]})`} className={`${field} font-semibold`} />
                <textarea rows={2} value={draft.translations[tLang]?.summary ?? ''} onChange={e => setTr(tLang, { summary: e.target.value })} placeholder={`Summary (${LANG_LABEL[tLang]})`} className={field} />
                <input value={draft.translations[tLang]?.role ?? ''} onChange={e => setTr(tLang, { role: e.target.value })} placeholder={`Role (${LANG_LABEL[tLang]})`} className={field} />
                <textarea rows={8} value={draft.translations[tLang]?.content ?? ''} onChange={e => setTr(tLang, { content: e.target.value })} placeholder={`Case study (${LANG_LABEL[tLang]}), same "## / - / >" markup as the source`} className={`${field} leading-relaxed text-fl-sm`} />
              </div>
            )}
          </Card>

          <Card title="Publishing">
            <div className="flex flex-wrap items-center gap-6 text-fl-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" className="w-4 h-4 accent-steel" checked={draft.published} onChange={e => set({ published: e.target.checked })} /> Published (visible on the site)</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" className="w-4 h-4 accent-steel" checked={draft.featured} onChange={e => set({ featured: e.target.checked })} /> Featured (shown first, badge on card)</label>
              <label className="inline-flex items-center gap-2">Order <input inputMode="numeric" value={draft.sort_order} onChange={e => set({ sort_order: e.target.value.replace(/[^\d-]/g, '') })} className="w-16 border border-line rounded-md px-2 py-1 text-center" /><span className="text-fog text-[11px]">lower first</span></label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" disabled={!canSave} onClick={() => onSave(false)} className="px-4 py-2.5 rounded-lg border border-line bg-white btn-text hover:border-steel disabled:opacity-50">{saving ? 'Saving…' : draft.published ? 'Save' : 'Save draft'}</button>
              <button type="button" disabled={!canSave} onClick={() => onSave(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-steel text-paper btn-text hover:bg-ink disabled:opacity-50">{draft.published ? 'Update' : 'Publish'} <IconArrowRight size={13} /></button>
              <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg btn-text text-slate hover:text-ink">Cancel</button>
            </div>
          </Card>
        </div>

        {/* ------------- PREVIEW ------------- */}
        <div className={`lg:sticky lg:top-20 ${mobileTab === 'edit' ? 'hidden lg:block' : ''}`}>{preview}</div>
      </div>
    </div>
  )
}
