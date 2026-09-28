import { formatRupees } from '../lib/money'

interface BalanceTextProps {
  paise: number
  className?: string
}

/** Amount owed in chai amber, advance paid in green, nothing due in grey. */
export default function BalanceText({ paise, className = '' }: BalanceTextProps) {
  if (paise > 0) return <span className={`font-bold tabular-nums text-chai-700 ${className}`}>{formatRupees(paise)} due</span>
  if (paise < 0) return <span className={`font-bold tabular-nums text-leaf-700 ${className}`}>{formatRupees(-paise)} advance</span>
  return <span className={`text-gray-500 ${className}`}>No dues</span>
}
