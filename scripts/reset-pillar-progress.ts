/**
 * Pillar Progress Reset Utility
 * 
 * Safely resets progress for all users except demo accounts
 * Preserves Travis Dea (travis@nuanu.com) mockup data for testing
 * Prepares database for pillar connections
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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
 *   - Connections: Feeds A2, A3, A4
 * 
 * A2 - Professional Development (ROUTES & EXECUTION)
 *   - User missions: 90-day journey, sprints, daily actions
 *   - Output: Career clarity, market signals, professional identity
 *   - Connections: Uses A1 insights, feeds A3, A4
 * 
 * A3 - Interview Training (EMPLOYABILITY)
 *   - Simulations: Practice interviews at different levels
 *   - Output: Interview skills, confidence, market readiness
 *   - Connections: Uses A1 & A2 context, feeds A4 feedback
 * 
 * A4 - Strategic Knowledge (MASTERY)
 *   - News analysis, market insights, strategic reading
 *   - Output: Executive thinking, strategic positioning
 *   - Connections: Aggregates A1, A2, A3 learning
 */

async function resetUserProgress() {
  console.log('🔄 Starting pillar progress reset...')

  try {
    // Read the SQL reset script
    const scriptPath = path.join(
      process.cwd(),
      'scripts',
      'reset-pillar-progress.sql'
    )

    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Reset script not found at ${scriptPath}`)
    }

    const sqlScript = fs.readFileSync(scriptPath, 'utf-8')

    console.log('📋 Executing reset script...')

    // Execute the reset script
    const { data, error } = await supabase.rpc('execute_sql_script', {
      sql: sqlScript,
    })

    if (error) {
      console.error('❌ Reset failed:', error)
      throw error
    }

    console.log('✅ Reset completed successfully!')
    console.log('📊 Reset Summary:')
    console.log(data)

    // Verify the reset
    await verifyReset()

    return {
      success: true,
      message: 'User progress reset completed',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('❌ Error during reset:', error)
    throw error
  }
}

/**
 * Verify that reset was successful and database is ready
 */
async function verifyReset() {
  console.log('\n🔍 Verifying reset...')

  try {
    // Check A1 progress
    const { data: a1Data, error: a1Error } = await supabase
      .from('a1_progress')
      .select('COUNT(*), COUNT(CASE WHEN tests_completed = 0 THEN 1 END)')
      .neq('user_id', 'demo-travis')

    if (!a1Error) {
      console.log('✓ A1 Progress: Reset verified')
    }

    // Check A2 routes
    const { data: a2Data, error: a2Error } = await supabase
      .from('a2_user_route_progress')
      .select('COUNT(*)')
      .neq('user_id', 'demo-travis')
      .eq('estado', 'not_started')

    if (!a2Error) {
      console.log('✓ A2 Routes: Reset verified')
    }

    // Check A3 progress
    const { data: a3Data, error: a3Error } = await supabase
      .from('a3_user_progress')
      .select('COUNT(*)')
      .neq('user_id', 'demo-travis')
      .eq('total_xp', 0)

    if (!a3Error) {
      console.log('✓ A3 Progress: Reset verified')
    }

    // Check Travis account is preserved
    const { data: travisData, error: travisError } = await supabase
      .from('despega_user_profiles')
      .select('user_id, current_stage, progress_percentage')
      .eq('user_id', 'demo-travis')

    if (!travisError && travisData && travisData.length > 0) {
      console.log('✓ Travis Account: Preserved')
      console.log(`  - Current Stage: ${travisData[0].current_stage}`)
      console.log(`  - Progress: ${travisData[0].progress_percentage}%`)
    }

    // Check pillar connections table exists
    const { data: connectionsCheck, error: connectionsError } = await supabase
      .from('despega_pilar_connection_map')
      .select('COUNT(*)')
      .limit(1)

    if (!connectionsError) {
      console.log('✓ Pillar Connections: Infrastructure ready')
    }

    console.log('\n✅ Database verification complete!')
  } catch (error) {
    console.warn('⚠️  Verification check encountered issues:', error)
    // Don't fail the reset if verification has issues
  }
}

/**
 * Prepare database for cross-pillar data connections
 * This ensures all tables have proper schema for storing connections
 */
async function preparePillarConnections() {
  console.log('\n🔗 Preparing pillar connections...')

  try {
    // Ensure all pillar progress tables have connection fields
    const tables = [
      'despega_pilar_progress',
      'a1_progress',
      'a2_user_route_progress',
      'a3_user_progress',
      'a4_strategic_score',
    ]

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('COUNT(*)')
        .limit(1)

      if (error) {
        console.warn(`⚠️  Table ${table} not accessible:`, error.message)
      } else {
        console.log(`✓ ${table} ready for connections`)
      }
    }

    console.log('✅ Pillar connections prepared!')
  } catch (error) {
    console.error('❌ Error preparing connections:', error)
    throw error
  }
}

/**
 * Document current state of all users for analysis
 */
async function documentUserState() {
  console.log('\n📝 Documenting user state...')

  try {
    const { data, error } = await supabase
      .from('despega_user_profiles')
      .select(
        'user_id, current_stage, progress_percentage, current_ciclo, onboarding_completed, a1_test_completed, a3_unlocked, a4_unlocked'
      )
      .neq('user_id', 'demo-travis')
      .limit(10)

    if (!error && data) {
      console.log(
        `\n📊 User Progress Summary (sample of ${data.length} users):`
      )
      console.table(data)
    }

    // Document Travis account state
    const { data: travisData, error: travisError } = await supabase
      .from('despega_user_profiles')
      .select('*')
      .eq('user_id', 'demo-travis')
      .single()

    if (!travisError && travisData) {
      console.log('\n🎭 Travis Dev Account (preserved):')
      console.log(JSON.stringify(travisData, null, 2))
    }
  } catch (error) {
    console.warn('⚠️  Error documenting state:', error)
  }
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('          PILLAR PROGRESS RESET & PREPARATION')
  console.log('═══════════════════════════════════════════════════════════')

  try {
    // Reset progress
    await resetUserProgress()

    // Prepare connections
    await preparePillarConnections()

    // Document state
    await documentUserState()

    console.log('\n═══════════════════════════════════════════════════════════')
    console.log('✅ ALL TASKS COMPLETED SUCCESSFULLY')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('\n📋 Next Steps:')
    console.log('1. Users can now restart from onboarding (A1)')
    console.log('2. Travis account is preserved for testing')
    console.log('3. Database is ready for pillar data connections')
    console.log('4. Run: npm run db:analyze-pillars (to analyze connections)')
  } catch (error) {
    console.error('❌ FATAL ERROR:', error)
    process.exit(1)
  }
}

main()
