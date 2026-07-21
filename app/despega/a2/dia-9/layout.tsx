import { requireA2Day } from '@/lib/journey/service'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireA2Day(9)
  return children
}
