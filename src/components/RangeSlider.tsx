type Props = {
  min: number
  max: number
  value: [number, number]
  onChange: (v: [number, number]) => void
  label?: string
}

/** Dual-thumb range input (e.g. the year filter). Two native ranges stacked; CSS lives in index.css (.range-dual). */
export default function RangeSlider({ min, max, value, onChange, label = 'Range' }: Props) {
  const [lo, hi] = value
  const span = Math.max(1, max - min)
  const pct = (v: number) => ((v - min) / span) * 100

  return (
    <div>
      <div className="range-dual" role="group" aria-label={label}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-white/15" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-ocean"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range" min={min} max={max} step={1} value={lo}
          aria-label={`${label} from`}
          onChange={e => onChange([Math.min(Number(e.target.value), hi), hi])}
          style={{ zIndex: lo >= max ? 5 : 3 }}
        />
        <input
          type="range" min={min} max={max} step={1} value={hi}
          aria-label={`${label} to`}
          onChange={e => onChange([lo, Math.max(Number(e.target.value), lo)])}
          style={{ zIndex: 4 }}
        />
      </div>
      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-fl-sm">
        <span className="ring-1 ring-white/15 bg-white/5 rounded-md px-2.5 py-1.5 text-center tabular-nums text-paper">{lo}</span>
        <span className="text-paper/40">—</span>
        <span className="ring-1 ring-white/15 bg-white/5 rounded-md px-2.5 py-1.5 text-center tabular-nums text-paper">{hi}</span>
      </div>
    </div>
  )
}
