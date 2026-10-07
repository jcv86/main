import type { Metadata, Viewport } from 'next'
import { OutcomesChileExperience } from '@/components/outcomes-chile/outcomes-chile-experience'

export const metadata: Metadata = {
  title: 'Mis resultados laborales',
  description: 'Registra tus avances de búsqueda, empleo y renta, y revisa tus seguimientos laborales.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5, userScalable: true,
}

export const dynamic = 'force-dynamic'

// The /despega layout resolves the authenticated journey before rendering this page.
export default function ResultadosLaboralesPage() {
  return <OutcomesChileExperience />
}
