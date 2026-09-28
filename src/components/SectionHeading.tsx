import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id?: string
  title: string
  /** Optional short text or link on the right, e.g. a total. */
  aside?: ReactNode
}

export default function SectionHeading({ id, title, aside }: SectionHeadingProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-5 pb-2">
      <h2 id={id} className="text-xl font-bold text-ink">
        {title}
      </h2>
      {aside && <div className="shrink-0 text-base text-gray-600">{aside}</div>}
    </div>
  )
}
