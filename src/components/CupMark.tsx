/** The app's tea cup, as on the home-screen icon. */
export default function CupMark() {
  return (
    <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 20h24v9a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z" fill="currentColor" fillOpacity={0.15} />
        <path d="M34 23h3a5 5 0 0 1 0 10h-3.5" />
        <path d="M18 8c-2 3 2 5 0 8M25 8c-2 3 2 5 0 8" />
        <path d="M9 43h28" />
      </svg>
    </span>
  )
}
