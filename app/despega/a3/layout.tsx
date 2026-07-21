import { requireJourneyModule } from '@/lib/journey/service'

export default async function A3Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireJourneyModule('A3')

  return <div className="min-h-screen">{children}</div>
}
