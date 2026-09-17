import { ChangeEvent, DragEvent, ReactNode, useState } from 'react'
import { IconUpload } from '../../components/Icons'

/** Small widgets shared by the project and article editors. */

export const field = 'w-full border border-line rounded-lg px-3 py-2 bg-white text-ink focus:border-steel outline-none transition-colors'
export const label = 'label-caps block mb-1.5'

export function Card({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="bg-white border border-line rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="font-bold uppercase tracking-tight text-fl-sm">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Dropzone({ onFiles, accept, multiple, children, busy }: { onFiles: (files: File[]) => void; accept?: string; multiple?: boolean; children: ReactNode; busy?: boolean }) {
  const [over, setOver] = useState(false)
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); setOver(false)
    const files = Array.from(e.dataTransfer.files ?? [])
    if (files.length) onFiles(multiple ? files : files.slice(0, 1))
  }
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) onFiles(files)
    e.target.value = ''
  }
  return (
    <label
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`block cursor-pointer rounded-xl border-2 border-dashed px-4 py-5 text-center text-fl-xs transition-colors ${over ? 'border-steel bg-frost' : 'border-line hover:border-steel/60 bg-paper'}`}
    >
      <input type="file" accept={accept} multiple={multiple} onChange={onInput} className="sr-only" />
      <IconUpload size={18} className="mx-auto text-steel" />
      <div className="mt-1.5 text-slate">{busy ? 'Uploading…' : children}</div>
    </label>
  )
}

export type FormatKind = 'h2' | 'bullet' | 'number' | 'quote' | 'bold' | 'italic' | 'link'
export const FORMAT_BUTTONS: readonly (readonly [FormatKind, string])[] = [
  ['h2', 'H2'], ['bold', 'B'], ['italic', 'I'], ['bullet', '• List'], ['number', '1. List'], ['quote', '“ Quote'], ['link', 'Link'],
]

/** Applies light markup to the textarea's current selection; returns the new value and caret position. */
export function applyFormat(ta: HTMLTextAreaElement, kind: FormatKind): { value: string; cursor: number } {
  const { selectionStart: s, selectionEnd: e, value } = ta
  const sel = value.slice(s, e)
  let out = '', cursor = 0
  const linePrefix = (prefix: string) => {
    const lineStart = value.lastIndexOf('\n', s - 1) + 1
    out = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    cursor = e + prefix.length
  }
  switch (kind) {
    case 'h2': linePrefix('## '); break
    case 'bullet': linePrefix('- '); break
    case 'number': linePrefix('1. '); break
    case 'quote': linePrefix('> '); break
    case 'bold': out = value.slice(0, s) + `**${sel || 'bold text'}**` + value.slice(e); cursor = s + (sel ? sel.length + 4 : 2); break
    case 'italic': out = value.slice(0, s) + `*${sel || 'italic text'}*` + value.slice(e); cursor = s + (sel ? sel.length + 2 : 1); break
    case 'link': out = value.slice(0, s) + `[${sel || 'link text'}](https://)` + value.slice(e); cursor = s + (sel || 'link text').length + 3 + 8; break
  }
  return { value: out, cursor }
}
