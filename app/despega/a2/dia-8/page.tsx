'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day8Experience } from '@/components/a2-day8-experience'

const DIA_NUM = 8

export default function Dia8Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay8Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 8 submission received:', submission)

      if (user?.id) {
        const apiResponse = await fetch('/api/a2/complete-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dayNumber: 8, submission }),
        })

        if (!apiResponse.ok) throw new Error('Failed to complete day')
        const result = await apiResponse.json()
        console.log('[v0] Day 8 completion result:', result)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      router.push('/despega/a2-routes#dia-9')
    } catch (err) {
      console.error('[v0] Error in handleDay8Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day8Experience onComplete={handleDay8Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
