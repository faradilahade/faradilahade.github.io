import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { site } from '../lib/site'
import { IconPhone, IconArrowDown, IconMail, IconWhatsapp, IconArrowRight } from './Icons'

/* ------------------------------------------------------------------
   Hero: the name set as large type in the middle, surrounded by
   floating "work" cards — a live-looking dashboard, a code snippet,
   the actuarial formulas used every week and a skills list. Cards
   drift on their own and respond to the pointer and to scrolling.
------------------------------------------------------------------- */

/** Count-up for the KPI numbers; runs once on mount. */
function useCountUp(target: number, ms = 1600, delay = 500) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setV(target); return }
    let raf = 0
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / ms))
      const eased = 1 - Math.pow(1 - t, 3)
      setV(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms, delay])
  return v
}

type CardProps = { children: ReactNode; className?: string; dx?: number; dy?: number; ds?: number; float?: 'float' | 'float-slow' | 'float-alt'; delay?: string; rise?: number; origin?: string }

/** Parallax wrapper (pointer + scroll) around an idle-floating card. */
function Floating({ children, className = '', dx = 0, dy = 0, ds = 0, float = 'float', delay = '0s', rise = 3, origin = '' }: CardProps) {
  const style = { '--dx': `${dx}px`, '--dy': `${dy}px`, '--ds': ds } as CSSProperties
  return (
    <div className={`para ${className}`} style={style}>
      <div className={`rise-${rise}`}>
        <div className={origin ? `lg:scale-[.8] xl:scale-[.9] 2xl:scale-100 ${origin}` : ''}>
          <div className={`animate-${float}`} style={{ animationDelay: delay }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

/* ---- Card 1: forecast dashboard ---------------------------------- */
function DashboardCard() {
  const { t } = useLang()
  const acc = useCountUp(92)
  const sites = useCountUp(240, 1800, 700)
  // observed vs forecast — smooth, plausible series
  const obs = 'M0 58 C 18 52, 30 40, 48 44 S 78 30, 96 34 S 126 18, 148 24 S 178 12, 200 16 S 232 8, 260 12'
  const fc = 'M0 60 C 20 56, 32 44, 50 46 S 80 34, 98 36 S 128 22, 150 26 S 180 16, 202 18 S 234 10, 260 13'
  return (
    <div className="hero-card p-4 w-[264px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-fog">{t('hero.card.dashboard')}</p>
          <p className="mt-0.5 text-fl-xs text-slate">{t('hero.card.dashboardSub')}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-frost px-2 py-1 text-[10px] font-semibold text-steel">
          <span className="relative flex w-1.5 h-1.5"><span className="absolute inline-flex w-full h-full rounded-full bg-ocean opacity-60 animate-ping [animation-duration:2.4s]" /><span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-ocean" /></span>
          LIVE
        </span>
      </div>
      <svg viewBox="0 0 260 70" className="mt-3 w-full h-[70px] overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="hArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5C9DC9" stopOpacity=".35" /><stop offset="1" stopColor="#5C9DC9" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[14, 32, 50].map(y => <line key={y} x1="0" x2="260" y1={y} y2={y} stroke="#0E1B2C" strokeOpacity=".06" />)}
        <path d={`${obs} L 260 70 L 0 70 Z`} fill="url(#hArea)" className="animate-fade [animation-delay:1.4s]" />
        <path d={fc} fill="none" stroke="#8FC3E3" strokeWidth="1.5" strokeDasharray="4 4" pathLength={1} className="draw-path [animation-delay:.9s]" style={{ strokeDasharray: '1' }} />
        <path d={obs} fill="none" stroke="#3E6B8F" strokeWidth="2" strokeLinecap="round" pathLength={1} className="draw-path" />
        <circle cx="260" cy="12" r="3.5" fill="#3E6B8F" className="animate-fade [animation-delay:2.4s]" />
        <circle cx="260" cy="12" r="8" fill="#3E6B8F" opacity=".25" className="animate-ping [animation-duration:2.4s] [animation-delay:2.4s]" />
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-frost px-3 py-2">
          <p className="text-fl-lg font-bold tabular-nums leading-none text-ink">{acc}%</p>
          <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-fog">{t('hero.card.accuracy')}</p>
        </div>
        <div className="rounded-lg bg-frost px-3 py-2">
          <p className="text-fl-lg font-bold tabular-nums leading-none text-ink">{sites}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[.12em] text-fog">{t('hero.card.sites')}</p>
        </div>
      </div>
    </div>
  )
}

/* ---- Card 2: code ------------------------------------------------ */
const K = ({ c }: { c: string }) => <span className="text-tide">{c}</span>          // keyword / builtin
const F = ({ c }: { c: string }) => <span className="text-ocean">{c}</span>         // function
const N = ({ c }: { c: string }) => <span className="text-[#C9D7E6]">{c}</span>     // number / literal
const C = ({ c }: { c: string }) => <span className="text-paper/40 italic">{c}</span>

function CodeCard() {
  return (
    <div className="hero-card-dark w-[300px] overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-white/20" /><span className="w-2.5 h-2.5 rounded-full bg-white/20" /><span className="w-2.5 h-2.5 rounded-full bg-ocean/70" />
        <span className="ml-2 text-[10px] font-mono text-paper/60">reserving.py</span>
        <span className="ml-auto text-[10px] font-mono text-paper/40">python</span>
      </div>
      <pre className="px-4 py-3.5 text-[11.5px] leading-[1.75] font-mono text-paper/90 overflow-hidden"><code>
<C c="# IBNR via chain-ladder" />{'\n'}
<K c="f" /> = (tri.<F c="shift" />(-<N c="1" />, axis=<N c="1" />).<F c="sum" />(){'\n'}
{'     '}/ tri.<F c="sum" />()).<F c="cumprod" />()[::-<N c="1" />]{'\n'}
ultimate = latest * f{'\n'}
ibnr = ultimate - paid{'\n'}
<C c="# credibility-weighted rate" />{'\n'}
z = n / (n + k){'\n'}
rate = z * observed + (<N c="1" /> - z) * prior<span className="caret" />
</code></pre>
    </div>
  )
}

/* ---- Card 3: actuarial formulas + statistics -------------------- */
function FormulaCard() {
  const { t } = useLang()
  const rows: { label: string; formula: ReactNode; value: string; pct: number }[] = [
    { label: t('hero.formula.lr'), formula: <>LR = <span className="italic">Claims</span> / <span className="italic">Premium</span></>, value: '68.4%', pct: 68 },
    { label: t('hero.formula.cl'), formula: <>f<sub>k</sub> = Σ C<sub>i,k+1</sub> / Σ C<sub>i,k</sub></>, value: '1.142', pct: 57 },
    { label: t('hero.formula.ax'), formula: <>A<sub>x</sub> = Σ v<sup>k+1</sup> · <sub>k</sub>p<sub>x</sub> · q<sub>x+k</sub></>, value: '0.412', pct: 41 },
    { label: t('hero.formula.z'), formula: <>Z = n / (n + k)</>, value: '0.83', pct: 83 },
    { label: t('hero.formula.var'), formula: <>VaR<sub>99.5</sub> = μ + 2.576 σ</>, value: '12.4bn', pct: 74 },
  ]
  return (
    <div className="hero-card p-4 w-[292px]">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-fog">{t('hero.card.formulas')}</p>
        <p className="text-[10px] text-fog">{t('hero.card.formulasSub')}</p>
      </div>
      <ul className="mt-3 space-y-2.5">
        {rows.map((r, i) => (
          <li key={r.label}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12.5px] text-ink font-medium tracking-tight whitespace-nowrap">{r.formula}</span>
              <span className="text-[12px] font-bold tabular-nums text-steel">{r.value}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-[3px] flex-1 rounded-full bg-ink/[.06] overflow-hidden">
                <span className="grow-x block h-full rounded-full bg-gradient-to-r from-steel to-tide" style={{ width: `${r.pct}%`, animationDelay: `${0.6 + i * 0.12}s` }} />
              </span>
              <span className="text-[10px] uppercase tracking-[.1em] text-fog whitespace-nowrap">{r.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---- Card 4: skills list (the reference's "Skills" panel) --------- */
function SkillsCard() {
  const { t } = useLang()
  const skills = [1, 2, 3, 4, 5].map(i => ({ label: t(`hero.skill.${i}`), level: [96, 90, 88, 92, 84][i - 1] }))
  return (
    <div className="w-[268px]">
      <span className="inline-flex items-center rounded-full bg-ink text-paper px-4 py-2 text-[11px] font-semibold uppercase tracking-[.14em] shadow-lift rise-4">{t('hero.card.skills')}</span>
      <ul className="hero-card-dark mt-3 divide-y divide-white/10 overflow-hidden">
        {skills.map((s, i) => (
          <li key={s.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <span className="text-[12.5px] text-paper/90 leading-snug">{s.label}</span>
            <span className="flex items-center gap-1" aria-label={`${s.level}%`}>
              {[0, 1, 2, 3, 4].map(d => (
                <span key={d} className={`w-1.5 h-1.5 rounded-full ${d < Math.round(s.level / 20) ? 'bg-tide' : 'bg-white/15'}`} style={{ animation: `fade .4s ${0.9 + i * 0.1 + d * 0.06}s both` }} />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---- Card 5: call pill (the reference's phone bar) ---------------- */
function CallPill() {
  const { t } = useLang()
  const initials = site.name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div className="hero-card-dark rounded-full pl-2 pr-2 py-2 flex items-center gap-3 w-full max-w-[420px] sm:w-max">
      <span className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-tide via-ocean to-steel text-night flex items-center justify-center text-[12px] font-bold">{initials}</span>
      <span className="min-w-0 flex-1 pr-1">
        <span className="block text-[12.5px] font-semibold leading-tight truncate">{site.name}</span>
        <span className="block text-[11px] text-paper/60 leading-tight tabular-nums truncate">{site.phoneDisplay} · {t('hero.call.label')}</span>
      </span>
      <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} className="shrink-0 w-9 h-9 rounded-full bg-steel text-paper flex items-center justify-center hover:bg-ocean hover:text-night transition-colors duration-300"><IconMail size={15} /></a>
      <a href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="shrink-0 w-9 h-9 rounded-full bg-tide text-night flex items-center justify-center hover:bg-paper transition-colors duration-300"><IconWhatsapp size={15} /></a>
    </div>
  )
}

/* ---- Hero ---------------------------------------------------------- */
export default function Hero() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)

  // Pointer + scroll parallax written as CSS variables on the section
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let px = 0, py = 0, sy = 0
    const apply = () => {
      raf = 0
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
      el.style.setProperty('--sy', `${sy.toFixed(1)}px`)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply) }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width - 0.5) * 2
      py = ((e.clientY - r.top) / r.height - 0.5) * 2
      schedule()
    }
    const onLeave = () => { px = 0; py = 0; schedule() }
    const onScroll = () => { sy = Math.min(window.scrollY, 900); schedule() }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const btnPrimary = 'group inline-flex items-center justify-center gap-3 rounded-full bg-ink text-paper pl-6 pr-5 py-4 text-[11px] font-semibold uppercase tracking-[.16em] shadow-lift hover:bg-steel transition-all duration-500 ease-smooth hover:-translate-y-0.5'
  const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-full bg-white/70 ring-1 ring-ink/10 text-ink px-6 py-4 text-[11px] font-semibold uppercase tracking-[.16em] hover:ring-steel hover:text-steel transition-all duration-500 ease-smooth hover:-translate-y-0.5 backdrop-blur'

  return (
    <section ref={ref} id="top" className="relative overflow-hidden" aria-label={site.name}>
      <div className="hero-blob w-[36vw] h-[36vw] bg-tide/40 -top-[10vw] right-[8vw]" aria-hidden="true" />
      <div className="hero-blob w-[28vw] h-[28vw] bg-ocean/25 bottom-[-8vw] left-[4vw] [animation-delay:-9s]" aria-hidden="true" />

      <div className="relative max-w-site mx-auto px-gutter pt-10 md:pt-14 lg:pt-10 pb-14 lg:pb-16">
        <div className="relative lg:min-h-[740px] lg:grid lg:place-items-center">

          {/* ---- centre: name + CTA ---- */}
          <div className="relative z-10 text-center max-w-[860px] mx-auto lg:pt-6">
            <p className="rise-1 inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-ink/[.06] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[.16em] text-steel backdrop-blur">
              <span className="relative flex w-1.5 h-1.5"><span className="absolute inline-flex w-full h-full rounded-full bg-steel opacity-60 animate-ping [animation-duration:2.4s]" /><span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-steel" /></span>
              {t('hero.status')}<span className="hidden sm:inline"> · {site.location} · {site.timezone}</span>
            </p>
            <p className="rise-2 mt-7 kicker text-[clamp(.85rem,1.6vw,1.25rem)]">{t('hero.eyebrow').split('·')[0].trim()}</p>
            <h1 className="rise-2 mt-2 h-display name-gradient text-[clamp(2.9rem,8.6vw,7rem)] tracking-[-0.035em] leading-[.92] text-balance">{site.name}</h1>
            <p className="rise-3 mt-6 text-fl-xl text-ink/85 leading-snug max-w-2xl mx-auto">{t('hero.title')}</p>
            <p className="rise-3 mt-4 text-fl-sm text-slate leading-relaxed max-w-xl mx-auto">{t('hero.body')}</p>
            <div className="rise-4 mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#call" className={btnPrimary}>
                <span className="w-8 h-8 -ml-2 rounded-full bg-paper/15 flex items-center justify-center"><IconPhone size={15} /></span>
                {t('hero.request')}
                <IconArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a href="#work" className={btnGhost}>{t('hero.cta3')} <IconArrowDown size={14} /></a>
            </div>
          </div>

          {/* ---- floating cards (desktop: around the name) ---- */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden="false">
            <Floating className="absolute left-0 top-2 pointer-events-auto" dx={-14} dy={-10} ds={-0.06} float="float" rise={3} origin="origin-top-left"><DashboardCard /></Floating>
            <Floating className="absolute right-0 top-0 pointer-events-auto" dx={16} dy={-8} ds={-0.1} float="float-alt" delay="-2s" rise={4} origin="origin-top-right"><FormulaCard /></Floating>
            <Floating className="absolute left-[1%] bottom-[7%] pointer-events-auto" dx={-18} dy={12} ds={-0.14} float="float-slow" delay="-4s" rise={5} origin="origin-bottom-left"><CodeCard /></Floating>
            <Floating className="absolute right-[1%] bottom-[9%] pointer-events-auto" dx={14} dy={14} ds={-0.08} float="float-alt" delay="-6s" rise={5} origin="origin-bottom-right"><SkillsCard /></Floating>
            <Floating className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-auto" dx={0} dy={8} ds={-0.04} float="float-slow" delay="-3s" rise={6}><CallPill /></Floating>
          </div>
        </div>

        {/* ---- floating cards (mobile / tablet: flow below the name) ---- */}
        <div className="lg:hidden mt-12 grid sm:grid-cols-2 gap-5 justify-items-center">
          <Floating float="float" rise={3}><DashboardCard /></Floating>
          <Floating float="float-alt" delay="-2s" rise={4}><FormulaCard /></Floating>
          <Floating float="float-slow" delay="-4s" rise={5}><CodeCard /></Floating>
          <Floating float="float-alt" delay="-6s" rise={5}><SkillsCard /></Floating>
          <div className="sm:col-span-2 mt-2"><Floating float="float-slow" delay="-3s" rise={6}><CallPill /></Floating></div>
        </div>
      </div>
    </section>
  )
}
