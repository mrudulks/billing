import { useId, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'prefix'> {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  prefix?: string
  multiline?: boolean
}

export default function TextField({ label, value, onChange, error, hint, prefix, multiline, ...inputProps }: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint
  const boxClass = `flex min-h-14 items-center rounded-2xl border-2 bg-white px-4 focus-within:border-leaf-700 focus-within:ring-2 focus-within:ring-leaf-200 ${
    error ? 'border-danger' : 'border-gray-400'
  }`
  const inputClass = 'w-full min-w-0 bg-transparent py-3 text-lg text-ink outline-none placeholder:text-gray-500'

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-ink">
        {label}
      </label>
      <div className={boxClass}>
        {prefix && <span className="mr-2 text-lg font-semibold text-gray-600">{prefix}</span>}
        {multiline ? (
          <textarea
            id={id}
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={message ? messageId : undefined}
            className={`${inputClass} resize-none`}
          />
        ) : (
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={message ? messageId : undefined}
            className={inputClass}
            {...inputProps}
          />
        )}
      </div>
      {message && (
        <p id={messageId} className={`mt-1.5 text-base ${error ? 'font-semibold text-danger' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
