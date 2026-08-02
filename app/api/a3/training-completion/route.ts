import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { getModuleConfig, resolveCanonicalId } from '@/lib/pillar3-config'

function normalizeTrainingLookup(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const {
      training_id,
      module_name,
      tiempo_dedicado_minutos,
      competencias_desarrolladas,
    } = body

    if (
      typeof training_id !== 'string' ||
      training_id.trim().length === 0 ||
      (module_name !== undefined && typeof module_name !== 'string')
    ) {
      return NextResponse.json({ error: 'Invalid training identity' }, { status: 400 })
    }

    const userId = currentUser.id
    const supabase = createAdminClient()
    const now = new Date().toISOString()
    const minutes = Math.max(
      1,
      Math.min(
        480,
        Number.isFinite(Number(tiempo_dedicado_minutos))
          ? Math.round(Number(tiempo_dedicado_minutos))
          : 45,
      ),
    )
    const competencies = Array.isArray(competencias_desarrolladas)
      ? competencias_desarrolladas.filter(
          (value): value is string => typeof value === 'string' && value.trim().length > 0,
        )
      : []

    const rawTrainingType = (module_name || training_id).trim()
    const normalizedTrainingType = normalizeTrainingLookup(rawTrainingType)
    const moduleConfig =
      getModuleConfig(rawTrainingType) ?? getModuleConfig(normalizedTrainingType)
    const canonicalId = moduleConfig?.id ?? resolveCanonicalId(normalizedTrainingType)

    if (!moduleConfig || !canonicalId) {
      return NextResponse.json(
        { error: 'Unknown training type; no verified reward configuration exists' },
        { status: 400 },
      )
    }

    const { data: existingAssignment, error: assignmentLookupError } = await supabase
      .from('a3_training_assignments')
      .select('id')
      .eq('user_id', userId)
      .eq('training_id', training_id)
      .maybeSingle()

    if (assignmentLookupError) {
      console.error('[v0] Error checking training assignment:', assignmentLookupError)
      return NextResponse.json({ error: 'Failed to verify training assignment' }, { status: 500 })
    }

    if (existingAssignment) {
      const { error: assignmentUpdateError } = await supabase
        .from('a3_training_assignments')
        .update({
          completed_at: now,
          tiempo_dedicado_minutos: minutes,
        })
        .eq('id', existingAssignment.id)

      if (assignmentUpdateError) {
        console.error('[v0] Error updating training assignment:', assignmentUpdateError)
        return NextResponse.json({ error: 'Failed to update training assignment' }, { status: 500 })
      }
    } else {
      const { error: assignmentInsertError } = await supabase
        .from('a3_training_assignments')
        .insert({
          user_id: userId,
          training_id,
          completed_at: now,
          started_at: now,
          tiempo_dedicado_minutos: minutes,
        })

      if (assignmentInsertError) {
        console.error('[v0] Error creating training assignment:', assignmentInsertError)
        return NextResponse.json({ error: 'Failed to create training assignment' }, { status: 500 })
      }
    }

    const xpAmount = moduleConfig.xp
    const dtcAmount = moduleConfig.dtc

    const { data: existingCompletion, error: completionLookupError } = await supabase
      .from('a3_training_module_completions')
      .select('id')
      .eq('user_id', userId)
      .eq('training_type', canonicalId)
      .maybeSingle()

    if (completionLookupError) {
      console.error('[v0] Error checking training completion:', completionLookupError)
      return NextResponse.json({ error: 'Failed to verify training completion' }, { status: 500 })
    }

    let isFirstCompletion = false
    let xpAwarded = 0
    let dtcAwarded = 0

    if (!existingCompletion) {
      const { error: completionInsertError } = await supabase
        .from('a3_training_module_completions')
        .insert({
          user_id: userId,
          training_type: canonicalId,
          training_module_id: training_id,
          xp_amount: xpAmount,
          xp_awarded_at: now,
          is_first_completion: true,
          first_completion_at: now,
        })

      if (!completionInsertError) {
        isFirstCompletion = true
        xpAwarded = xpAmount
        dtcAwarded = dtcAmount
      } else {
        // A concurrent or previous completion must never result in a second award.
        console.warn('[v0] Completion was not inserted; rewards skipped:', completionInsertError)
      }
    }

    if (isFirstCompletion) {
      const { data: gamProfile, error: gamProfileError } = await supabase
        .from('user_gamification_profile')
        .select('total_xp, current_xp')
        .eq('user_id', userId)
        .maybeSingle()

      if (gamProfileError) {
        console.error('[v0] Error fetching gamification profile:', gamProfileError)
        return NextResponse.json({ error: 'Failed to fetch gamification profile' }, { status: 500 })
      }

      const { error: gamificationWriteError } = gamProfile
        ? await supabase
            .from('user_gamification_profile')
            .update({
              total_xp: (gamProfile.total_xp || 0) + xpAmount,
              current_xp: (gamProfile.current_xp || 0) + xpAmount,
              updated_at: now,
            })
            .eq('user_id', userId)
        : await supabase.from('user_gamification_profile').insert({
            user_id: userId,
            total_xp: xpAmount,
            current_xp: xpAmount,
            current_level: 'Bronze',
          })

      if (gamificationWriteError) {
        console.error('[v0] Error updating gamification profile:', gamificationWriteError)
        return NextResponse.json({ error: 'Failed to award XP' }, { status: 500 })
      }

      if (dtcAmount > 0) {
        const { error: transactionError } = await supabase.from('dtc_transactions').insert({
          user_id: userId,
          amount: dtcAmount,
          transaction_type: 'earn',
          description: `Pillar 3: ${moduleConfig.name ?? canonicalId}`,
          related_to: 'pillar3_module',
          related_id: training_id,
          metadata: { source: 'pillar3', module: canonicalId },
        })

        if (transactionError) {
          console.error('[v0] Error saving DTC transaction:', transactionError)
          return NextResponse.json({ error: 'Failed to record DTC reward' }, { status: 500 })
        }

        const { data: balance, error: balanceLookupError } = await supabase
          .from('user_dtc_balance')
          .select('balance, lifetime_earned')
          .eq('user_id', userId)
          .maybeSingle()

        if (balanceLookupError) {
          console.error('[v0] Error fetching DTC balance:', balanceLookupError)
          return NextResponse.json({ error: 'Failed to fetch DTC balance' }, { status: 500 })
        }

        const { error: balanceWriteError } = balance
          ? await supabase
              .from('user_dtc_balance')
              .update({
                balance: (balance.balance || 0) + dtcAmount,
                lifetime_earned: (balance.lifetime_earned || 0) + dtcAmount,
                updated_at: now,
              })
              .eq('user_id', userId)
          : await supabase.from('user_dtc_balance').insert({
              user_id: userId,
              balance: dtcAmount,
              lifetime_earned: dtcAmount,
              lifetime_spent: 0,
            })

        if (balanceWriteError) {
          console.error('[v0] Error updating DTC balance:', balanceWriteError)
          return NextResponse.json({ error: 'Failed to award DTC' }, { status: 500 })
        }
      }
    }

    const { data: currentProgress, error: progressLookupError } = await supabase
      .from('a3_user_progreso')
      .select('competencias_desarrolladas')
      .eq('user_id', userId)
      .maybeSingle()

    if (progressLookupError) {
      console.error('[v0] Error fetching A3 competencies:', progressLookupError)
      return NextResponse.json({ error: 'Failed to fetch competencies' }, { status: 500 })
    }

    if (!currentProgress) {
      const { error: progressInsertError } = await supabase.from('a3_user_progreso').insert({
        user_id: userId,
        entrevistas_completadas: 0,
        competencias_desarrolladas: competencies,
      })

      if (progressInsertError) {
        console.error('[v0] Error creating A3 competencies:', progressInsertError)
      }
    } else {
      const updatedCompetencies = Array.from(
        new Set([...(currentProgress.competencias_desarrolladas || []), ...competencies]),
      )
      const { error: progressUpdateError } = await supabase
        .from('a3_user_progreso')
        .update({
          competencias_desarrolladas: updatedCompetencies,
          updated_at: now,
        })
        .eq('user_id', userId)

      if (progressUpdateError) {
        console.error('[v0] Error updating A3 competencies:', progressUpdateError)
      }
    }

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
