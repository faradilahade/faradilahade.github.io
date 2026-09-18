import { useLang } from '../contexts/LanguageContext'
import { site, mailto } from '../lib/site'
import { IconMail } from './Icons'

/** Giant clipped wordmark at the very bottom of every page, in the accent blue. */
export default function Wordmark() {
  const { t } = useLang()
  return (
    <section className="relative bg-gradient-to-b from-steel to-graphite text-paper overflow-hidden h-[clamp(140px,19vw,290px)]" aria-label={site.name}>
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[0.22em] font-bold uppercase whitespace-nowrap leading-none select-none text-[clamp(5.2rem,18.5vw,18.5rem)] tracking-[-0.045em] text-paper/95"
        aria-hidden="true"
      >
        {site.firstName}
      </div>
      <a
        href={mailto()}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-stretch rounded-full overflow-hidden bg-ink text-paper btn-text shadow-lift hover:bg-night transition-colors"
      >
        <span className="px-5 py-3">{t('hero.cta')}</span>
        <span className="px-3 flex items-center bg-ocean text-night"><IconMail size={15} /></span>
      </a>
    </section>
  )
}
