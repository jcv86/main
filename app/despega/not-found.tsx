import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

import { EmptyState } from '@/components/layout/async-state'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'
import { Button } from '@/components/ui/button'

export default function DespegaNotFound() {
  return (
    <PageContainer>
      <PageStack>
        <EmptyState
          title="Esta parte del recorrido no está disponible"
          description="La dirección puede haber cambiado o la etapa todavía no forma parte de tu recorrido habilitado."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/despega/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Volver al dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link href="/despega">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Ir al inicio
                </Link>
              </Button>
            </div>
          }
        />
      </PageStack>
    </PageContainer>
  )
}
