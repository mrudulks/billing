import { useEffect, useRef, type ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="mx-auto mb-0 mt-auto max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-0 text-ink backdrop:bg-black/60"
    >
      <div className="sticky top-0 flex items-center justify-between bg-white px-5 pb-2 pt-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full text-gray-700 active:bg-gray-100"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">{open && children}</div>
    </dialog>
  )
}
