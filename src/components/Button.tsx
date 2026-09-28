import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'dangerSolid' | 'quiet'

const variants: Record<Variant, string> = {
  primary: 'bg-leaf-700 text-white active:bg-leaf-800 disabled:bg-gray-400',
  secondary: 'border-2 border-leaf-700 bg-white text-leaf-800 active:bg-leaf-100',
  danger: 'border-2 border-danger bg-white text-danger active:bg-red-50',
  dangerSolid: 'bg-danger text-white active:bg-red-800',
  quiet: 'text-leaf-800 active:bg-leaf-100',
}

export const buttonClass = (variant: Variant = 'primary') =>
  `inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-5 text-lg font-bold outline-offset-2 focus-visible:outline-3 focus-visible:outline-leaf-600 ${variants[variant]}`

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export default function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`${buttonClass(variant)} ${className}`} {...props} />
}
