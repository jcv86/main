'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day4Experience } from '@/components/a2-day4-experience'

const DIA_NUM = 4

export default function Dia4Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay4Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 4 submission received:', submission)
      if (user?.id) {
        const apiResponse = await fetch('/api/a2/complete-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayNumber: 4, submission }),
        })

        if (!apiResponse.ok) throw new Error('Failed to complete day')
        const result = await apiResponse.json()
        console.log('[v0] Day 4 completion result:', result)
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/despega/a2-routes#dia-5')
    } catch (err) {
      console.error('[v0] Error in handleDay4Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day4Experience onComplete={handleDay4Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
