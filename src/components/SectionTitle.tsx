import { ReactNode } from 'react'

type Props = { children: ReactNode; count?: number; id?: string; className?: string; as?: 'h2' | 'h3' }

/** "• RESULTS 31" style heading used across sections. */
export default function SectionTitle({ children, count, id, className = '', as = 'h2' }: Props) {
  const Tag = as
  return (
    <Tag id={id} className={`flex items-center gap-2.5 text-fl-lg font-bold uppercase tracking-tight leading-none ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-steel shrink-0" aria-hidden="true" />
      <span>{children}</span>
      {typeof count === 'number' && <span className="text-fog font-medium tabular-nums">{count}</span>}
    </Tag>
  )
}
