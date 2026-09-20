import { NextResponse } from 'next/server'
import { fetchGetOnBoardJobs } from '@/lib/opportunities/sources/getonboard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = (searchParams.get('category') || 'programming').slice(0, 80)
  const startedAt = Date.now()
  try {
    const opportunities = await fetchGetOnBoardJobs(category)
    const sample = opportunities.slice(0, 3).map((item) => ({
      sourceId: item.sourceId,
      title: item.title,
      company: item.company,
      location: item.location,
      originalUrl: item.originalUrl,
      publishedAt: item.publishedAt,
      verificationStatus: item.verificationStatus,
    }))
    return NextResponse.json({
      ok: opportunities.length > 0,
      provider: 'getonboard',
      category,
      count: opportunities.length,
      valid_original_urls: opportunities.filter((item) => /^https:\/\//i.test(item.originalUrl)).length,
      latency_ms: Date.now() - startedAt,
      checked_at: new Date().toISOString(),
      sample,
    }, { status: opportunities.length > 0 ? 200 : 503 })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      provider: 'getonboard',
      category,
      count: 0,
      latency_ms: Date.now() - startedAt,
      checked_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'provider unavailable',
    }, { status: 503 })
  }
}
