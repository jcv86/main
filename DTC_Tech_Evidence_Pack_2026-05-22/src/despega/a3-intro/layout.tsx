import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.a3Intro.title,
  description: phaseMetadata.a3Intro.description,
  openGraph: {
    title: phaseMetadata.a3Intro.title,
    description: phaseMetadata.a3Intro.description,
  },
}

export default function A3IntroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
