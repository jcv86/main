'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day6Experience } from '@/components/a2-day6-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 6

export default function Dia6Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay6Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 6 submission saved:', submission)
      if (user?.id) {
        await markTaskComplete(30, 6, 'Día 6')
      }
      router.push('/despega/a2-routes#dia-7')
    } catch (err) {
      console.error('[v0] Error saving Day 6:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day6Experience onComplete={handleDay6Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
