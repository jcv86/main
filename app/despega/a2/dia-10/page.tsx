'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day10Experience } from '@/components/a2-day10-experience'

const DIA_NUM = 10

export default function Dia10Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay10Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 10 submission received:', submission)
      if (user?.id) {
        const apiResponse = await fetch('/api/a2/complete-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayNumber: 10, submission }),
        })

        if (!apiResponse.ok) throw new Error('Failed to complete day')
        const result = await apiResponse.json()
        console.log('[v0] Day 10 completion result:', result)
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/despega/a2-routes#phase2')
    } catch (err) {
      console.error('[v0] Error in handleDay10Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day10Experience onComplete={handleDay10Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
