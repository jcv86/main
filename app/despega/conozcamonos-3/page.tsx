import { redirect } from 'next/navigation'
import { getLegacyJourneyDestination } from '@/lib/journey/legacy-compatibility'

export default async function LegacyConozcamonosThreeDashPage() {
  redirect(await getLegacyJourneyDestination())
}
