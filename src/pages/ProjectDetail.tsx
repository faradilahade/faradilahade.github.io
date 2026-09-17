import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, Project } from '../lib/supabase'
import { useLang } from '../contexts/LanguageContext'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const [p, setP] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => {
        setP(data as Project)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-20 text-slate">…</div>
  if (!p) return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-slate">Project not found.</p>
      <Link to="/work" className="link-underline text-steel text-sm">← {t('detail.back')}</Link>
    </div>
  )

  const date = new Date(p.created_at).toLocaleDateString(
    lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : lang === 'id' ? 'id-ID' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <article className="max-w-3xl mx-auto px-6 py-14">
      <Link to="/work" className="link-underline text-sm text-steel">← {t('detail.back')}</Link>

      <header className="mt-8">
        <p className="text-sm text-slate">
          <span className="capitalize">{p.category}</span> · {t('detail.date')} {date}
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">{p.title}</h1>
        {p.summary && <p className="mt-5 text-lg text-slate leading-relaxed">{p.summary}</p>}
      </header>

      {p.cover_url && (
        <img src={p.cover_url} alt={p.title} className="mt-10 w-full rounded-sm" />
      )}

      {p.content && (
        <div className="mt-10 space-y-5 text-[17px] leading-[1.8] text-ink/90">
          {p.content.split('\n').filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {p.tags?.length > 0 && (
        <p className="mt-10 text-sm text-slate/80">{p.tags.join('  ·  ')}</p>
      )}

      {p.attachments?.length > 0 && (
        <div className="mt-12 border-t border-mist pt-8">
          <h2 className="font-display text-2xl mb-4">{t('detail.attachments')}</h2>
          <ul className="space-y-2">
            {p.attachments.map((a, i) => (
              <li key={i}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-steel"
                >
                  {a.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
