import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.a1Intro.title,
  description: phaseMetadata.a1Intro.description,
  openGraph: {
    title: phaseMetadata.a1Intro.title,
    description: phaseMetadata.a1Intro.description,
  },
}

export default function A1CerebralIntroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
