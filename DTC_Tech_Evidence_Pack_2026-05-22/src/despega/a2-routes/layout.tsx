import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.a2Routes.title,
  description: phaseMetadata.a2Routes.description,
  openGraph: {
    title: phaseMetadata.a2Routes.title,
    description: phaseMetadata.a2Routes.description,
  },
}

export default function A2RoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
