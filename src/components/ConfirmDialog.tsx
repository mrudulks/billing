import { useEffect, useRef, type ReactNode } from 'react'
import Button from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, children, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
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
        onCancel()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-6 text-ink backdrop:bg-black/60"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-3 text-lg text-gray-700">{children}</div>
      <div className="mt-6 flex flex-col gap-3">
        <Button variant="dangerSolid" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} autoFocus>
          Cancel
        </Button>
      </div>
    </dialog>
  )
}
