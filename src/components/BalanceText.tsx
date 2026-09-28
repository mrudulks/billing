import { formatRupees } from '../lib/money'

interface BalanceTextProps {
  paise: number
  /** 'tag' is a small rounded label for lists; 'text' is plain for headings. */
  look?: 'tag' | 'text'
  className?: string
}

/** Amount owed in chai amber, advance paid in green, nothing due in grey. */
export default function BalanceText({ paise, look = 'text', className = '' }: BalanceTextProps) {
  const tag = look === 'tag' ? 'rounded-full px-3 py-1' : ''
  if (paise > 0) {
    return <span className={`font-bold tabular-nums text-chai-700 ${look === 'tag' ? 'bg-chai-50' : ''} ${tag} ${className}`}>{formatRupees(paise)} due</span>
  }
  if (paise < 0) {
    return <span className={`font-bold tabular-nums text-leaf-700 ${look === 'tag' ? 'bg-leaf-100' : ''} ${tag} ${className}`}>{formatRupees(-paise)} advance</span>
  }
  return <span className={`text-gray-500 ${tag} ${className}`}>No dues</span>
}
