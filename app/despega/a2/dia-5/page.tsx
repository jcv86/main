'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day5Experience } from '@/components/a2-day5-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 5

export default function Dia5Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay5Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 5 submission saved:', submission)
      if (user?.id) {
        await markTaskComplete(30, 5, 'Día 5')
      }
      router.push('/despega/a2-routes#dia-6')
    } catch (err) {
      console.error('[v0] Error saving Day 5:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day5Experience onComplete={handleDay5Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
