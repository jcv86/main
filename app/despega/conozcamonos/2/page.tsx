import { redirect } from 'next/navigation'
import { getLegacyJourneyDestination } from '@/lib/journey/legacy-compatibility'

export default async function LegacyConozcamonosTwoPage() {
  redirect(await getLegacyJourneyDestination())
}
