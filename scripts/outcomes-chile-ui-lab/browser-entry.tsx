import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { OutcomesChileExperience } from '@/components/outcomes-chile/outcomes-chile-experience'

// Only the authenticated application shell is substituted. The experience,
// form state, requests, styling and components are imported from the real app.
createRoot(document.getElementById('root')!).render(
  <div className="lg:pl-72">
    <main id="main-content" className="min-h-[calc(100vh-4rem)] outline-none">
      <div className="mx-auto w-full max-w-[var(--dtc-content-max,88rem)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <OutcomesChileExperience />
      </div>
    </main>
  </div>,
)
