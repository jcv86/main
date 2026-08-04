import type React from "react"
import type { Metadata } from "next"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: "Design System",
  description: "Catálogo interno del sistema visual de DespegaTuCarrera.",
  robots: { index: false, follow: false },
}

const swatches = [
  ["Fondo raíz", "bg-background"],
  ["Superficie", "bg-card"],
  ["Índigo DTC", "bg-primary"],
  ["Progreso", "bg-success"],
  ["Logros", "bg-warning"],
  ["Error", "bg-destructive"],
] as const

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  )
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="max-w-3xl space-y-4">
          <Badge variant="secondary">Uso interno · no indexado</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Sistema visual DTC</h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            Referencia viva de los componentes, estados y tokens definidos por DESIGN.md. Las nuevas interfaces deben construirse desde este catálogo.
          </p>
        </header>

        <ShowcaseSection title="Paleta canónica" description="Colores con propósito; nunca valores aislados en una pantalla.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {swatches.map(([label, className]) => (
              <div key={label} className="overflow-hidden rounded-[var(--dtc-radius-md)] border border-border bg-card">
                <div className={`h-24 ${className}`} />
                <div className="px-4 py-3 text-sm font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Acciones" description="Jerarquía clara, estados accesibles y geometría consistente.">
          <div className="flex flex-wrap gap-3">
            <Button>Acción principal</Button>
            <Button variant="secondary">Acción secundaria</Button>
            <Button variant="outline">Acción discreta</Button>
            <Button variant="ghost">Acción contextual</Button>
            <Button variant="destructive">Acción destructiva</Button>
            <Button disabled>Deshabilitada</Button>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Formularios" description="Controles alineados en altura, foco, borde y feedback.">
          <div className="grid gap-5 md:grid-cols-2">
            <Input aria-label="Nombre" placeholder="Nombre completo" />
            <Select>
              <SelectTrigger aria-label="Objetivo profesional">
                <SelectValue placeholder="Selecciona un objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clarity">Ganar claridad profesional</SelectItem>
                <SelectItem value="interview">Preparar entrevistas</SelectItem>
                <SelectItem value="transition">Cambiar de carrera</SelectItem>
              </SelectContent>
            </Select>
            <Textarea className="md:col-span-2" aria-label="Contexto" placeholder="Describe brevemente tu contexto profesional" />
            <label className="flex items-center gap-3 text-sm font-medium">
              <Checkbox defaultChecked />
              Guardar esta preferencia
            </label>
            <RadioGroup defaultValue="evidence" className="flex flex-wrap gap-5" aria-label="Prioridad">
              <label className="flex items-center gap-2 text-sm font-medium">
                <RadioGroupItem value="evidence" /> Evidencia
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <RadioGroupItem value="practice" /> Práctica
              </label>
            </RadioGroup>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Estado y progreso" description="Feedback sobrio: informa, orienta y permite continuar.">
          <div className="space-y-4">
            <Progress value={68} aria-label="Progreso del recorrido" />
            <div className="flex flex-wrap gap-2">
              <Badge>Activo</Badge>
              <Badge variant="secondary">En revisión</Badge>
              <Badge variant="outline">Evidencia nueva</Badge>
              <Badge variant="destructive">Requiere atención</Badge>
            </div>
            <Alert variant="info">
              <AlertTitle>Nueva evidencia registrada</AlertTitle>
              <AlertDescription>Tu perfil se actualizó a partir de una actividad verificada.</AlertDescription>
            </Alert>
            <Alert variant="success">
              <AlertTitle>Etapa completada</AlertTitle>
              <AlertDescription>El siguiente paso ya está disponible en tu recorrido.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Información incompleta</AlertTitle>
              <AlertDescription>Puedes continuar, pero este dato mejorará la precisión de tu perfil.</AlertDescription>
            </Alert>
          </div>
        </ShowcaseSection>

        <ShowcaseSection title="Carga" description="Estados de espera tranquilos, reconocibles y sin ruido visual.">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </main>
  )
}
