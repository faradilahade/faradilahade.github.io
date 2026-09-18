import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import SectionTitle from './SectionTitle'
import { IconPlus, IconMinus } from './Icons'

export const FAQ_COUNT = 8

export function faqItems(t: (k: string) => string) {
  return Array.from({ length: FAQ_COUNT }, (_, i) => ({ q: t(`faq.q${i + 1}`), a: t(`faq.a${i + 1}`) }))
}

function Item({ n, q, a, open, onToggle }: { n: number; q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`bg-white/75 backdrop-blur ring-1 rounded-xl transition-all duration-300 ${open ? 'ring-steel/50 shadow-float' : 'ring-ink/[.06] hover:ring-steel/30'}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-4 px-4 py-3.5 text-left">
        <span className="text-fl-xs text-fog tabular-nums w-6 shrink-0">{String(n).padStart(2, '0')}</span>
        <span className="flex-1 btn-text text-ink leading-snug">{q}</span>
        <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${open ? 'bg-steel border-steel text-paper' : 'border-line text-steel'}`}>
          {open ? <IconMinus size={14} /> : <IconPlus size={14} />}
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-smooth ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-4 pb-4 pl-14 text-fl-sm text-slate leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const { t } = useLang()
  const items = faqItems(t)
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))
  const toggle = (i: number) => setOpen(prev => {
    const next = new Set(prev)
    if (next.has(i)) next.delete(i); else next.add(i)
    return next
  })
  const half = Math.ceil(items.length / 2)
  const cols = [items.slice(0, half), items.slice(half)]

  return (
    <section id="faq" className="scroll-mt-20">
      <div className="max-w-site mx-auto px-gutter py-section">
        <SectionTitle className="reveal">{t('faq.title')}</SectionTitle>
        <div className="mt-8 grid md:grid-cols-2 gap-x-6 gap-y-3 reveal reveal-delay-1">
          {cols.map((col, c) => (
            <div key={c} className="space-y-3">
              {col.map((it, i) => {
                const idx = c * half + i
                return <Item key={idx} n={idx + 1} q={it.q} a={it.a} open={open.has(idx)} onToggle={() => toggle(idx)} />
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
