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
  const { data: progress } = useSWR<A2ProgressData>(
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
  const displayPercentage = Math.max(percentage, 2)

  return (
    <Link href="/despega/a2-routes">
      <div className="sticky top-16 z-40 bg-black border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Progress bar container */}
          <div className="flex-1 flex items-center gap-3">
            {/* Label */}
            <div className="whitespace-nowrap">
              <span className="text-sm font-semibold text-white">
                Mes {month} • {percentage}%
              </span>
            </div>

            {/* Gradient progress bar */}
            <div className="flex-1 h-3 bg-white/10 rounded-full relative overflow-hidden hover:bg-white/20 transition-colors cursor-pointer group">
              <div
                className="h-full bg-gradient-to-r from-purple via-blue to-cyan transition-all duration-500 ease-out shadow-lg rounded-full"
                style={{
                  width: `${displayPercentage}%`,
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full" />
              </div>
            </div>

            {/* Percentage text */}
            <div className="whitespace-nowrap text-right min-w-[50px]">
              <span className="text-sm font-bold text-cyan">{percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
