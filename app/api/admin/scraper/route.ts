import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { queueScrapingTask, getScraperStats, dailyScrapingSchedule } from '@/lib/scraping/linkedin-scraper'

export async function POST(request: NextRequest) {
  try {
    const { action, searchTerms } = await request.json()

    // Verify admin access (optional - in production would need real auth)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let result

    if (action === 'scrape_terms' && searchTerms) {
      console.log('[v0] Queueing scraping tasks for:', searchTerms)
      result = {
        action: 'scrape_terms',
        queued: searchTerms.length,
        tasks: await Promise.all(
          searchTerms.map(term => queueScrapingTask(term))
        ),
      }
    } else if (action === 'daily_schedule') {
      result = await dailyScrapingSchedule()
    } else if (action === 'stats') {
      result = getScraperStats()
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('[v0] Scraping error:', error)
    return NextResponse.json(
      {
        error: 'Scraping failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = getScraperStats()
    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('[v0] Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}
