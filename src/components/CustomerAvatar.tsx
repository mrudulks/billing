// Distinct, high-contrast pairs so customers are easy to tell apart at a glance.
const colors = [
  'bg-leaf-100 text-leaf-800',
  'bg-chai-50 text-chai-700',
  'bg-sky-100 text-sky-900',
  'bg-violet-100 text-violet-900',
  'bg-rose-100 text-rose-900',
  'bg-amber-100 text-amber-900',
]

function colorFor(name: string): string {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return colors[hash % colors.length]
}

interface CustomerAvatarProps {
  name: string
  size?: 'md' | 'lg'
}

export default function CustomerAvatar({ name, size = 'md' }: CustomerAvatarProps) {
  const sizeClass = size === 'lg' ? 'h-16 w-16 text-3xl' : 'h-12 w-12 text-xl'
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full font-bold ${sizeClass} ${colorFor(name)}`}>
      {name.trim().charAt(0).toUpperCase()}
    </span>
  )
}
