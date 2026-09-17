import { useEffect, useState } from 'react'
import { supabase, Project } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'
import ProjectCard from '../components/ProjectCard'

const CATS = ['all', 'data', 'finance', 'risk'] as const

export default function Work() {
  const { t } = useLang()
  const [projects, setProjects] = useState<Project[]>([])
  const [cat, setCat] = useState<typeof CATS[number]>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects((data as Project[]) ?? [])
        setLoading(false)
      })
  }, [])

  const shown = cat === 'all' ? projects : projects.filter(p => p.category === cat)

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl md:text-5xl">{t('work.title')}</h1>
      <p className="mt-3 text-slate max-w-xl">{t('work.sub')}</p>

      <div className="mt-8 flex gap-2 flex-wrap">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors capitalize ${
              cat === c
                ? 'bg-ink text-paper border-ink'
                : 'border-mist text-slate hover:border-steel'
            }`}
          >
            {c === 'all' ? t('work.all') : c}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-slate">…</p>
        ) : shown.length === 0 ? (
          <p className="text-slate">{t('work.empty')}</p>
        ) : (
          shown.map(p => <ProjectCard key={p.id} p={p} />)
        )}
      </div>
    </section>
  )
}
