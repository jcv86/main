import { LoadingState } from '@/components/layout/async-state'
import { PageContainer, PageStack } from '@/components/layout/page-foundation'

export default function DespegaLoading() {
  return (
    <PageContainer>
      <PageStack>
        <LoadingState label="Preparando tu recorrido…" />
      </PageStack>
    </PageContainer>
  )
}
