import { requireJourneyModule } from '@/lib/journey/service'

export default async function A2DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireJourneyModule('A2')
  return children
}
