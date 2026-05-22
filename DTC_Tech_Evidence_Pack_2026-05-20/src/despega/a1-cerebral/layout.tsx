import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.a1Test.title,
  description: phaseMetadata.a1Test.description,
  openGraph: {
    title: phaseMetadata.a1Test.title,
    description: phaseMetadata.a1Test.description,
  },
}

export default function A1CerebralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
