import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import { getModuleConfig, resolveCanonicalId } from '@/lib/pillar3-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { training_id, module_name, tiempo_dedicado_minutos, competencias_desarrolladas } = body

    console.log('[v0] Training completion request received:', {
      training_id,
      module_name,
      tiempo_dedicado_minutos,
    })

    // Get auth token from cookies to extract user ID
    const cookieStore = await cookies()
    const authToken =
      cookieStore.get('sb-auth-token')?.value || cookieStore.get('sb-token')?.value

    if (!authToken) {
      console.warn('[v0] No auth token found in cookies for training-completion')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Extract user ID from JWT token
    let userId: string
    try {
      const decoded: any = jwtDecode(authToken)
      userId = decoded.sub
      if (!userId) {
        throw new Error('No user ID in token')
      }
    } catch (decodeError) {
      console.error('[v0] Error decoding auth token:', decodeError)
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 })
    }

    const supabase = await createClient()

    // Resolve the training type to a canonical Pillar 3 module
    const rawTrainingType = (module_name || training_id || '').toString()
    const moduleConfig = getModuleConfig(rawTrainingType)
    const canonicalId = moduleConfig?.id ?? resolveCanonicalId(rawTrainingType) ?? rawTrainingType

    if (!moduleConfig) {
      console.warn(
        '[v0] Unknown training type, no XP/DTC config found:',
        rawTrainingType
      )
    } else {
      console.log('[v0] Resolved canonical module:', {
        raw: rawTrainingType,
        canonical: canonicalId,
        xp: moduleConfig.xp,
        dtc: moduleConfig.dtc,
      })
    }

    // Save / update training assignment record
    const { data: existingAssignment } = await supabase
      .from('a3_training_assignments')
      .select('id')
      .eq('user_id', userId)
      .eq('training_id', training_id)
      .maybeSingle()

    if (existingAssignment) {
      await supabase
        .from('a3_training_assignments')
        .update({
          completed_at: new Date().toISOString(),
          tiempo_dedicado_minutos: tiempo_dedicado_minutos || 45,
        })
        .eq('id', existingAssignment.id)
    } else {
      await supabase.from('a3_training_assignments').insert({
        user_id: userId,
        training_id: training_id,
        completed_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        tiempo_dedicado_minutos: tiempo_dedicado_minutos || 45,
      })
    }

    // Look up XP and DTC from the canonical config
    const xpAmount = moduleConfig?.xp ?? 0
    const dtcAmount = moduleConfig?.dtc ?? 0

    // Check if this is the first completion (only first completion awards rewards)
    const { data: existingCompletion } = await supabase
      .from('a3_training_module_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('training_type', canonicalId)
      .maybeSingle()

    let isFirstCompletion = false
    let xpAwarded = 0
    let dtcAwarded = 0

    if (!existingCompletion && xpAmount > 0) {
      isFirstCompletion = true
      xpAwarded = xpAmount
      dtcAwarded = dtcAmount

      // Save completion record with config-based XP
      const { error: xpError } = await supabase
        .from('a3_training_module_completions')
        .insert({
          user_id: userId,
          training_type: canonicalId,
          training_module_id: training_id,
          xp_amount: xpAmount,
          xp_awarded_at: new Date().toISOString(),
          is_first_completion: true,
          first_completion_at: new Date().toISOString(),
        })

      if (xpError) {
        console.error('[v0] Error saving XP completion:', xpError)
      } else {
        console.log('[v0] XP completion recorded:', {
          canonicalId,
          xp: xpAmount,
          dtc: dtcAmount,
        })
      }

      // Update user_gamification_profile total_xp directly
      const { data: gamProfile } = await supabase
        .from('user_gamification_profile')
        .select('total_xp, current_xp')
        .eq('user_id', userId)
        .maybeSingle()

      if (gamProfile) {
        await supabase
          .from('user_gamification_profile')
          .update({
            total_xp: (gamProfile.total_xp || 0) + xpAmount,
            current_xp: (gamProfile.current_xp || 0) + xpAmount,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
      } else {
        await supabase.from('user_gamification_profile').insert({
          user_id: userId,
          total_xp: xpAmount,
          current_xp: xpAmount,
          current_level: 'Bronze',
        })
      }

      // Save DTC transaction and update balance
      if (dtcAmount > 0) {
        const { error: txError } = await supabase.from('dtc_transactions').insert({
          user_id: userId,
          amount: dtcAmount,
          transaction_type: 'earn',
          description: `Pillar 3: ${moduleConfig?.name ?? canonicalId}`,
          related_to: 'pillar3_module',
          related_id: training_id,
          metadata: { source: 'pillar3', module: canonicalId },
        })

        if (txError) {
          console.error('[v0] Error saving DTC transaction:', txError)
        }

        // Update DTC balance
        const { data: balance } = await supabase
          .from('user_dtc_balance')
          .select('balance, lifetime_earned')
          .eq('user_id', userId)
          .maybeSingle()

        if (balance) {
          await supabase
            .from('user_dtc_balance')
            .update({
              balance: (balance.balance || 0) + dtcAmount,
              lifetime_earned: (balance.lifetime_earned || 0) + dtcAmount,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
        } else {
          await supabase.from('user_dtc_balance').insert({
            user_id: userId,
            balance: dtcAmount,
            lifetime_earned: dtcAmount,
            lifetime_spent: 0,
          })
        }
      }
    } else if (existingCompletion) {
      console.log('[v0] Training already completed, no additional rewards:', canonicalId)
    }

    // Update competencias on a3_user_progreso
    const { data: currentProgress } = await supabase
      .from('a3_user_progreso')
      .select('competencias_desarrolladas')
      .eq('user_id', userId)
      .maybeSingle()

    if (!currentProgress) {
      await supabase.from('a3_user_progreso').insert({
        user_id: userId,
        entrevistas_completadas: 0,
        competencias_desarrolladas: competencias_desarrolladas || [],
      })
    } else {
      const updatedCompetencias = Array.from(
        new Set([
          ...(currentProgress.competencias_desarrolladas || []),
          ...(competencias_desarrolladas || []),
        ])
      )
      await supabase
        .from('a3_user_progreso')
        .update({
          competencias_desarrolladas: updatedCompetencias,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
    }

    // Read back final balances for the response
    const { data: finalGam } = await supabase
      .from('user_gamification_profile')
      .select('total_xp, current_level')
      .eq('user_id', userId)
      .maybeSingle()

    const { data: finalDtc } = await supabase
      .from('user_dtc_balance')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle()

    return NextResponse.json({
      success: true,
      message: isFirstCompletion
        ? `+${xpAwarded} XP y +${dtcAwarded} DTC ganados`
        : 'Práctica registrada (sin XP/DTC adicionales: ya completado)',
      canonicalId,
      xpEarned: xpAwarded,
      pointsEarned: dtcAwarded,
      level: finalGam?.current_level || 'Bronze',
      totalXP: finalGam?.total_xp || 0,
      totalDtc: finalDtc?.balance || 0,
      isFirstCompletion,
      rewards: isFirstCompletion
        ? [
            { type: 'xp', amount: xpAwarded, label: 'Experiencia' },
            { type: 'dtc', amount: dtcAwarded, label: 'DTC' },
          ]
        : [],
    })
  } catch (error) {
    console.error('[v0] Error in training-completion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
