import { notFound } from 'next/navigation'
import { requireA2Day } from '@/lib/journey/service'
import { parseExtendedA2DaySegment } from '@/lib/journey/a2-day-access'

interface DayLayoutProps {
  children: React.ReactNode
  params: Promise<{ day: string }>
}

export default async function DayLayout({ children, params }: DayLayoutProps) {
  const day = parseExtendedA2DaySegment((await params).day)
  if (day === null) notFound()

  await requireA2Day(day)
  return children
}
