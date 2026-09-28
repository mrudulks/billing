import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backTo?: string
  action?: ReactNode
}

export default function PageHeader({ title, subtitle, backTo, action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
      <div className="flex min-h-12 items-center gap-2">
        {backTo && (
          <Link
            to={backTo}
            aria-label="Go back"
            className="-ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ink active:bg-leaf-100"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[1.75rem] font-bold leading-tight text-leaf-800">{title}</h1>
          {subtitle && <p className="truncate text-base text-gray-600">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}
