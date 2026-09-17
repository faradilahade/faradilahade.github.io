import { ReactNode } from 'react'

/**
 * Tiny, safe rich-text renderer shared by the public modal and the admin live preview.
 * Block syntax (one per line):  "## Heading"  "- bullet"  "1. numbered"  "> quote"   blank line = paragraph break
 * Inline syntax:  **bold**  *italic*  `code`  [label](https://url)
 * Everything is built as React nodes, so no HTML is ever injected.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of text.matchAll(INLINE)) {
    const idx = m.index ?? 0
    if (idx > last) out.push(text.slice(last, idx))
    const tok = m[0]
    if (tok.startsWith('**')) out.push(<strong key={i++} className="font-semibold text-ink">{tok.slice(2, -2)}</strong>)
    else if (tok.startsWith('`')) out.push(<code key={i++} className="font-mono text-[0.9em] bg-frost px-1.5 py-0.5 rounded-sm">{tok.slice(1, -1)}</code>)
    else if (tok.startsWith('[')) {
      const label = tok.slice(1, tok.indexOf(']('))
      out.push(<a key={i++} href={m[2]} target="_blank" rel="noreferrer" className="text-steel underline decoration-steel/40 hover:decoration-steel">{label}</a>)
    } else out.push(<em key={i++}>{tok.slice(1, -1)}</em>)
    last = idx + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

type Opts = { headingClass?: string; paragraphClass?: string }

export function renderContent(text: string, opts: Opts = {}): ReactNode[] {
  const headingClass = opts.headingClass ?? 'font-bold uppercase tracking-tight text-fl-base text-ink pt-3'
  const paragraphClass = opts.paragraphClass ?? ''
  const lines = text.split(/\r?\n/)
  const out: ReactNode[] = []
  let bullets: string[] = []
  let numbered: string[] = []
  const flush = () => {
    if (bullets.length) {
      out.push(<ul key={`ul-${out.length}`} className="list-disc pl-5 space-y-1.5 marker:text-steel">{bullets.map((li, i) => <li key={i}>{renderInline(li)}</li>)}</ul>)
      bullets = []
    }
    if (numbered.length) {
      out.push(<ol key={`ol-${out.length}`} className="list-decimal pl-5 space-y-1.5 marker:text-steel marker:font-medium">{numbered.map((li, i) => <li key={i}>{renderInline(li)}</li>)}</ol>)
      numbered = []
    }
  }
  lines.forEach((raw, i) => {
    const line = raw.trim()
    if (!line) { flush(); return }
    const h = line.match(/^(#{1,3})\s+(.*)$/)
    if (h) { flush(); out.push(<h2 key={i} className={headingClass}>{renderInline(h[2])}</h2>); return }
    const b = line.match(/^[-•*]\s+(.*)$/)
    if (b) { if (numbered.length) flush(); bullets.push(b[1]); return }
    const n = line.match(/^\d+[.)]\s+(.*)$/)
    if (n) { if (bullets.length) flush(); numbered.push(n[1]); return }
    const q = line.match(/^>\s?(.*)$/)
    if (q) { flush(); out.push(<blockquote key={i} className="border-l-2 border-steel pl-4 font-display text-fl-lg text-ink/80 leading-snug">{renderInline(q[1])}</blockquote>); return }
    flush()
    out.push(<p key={i} className={paragraphClass}>{renderInline(line)}</p>)
  })
  flush()
  return out
}

export function wordCount(text: string): number {
  const t = text.trim()
  if (!t) return 0
  // CJK scripts: count characters; otherwise count whitespace-separated words
  const cjk = (t.match(/[぀-ヿ㐀-鿿가-힯]/g) ?? []).length
  const words = t.replace(/[぀-ヿ㐀-鿿가-힯]/g, ' ').split(/\s+/).filter(Boolean).length
  return words + cjk
}

export function readingMinutes(text: string): number {
  return Math.max(1, Math.round(wordCount(text) / 220))
}
