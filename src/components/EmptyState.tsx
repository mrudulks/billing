import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  children?: ReactNode
}

export default function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="mx-4 mt-5 rounded-3xl bg-white px-6 py-8 text-center ring-1 ring-ink/5">
      <span aria-hidden="true" className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7" />
        </svg>
      </span>
      <p className="text-xl font-bold text-ink">{title}</p>
      {children && <div className="mt-2 text-lg text-gray-700">{children}</div>}
    </div>
  )
}
