'use client'

import useSWR from 'swr'
import Link from 'next/link'

interface A2ProgressData {
  current_month: number
  progress_percentage: number
  status: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function A2ProgressBar() {
  const { data: progress, error } = useSWR<A2ProgressData>(
    '/api/a2/progress',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000,
      dedupingInterval: 2000,
      fallbackData: { current_month: 1, progress_percentage: 0, status: 'loading' }
    }
  )

  const percentage = progress?.progress_percentage ?? 0
  const month = progress?.current_month ?? 1
  const displayPercentage = Math.max(percentage, 1)

  return (
    <Link href="/despega/a2-routes">
      <div className="h-2 bg-white/10 relative overflow-hidden cursor-pointer group hover:bg-white/20 transition-colors">
        {/* Gradient bar that fills */}
        <div
          className="h-full bg-gradient-to-r from-purple to-cyan transition-all duration-500 ease-out shadow-lg"
          style={{
            width: `${displayPercentage}%`,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>

        {/* Progress text on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50">
          <span className="text-xs font-semibold text-white">
            Mes {month} • {percentage}%
          </span>
        </div>
      </div>
    </Link>
  )
}
