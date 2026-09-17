import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Project } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import ProjectCard from '../components/ProjectCard'

export default function Home() {
  const { t } = useLang()
  const [featured, setFeatured] = useState<Project[]>([])

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setFeatured((data as Project[]) ?? []))
  }, [])

  return (
    <>
      {/* HERO — asymmetric editorial, single orchestrated reveal */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid md:grid-cols-[7fr_4fr] gap-12 items-end">
          <div>
            <p className="rise-1 text-sm text-steel mb-5">{t('hero.kicker')}</p>
            <h1 className="rise-2 font-display text-5xl md:text-6xl leading-[1.08] tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="rise-3 mt-7 text-lg text-slate leading-relaxed max-w-xl">
              {t('hero.sub')}
            </p>
            <div className="rise-4 mt-10 flex flex-wrap gap-4">
              <Link
                to="/work"
                className="bg-ink text-paper px-6 py-3 rounded-full text-sm hover:bg-steel transition-colors"
              >
                {t('hero.cta')}
              </Link>
              <Link
                to="/contact"
                className="border border-ink px-6 py-3 rounded-full text-sm hover:border-brass hover:text-brass transition-colors"
              >
                {t('hero.cta2')}
              </Link>
            </div>
          </div>

          {/* credentials rail */}
          <aside className="rise-4 hidden md:block border-l border-mist pl-8 space-y-6 text-sm">
            <div>
              <p className="font-display text-3xl">240</p>
              <p className="text-slate">dam sites monitored, national early warning system</p>
            </div>
            <div>
              <p className="font-display text-3xl">92%</p>
              <p className="text-slate">forecast accuracy, deployed to production</p>
            </div>
            <div>
              <p className="font-display text-3xl">15,000</p>
              <p className="text-slate">insurance policies analyzed for reserving</p>
            </div>
            <div>
              <p className="font-display text-3xl">350+</p>
              <p className="text-slate">members in the community I founded</p>
            </div>
          </aside>
        </div>
      </section>

      {/* THREE PILLARS — alternating bands, not identical cards */}
      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl mb-14">{t('pillars.title')}</h2>

          <div className="space-y-0 divide-y divide-paper/15">
            {(['data', 'finance', 'risk'] as const).map((k, i) => (
              <div key={k} className="grid md:grid-cols-[1fr_3fr] gap-4 md:gap-10 py-9">
                <h3 className="font-display text-2xl md:text-3xl text-brass">
                  {t(`pillar.${k}.title`)}
                </h3>
                <p className="text-paper/80 leading-relaxed text-lg max-w-2xl">
                  {t(`pillar.${k}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl">{t('work.title')}</h2>
          <Link to="/work" className="link-underline text-sm text-steel">{t('nav.work')} →</Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-slate">{t('work.empty')}</p>
        ) : (
          <div>{featured.map(p => <ProjectCard key={p.id} p={p} />)}</div>
        )}
      </section>

      {/* PROOF */}
      <section className="border-t border-mist">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl mb-4">{t('proof.title')}</h2>
          <p className="text-slate leading-relaxed max-w-4xl">{t('proof.body')}</p>
        </div>
      </section>
    </>
  )
}
