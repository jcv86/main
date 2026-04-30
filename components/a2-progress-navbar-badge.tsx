'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { ProgressThermometerBadge } from './progress-thermometer-badge'

interface A2ProgressData {
  current_month: number
  progress_percentage: number
  status: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function A2ProgressNavbarBadge() {
  const { data: progress, isLoading } = useSWR<A2ProgressData>(
    '/api/a2/progress',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000,
      dedupingInterval: 2000,
    }
  )

  if (isLoading || !progress) {
    return null
  }

  const getColor = () => {
    if (progress.progress_percentage === 0) return 'purple'
    if (progress.progress_percentage < 50) return 'purple'
    if (progress.progress_percentage < 100) return 'blue'
    return 'emerald'
  }

  return (
    <Link href="/despega/a2-routes">
      <ProgressThermometerBadge
        percentage={progress.progress_percentage}
        label={`Mes ${progress.current_month}`}
        color={getColor() as 'purple' | 'blue' | 'cyan' | 'emerald'}
      />
    </Link>
  )
}
