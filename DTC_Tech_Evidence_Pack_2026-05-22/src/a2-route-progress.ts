'use client'

// A2 Route Progress - Separate from A3 XP tracking
// Tracks real-world metrics: applications, connections, interviews, offers

export interface A2ProgressMetrics {
  day: number
  phase: 'foundation' | 'acceleration' | 'mastery'
  tasksCompleted: number
  xpEarned: number
  applicationsSubmitted: number
  connectionsInitiated: number
  interviewsCompleted: number
  offersReceived: number
  averageResponseRate: number // percentage
  averageInterviewRate: number // percentage
}

export interface A2Milestone {
  day: 30 | 60 | 90
  title: string
  description: string
  expectedMetrics: {
    applicationsSubmitted: number
    connectionsInitiated: number
    interviewsCompleted: number
    offersReceived: number
    xpEarned: number
  }
  celebrationMessage: string
}

const A2_MILESTONES: Record<30 | 60 | 90, A2Milestone> = {
  30: {
    day: 30,
    title: '30-Day Foundation Complete',
    description: 'You\'ve established your foundation. CV optimized, LinkedIn updated, initial outreach started.',
    expectedMetrics: {
      applicationsSubmitted: 50,
      connectionsInitiated: 30,
      interviewsCompleted: 5,
      offersReceived: 0,
      xpEarned: 500
    },
    celebrationMessage: 'Felicidades! Completaste la fase Foundation. Tienes momentum - ahora acelera!'
  },
  60: {
    day: 60,
    title: '60-Day Acceleration Peak',
    description: 'You\'re in full acceleration. Multiple interview pipelines, deeper networking, skill gains visible.',
    expectedMetrics: {
      applicationsSubmitted: 120,
      connectionsInitiated: 75,
      interviewsCompleted: 20,
      offersReceived: 2,
      xpEarned: 1000
    },
    celebrationMessage: 'Excelente progreso! Estás en el pico de aceleración. Mantén el ritmo!'
  },
  90: {
    day: 90,
    title: '90-Day Mastery & Close',
    description: 'Negotiating offers, making final decision, ready to start new role.',
    expectedMetrics: {
      applicationsSubmitted: 180,
      connectionsInitiated: 120,
      interviewsCompleted: 35,
      offersReceived: 3,
      xpEarned: 1340
    },
    celebrationMessage: '¡Lo lograste! Completaste los 90 días. ¡Adelante con tu nuevo rol!'
  }
}

export function getA2RouteProgressMetrics(day: number): A2ProgressMetrics {
  let phase: 'foundation' | 'acceleration' | 'mastery'
  if (day <= 30) {
    phase = 'foundation'
  } else if (day <= 60) {
    phase = 'acceleration'
  } else {
    phase = 'mastery'
  }

  // Calculate expected metrics based on day
  const progressPercent = Math.min(day / 90, 1)
  
  return {
    day,
    phase,
    tasksCompleted: Math.round(progressPercent * 40),
    xpEarned: Math.round(progressPercent * 1340),
    applicationsSubmitted: Math.round(progressPercent * 180),
    connectionsInitiated: Math.round(progressPercent * 120),
    interviewsCompleted: Math.round(progressPercent * 35),
    offersReceived: progressPercent < 0.67 ? 0 : Math.round((progressPercent - 0.67) * 9),
    averageResponseRate: Math.min(10 + progressPercent * 15, 25), // 10% to 25%
    averageInterviewRate: Math.min(15 + progressPercent * 20, 35) // 15% to 35%
  }
}

export function getA2Milestone(day: 30 | 60 | 90): A2Milestone {
  return A2_MILESTONES[day]
}

export function calculateA2RouteProgress(userDay: number, userMetrics: {
  applicationsSubmitted: number
  connectionsInitiated: number
  interviewsCompleted: number
  offersReceived: number
}): {
  onTrack: boolean
  applicationsPacing: 'ahead' | 'on-track' | 'behind'
  interviewPacing: 'ahead' | 'on-track' | 'behind'
  offerPacing: 'ahead' | 'on-track' | 'behind'
  recommendedAction: string
} {
  const expected = getA2RouteProgressMetrics(userDay)
  
  const applicationDiff = userMetrics.applicationsSubmitted - expected.applicationsSubmitted
  const interviewDiff = userMetrics.interviewsCompleted - expected.interviewsCompleted
  const offerDiff = userMetrics.offersReceived - expected.offersReceived

  const applicationsPacing = applicationDiff > 5 ? 'ahead' : applicationDiff < -5 ? 'behind' : 'on-track'
  const interviewPacing = interviewDiff > 2 ? 'ahead' : interviewDiff < -2 ? 'behind' : 'on-track'
  const offerPacing = offerDiff > 0 ? 'ahead' : offerDiff < 0 ? 'behind' : 'on-track'

  const onTrack = applicationsPacing !== 'behind' && interviewPacing !== 'behind'

  let recommendedAction = 'Vas bien! Mantén el ritmo.'
  if (applicationsPacing === 'behind') {
    recommendedAction = 'Aumenta aplicaciones: Manda 5-10 hoy'
  } else if (interviewPacing === 'behind') {
    recommendedAction = 'Enfócate en entrevistas. Practica y prepárate mejor'
  } else if (offerPacing === 'behind' && userDay >= 60) {
    recommendedAction = 'Es tiempo de negociar y cerrar deals'
  }

  return {
    onTrack,
    applicationsPacing,
    interviewPacing,
    offerPacing,
    recommendedAction
  }
}

export const A2_PHASE_DESCRIPTIONS = {
  foundation: {
    emoji: '🏗️',
    title: 'Foundation Phase (Days 1-30)',
    description: 'Build your foundation. Optimize CV/LinkedIn, research market, start initial outreach.',
    color: 'from-blue-600 to-cyan-600',
    focus: ['Profile Optimization', 'Market Research', 'Initial Outreach', 'Networking Setup']
  },
  acceleration: {
    emoji: '⚡',
    title: 'Acceleration Phase (Days 31-60)',
    description: 'Scale your efforts. Increase applications, deepen interviews, build momentum.',
    color: 'from-orange-600 to-red-600',
    focus: ['Volume Increase', 'Interview Mastery', 'Deep Networking', 'Skill Showcase']
  },
  mastery: {
    emoji: '🎯',
    title: 'Mastery Phase (Days 61-90)',
    description: 'Close the deal. Negotiate offers, make final decision, prepare for start date.',
    color: 'from-green-600 to-emerald-600',
    focus: ['Offer Negotiation', 'Final Decision', 'Offer Comparison', 'Onboarding Prep']
  }
}
