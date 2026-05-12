// API endpoint to complete module and sync XP
import { NextRequest, NextResponse } from 'next/server';
import { completeModule } from '@/lib/a3-modules/xp-system';
import { getModuleById } from '@/lib/a3-modules/module-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, moduleId, finalScore } = body;

    if (!userId || !moduleId || finalScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate module exists and get XP reward
    const module = getModuleById(moduleId);
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Check if score meets passing threshold
    if (finalScore < module.passingScore) {
      return NextResponse.json(
        { error: 'Score below passing threshold', passingScore: module.passingScore },
        { status: 400 }
      );
    }

    // Complete module and award XP
    await completeModule(userId, moduleId, finalScore, module.xp);

    return NextResponse.json({
      success: true,
      xpAwarded: module.xp,
      message: `Module completed! You earned ${module.xp} XP.`,
    });
  } catch (error) {
    console.error('Module completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete module' },
      { status: 500 }
    );
  }
}
