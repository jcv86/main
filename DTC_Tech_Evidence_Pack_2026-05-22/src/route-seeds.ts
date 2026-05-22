/**
 * Travis Dev Mode Seeding Functions
 * Generates realistic seeded data for C1, A1, C2, A2, A3 context
 * Used when accessing pages without completing prerequisites
 */

import type {
  C1ProfessionalIdentity,
  A1CommunicationProfile,
  C2EvidenceVault,
  A2RouteState,
  A3RouteState,
  UserRouteState,
} from './route-state.types'
import { initializeA2Route, initializeA3Route, completeA2Day, completeA3Module } from './route-engine'

// ═══════════════════════════════════════════════════════════════════════════
// C1: PROFESSIONAL IDENTITY
// ═══════════════════════════════════════════════════════════════════════════

export function seedTravisC1(): C1ProfessionalIdentity {
  return {
    userId: 'demo-travis',
    targetRole: 'Product Manager',
    targetIndustry: 'SaaS / Technology',
    yearsExperience: 5,
    keyStrengths: [
      'Product Strategy',
      'Data Analysis',
      'Cross-functional Leadership',
      'User Research',
      'Agile Methodology',
    ],
    uniqueValue:
      'I combine deep product intuition with data-driven decision making to deliver products that users love. My background in both tech and design gives me a unique perspective on building scalable solutions.',
    workStyle: 'collaborative',
    preferredEnvironment: ['Remote-First', 'Early Stage Startup', 'Tech-Forward Culture'],
    careerGoal: 'Lead product strategy at a Series B/C SaaS company focused on developer tools or business productivity',
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// A1: COMMUNICATION PROFILE
// ═══════════════════════════════════════════════════════════════════════════

export function seedTravisA1(): A1CommunicationProfile {
  return {
    userId: 'demo-travis',
    communicationStyle: 'collaborative',
    responseTime: 'thoughtful',
    preferredMedium: 'mixed',
    strengthAreas: [
      'Clear written communication',
      'Public speaking to technical audiences',
      'Stakeholder management',
      'Async documentation',
    ],
    improvementAreas: [
      'Reducing meeting time',
      'Faster decision-making in ambiguous situations',
    ],
    stressResponse: 'I become more structured and data-focused; I like to break problems into components and tackle systematically.',
    motivationFactors: [
      'Building products that solve real problems',
      'Learning from smart people',
      'Ownership and autonomy',
      'Visible impact on users',
    ],
    workPreferences: {
      remoteFirst: true,
      flexibleSchedule: true,
      asyncPreferred: true,
      collaborationStyle: 'structured async + focused sync',
      feedbackFrequency: 'bi-weekly 1:1s',
    },
    completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// C2: EVIDENCE VAULT
// ═══════════════════════════════════════════════════════════════════════════

export function seedTravisC2(): C2EvidenceVault {
  return {
    userId: 'demo-travis',
    achievements: [
      {
        id: 'ach-1',
        title: 'Led product roadmap reorg that increased feature velocity by 45%',
        context: 'At TechCorp, the product team was overwhelmed with competing priorities and slow delivery cycles.',
        action:
          'I conducted user research with 30+ customers, built a prioritization framework, and proposed a new roadmap structure based on OKRs. I trained the team on the new process and established weekly retrospectives.',
        result:
          'Feature delivery velocity increased by 45% within 2 quarters. Customer satisfaction scores jumped from 7.2 to 8.4. Team morale improved significantly.',
        skills: ['Strategic Planning', 'Team Leadership', 'Roadmapping', 'OKRs', 'Customer Research'],
        quantifiedMetric: '45% velocity increase, 8.4/10 CSAT',
        industry: 'SaaS',
        role: 'Senior Product Manager',
      },
      {
        id: 'ach-2',
        title: 'Launched first mobile app reaching 50k downloads in 6 weeks',
        context:
          'The company wanted to expand to mobile but had no experience in that space. Timeline was aggressive due to market opportunity.',
        action:
          'I researched mobile product patterns, owned the go-to-market strategy, and coordinated eng+design. I built a phased rollout plan with beta testing to mitigate risk.',
        result:
          'Launched successfully with 50k downloads in 6 weeks, 4.7-star rating, and became top revenue driver for mobile channel.',
        skills: ['GTM Strategy', 'Project Management', 'Mobile Product', 'Cross-functional Coordination'],
        quantifiedMetric: '50k downloads, 4.7⭐ rating',
        industry: 'SaaS',
        role: 'Product Manager',
      },
      {
        id: 'ach-3',
        title: 'Built data analytics dashboard used by 500+ enterprise customers',
        context: 'Enterprise customers were struggling to understand their usage patterns and ROI.',
        action:
          'I designed a self-serve analytics dashboard by conducting extensive user interviews, created detailed wireframes, and iterated through 3 prototypes.',
        result: 'Deployed to 500+ customers, 78% adoption rate in first month, became key feature for retention.',
        skills: ['Data Product', 'UX Design', 'Enterprise Insights', 'Feature Design'],
        quantifiedMetric: '500+ customers, 78% adoption',
        industry: 'SaaS',
        role: 'Product Manager',
      },
    ],
    caseStudies: [
      {
        id: 'case-1',
        title: 'Reducing Churn Through Data-Driven Cohort Analysis',
        problemStatement:
          'Company was losing 8% MRR monthly churn, but we didn\'t understand which customer segments were most at risk.',
        yourRole: 'Product Manager leading analytics efforts',
        approach:
          'Built cohort analysis dashboard, identified that new customers without "aha moment" in week 2 had 60% 3-month churn rate. Redesigned onboarding to surface value faster.',
        results: 'Reduced churn from 8% to 5.2% MRR within 6 months, saving $400k ARR. Became template for future retention efforts.',
        skills: ['Data Analysis', 'Cohort Analysis', 'Retention Strategy', 'Product Design'],
        timeframe: '6 months',
      },
    ],
    testimonials: [
      {
        id: 'test-1',
        source: 'Sarah Chen',
        relationship: 'VP of Engineering, reported to Travis',
        quote:
          'Travis has exceptional strategic thinking. He takes time to deeply understand user problems before jumping to solutions. His ability to unblock engineering teams and communicate complex tradeoffs clearly makes him invaluable.',
        skillsHighlighted: ['Strategic Thinking', 'Communication', 'User Understanding', 'Leadership'],
      },
      {
        id: 'test-2',
        source: 'Michael Rodriguez',
        relationship: 'Customer Success Director, frequent collaborator',
        quote:
          'Working with Travis on customer success initiatives is seamless. He listens to customer feedback and translates it into product improvements. Customers specifically ask to talk to him during QBRs.',
        skillsHighlighted: ['Customer Focus', 'Collaboration', 'Communication'],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Reforge: Advanced Product Strategy',
        issuer: 'Reforge',
        date: '2023-06',
      },
      {
        id: 'cert-2',
        name: 'Google Analytics Certification',
        issuer: 'Google',
        date: '2022-09',
      },
    ],
    completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// A2: DAILY MISSION PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════

export function seedTravisA2UntilDay(targetDay: number): A2RouteState {
  let state = initializeA2Route('demo-travis')

  // Complete all days up to (but not including) target day
  for (let day = 1; day < targetDay; day++) {
    state = completeA2Day(state, day, 10) // 10 XP per day base
  }

  // Set target day as available
  if (state.days[targetDay]) {
    state.days[targetDay].status = 'available'
  }

  return state
}

export function seedTravisA2Full(): A2RouteState {
  return seedTravisA2UntilDay(91) // Complete all 90 days
}

// ═══════════════════════════════════════════════════════════════════════════
// A3: MODULE PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════

export function seedTravisA3UntilModule(targetModuleNumber: number): A3RouteState {
  let state = initializeA3Route('demo-travis')

  // Get checkpoint days in order
  const checkpointDays = [7, 16, 27, 35, 43, 51, 58, 68, 78, 88]

  // Complete all modules up to (but not including) target module
  for (let i = 1; i < targetModuleNumber; i++) {
    const checkpoint = Object.values(state.modules).find(m => m.moduleNumber === i)
    if (checkpoint) {
      state = completeA3Module(state, checkpoint.moduleId, 10 * i) // Increasing XP per module
    }
  }

  // Set target module as available
  const targetModule = Object.values(state.modules).find(m => m.moduleNumber === targetModuleNumber)
  if (targetModule) {
    targetModule.status = 'available'
    targetModule.unlocked = true
    targetModule.prerequisitesComplete = true
  }

  return state
}

export function seedTravisA3Full(): A3RouteState {
  return seedTravisA3UntilModule(11) // Complete all 10 modules
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE ROUTE STATE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

export function seedTravisCompleteRoute(targetDay?: number): UserRouteState {
  const a2State = targetDay ? seedTravisA2UntilDay(targetDay) : seedTravisA2Full()
  const a3State = seedTravisA3Full()

  const state: UserRouteState = {
    userId: 'demo-travis',
    mode: 'travis_dev',
    status: 'in_progress',
    lastUpdated: new Date(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago

    // Seed all 5 modules
    c1: seedTravisC1(),
    a1: seedTravisA1(),
    c2: seedTravisC2(),
    a2: a2State,
    a3: a3State,

    dataQuality: {
      c1Complete: true,
      a1Complete: true,
      c2Complete: true,
      a2Complete: targetDay ? false : true,
      a3Complete: true,
    },

    seededDataUsed: true,
    seededAt: new Date(),
    seededBy: 'travis_mode',
  }

  return state
}

export function seedTravisForDay(dayNumber: number): UserRouteState {
  // Determine how many A3 modules should be complete based on day
  let targetModule = 1
  const checkpointDays = [7, 16, 27, 35, 43, 51, 58, 68, 78, 88]

  for (const day of checkpointDays) {
    if (dayNumber >= day) {
      targetModule = checkpointDays.indexOf(day) + 2
    }
  }

  const a2State = seedTravisA2UntilDay(dayNumber)
  const a3State = seedTravisA3UntilModule(targetModule)

  const state: UserRouteState = {
    userId: 'demo-travis',
    mode: 'travis_dev',
    status: 'in_progress',
    lastUpdated: new Date(),
    createdAt: new Date(Date.now() - dayNumber * 24 * 60 * 60 * 1000),

    c1: seedTravisC1(),
    a1: seedTravisA1(),
    c2: seedTravisC2(),
    a2: a2State,
    a3: a3State,

    dataQuality: {
      c1Complete: true,
      a1Complete: true,
      c2Complete: true,
      a2Complete: dayNumber === 90,
      a3Complete: targetModule > 10,
    },

    seededDataUsed: true,
    seededAt: new Date(),
    seededBy: 'travis_mode',
  }

  return state
}
