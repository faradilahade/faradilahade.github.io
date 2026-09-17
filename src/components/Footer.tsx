import { useLang } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-mist bg-ink text-paper/70">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
        <p className="font-display text-paper text-lg">Faradilah Ade<span className="text-brass">.</span></p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a className="link-underline" href="mailto:faradilahade@gmail.com">faradilahade@gmail.com</a>
          <a className="link-underline" href="https://anakaktuaria.org" target="_blank" rel="noreferrer">anakaktuaria.org</a>
          <a className="link-underline" href="https://www.tiktok.com/@anakaktuaria.id" target="_blank" rel="noreferrer">TikTok</a>
          <a className="link-underline" href="https://www.youtube.com/@KomunitasAnakAktuariaIndonesia" target="_blank" rel="noreferrer">YouTube</a>
        </div>
        <p>© {year} · {t('footer.rights')}</p>
      </div>
    </footer>
  )
}
