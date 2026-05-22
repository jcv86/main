'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day3Experience } from '@/components/a2-day3-experience'

const DIA_NUM = 3

export default function Dia3Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay3Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 3 submission received:', submission)

      if (user?.id) {
        const apiResponse = await fetch('/api/a2/complete-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayNumber: 3, submission }),
        })

        if (!apiResponse.ok) {
          const error = await apiResponse.json()
          throw new Error(error.error || 'Failed to complete day')
        }

        const result = await apiResponse.json()
        console.log('[v0] Day 3 completion result:', result)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/despega/a2-routes#dia-4')
    } catch (err) {
      console.error('[v0] Error in handleDay3Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day3Experience onComplete={handleDay3Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
