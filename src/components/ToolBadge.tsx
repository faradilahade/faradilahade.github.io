/**
 * Small square monogram badges for tools — the equivalent of Behance's
 * Ps / Ai / Ae icons. Colours are picked deterministically from the palette
 * so the same tool always looks the same.
 */
const KNOWN: Record<string, string> = {
  python: 'Py', sql: 'SQL', r: 'R', excel: 'Xl', 'power bi': 'PBI', powerbi: 'PBI', tableau: 'Tb',
  airflow: 'Af', dbt: 'dbt', bigquery: 'BQ', 'google cloud': 'GCP', gcp: 'GCP', looker: 'Lk',
  'looker studio': 'LS', figma: 'Fg', prophet: 'Pr', pandas: 'Pd', numpy: 'Np', 'scikit-learn': 'Sk',
  sklearn: 'Sk', tensorflow: 'TF', pytorch: 'PT', spark: 'Sp', pyspark: 'PS', postgres: 'Pg',
  postgresql: 'Pg', mysql: 'My', docker: 'Dk', git: 'Git', github: 'GH', jupyter: 'Jp', vba: 'VBA',
  sas: 'SAS', stata: 'St', matlab: 'Ml', 'apache superset': 'Ss', metabase: 'Mb', streamlit: 'St',
  fastapi: 'FA', flask: 'Fl', notion: 'No', illustrator: 'Ai', photoshop: 'Ps', 'after effects': 'Ae',
  premiere: 'Pr', canva: 'Cv', latex: 'TeX', 'google sheets': 'GS', 'r shiny': 'Sh', shiny: 'Sh',
  'ifrs 17': 'I17', prophet17: 'P17', 'moses': 'Mo', 'axis': 'Ax', 'emblem': 'Em', 'radar': 'Rd',
}

const COLORS = [
  'bg-ocean text-night', 'bg-brass text-night', 'bg-clay text-night', 'bg-steel text-paper',
  'bg-tide text-night', 'bg-sand text-night', 'bg-graphite text-tide border border-tide/30',
]

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function toolAbbr(name: string): string {
  const k = name.trim().toLowerCase()
  if (KNOWN[k]) return KNOWN[k]
  const words = name.trim().split(/[\s\-_/]+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  const w = words[0] ?? '?'
  return w.length <= 3 ? w : w.slice(0, 2)[0].toUpperCase() + w.slice(1, 2).toLowerCase()
}

export function toolColor(name: string): string {
  return COLORS[hash(name.trim().toLowerCase()) % COLORS.length]
}

type Props = {
  name: string
  count?: number
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

export default function ToolBadge({ name, count, size = 'md', showName = false, className = '' }: Props) {
  const dim = size === 'sm' ? 'w-7 h-7 text-[10px]' : size === 'lg' ? 'w-11 h-11 text-sm' : 'w-9 h-9 text-xs'
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} title={name}>
      <span className={`${dim} ${toolColor(name)} rounded-md font-semibold tracking-tight flex items-center justify-center shrink-0 select-none`}>
        {toolAbbr(name)}
      </span>
      {showName && <span className="text-fl-sm">{name}</span>}
      {typeof count === 'number' && (
        <span className="text-fl-xs text-fog -ml-1">{count}</span>
      )}
    </span>
  )
}
