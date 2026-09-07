'use client'
import { Button } from '@/components/ui/button'

export default function IdentityError({ reset }: { reset: () => void }) {
  return <section role="alert" className="space-y-4 rounded-2xl border border-border p-6"><h2 className="text-xl font-semibold">No pudimos cargar tu identidad profesional</h2><p className="text-sm leading-relaxed text-muted-foreground">No sustituimos la información que falta por datos de demostración. Tus respuestas permanecen guardadas.</p><Button onClick={reset}>Reintentar</Button></section>
}
