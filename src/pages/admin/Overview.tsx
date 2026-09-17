import { Project } from '../../lib/supabase'
import { Article } from '../../lib/articles'
import { site } from '../../lib/site'
import { IconPlus, IconLayers, IconEdit, IconLanguage, IconArrowRight, IconFile } from '../../components/Icons'
import { formatDate, translatedLangs } from './shared'

type Props = {
  projects: Project[]
  articles: Article[]
  articlesMissing?: boolean
  onNew: () => void
  onOpenProjects: () => void
  onEdit: (p: Project) => void
  onNewArticle: () => void
  onOpenArticles: () => void
  onEditArticle: (a: Article) => void
}

export default function Overview({ projects, articles, articlesMissing, onNew, onOpenProjects, onEdit, onNewArticle, onOpenArticles, onEditArticle }: Props) {
  const published = projects.filter(p => p.published).length
  const drafts = projects.length - published
  const featured = projects.filter(p => p.featured).length
  const articlesLive = articles.filter(a => a.published).length
  const untranslated = projects.filter(p => p.published && translatedLangs(p).length < 3)
  const recent = [...projects].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)).slice(0, 5)
  const recentArticles = [...articles].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)).slice(0, 4)

  const tile = 'bg-white border border-line rounded-2xl p-5'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Published projects', published, 'live in the Work tab'],
          ['Project drafts', drafts, 'not visible yet'],
          ['Featured', featured, 'shown first'],
          ['Articles', articlesLive, articlesMissing ? 'table not created yet' : `${articles.length - articlesLive} draft${articles.length - articlesLive === 1 ? '' : 's'}`],
        ].map(([k, v, sub]) => (
          <div key={String(k)} className={tile}>
            <p className="label-caps">{k}</p>
            <p className="mt-2 text-fl-3xl font-bold tracking-tight leading-none">{v}</p>
            <p className="mt-1.5 text-[11px] text-fog">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <div className="space-y-6">
          <div className={tile}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-bold uppercase tracking-tight text-fl-sm">Recently updated projects</h3>
              <button type="button" onClick={onOpenProjects} className="text-[11px] font-semibold uppercase tracking-[.12em] text-steel link-underline">All projects</button>
            </div>
            {recent.length === 0 ? (
              <p className="mt-4 text-fl-sm text-slate">Nothing here yet. Start with your strongest case study.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {recent.map(p => (
                  <li key={p.id} className="flex items-center gap-3 py-2.5">
                    <div className="w-12 aspect-[4/3] rounded bg-frost overflow-hidden ring-1 ring-line shrink-0">{p.cover_url && <img src={p.cover_url} alt="" className="w-full h-full object-cover" />}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-fl-sm font-semibold truncate">{p.title}</p>
                      <p className="text-[11px] text-fog">{p.published ? 'Published' : 'Draft'} · {formatDate(p.updated_at)} · {p.source_lang.toUpperCase()}{translatedLangs(p).length ? ` + ${translatedLangs(p).map(l => l.toUpperCase()).join(' ')}` : ''}</p>
                    </div>
                    <button type="button" onClick={() => onEdit(p)} className="w-8 h-8 rounded-md border border-line flex items-center justify-center text-slate hover:text-ink hover:border-steel" aria-label="Edit"><IconEdit size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={tile}>
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-bold uppercase tracking-tight text-fl-sm inline-flex items-center gap-2"><IconFile size={14} /> Articles</h3>
              <span className="flex items-center gap-3">
                <button type="button" onClick={onOpenArticles} className="text-[11px] font-semibold uppercase tracking-[.12em] text-steel link-underline">All articles</button>
                <button type="button" onClick={onNewArticle} className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.12em] px-2.5 py-1.5 rounded-md bg-ink text-paper hover:bg-steel"><IconPlus size={12} /> New</button>
              </span>
            </div>
            {articlesMissing ? (
              <p className="mt-4 text-fl-sm text-slate leading-relaxed">Run <span className="font-mono text-[12px]">supabase/schema.sql</span> once in the Supabase SQL Editor to create the articles table, then reload.</p>
            ) : recentArticles.length === 0 ? (
              <p className="mt-4 text-fl-sm text-slate">No articles yet. Short, useful notes on data, actuarial method and finance work well here.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {recentArticles.map(a => (
                  <li key={a.id} className="flex items-center gap-3 py-2.5">
                    <div className="w-12 aspect-[4/3] rounded bg-frost overflow-hidden ring-1 ring-line shrink-0">{a.cover_url && <img src={a.cover_url} alt="" className="w-full h-full object-cover" />}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-fl-sm font-semibold truncate">{a.title}</p>
                      <p className="text-[11px] text-fog">{a.published ? 'Published' : 'Draft'} · {formatDate(a.published_at)}{a.tags.length ? ` · ${a.tags.slice(0, 3).join(', ')}` : ''}</p>
                    </div>
                    <button type="button" onClick={() => onEditArticle(a)} className="w-8 h-8 rounded-md border border-line flex items-center justify-center text-slate hover:text-ink hover:border-steel" aria-label="Edit"><IconEdit size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-ink rounded-2xl p-5 bg-ink text-paper">
            <p className="label-caps text-paper/60">Quick start</p>
            <h3 className="mt-2 font-bold uppercase tracking-tight text-fl-lg">Publish a case study in 10 minutes</h3>
            <ol className="mt-3 space-y-2 text-fl-sm text-paper/85 list-decimal pl-4">
              <li>Title with the outcome, e.g. <em>“Forecasting for 240 dam sites at 92% accuracy”</em>.</li>
              <li>Summary in two sentences — what, for whom, result.</li>
              <li>Story: Context → What I built → Result. Add a cover and a few images.</li>
              <li>Tools and keywords — they become filters, badges and SEO signals.</li>
              <li>Auto-translate, skim the four languages, publish.</li>
            </ol>
            <button type="button" onClick={onNew} className="mt-4 inline-flex items-center gap-2 bg-paper text-ink px-4 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-[.12em] hover:bg-tide"><IconPlus size={14} /> New project</button>
          </div>

          {untranslated.length > 0 && (
            <div className={tile}>
              <p className="label-caps inline-flex items-center gap-1.5"><IconLanguage size={13} /> Translations to review</p>
              <ul className="mt-2 space-y-1.5 text-fl-sm">
                {untranslated.slice(0, 4).map(p => (
                  <li key={p.id}><button type="button" onClick={() => onEdit(p)} className="inline-flex items-center gap-1.5 text-ink hover:text-steel text-left"><span className="truncate max-w-[26ch]">{p.title}</span> <IconArrowRight size={12} className="text-fog" /></button></li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-fog">Published projects missing one or more of ID · JA · ZH. Visitors still see a machine translation meanwhile.</p>
            </div>
          )}

          <div className={tile}>
            <p className="label-caps inline-flex items-center gap-1.5"><IconLayers size={13} /> Site</p>
            <p className="mt-2 text-fl-sm text-slate leading-relaxed">Public site: <a href={site.url} className="text-steel link-underline">{site.url.replace('https://', '')}</a>. Profile text, links and colours live in <span className="font-mono text-[12px]">src/lib/site.ts</span> and <span className="font-mono text-[12px]">src/lib/translations.ts</span>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
