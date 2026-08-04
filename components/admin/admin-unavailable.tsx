import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function AdminUnavailable() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 space-y-6 text-center">
          <ShieldAlert className="w-12 h-12 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Administración aún no configurada
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Este panel permanecerá deshabilitado hasta contar con roles de
              administrador, permisos y auditoría instalados y verificados en la
              base de datos. No se usarán correos públicos ni excepciones heredadas
              para habilitar acceso.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
