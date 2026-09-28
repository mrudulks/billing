interface PageHeaderProps {
  title: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-green-900 px-4 py-4 pt-[calc(1rem+env(safe-area-inset-top))] text-white">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  )
}
