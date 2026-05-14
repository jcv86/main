'use client'

import { useRouter } from 'next/navigation'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day1Experience } from '@/components/a2-day1-experience'

const DIA_NUM = 1

export default function Dia1Page() {
  const router = useRouter()

  const handleDay1Complete = async (submission: any) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/despega/a2/dia-1', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submission),
      // })
      // if (!response.ok) throw new Error('Failed to save')

      console.log('[v0] Day 1 submission saved:', submission)

      // Navigate to next day
      router.push('/despega/a2-routes#dia-2')
    } catch (err) {
      console.error('[v0] Error saving Day 1:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM}>
      <Day1Experience onComplete={handleDay1Complete} />
    </A2DayPageTemplate>
  )
}
