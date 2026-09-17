import { useState } from 'react'
import { site, asset } from '../lib/site'
import { useLang } from '../contexts/LanguageContext'
import Banner from './Banner'

/**
 * Right-hand hero visual. Shows public/avatar.jpg when it exists; otherwise a
 * dark "data bands" panel with a monogram so the layout looks intentional either way.
 */
export default function HeroVisual() {
  const { t } = useLang()
  const [failed, setFailed] = useState(false)
  const initials = site.name.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div className="rise-3 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/4.6] rounded-2xl overflow-hidden ring-1 ring-line bg-ink shadow-lift">
      {!failed ? (
        <img
          src={asset(site.avatar)}
          alt={`${site.name} portrait`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <div className="absolute inset-0"><Banner className="h-full" /></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-paper/90 text-[clamp(4rem,9vw,8rem)] leading-none tracking-tight select-none" aria-label={site.name}>
              {initials}
            </span>
          </div>
          <div className="absolute top-4 left-4 flex flex-col gap-1 text-[10px] uppercase tracking-[.16em] text-tide/80">
            <span>Data · Finance · Risk</span>
            <span>{site.location}</span>
          </div>
        </>
      )}

      <div className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 flex items-center justify-between gap-3 rounded-xl bg-paper/92 backdrop-blur px-4 py-3 text-fl-xs ring-1 ring-line">
        <span className="inline-flex items-center gap-2 text-ink font-medium">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-steel opacity-50 animate-ping [animation-duration:2.4s]" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-steel" />
          </span>
          {t('hero.available')}
        </span>
        <span className="text-fog hidden sm:inline">{site.timezone}</span>
      </div>
    </div>
  )
}
