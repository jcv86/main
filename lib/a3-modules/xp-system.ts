// XP system and progress tracking
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface XPTransaction {
  userId: string;
  amount: number;
  reason: string;
  relatedTo: string;
  relatedId: string;
}

/**
 * Award XP to user when module is completed
 */
export async function awardModuleXP(
  userId: string,
  moduleId: string,
  xpAmount: number
): Promise<{ success: boolean; totalXP: number }> {
  try {
    // Record XP transaction
    const { error: transactionError } = await supabase
      .from('dtc_transactions')
      .insert({
        user_id: userId,
        amount: xpAmount,
        transaction_type: 'xp_award',
        description: `Module completion: ${moduleId}`,
        related_to: 'module',
        related_id: moduleId,
      });

    if (transactionError) {
      throw transactionError;
    }

    // Update user's total XP
    const { data: balance, error: balanceError } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned')
      .eq('user_id', userId)
      .single();

    if (balanceError && balanceError.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is OK for new users
      throw balanceError;
    }

    const newBalance = (balance?.balance || 0) + xpAmount;
    const newLifetimeEarned = (balance?.lifetime_earned || 0) + xpAmount;

    const { error: updateError } = await supabase
      .from('user_dtc_balance')
      .upsert(
        {
          user_id: userId,
          balance: newBalance,
          lifetime_earned: newLifetimeEarned,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (updateError) {
      throw updateError;
    }

    // Sync XP to gamification profile
    const { error: gamificationError } = await supabase
      .from('user_gamification_profile')
      .upsert(
        {
          user_id: userId,
          current_xp: newBalance,
          total_xp: newLifetimeEarned,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (gamificationError) {
      console.error('Warning: Could not sync to gamification profile');
    }

    return {
      success: true,
      totalXP: newBalance,
    };
  } catch (error) {
    console.error('[XP Award Error]', error);
    throw error;
  }
}

/**
 * Mark module as completed and sync XP
 */
export async function completeModule(
  userId: string,
  moduleId: string,
  finalScore: number,
  xpReward: number
): Promise<void> {
  try {
    // Record module completion
    const { error: completionError } = await supabase
      .from('a3_completed_modules')
      .insert({
        user_id: userId,
        module_id: moduleId,
        score: finalScore,
        xp_earned: xpReward,
        completed_at: new Date().toISOString(),
      });

    if (completionError && completionError.code !== '23505') {
      // 23505 = unique constraint violation, which means already completed
      throw completionError;
    }

    // Award XP
    await awardModuleXP(userId, moduleId, xpReward);

    // Update user's overall progress
    const { data: currentProgress } = await supabase
      .from('a3_user_progress')
      .select('completed_modules, total_xp')
      .eq('user_id', userId)
      .single();

    const completedModules = currentProgress?.completed_modules || [];
    if (!completedModules.includes(moduleId)) {
      completedModules.push(moduleId);
    }

    await supabase
      .from('a3_user_progress')
      .upsert(
        {
          user_id: userId,
          completed_modules: completedModules,
          total_xp: currentProgress?.total_xp || 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
  } catch (error) {
    console.error('[Module Completion Error]', error);
    throw error;
  }
}

/**
 * Get user's current XP and level
 */
export async function getUserXPStatus(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const currentXP = data?.balance || 0;
    const lifetimeEarned = data?.lifetime_earned || 0;

    // Calculate level based on XP (rough scale)
    const level = Math.floor(currentXP / 500) + 1;

    return {
      currentXP,
      lifetimeEarned,
      level,
      nextLevelXP: level * 500,
    };
  } catch (error) {
    console.error('[Get XP Status Error]', error);
    throw error;
  }
}

/**
 * Get user's module progress
 */
export async function getUserModuleProgress(
  userId: string,
  moduleId: string
) {
  try {
    const { data, error } = await supabase
      .from('a3_module_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Not found, return default
      return {
        status: 'not_started',
        score: 0,
        attempts: 0,
      };
    }

    if (error) {
      throw error;
    }

    return {
      status: data?.status,
      score: data?.final_score,
      attempts: data?.attempts,
      startedAt: data?.started_at,
      completedAt: data?.completed_at,
    };
  } catch (error) {
    console.error('[Get Module Progress Error]', error);
    throw error;
  }
}

/**
 * Update module progress
 */
export async function updateModuleProgress(
  userId: string,
  moduleId: string,
  status: 'not_started' | 'in_progress' | 'completed' | 'failed',
  currentSection?: string,
  sectionScores?: Record<string, number>
): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from('a3_module_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single();

    const updates = {
      user_id: userId,
      module_id: moduleId,
      status,
      current_section_id: currentSection,
      section_scores: sectionScores || existing?.section_scores || {},
      updated_at: new Date().toISOString(),
    };

    if (!existing) {
      await supabase.from('a3_module_progress').insert({
        ...updates,
        attempts: 1,
        started_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from('a3_module_progress')
        .update({
          ...updates,
          attempts: (existing?.attempts || 0) + (status === 'failed' ? 1 : 0),
        })
        .eq('id', existing.id);
    }
  } catch (error) {
    console.error('[Update Module Progress Error]', error);
    throw error;
  }
}

/**
 * Get user's overall Pillar 3 dashboard stats
 */
export async function getUserPillar3Stats(userId: string) {
  try {
    const [
      { data: xpData },
      { data: progressData },
      { count: completedCount },
    ] = await Promise.all([
      supabase
        .from('user_dtc_balance')
        .select('balance, lifetime_earned')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('a3_user_progress')
        .select('completed_modules, total_xp')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('a3_completed_modules')
        .select('count', { count: 'exact' })
        .eq('user_id', userId),
    ]);

    const currentXP = xpData?.balance || 0;
    const completedModules = progressData?.completed_modules || [];
    const modulesCompleted = completedCount || 0;

    return {
      currentXP,
      lifetimeXP: xpData?.lifetime_earned || 0,
      modulesCompleted,
      totalModules: 10,
      completionPercentage: (modulesCompleted / 10) * 100,
      completedModuleIds: completedModules,
    };
  } catch (error) {
    console.error('[Get Pillar 3 Stats Error]', error);
    return {
      currentXP: 0,
      lifetimeXP: 0,
      modulesCompleted: 0,
      totalModules: 10,
      completionPercentage: 0,
      completedModuleIds: [],
    };
  }
}
