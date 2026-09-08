'use client'
import { Button } from '@/components/ui/button'
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="space-y-4 p-6" role="alert"><h1 className="text-2xl font-semibold">No pudimos verificar tu recorrido</h1><p className="text-sm text-muted-foreground">Tu información no se reemplazó por cero ni se reinició el progreso. Intenta cargar nuevamente.</p><Button variant="outline" onClick={reset}>Volver a verificar</Button></section>
}
