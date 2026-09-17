import { useState, FormEvent } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { site, mailto } from '../lib/site'
import { IconArrowRight } from './Icons'

export default function BookCall() {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `${t('call.subject')}${name ? ` — ${name}` : ''}`
    const body = `${t('call.body')}\n\n${t('call.name')}: ${name}\n${t('call.contact')}: ${contact}\n`
    window.location.href = mailto(subject, body)
  }

  const field = 'w-full bg-transparent border-b border-line focus:border-steel py-2.5 text-fl-lg text-ink placeholder:text-fog/60 outline-none transition-colors'

  return (
    <section id="call" className="border-t border-line bg-white scroll-mt-20">
      <div className="max-w-site mx-auto px-gutter py-section">
        <h2 className="h-display text-[clamp(1.75rem,4vw,3.2rem)] max-w-3xl reveal">{t('call.title')}</h2>

        <form onSubmit={submit} className="mt-10 grid md:grid-cols-[1fr_1fr_auto] gap-6 md:gap-8 items-end reveal reveal-delay-1">
          <label className="block">
            <span className="label-caps block mb-1">{t('call.name')}</span>
            <input required value={name} onChange={e => setName(e.target.value)} className={field} autoComplete="name" />
          </label>
          <label className="block">
            <span className="label-caps block mb-1">{t('call.contact')}</span>
            <input required value={contact} onChange={e => setContact(e.target.value)} className={field} autoComplete="email" placeholder="name@company.com" />
          </label>
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-3 bg-steel text-paper px-8 py-4 text-[11px] font-semibold uppercase tracking-[.16em] rounded-sm hover:bg-ink transition-colors duration-300"
          >
            {t('call.button')} <IconArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <p className="mt-5 text-fl-xs text-fog reveal reveal-delay-2">
          {t('call.note')} <a href={`mailto:${site.email}`} className="text-steel font-medium link-underline">{site.email}</a>
        </p>
      </div>
    </section>
  )
}
