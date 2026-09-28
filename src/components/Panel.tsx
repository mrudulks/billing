import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  className?: string
}

/** White rounded block on the tinted page. Groups related rows; no shadow so screens stay calm. */
export default function Panel({ children, className = '' }: PanelProps) {
  return <div className={`mx-4 overflow-hidden rounded-3xl bg-white ring-1 ring-ink/5 ${className}`}>{children}</div>
}
