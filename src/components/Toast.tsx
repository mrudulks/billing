interface ToastProps {
  message: string
}

/** Short confirmation above the save bar. The parent decides when to clear it. */
export default function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[calc(10rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md rounded-2xl bg-ink px-5 py-4 text-center text-lg font-bold text-white shadow-lg"
    >
      {message}
    </div>
  )
}
