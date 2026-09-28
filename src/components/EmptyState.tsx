import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  children?: ReactNode
}

export default function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="mx-4 mt-6 rounded-3xl border-2 border-dashed border-leaf-200 bg-leaf-50 px-5 py-8 text-center">
      <p className="text-xl font-bold text-ink">{title}</p>
      {children && <div className="mt-2 text-lg text-gray-700">{children}</div>}
    </div>
  )
}
