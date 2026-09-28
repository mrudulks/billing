import { Link } from 'react-router-dom'

interface SetupStepsProps {
  hasItems: boolean
  hasCustomers: boolean
}

/** First-run guide. Numbered because the steps really are done in order. */
export default function SetupSteps({ hasItems, hasCustomers }: SetupStepsProps) {
  const steps = [
    { done: hasItems, title: 'Add your items and prices', to: '/settings', action: 'Open settings' },
    { done: hasCustomers, title: 'Add your customers', to: '/customers/new', action: 'Add customer' },
  ]

  return (
    <section className="px-4 pt-6">
      <h2 className="px-1 text-xl font-bold text-ink">Let’s get started</h2>
      <p className="px-1 pt-1 text-lg text-gray-700">Two quick steps before your first entry.</p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step.title} className={`flex items-center gap-4 rounded-3xl p-4 ring-1 ring-ink/5 ${step.done ? 'bg-leaf-100' : 'bg-white'}`}>
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                step.done ? 'bg-leaf-700 text-white' : 'bg-paper text-ink'
              }`}
            >
              {step.done ? '✓' : i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-lg font-semibold ${step.done ? 'text-leaf-800' : 'text-ink'}`}>{step.title}</span>
              {step.done ? (
                <span className="block text-base text-leaf-700">Done</span>
              ) : (
                <Link to={step.to} className="mt-1 inline-flex min-h-11 items-center text-lg font-bold text-leaf-700 underline underline-offset-4">
                  {step.action}
                </Link>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
