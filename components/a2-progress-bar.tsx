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
    }
  )

  if (!progress) {
    return null
  }

  return (
    <Link href="/despega/a2-routes">
      <div className="h-1 bg-white/5 relative overflow-hidden cursor-pointer group hover:bg-white/10 transition-colors">
        {/* Background gradient bar */}
        <div
          className="h-full bg-gradient-to-r from-purple via-blue to-cyan transition-all duration-500 ease-out shadow-lg"
          style={{
            width: `${Math.max(progress.progress_percentage, 1)}%`,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>

        {/* Progress text on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
          <span className="text-xs font-semibold text-white">
            Mes {progress.current_month} • {progress.progress_percentage}% completado
          </span>
        </div>
      </div>
    </Link>
  )
}
