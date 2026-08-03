import { redirect } from 'next/navigation'
import { getLegacyJourneyDestination } from '@/lib/journey/legacy-compatibility'

export default async function LegacyConozcamonosFourDashPage() {
  redirect(await getLegacyJourneyDestination())
}
