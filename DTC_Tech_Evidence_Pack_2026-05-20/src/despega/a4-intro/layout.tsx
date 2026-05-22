import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.a4Intro.title,
  description: phaseMetadata.a4Intro.description,
  openGraph: {
    title: phaseMetadata.a4Intro.title,
    description: phaseMetadata.a4Intro.description,
  },
}

export default function A4IntroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
