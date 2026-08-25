import Link from 'next/link'
import { ArrowRight, KeyRound, Rocket, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ComenzarPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10">
            <Rocket className="h-7 w-7 text-purple" />
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-purple md:text-6xl">
            Tu transformación profesional continúa aquí
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Si ya comenzaste tu recorrido, ingresa con la misma cuenta para recuperar tu progreso. El acceso para nuevos participantes se habilita mediante invitación.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          <Card className="border-purple/30">
            <CardHeader><UserRound className="mb-2 h-7 w-7 text-purple" /><CardTitle>Ya tengo cuenta</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">Continúa con Google o LinkedIn sin perder tus respuestas ni tu avance.</p>
              <Button asChild className="w-full bg-purple text-white"><Link href="/auth/signin?next=%2Fdespega">Ingresar <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </CardContent>
          </Card>

          <Card id="invitacion" className="border-cyan/30">
            <CardHeader><KeyRound className="mb-2 h-7 w-7 text-cyan" /><CardTitle>Tengo una invitación</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">Abre el enlace personal que recibiste. La invitación se valida automáticamente antes de ingresar.</p>
              <Button asChild variant="outline" className="w-full"><Link href="/auth/signin">Ir al ingreso</Link></Button>
            </CardContent>
          </Card>

          <Card className="border-teal/30">
            <CardHeader><Rocket className="mb-2 h-7 w-7 text-teal" /><CardTitle>Solicitar acceso</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">Cuéntanos sobre tu objetivo profesional y te contactaremos cuando haya un cupo.</p>
              <Button asChild variant="outline" className="w-full"><Link href="/contact">Contactar al equipo</Link></Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
