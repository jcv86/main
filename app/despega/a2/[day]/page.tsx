import { notFound } from 'next/navigation'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { parseExtendedA2DaySegment } from '@/lib/journey/a2-day-access'

interface DayPageProps {
  params: Promise<{ day: string }>
}

export default async function DayPage({ params }: DayPageProps) {
  const day = parseExtendedA2DaySegment((await params).day)
  if (day === null) notFound()

  return <A2DayPageTemplate dayNumber={day} />
}
