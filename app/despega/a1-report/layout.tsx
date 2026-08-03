import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { A1CanonicalReport } from '@/components/a1-canonical-report'
import { phaseMetadata } from '@/lib/phase-metadata'
import { createAdminClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import {
  recordJourneyTransition,
  repairLegacyC2Completion,
} from '@/lib/journey/transitions'

export const metadata: Metadata = {
  title: phaseMetadata.a1Report.title,
  description: phaseMetadata.a1Report.description,
  openGraph: {
    title: phaseMetadata.a1Report.title,
    description: phaseMetadata.a1Report.description,
  },
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

export default async function A1ReportLayout({
  children: _children,
}: {
  children: React.ReactNode
}) {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  await repairLegacyC2Completion(journey.user.id)

  const supabase = createAdminClient()
  const [profileResult, assessmentResult, c2Result] = await Promise.all([
    supabase
      .from('despega_user_profiles')
      .select(
        'conozcamonos_2_completed, onboarding_conozcamonos_2_completed, a2_route_generated',
      )
      .eq('user_id', journey.user.id)
      .maybeSingle(),
    supabase
      .from('a1_cerebral_assessment')
      .select('disc_profile')
      .eq('user_id', journey.user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('canon_conozcamonos_2_responses')
      .select('responses')
      .eq('user_id', journey.user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (profileResult.error || assessmentResult.error || c2Result.error) {
    throw profileResult.error || assessmentResult.error || c2Result.error
  }

  const profile = profileResult.data
  const c2Completed = Boolean(
    profile?.conozcamonos_2_completed ||
      profile?.onboarding_conozcamonos_2_completed ||
      profile?.a2_route_generated,
  )
  if (!c2Completed || !c2Result.data?.responses) {
    redirect('/despega/conozcamonos-2')
  }
  if (!assessmentResult.data?.disc_profile) redirect('/despega/a1-cerebral')

  await recordJourneyTransition(journey.user.id, 'a1_report')

  const raw = assessmentResult.data.disc_profile as Record<string, number>
  const absoluteScores = {
    D: Math.abs(Number(raw.D) || 0),
    I: Math.abs(Number(raw.I) || 0),
    S: Math.abs(Number(raw.S) || 0),
    C: Math.abs(Number(raw.C) || 0),
  }
  const total =
    absoluteScores.D + absoluteScores.I + absoluteScores.S + absoluteScores.C || 1

  return (
    <A1CanonicalReport
      scores={{
        D: (absoluteScores.D / total) * 100,
        I: (absoluteScores.I / total) * 100,
        S: (absoluteScores.S / total) * 100,
        C: (absoluteScores.C / total) * 100,
      }}
      responses={objectValue(c2Result.data.responses)}
    />
  )
}
