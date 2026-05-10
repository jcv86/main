import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.c2.title,
  description: phaseMetadata.c2.description,
  openGraph: {
    title: phaseMetadata.c2.title,
    description: phaseMetadata.c2.description,
  },
}

export default function Conozcamonos2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
