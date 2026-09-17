import { useLang } from '../contexts/LanguageContext'

export default function Contact() {
  const { t } = useLang()

  const rows = [
    { label: t('contact.email'), value: 'faradilahade@gmail.com', href: 'mailto:faradilahade@gmail.com' },
    { label: t('contact.phone'), value: '+62 8511 7575 990', href: 'https://wa.me/6285117575990' },
    { label: 'LinkedIn', value: 'Faradilah Ade', href: 'https://www.linkedin.com/in/faradilahade' },
    { label: t('contact.community'), value: 'anakaktuaria.org', href: 'https://anakaktuaria.org' },
  ]

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-14">
        <div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">{t('contact.title')}</h1>
          <p className="mt-5 text-slate text-lg leading-relaxed max-w-md">{t('contact.sub')}</p>
          <p className="mt-8 text-sm text-slate">
            {t('contact.location')}: {t('contact.location.value')}
          </p>
        </div>

        <div className="divide-y divide-mist border-t border-b border-mist">
          {rows.map(r => (
            <a
              key={r.label}
              href={r.href}
              target={r.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="group flex items-center justify-between py-6 hover:pl-2 transition-all"
            >
              <span className="text-sm text-slate">{r.label}</span>
              <span className="font-display text-xl group-hover:text-brass transition-colors">
                {r.value}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-20 border-t border-mist pt-10">
        <p className="text-sm text-slate mb-4">Media & channels</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a className="link-underline text-steel" href="https://anakaktuaria.org" target="_blank" rel="noreferrer">Website — anakaktuaria.org</a>
          <a className="link-underline text-steel" href="https://www.instagram.com/anakaktuaria.id" target="_blank" rel="noreferrer">Instagram — @anakaktuaria.id</a>
          <a className="link-underline text-steel" href="https://www.tiktok.com/@anakaktuaria.id" target="_blank" rel="noreferrer">TikTok — @anakaktuaria.id</a>
          <a className="link-underline text-steel" href="https://www.youtube.com/@KomunitasAnakAktuariaIndonesia" target="_blank" rel="noreferrer">YouTube — Komunitas Anak Aktuaria Indonesia</a>
        </div>
      </div>
    </section>
  )
}
