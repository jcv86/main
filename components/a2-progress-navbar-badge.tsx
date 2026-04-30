'use client'

import useSWR from 'swr'
import Link from 'next/link'

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
      refreshInterval: 5000, // Refresca cada 5 segundos
      dedupingInterval: 2000,
    }
  )

  if (isLoading || !progress) {
    return null
  }

  const getStatusColor = () => {
    if (progress.progress_percentage === 0) return 'bg-muted/30 text-white/60'
    if (progress.progress_percentage < 50) return 'bg-purple/20 text-purple'
    if (progress.progress_percentage < 100) return 'bg-blue/20 text-blue'
    return 'bg-emerald-500/20 text-emerald-400'
  }

  return (
    <Link href="/despega/a2-routes">
      <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border border-current/20 ${getStatusColor()} hover:opacity-80 transition-opacity cursor-pointer`}>
        Mes {progress.current_month} • {progress.progress_percentage}%
      </div>
    </Link>
  )
}
