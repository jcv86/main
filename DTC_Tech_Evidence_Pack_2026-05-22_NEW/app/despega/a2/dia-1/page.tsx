'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day1Experience } from '@/components/a2-day1-experience'

const DIA_NUM = 1

export default function Dia1Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay1Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 1 submission received:', submission)

      // Call the /api/a2/complete-day endpoint with full submission data
      if (user?.id) {
        const apiResponse = await fetch('/api/a2/complete-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dayNumber: 1,
            submission, // Full submission data including scores, passStatus, etc.
          }),
        })

        if (!apiResponse.ok) {
          const error = await apiResponse.json()
          console.error('[v0] API error:', error)
          throw new Error(error.error || 'Failed to complete day')
        }

        const result = await apiResponse.json()
        console.log('[v0] Day 1 completion result:', result)
        console.log('[v0] A3 unlocks triggered:', result.a3_unlocks)
      }

      // Wait a moment for Supabase to sync, then navigate
      await new Promise(resolve => setTimeout(resolve, 500))

      // Navigate to A2 progress dashboard with anchor to día-2
      console.log('[v0] Navigating to /despega/a2-routes#dia-2')
      router.push('/despega/a2-routes#dia-2')
    } catch (err) {
      console.error('[v0] Error in handleDay1Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day1Experience onComplete={handleDay1Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
