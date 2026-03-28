'use client'

import useSWR from 'swr'

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  urlToImage?: string
  source: {
    id: string | null
    name: string
  }
  author?: string
  publishedAt: string
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch news')
  return response.json()
}

export function useRealNews(userId: string | null, category = 'business') {
  const { data, isLoading, error, mutate } = useSWR(
    userId ? `/api/news/${userId}?category=${category}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000 // Cache for 1 minute
    }
  )

  return {
    articles: data?.articles || [],
    userProfile: data?.userProfile,
    isLoading,
    error,
    refetch: mutate
  }
}
