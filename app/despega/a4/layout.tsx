import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'
import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'

export const metadata: Metadata = {
  title: phaseMetadata.a4Dashboard.title,
  description: phaseMetadata.a4Dashboard.description,
  openGraph: {
    title: phaseMetadata.a4Dashboard.title,
    description: phaseMetadata.a4Dashboard.description,
  },
}

export default function A4Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <div className="min-h-screen">
        {children}
      </div>
    </CoachProviderWrapper>
  )
}
