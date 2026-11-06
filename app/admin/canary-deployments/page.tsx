import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireSuperadminPage } from '@/lib/auth/require-superadmin'
import { selectA2Swarm } from '@/lib/a2/swarm/canary'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Activación gradual del asistente | DTC', robots: { index: false, follow: false } }

const REASONS: Record<string, string> = {
  disabled: 'El enjambre está desactivado en la configuración de este despliegue.',
  killed: 'El interruptor de apagado mantiene el asistente habitual.',
  invalid_configuration: 'La configuración está incompleta o es inválida. Se conserva el asistente habitual.',
  allowlist: 'Esta cuenta pertenece al grupo de prueba configurado en el servidor.',
  percentage: 'Esta cuenta está dentro de la cohorte gradual configurada en el servidor.',
  control: 'Esta cuenta permanece en el grupo de control.',
}

export default async function CanaryDeploymentsPage() {
  const user = await requireSuperadminPage('/admin/canary-deployments')
  const selection = selectA2Swarm(user.id, {
    DTC_A2_SWARM_MODE: process.env.DTC_A2_SWARM_MODE,
    DTC_A2_SWARM_KILL_SWITCH: process.env.DTC_A2_SWARM_KILL_SWITCH,
    DTC_A2_SWARM_ROLLOUT_ID: process.env.DTC_A2_SWARM_ROLLOUT_ID,
    DTC_A2_SWARM_REVISION: process.env.DTC_A2_SWARM_REVISION,
    DTC_A2_SWARM_PERCENT: process.env.DTC_A2_SWARM_PERCENT,
    DTC_A2_SWARM_ALLOWLIST: process.env.DTC_A2_SWARM_ALLOWLIST,
  })

  return (
    <section className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8" aria-labelledby="canary-title">
      <header className="space-y-2">
        <h1 id="canary-title" className="text-3xl font-bold">Activación gradual del asistente</h1>
        <p className="text-muted-foreground">Selección calculada con la configuración del servidor para esta cuenta y este despliegue.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{selection.variant === 'swarm' ? 'Variante seleccionada: enjambre' : 'Variante seleccionada: asistente habitual'}</CardTitle>
          <CardDescription>{REASONS[selection.reason]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm text-muted-foreground">Cohorte</dt><dd className="break-words font-medium">{selection.rolloutId || 'Sin cohorte activa'}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Revisión de configuración</dt><dd className="break-words font-medium">{selection.configRevision || 'Sin revisión activa'}</dd></div>
          </dl>
          <p className="text-sm text-muted-foreground">Al consultar Tu Ruta se verifican además la sesión, el acceso al piloto y la etapa habilitada. La selección de variante conserva esos requisitos.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Revisión antes de ampliar</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm leading-6">
          <p>Mediciones de tráfico real: pendientes de incorporar a esta vista.</p>
          <p>El grupo de prueba se amplía con evidencia del commit, despliegue, cohorte y revisión exactos. Se comparan errores, latencia, llamadas al modelo y retorno al asistente habitual.</p>
          <p>El evaluador puede recomendar mantener, retirar o revisar la ampliación. Las pruebas sintéticas sirven para validar el código; las decisiones sobre tráfico real requieren mediciones de ese despliegue.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recuperación y apagado</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm leading-6">
          <p>Si un agente falla o su salida no cumple el contrato, la consulta puede volver una sola vez al asistente habitual dentro del tiempo disponible. La siguiente acción del recorrido se conserva.</p>
          <p>El interruptor de este bloque se configura en variables del servidor: un cambio en Vercel requiere un nuevo despliegue para aplicarse. La reversión de un despliegue completo se gestiona por separado en Vercel.</p>
        </CardContent>
      </Card>
    </section>
  )
}
