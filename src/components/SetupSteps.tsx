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
    <section className="px-4 pt-5">
      <h2 className="text-xl font-bold text-ink">Let’s get started</h2>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={`flex items-center gap-4 rounded-3xl border-2 p-4 ${
              step.done ? 'border-leaf-200 bg-leaf-50' : 'border-gray-300 bg-white'
            }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                step.done ? 'bg-leaf-700 text-white' : 'bg-gray-200 text-ink'
              }`}
            >
              {step.done ? '✓' : i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-lg font-semibold ${step.done ? 'text-gray-600 line-through' : 'text-ink'}`}>
                {step.title}
              </span>
              {!step.done && (
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
