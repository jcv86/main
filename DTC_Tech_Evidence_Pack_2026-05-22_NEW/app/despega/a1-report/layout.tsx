import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.a1Report.title,
  description: phaseMetadata.a1Report.description,
  openGraph: {
    title: phaseMetadata.a1Report.title,
    description: phaseMetadata.a1Report.description,
  },
}

export default function A1ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
