import { useEffect, useMemo, useRef, useState } from 'react'
import { Lang4, LANG4, TranslatedFields } from '../../lib/supabase'
import { translateFields } from '../../lib/translate'
import { renderContent, wordCount, readingMinutes } from '../../lib/richtext'
import { IconClose, IconEye, IconLanguage, IconArrowLeft, IconArrowRight, IconCheck, IconExternal } from '../../components/Icons'
import { Card, Dropzone, field, label, FORMAT_BUTTONS, applyFormat, FormatKind } from './ui'
import { ArticleDraft, LANG_LABEL, slugify, splitList, uploadFile, saveLocalArticle, loadLocalArticle, clearLocalArticle } from './shared'

type Updater = ArticleDraft | ((d: ArticleDraft) => ArticleDraft)

type Props = {
  draft: ArticleDraft
  onChange: (u: Updater) => void
  onSave: (publish?: boolean) => void
  onCancel: () => void
  saving: boolean
  previewHref?: string
}

/** Medium-style editor for articles: title, standfirst, body with light markup, cover, tags, translations, publishing. */
export default function ArticleEditor({ draft, onChange, onSave, onCancel, saving, previewHref }: Props) {
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const [restore, setRestore] = useState<{ at: number; draft: ArticleDraft } | null>(null)
  const [tLang, setTLang] = useState<Lang4>(() => LANG4.find(l => l !== draft.source_lang) ?? 'id')
  const [tBusy, setTBusy] = useState('')
  const [tErr, setTErr] = useState('')
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const isNew = !draft.id

  useEffect(() => {
    const saved = loadLocalArticle(draft.id)
    if (saved && JSON.stringify(saved.draft) !== JSON.stringify(draft) && (saved.draft.title || saved.draft.content)) setRestore(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id])
  useEffect(() => {
    const h = window.setTimeout(() => { if (draft.title || draft.content || draft.summary) saveLocalArticle(draft) }, 800)
    return () => window.clearTimeout(h)
  }, [draft])

  const set = (patch: Partial<ArticleDraft>) => onChange(d => ({ ...d, ...patch }))

  async function uploadCover(files: File[]) {
    setUploading(true); setUploadErr('')
    const r = await uploadFile(files[0], 'articles')
    setUploading(false)
    if ('error' in r) setUploadErr(r.error)
    else set({ cover_url: r.url })
  }

  function format(kind: FormatKind) {
    const ta = contentRef.current
    if (!ta) return
    const { value, cursor } = applyFormat(ta, kind)
    set({ content: value })
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(cursor, cursor) })
  }

  const targets = LANG4.filter(l => l !== draft.source_lang)
  useEffect(() => { if (tLang === draft.source_lang) setTLang(targets[0]) }, [draft.source_lang, tLang, targets])

  async function translateTo(langs: Lang4[]) {
    setTErr('')
    for (const l of langs) {
      try {
        setTBusy(`${LANG_LABEL[l]} …`)
        const res = await translateFields(
          { title: draft.title, summary: draft.summary || null, content: draft.content || null, role: null },
          draft.source_lang, l,
          (part, done, total) => setTBusy(`${LANG_LABEL[l]} · ${part}${total > 1 ? ` ${done}/${total}` : ''}`),
        )
        onChange(d => ({ ...d, translations: { ...d.translations, [l]: { title: res.title, summary: res.summary, content: res.content } } }))
      } catch (e) {
        setTErr(`Could not translate to ${LANG_LABEL[l]}: ${e instanceof Error ? e.message : 'network error'}. Try again in a minute or write it by hand.`)
      }
    }
    setTBusy('')
  }
  const setTr = (l: Lang4, patch: Partial<TranslatedFields>) =>
    onChange(d => ({ ...d, translations: { ...d.translations, [l]: { ...(d.translations[l] ?? {}), ...patch } } }))

  const tags = useMemo(() => splitList(draft.tags), [draft.tags])
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
          <span className="text-ink">Article</span>
          <span>· {draft.published_at}</span>
          {tags.slice(0, 3).map(tg => <span key={tg} className="text-steel">· {tg}</span>)}
        </p>
        <h2 className="mt-2 font-bold tracking-tight text-fl-2xl leading-tight text-ink">{draft.title || 'Untitled article'}</h2>
        {draft.summary && <p className="mt-3 text-fl-lg text-ink/75 leading-snug">{draft.summary}</p>}
        {draft.content ? (
          <div className="mt-6 space-y-4 text-fl-sm leading-[1.8] text-ink/90">{renderContent(draft.content)}</div>
        ) : (
          <p className="mt-6 text-fl-sm text-fog">Your article will appear here as you write.</p>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-paper/95 backdrop-blur border-b border-line flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={onCancel} className="w-9 h-9 rounded-lg border border-line flex items-center justify-center text-slate hover:text-ink hover:border-steel" aria-label="Back"><IconArrowLeft size={16} /></button>
          <div className="min-w-0">
            <p className="font-bold uppercase tracking-tight text-fl-sm truncate">{isNew ? 'New article' : 'Edit article'}</p>
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
            <button type="button" onClick={() => { clearLocalArticle(draft.id); setRestore(null) }} className="px-3 py-1.5 rounded-md border border-line btn-text text-slate">Discard</button>
          </span>
        </div>
      )}
      {uploadErr && <p className="mt-4 text-fl-sm text-red-700 rounded-lg border border-red-200 bg-red-50 p-3" role="alert">{uploadErr}</p>}

      <div className="mt-5 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-6 items-start">
        <div className={`space-y-5 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
          <Card title="Article">
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
              placeholder="Title: what will the reader learn?"
              className="w-full bg-transparent border-0 border-b border-line focus:border-steel outline-none py-2 text-fl-2xl font-bold tracking-tight leading-tight placeholder:text-fog/50 resize-none overflow-hidden"
            />
            <textarea
              rows={2} maxLength={240} value={draft.summary} onChange={e => set({ summary: e.target.value })}
              placeholder="Standfirst: one or two sentences shown on the card and used as the SEO description."
              className="mt-3 w-full bg-transparent border-0 border-b border-line focus:border-steel outline-none py-2 text-fl-lg leading-snug placeholder:text-fog/50 placeholder:text-fl-sm resize-none"
            />
            <p className="mt-1 text-right text-[11px] text-fog tabular-nums">{draft.summary.length}/240</p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate">
              {FORMAT_BUTTONS.map(([k, lbl]) => (
                <button key={k} type="button" onClick={() => format(k)} className={`px-2.5 py-1.5 rounded-md border border-line bg-paper hover:border-steel hover:text-ink ${k === 'italic' ? 'italic' : ''}`}>{lbl}</button>
              ))}
              <span className="ml-auto text-fog font-medium tabular-nums">{words} words · {readingMinutes(draft.content)} min</span>
            </div>
            <textarea
              ref={contentRef}
              rows={18} value={draft.content} onChange={e => set({ content: e.target.value })}
              placeholder={'Write the article. One paragraph per line.\n\n## A heading\nParagraph with **bold**, *italic*, `code` and [links](https://…).\n\n- bullet points\n1. numbered steps\n> a pull quote'}
              className={`${field} mt-2 leading-relaxed font-body text-fl-sm`}
            />
          </Card>

          <Card title="Cover & details">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <span className={label}>Cover image (16:9 works best)</span>
                {draft.cover_url ? (
                  <div className="relative group">
                    <img src={draft.cover_url} alt="cover" className="w-full aspect-[16/9] object-cover rounded-lg ring-1 ring-line" />
                    <button type="button" onClick={() => set({ cover_url: '' })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-red-700 flex items-center justify-center shadow" aria-label="Remove cover"><IconClose size={14} /></button>
                  </div>
                ) : (
                  <Dropzone accept="image/*" busy={uploading} onFiles={uploadCover}>Drop an image or <span className="text-steel font-semibold">browse</span></Dropzone>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <span className={label}>Topics / tags (comma separated), become filter chips</span>
                  <input value={draft.tags} onChange={e => set({ tags: e.target.value })} placeholder="Actuarial, Python, IFRS 17" className={field} />
                </div>
                <div>
                  <span className={label}>Publish date</span>
                  <input type="date" value={draft.published_at} onChange={e => set({ published_at: e.target.value })} className={field} />
                </div>
                <div>
                  <span className={label}>External link (Medium, LinkedIn, PDF…), optional</span>
                  <input type="url" value={draft.external_url} onChange={e => set({ external_url: e.target.value })} placeholder="https://" className={field} />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className={label}>Slug (URL): /articles/…</span>
              <input value={draft.slug} onChange={e => set({ slug: slugify(e.target.value) })} className={`${field} font-mono text-[12px]`} />
            </div>
          </Card>

          <Card title="Translations" aside={<span className="inline-flex items-center gap-1.5 text-[11px] text-fog"><IconLanguage size={13} /> EN · ID · JA · ZH</span>}>
            <p className="text-fl-xs text-slate leading-relaxed">
              Write once in the source language, click <strong>Auto-translate</strong>, then review each language. Articles without a stored translation are machine-translated in the visitor's browser as a fallback.
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
                <textarea rows={2} value={draft.translations[tLang]?.summary ?? ''} onChange={e => setTr(tLang, { summary: e.target.value })} placeholder={`Standfirst (${LANG_LABEL[tLang]})`} className={field} />
                <textarea rows={8} value={draft.translations[tLang]?.content ?? ''} onChange={e => setTr(tLang, { content: e.target.value })} placeholder={`Article (${LANG_LABEL[tLang]}), same "## / - / >" markup as the source`} className={`${field} leading-relaxed text-fl-sm`} />
              </div>
            )}
          </Card>

          <Card title="Publishing">
            <div className="flex flex-wrap items-center gap-6 text-fl-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" className="w-4 h-4 accent-steel" checked={draft.published} onChange={e => set({ published: e.target.checked })} /> Published (visible on the site)</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" className="w-4 h-4 accent-steel" checked={draft.featured} onChange={e => set({ featured: e.target.checked })} /> Featured (shown first, larger card)</label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" disabled={!canSave} onClick={() => onSave(false)} className="px-4 py-2.5 rounded-lg border border-line bg-white btn-text hover:border-steel disabled:opacity-50">{saving ? 'Saving…' : draft.published ? 'Save' : 'Save draft'}</button>
              <button type="button" disabled={!canSave} onClick={() => onSave(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-steel text-paper btn-text hover:bg-ink disabled:opacity-50">{draft.published ? 'Update' : 'Publish'} <IconArrowRight size={13} /></button>
              <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg btn-text text-slate hover:text-ink">Cancel</button>
            </div>
          </Card>
        </div>

        <div className={`lg:sticky lg:top-20 ${mobileTab === 'edit' ? 'hidden lg:block' : ''}`}>{preview}</div>
      </div>
    </div>
  )
}
