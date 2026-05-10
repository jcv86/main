import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'

export const metadata: Metadata = {
  title: phaseMetadata.a3Dashboard.title,
  description: phaseMetadata.a3Dashboard.description,
  openGraph: {
    title: phaseMetadata.a3Dashboard.title,
    description: phaseMetadata.a3Dashboard.description,
  },
}

export default function A3DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
