import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.c1.title,
  description: phaseMetadata.c1.description,
  openGraph: {
    title: phaseMetadata.c1.title,
    description: phaseMetadata.c1.description,
  },
}

export default function Conozcamonos1Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
