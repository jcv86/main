/**
 * Auto-Detection Webhook
 * 
 * Triggered when A1/A2/A3 milestones complete
 * Runs job matching and creates notifications for high-match opportunities
 */

export const runtime = 'nodejs' // Required for Supabase

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { invalidateProfileCache, getUserUnifiedProfile } from '@/lib/a1-a2-a3/profile-builder'
import { 
  matchJobsForUser, 
  saveJobMatch, 
  getUserJobMatches 
} from '@/lib/supabase/a4-job-matching'
import { createNotification } from '@/lib/notifications/job-notifications'

interface WebhookPayload {
  event: 'a1_completed' | 'a2_milestone' | 'a3_training_completed'
  userId: string
  data: Record<string, any>
}

// Minimum match score to create notification
const NOTIFICATION_THRESHOLD = 70

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (optional but recommended)
    const signature = request.headers.get('x-webhook-signature')
    if (!verifyWebhookSignature(signature, await request.text())) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload: WebhookPayload = await request.json()
    
    console.log(`[v0] Auto-detection webhook triggered: ${payload.event} for user ${payload.userId}`)

    // 1. Invalidate user's profile cache to force rebuild
    invalidateProfileCache(payload.userId)

    // 2. Get fresh unified profile
    const userProfile = await getUserUnifiedProfile(payload.userId)

    // 3. Run job matching with updated skills
    const jobMatches = await matchJobsForUser(
      payload.userId,
      userProfile.all_skills,
      userProfile.experience_level,
      userProfile.specializations
    )

    console.log(`[v0] Found ${jobMatches.length} potential matches`)

    // 4. Filter for high matches and create notifications
    const highMatches = jobMatches.filter(match => match.matchScore >= NOTIFICATION_THRESHOLD)
    let notificationsCreated = 0

    for (const jobMatch of highMatches) {
      // Check if we already notified about this job
      const supabase = await createClient()
      const { data: existingNotifications } = await supabase
        .from('job_match_notifications')
        .select('id')
        .eq('user_id', payload.userId)
        .eq('job_id', jobMatch.jobId)
        .single()

      if (!existingNotifications) {
        // Create notification
        await createNotification({
          userId: payload.userId,
          type: 'new_job_match',
          title: `New opportunity matched your skills!`,
          message: `${jobMatch.jobTitle} at ${jobMatch.company} - ${jobMatch.matchScore}% match`,
          relatedJobId: jobMatch.jobId,
          relatedMatchScore: jobMatch.matchScore
        })
        notificationsCreated++
      }

      // Save the match
      await saveJobMatch({
        userId: payload.userId,
        jobId: jobMatch.jobId,
        matchScore: jobMatch.matchScore,
        matchDetails: jobMatch.details,
        discoveredVia: payload.event
      })
    }

    return NextResponse.json({
      success: true,
      event: payload.event,
      jobsFound: jobMatches.length,
      highMatches: highMatches.length,
      notificationsCreated,
      profile: {
        skills: userProfile.all_skills.length,
        experienceLevel: userProfile.experience_level,
        specializations: userProfile.specializations.length
      }
    })
  } catch (error) {
    console.error('[v0] Auto-detection webhook error:', error)
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Manual trigger endpoint for testing
 * Simulates milestone completion for a user
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const event = searchParams.get('event') || 'a1_completed'

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  // Trigger webhook manually
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': 'dev-mode' // Skip verification in dev
      },
      body: JSON.stringify({
        event,
        userId,
        data: {}
      })
    })
  )
}

/**
 * Verify webhook signature (placeholder - implement actual verification)
 */
function verifyWebhookSignature(signature: string | null, body: string): boolean {
  // In production, verify HMAC signature
  // For now, accept if signature exists or if in dev mode
  return signature === 'dev-mode' || signature !== null
}
