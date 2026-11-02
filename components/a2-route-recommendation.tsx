import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RouteRecommendationProps {
  onSelectRoute?: (route: 'persona' | 'profesional' | 'hibrido') => void
  loading?: boolean
}

/** Compatibility UI for old imports. No route is selected from DISC alone. */
export function RouteRecommendation(_props: RouteRecommendationProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Continúa en Tu Ruta</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Revisa tu objetivo y el contexto de A1 para comenzar o retomar tu ciclo.</p>
        <Link href="/despega/a2-routes" className="inline-flex rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          Ir a Tu Ruta
        </Link>
      </CardContent>
    </Card>
  )
}
