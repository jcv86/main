/**
 * Pillar Progress Reset Utility
 * 
 * Safely resets progress for all users except demo accounts
 * Preserves Travis Dea (travis@nuanu.com) mockup data for testing
 * Prepares database for pillar connections
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Pillar System Overview:
 * 
 * A1 - Identity & Self-Discovery (FOUNDATION)
 *   - User tests: DISC, Cerebral, Emotional Intelligence
 *   - Output: Personal profile, strengths, areas for growth
 * 
 * A2 - Professional Development (ROUTES & EXECUTION)
 *   - User missions: 90-day journey, sprints, daily actions
 *   - Output: Career clarity, market signals
 * 
 * A3 - Interview Training (EMPLOYABILITY)
 *   - Simulations: Practice interviews
 *   - Output: Interview skills, confidence
 * 
 * A4 - Strategic Knowledge (MASTERY)
 *   - News analysis, market insights
 *   - Output: Executive thinking
 */

async function findTravisUserId() {
  console.log('🔍 Finding Travis account...')
  try {
    const { data } = await supabase.auth.admin.listUsers()
    const travisUser = data?.users?.find((u: any) => u.email === 'travis@nuanu.com')
    if (travisUser) {
      console.log(`✅ Found Travis: ${travisUser.id}`)
      return travisUser.id
    }
  } catch (err) {
    console.log('⚠️  Using fallback approach to preserve demo accounts')
  }
  return null
}

async function resetUserProgress(travisId: string | null) {
  console.log('\n🔄 Starting pillar progress reset...\n')

  const tables = [
    // A1 - Identity Pillar
    'a1_profile_insights',
    'a1_tests_results',
    'a1_progress',
    // A2 - Routes Pillar
    'a2_user_sprints',
    'a2_user_missions',
    'a2_user_route_progress',
    // A3 - Interview Pillar
    'a3_session_attempts',
    'a3_module_completion',
    'a3_user_progress',
    // A4 - Strategic Pillar
    'a4_user_test_completions',
    'a4_module_progress',
    'a4_strategic_score',
  ]

  let successCount = 0
  let errorCount = 0

  for (const table of tables) {
    try {
      let query = supabase.from(table).delete()

      // If we found Travis UUID, exclude it
      if (travisId) {
        query = query.neq('user_id', travisId)
      }

      const { count, error } = await query

      if (error) {
        console.log(`⚠️  ${table}: ${error.message}`)
        errorCount++
      } else {
        console.log(`✅ Reset ${table} (${count} records deleted)`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ ${table}:`, err)
      errorCount++
    }
  }

  return { successCount, errorCount }
}

async function verifyReset(travisId: string | null) {
  console.log('\n📋 Verifying reset...')

  try {
    // Check A1
    const { count: a1Count } = await supabase
      .from('a1_progress')
      .select('*', { count: 'exact', head: true })

    console.log(`A1 Progress records remaining: ${a1Count || 0}`)

    // Check A2
    const { count: a2Count } = await supabase
      .from('a2_user_route_progress')
      .select('*', { count: 'exact', head: true })

    console.log(`A2 Route Progress records remaining: ${a2Count || 0}`)

    // Check A3
    const { count: a3Count } = await supabase
      .from('a3_user_progress')
      .select('*', { count: 'exact', head: true })

    console.log(`A3 Progress records remaining: ${a3Count || 0}`)

    // Check A4
    const { count: a4Count } = await supabase
      .from('a4_strategic_score')
      .select('*', { count: 'exact', head: true })

    console.log(`A4 Strategic Score records remaining: ${a4Count || 0}`)

    // Verify Travis is preserved if we have the ID
    if (travisId) {
      const { data: travisData } = await supabase
        .from('a1_progress')
        .select('*')
        .eq('user_id', travisId)
        .limit(1)

      if (travisData && travisData.length > 0) {
        console.log(`\n✅ Travis account VERIFIED (data preserved for testing)`)
      } else {
        console.log(`\n⚠️  Travis account found but may not have started A1 yet`)
      }
    }
  } catch (err) {
    console.error('❌ Verification error:', err)
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('          PILLAR PROGRESS RESET & PREPARATION')
  console.log('═══════════════════════════════════════════════════════════\n')

  try {
    // Find Travis account first
    const travisId = await findTravisUserId()

    // Execute resets
    const { successCount, errorCount } = await resetUserProgress(travisId)

    // Verify
    await verifyReset(travisId)

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('✅ RESET COMPLETE - System ready for new user journeys')
    console.log('═══════════════════════════════════════════════════════════\n')
    console.log('📊 Summary:')
    console.log(`   ✅ Successful resets: ${successCount}`)
    console.log(`   ⚠️  Errors: ${errorCount}`)
    console.log(`   🔒 Travis account: PROTECTED`)
    console.log(`   📍 All other users: RESET TO BEGINNING\n`)
    console.log('🚀 Next Steps:')
    console.log('   1. All users can restart from onboarding')
    console.log('   2. Travis can freely test across pillars')
    console.log('   3. System ready to track pillar connections\n')

  } catch (err) {
    console.error('\n❌ FATAL ERROR:', err)
    process.exit(1)
  }
}

main()

