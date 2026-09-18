import { useState, FormEvent } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { site, mailto } from '../lib/site'
import { useSeo, personJsonLd } from '../lib/seo'
import { useReveal } from '../hooks/useReveal'
import SectionTitle from '../components/SectionTitle'
import { IconMail, IconExternal, IconArrowRight } from '../components/Icons'

const TOPICS = ['role', 'consulting', 'speaking', 'other'] as const

export default function Contact() {
  const { t, lang } = useLang()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [topic, setTopic] = useState<typeof TOPICS[number]>('consulting')
  const [message, setMessage] = useState('')

  useSeo({
    title: t('seo.contact.title'),
    description: t('seo.contact.desc'),
    path: 'contact',
    type: 'profile',
    jsonLd: { '@context': 'https://schema.org', '@type': 'ContactPage', name: t('seo.contact.title'), about: personJsonLd(lang) },
  })
  useReveal([])

  const rows = [
    { label: t('contact.email'), value: site.email, href: `mailto:${site.email}` },
    { label: t('contact.phone'), value: site.phoneDisplay, href: site.whatsapp },
    { label: 'LinkedIn', value: site.name, href: site.links.find(l => l.key === 'linkedin')!.href },
    { label: 'Behance', value: `@${site.handle}`, href: site.links.find(l => l.key === 'behance')!.href },
    { label: t('contact.community'), value: 'anakaktuaria.org', href: 'https://anakaktuaria.org' },
  ]

  const compose = (e: FormEvent) => {
    e.preventDefault()
    const subject = `${t(`contact.form.topic.${topic}`)}${company ? ` (${company})` : ''}${name ? ` (${name})` : ''}`
    const body = `Hi ${site.firstName},\n\n${message.trim()}\n\n${name}${company ? `\n${company}` : ''}`
    window.location.href = mailto(subject, body)
  }

  const field = 'w-full bg-white border border-line rounded-sm px-3.5 py-2.5 text-fl-sm placeholder:text-fog/60 focus:border-steel outline-none transition-colors'

  return (
    <section className="page-enter">
      <div className="max-w-site mx-auto px-gutter py-section">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 xl:gap-20">
          <div>
            <p className="rise-1 label-caps text-steel">{site.location} · {site.timezone}</p>
            <h1 className="rise-2 mt-4 h-display text-[clamp(2.4rem,6vw,5.2rem)]">{t('contact.title')}</h1>
            <p className="rise-3 mt-6 text-fl-lg text-slate leading-relaxed max-w-md">{t('contact.sub')}</p>

            <a
              href={mailto(`Hello ${site.firstName}, from your portfolio`, `Hi ${site.firstName},\n\n`)}
              className="rise-4 group mt-8 inline-flex items-center gap-2.5 bg-steel text-paper px-6 py-3.5 btn-text rounded-sm hover:bg-ink transition-colors duration-300"
            >
              <IconMail size={15} /> {site.email}
              <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>

            <div className="mt-12 divide-y divide-line border-y border-line reveal">
              {rows.map(r => (
                <a
                  key={r.label}
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-6 py-4 hover:pl-1.5 transition-all duration-300 ease-smooth"
                >
                  <span className="label-caps">{r.label}</span>
                  <span className="text-fl-lg font-semibold text-ink group-hover:text-steel transition-colors inline-flex items-center gap-2">
                    {r.value}
                    {r.href.startsWith('http') && <IconExternal size={14} className="text-fog opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={compose} className="reveal reveal-delay-1 bg-white border border-line rounded-2xl p-[clamp(1.25rem,3vw,2.5rem)] self-start">
            <SectionTitle>{t('contact.form.title')}</SectionTitle>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="label-caps block mb-1.5">{t('contact.form.name')}</span>
                <input required value={name} onChange={e => setName(e.target.value)} className={field} autoComplete="name" />
              </label>
              <label className="block">
                <span className="label-caps block mb-1.5">{t('contact.form.company')}</span>
                <input value={company} onChange={e => setCompany(e.target.value)} className={field} autoComplete="organization" />
              </label>
            </div>

            <fieldset className="mt-4">
              <legend className="label-caps mb-1.5">{t('contact.form.topic')}</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(k => (
                  <label key={k} className={`cursor-pointer rounded-sm px-3.5 py-1.5 btn-text border transition-all duration-300 ${topic === k ? 'bg-steel text-paper border-steel' : 'border-line text-slate hover:border-steel hover:text-steel'}`}>
                    <input type="radio" name="topic" value={k} checked={topic === k} onChange={() => setTopic(k)} className="sr-only" />
                    {t(`contact.form.topic.${k}`)}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block mt-4">
              <span className="label-caps block mb-1.5">{t('contact.form.message')}</span>
              <textarea required rows={6} value={message} onChange={e => setMessage(e.target.value)} className={`${field} resize-y leading-relaxed`} />
            </label>

            <button type="submit" className="group mt-5 w-full inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3.5 btn-text rounded-sm hover:bg-steel transition-colors duration-300">
              <IconMail size={15} /> {t('contact.form.send')}
              <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <p className="mt-3 text-fl-xs text-fog leading-relaxed">
              {t('contact.form.hint')} <a href={`mailto:${site.email}`} className="link-underline text-steel">{site.email}</a>.
            </p>
          </form>
        </div>

        <div className="mt-section border-t border-line pt-8 reveal">
          <p className="label-caps mb-4">{t('contact.channels')}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-fl-sm">
            {site.links.map(l => (
              <a key={l.key} className="link-underline text-ink hover:text-steel inline-flex items-center gap-1.5" href={l.href} target="_blank" rel="noreferrer">
                {l.label} <IconExternal size={13} className="text-fog" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
