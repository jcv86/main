import * as React from 'react'
import { AlertCircle, Inbox, Loader2, RefreshCw, WifiOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StateFrameProps = {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

function StateFrame({ icon: Icon, title, description, action, className }: StateFrameProps) {
  return (
    <section
      className={cn(
        'flex min-h-64 flex-col items-center justify-center rounded-[var(--dtc-radius-lg)] border border-border bg-card/72 px-6 py-10 text-center shadow-[var(--dtc-shadow-sm)]',
        className,
      )}
      aria-live="polite"
    >
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--dtc-radius-md)] border border-border bg-muted/55 text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden={true} />
      </span>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  )
}

export function LoadingState({ label = 'Preparando tu información…', className }: { label?: string; className?: string }) {
  return (
    <StateFrame
      icon={({ className: iconClassName }) => <Loader2 className={cn(iconClassName, 'animate-spin')} />}
      title={label}
      description="Esto puede tardar unos segundos. Tu progreso se mantiene guardado."
      className={className}
    />
  )
}

export function EmptyState({
  title = 'Todavía no hay información aquí',
  description = 'Cuando completes el siguiente paso, este espacio mostrará tu avance.',
  action,
  className,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return <StateFrame icon={Inbox} title={title} description={description} action={action} className={className} />
}

export function ErrorState({
  title = 'No pudimos cargar esta información',
  description = 'Revisa tu conexión e inténtalo nuevamente. Tu progreso no se perdió.',
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <StateFrame
      icon={AlertCircle}
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reintentar
          </Button>
        ) : undefined
      }
      className={className}
    />
  )
}

export function OfflineState({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <StateFrame
      icon={WifiOff}
      title="Estás sin conexión"
      description="Vuelve a conectarte para sincronizar tu recorrido y continuar donde quedaste."
      action={
        onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Verificar conexión
          </Button>
        ) : undefined
      }
      className={className}
    />
  )
}
