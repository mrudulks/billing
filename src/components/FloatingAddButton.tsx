import { Link } from 'react-router-dom'

interface FloatingAddButtonProps {
  to: string
  label: string
}

/** Main action, bottom-right where the thumb rests, just above the tabs. */
export default function FloatingAddButton({ to, label }: FloatingAddButtonProps) {
  return (
    <Link
      to={to}
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-[max(1rem,calc((100vw-36rem)/2+1rem))] z-20 flex min-h-16 items-center gap-2 rounded-full bg-leaf-700 pl-5 pr-6 text-lg font-bold text-white shadow-lg shadow-leaf-800/30 active:bg-leaf-800"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {label}
    </Link>
  )
}
