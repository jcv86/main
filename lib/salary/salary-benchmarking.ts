/**
 * Salary Benchmarking Engine
 * Calculates estimated salary ranges based on:
 * - Industry base salary
 * - Experience level multiplier
 * - Tech stack premium
 * - Location multiplier
 * - Job urgency
 */

export interface SalaryEstimate {
  min: number
  max: number
  currency: string
  median: number
  breakdown: {
    base: number
    experienceMultiplier: number
    skillPremium: number
    locationMultiplier: number
    urgencyMultiplier: number
  }
  confidence: number
  source: string
}

// Industry base salaries (USD annual, LATAM average)
const INDUSTRY_BASE_SALARY: Record<string, number> = {
  'Tech': 65000,
  'Finance': 70000,
  'E-commerce': 60000,
  'Healthcare': 55000,
  'Retail': 50000,
  'Consulting': 65000,
  'Education': 45000,
  'Manufacturing': 52000,
  'Telecom': 60000,
  'Energy': 65000,
  'Media': 55000,
  'Travel': 48000,
  'Real Estate': 55000,
  'Legal': 68000,
  'Pharma': 72000,
  'AI/ML': 80000,
  'Cloud': 75000,
  'Security': 78000,
  'Data': 70000,
  'Startup': 58000,
}

// Tech skill premiums (% increase from base)
const SKILL_PREMIUM: Record<string, number> = {
  // Languages
  'Python': 10,
  'Javascript': 8,
  'Go': 15,
  'Rust': 18,
  'Cpp': 12,
  'Java': 10,
  'Csharp': 11,
  'Kotlin': 12,
  'Swift': 13,
  'Ruby': 8,
  'Php': 5,
  'Elixir': 14,
  
  // Frameworks
  'React': 12,
  'Vue': 8,
  'Angular': 10,
  'Django': 10,
  'Rails': 9,
  'Spring': 11,
  'Fastapi': 12,
  'Nodejs': 11,
  'Express': 10,
  'Net': 11,
  
  // Infrastructure
  'Docker': 15,
  'Kubernetes': 18,
  'Aws': 16,
  'Gcp': 16,
  'Azure': 15,
  'Terraform': 14,
  'Cicd': 12,
  
  // Databases
  'Postgresql': 10,
  'Mongodb': 9,
  'Graphql': 14,
  'Redis': 12,
  'Elasticsearch': 13,
  
  // ML/Data
  'Tensorflow': 20,
  'Pytorch': 20,
  'Spark': 18,
  'Datascience': 15,
  'Machinelearning': 18,
  'Ai': 22,
  
  // Security
  'Cybersecurity': 22,
  'Blockchain': 25,
  'Web3': 24,
}

// Location multipliers (relative to LATAM average = 1.0)
const LOCATION_MULTIPLIER: Record<string, number> = {
  'Santiago, Chile': 1.0,
  'Remote, Chile': 1.05,
  'Remote, LATAM': 1.1,
  'Buenos Aires, Argentina': 0.95,
  'São Paulo, Brazil': 1.0,
  'Mexico City, Mexico': 0.98,
  'Bogotá, Colombia': 0.85,
  'Lima, Peru': 0.88,
  'Caracas, Venezuela': 0.7,
  'Remote, US': 1.5,
  'Remote, EU': 1.3,
  'US': 1.6,
  'Canada': 1.4,
  'EU': 1.4,
  'UK': 1.35,
}

// Experience level multipliers
const EXPERIENCE_MULTIPLIER: Record<number, number> = {
  0: 0.7,
  1: 0.85,
  2: 0.95,
  3: 1.0,
  4: 1.15,
  5: 1.3,
  6: 1.45,
  7: 1.6,
  8: 1.75,
  9: 1.85,
  10: 2.0,
  15: 2.3,
  20: 2.6,
}

// Urgency multipliers
const URGENCY_MULTIPLIER: Record<string, number> = {
  'critical': 1.2,
  'high': 1.1,
  'medium': 1.0,
  'low': 0.95,
}

export function estimateSalary(params: {
  industry: string
  experienceYears: number
  skills: string[]
  location: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
  currency?: string
}): SalaryEstimate {
  const {
    industry,
    experienceYears,
    skills,
    location,
    urgency,
    currency = 'USD',
  } = params

  const baseIndustry = industry || 'Tech'
  const base = INDUSTRY_BASE_SALARY[baseIndustry] || INDUSTRY_BASE_SALARY['Tech']

  let expMult = EXPERIENCE_MULTIPLIER[experienceYears]
  if (!expMult) {
    const below = Math.floor(experienceYears)
    const above = Math.ceil(experienceYears)
    const belowMult = EXPERIENCE_MULTIPLIER[below] || 2.0
    const aboveMult = EXPERIENCE_MULTIPLIER[above] || 2.6
    const ratio = experienceYears - below
    expMult = belowMult + (aboveMult - belowMult) * ratio
  }

  let skillPremium = 0
  if (skills.length > 0) {
    const skillPremiums = skills
      .map(skill => {
        const normalized = skill
          .toLowerCase()
          .replace(/[.\s\-_+#]/g, '')
        return SKILL_PREMIUM[normalized] || 0
      })
      .filter(p => p > 0)
    
    if (skillPremiums.length > 0) {
      skillPremium = skillPremiums.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, skillPremiums.length)
    }
  }

  const skillMultiplier = 1 + (skillPremium / 100)

  const locMult = LOCATION_MULTIPLIER[location] || 1.0
  const urgencyMult = URGENCY_MULTIPLIER[urgency] || 1.0

  const calculatedSalary = base * expMult * skillMultiplier * locMult * urgencyMult

  const min = Math.round(calculatedSalary * 0.85)
  const max = Math.round(calculatedSalary * 1.15)
  const median = Math.round(calculatedSalary)

  let confidence = 70
  if (skills.length >= 3) confidence += 15
  if (Object.keys(INDUSTRY_BASE_SALARY).includes(industry)) confidence += 10
  if (Object.keys(LOCATION_MULTIPLIER).includes(location)) confidence += 5
  confidence = Math.min(95, confidence)

  return {
    min,
    max,
    median,
    currency,
    breakdown: {
      base,
      experienceMultiplier: expMult,
      skillPremium,
      locationMultiplier: locMult,
      urgencyMultiplier: urgencyMult,
    },
    confidence,
    source: 'Heuristic Estimate (LATAM Market)',
  }
}

export function compareSalaryRanges(
  jobMin: number,
  jobMax: number,
  estimatedSalary: number
): {
  match: 'good' | 'excellent' | 'low' | 'high'
  isWithinRange: boolean
  adjustment: number
  recommendation: string
} {
  const jobMidpoint = (jobMin + jobMax) / 2
  const difference = estimatedSalary - jobMidpoint
  const percentDifference = (difference / jobMidpoint) * 100

  let match: 'good' | 'excellent' | 'low' | 'high'
  let recommendation: string

  if (estimatedSalary >= jobMin && estimatedSalary <= jobMax) {
    match = percentDifference < 5 ? 'excellent' : 'good'
    recommendation = 'Your estimated salary aligns well with this job posting'
  } else if (estimatedSalary < jobMin) {
    match = 'low'
    recommendation = `Consider negotiating - job typically pays $${Math.round(jobMin - estimatedSalary)}/year more`
  } else {
    match = 'high'
    recommendation = `This role typically pays less than your estimate - factor in other benefits`
  }

  return {
    match,
    isWithinRange: estimatedSalary >= jobMin && estimatedSalary <= jobMax,
    adjustment: percentDifference,
    recommendation,
  }
}
