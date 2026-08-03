import { redirect } from 'next/navigation'
import { A2CanonicalIntro } from '@/components/a2-canonical-intro'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { createAdminClient } from '@/lib/supabase/server'

export default async function YourRouteIntroPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('a1_cerebral_assessment')
    .select('disc_profile')
    .eq('user_id', journey.user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data?.disc_profile) redirect('/despega/a1-cerebral')

  const raw = data.disc_profile as Record<string, number>
  const scores = {
    energia: Math.abs(Number(raw.D) || 0),
    planEjecutivo: Math.abs(Number(raw.I) || 0),
    relaciones: Math.abs(Number(raw.S) || 0),
    enfoque: Math.abs(Number(raw.C) || 0),
  }
  const total =
    scores.energia +
      scores.planEjecutivo +
      scores.relaciones +
      scores.enfoque ||
    1
  const normalized = {
    energia: (scores.energia / total) * 100,
    planEjecutivo: (scores.planEjecutivo / total) * 100,
    relaciones: (scores.relaciones / total) * 100,
    enfoque: (scores.enfoque / total) * 100,
  }
  const ordered = [
    ['Energía', normalized.energia],
    ['Plan Ejecutivo', normalized.planEjecutivo],
    ['Relaciones', normalized.relaciones],
    ['Enfoque', normalized.enfoque],
  ] as const
  const primary = [...ordered].sort((left, right) => right[1] - left[1])[0]

  return (
    <A2CanonicalIntro
      profile={{
        ...normalized,
        primaryName: primary[0],
        primaryScore: primary[1],
      }}
    />
  )
}
