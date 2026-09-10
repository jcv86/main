import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function GlobalNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Error 404
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          No encontramos esta página
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          La dirección puede haber cambiado o ya no estar disponible. Puedes volver al inicio o comenzar tu diagnóstico para retomar el recorrido.
        </p>
        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/comenzar">Comenzar mi diagnóstico</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
