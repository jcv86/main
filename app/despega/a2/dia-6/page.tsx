'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day6Experience } from '@/components/a2-day6-experience'

const DIA_NUM = 6

export default function Dia6Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay6Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 6 submission received:', submission)
      if (user?.id) {
        const apiResponse = await fetch('/api/a2/complete-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayNumber: 6, submission }),
        })

        if (!apiResponse.ok) throw new Error('Failed to complete day')
        const result = await apiResponse.json()
        console.log('[v0] Day 6 completion result:', result)
        console.log('[v0] A3 unlocks triggered:', result.a3_unlocks)
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/despega/a2-routes#dia-7')
    } catch (err) {
      console.error('[v0] Error in handleDay6Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day6Experience onComplete={handleDay6Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
