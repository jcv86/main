import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function auditModuleSystem() {
  console.log('\n=== A3 MODULE UNLOCK AUDIT START ===\n')

  try {
    // 1. Check module unlock rules
    console.log('1. CHECKING MODULE UNLOCK RULES TABLE...')
    const { data: rules, error: rulesError } = await supabase
      .from('a3_module_unlock_rules')
      .select('*')
      .order('sequence_order', { ascending: true })

    if (rulesError) {
      console.error('ERROR fetching rules:', rulesError)
    } else {
      console.log(`Found ${rules.length} module rules:`)
      rules.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.module_id} (XP: ${r.xp_required}, Level: ${r.level})`)
      })
      if (rules.length === 0) {
        console.error('⚠️  WARNING: NO MODULE RULES FOUND - THIS IS THE MAIN ISSUE!')
      }
    }

    // 2. Check for duplicate module rules
    console.log('\n2. CHECKING FOR DUPLICATE RULES...')
    let dupes = null
    try {
      const result = await supabase.rpc('check_duplicate_modules')
      dupes = result.data
    } catch (e) {
      // RPC function may not exist, which is fine
    }
    
    if (dupes && dupes.length > 0) {
      console.log('Duplicate modules found:', dupes)
    } else {
      console.log('No direct duplicates detected')
    }

    // 3. Sample user progress records
    console.log('\n3. CHECKING USER PROGRESS RECORDS...')
    const { data: progressRecords } = await supabase
      .from('a3_user_progress')
      .select('user_id, total_xp, completed_modules, created_at, updated_at')
      .limit(5)

    if (progressRecords && progressRecords.length > 0) {
      console.log(`Found ${progressRecords.length} progress records:`)
      progressRecords.forEach((p, i) => {
        console.log(`  ${i + 1}. User: ${p.user_id.substring(0, 8)}..., XP: ${p.total_xp}, Modules: [${p.completed_modules.join(',')}]`)
      })
    } else {
      console.log('⚠️  No user progress records found')
    }

    // 4. Check interview-0 progress records
    console.log('\n4. CHECKING INTERVIEW-0 COMPLETION RECORDS...')
    const { data: interview0 } = await supabase
      .from('a3_interview_0_progress')
      .select('user_id, final_score, passed, completed_at')
      .limit(5)

    if (interview0 && interview0.length > 0) {
      console.log(`Found ${interview0.length} interview-0 records:`)
      interview0.forEach((i, idx) => {
        console.log(`  ${idx + 1}. User: ${i.user_id.substring(0, 8)}..., Score: ${i.final_score}, Passed: ${i.passed}`)
      })
    } else {
      console.log('⚠️  No interview-0 completion records found')
    }

    // 5. Check for XP discrepancies
    console.log('\n5. CHECKING FOR DATA INTEGRITY ISSUES...')
    const { data: allProgress } = await supabase
      .from('a3_user_progress')
      .select('total_xp')

    if (allProgress && allProgress.length > 0) {
      const xpValues = allProgress.map(r => r.total_xp)
      const avgXp = xpValues.reduce((sum, xp) => sum + xp, 0) / xpValues.length
      const minXp = Math.min(...xpValues)
      const maxXp = Math.max(...xpValues)
      console.log(`XP Statistics: Count: ${allProgress.length}, Avg: ${avgXp.toFixed(1)}, Min: ${minXp}, Max: ${maxXp}`)
    } else {
      console.log('No progress records to analyze')
    }

    console.log('\n=== AUDIT COMPLETE ===\n')

  } catch (error) {
    console.error('AUDIT FAILED:', error)
  }
}

// Run audit
auditModuleSystem()
