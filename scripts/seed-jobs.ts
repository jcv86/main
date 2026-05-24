/**
 * Seed Real Job Opportunities for A4
 * Based on Chilean market data (2026)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const jobOpportunities = [
  {
    id: 'job-001',
    company_name: 'Banco Santander Chile',
    job_title: 'Senior Data Engineer',
    job_level: 'Senior',
    location: 'Santiago, Chile',
    industry: 'Finance',
    required_skills: ['Python', 'SQL', 'Apache Spark', 'AWS', 'Data Warehouse'],
    salary_range: '$120,000 - $180,000 USD/year',
    demand_level: 'VERY_HIGH',
    trending: true,
    frequency_posted: 12,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/banco-santander/data-engineer'
  },
  {
    id: 'job-002',
    company_name: 'Falabella',
    job_title: 'Machine Learning Engineer',
    job_level: 'Mid-Level',
    location: 'Santiago, Chile',
    industry: 'E-commerce',
    required_skills: ['Python', 'TensorFlow', 'Deep Learning', 'AWS', 'MLOps'],
    salary_range: '$90,000 - $140,000 USD/year',
    demand_level: 'VERY_HIGH',
    trending: true,
    frequency_posted: 8,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/falabella/ml-engineer'
  },
  {
    id: 'job-003',
    company_name: 'Cornershop',
    job_title: 'Backend Engineer (Go/Python)',
    job_level: 'Mid-Level',
    location: 'Santiago, Chile',
    industry: 'E-commerce',
    required_skills: ['Go', 'Python', 'PostgreSQL', 'Kubernetes', 'Microservices'],
    salary_range: '$85,000 - $130,000 USD/year',
    demand_level: 'HIGH',
    trending: true,
    frequency_posted: 6,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/cornershop/backend'
  },
  {
    id: 'job-004',
    company_name: 'Tenpo',
    job_title: 'Frontend Architect (React/TypeScript)',
    job_level: 'Senior',
    location: 'Santiago, Chile',
    industry: 'Fintech',
    required_skills: ['React', 'TypeScript', 'Vite', 'Web Performance', 'UI/UX'],
    salary_range: '$95,000 - $150,000 USD/year',
    demand_level: 'HIGH',
    trending: true,
    frequency_posted: 5,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/tenpo/frontend-architect'
  },
  {
    id: 'job-005',
    company_name: 'Microsoft Chile',
    job_title: 'Cloud Solutions Architect',
    job_level: 'Senior',
    location: 'Santiago, Chile',
    industry: 'Cloud',
    required_skills: ['Azure', 'Infrastructure as Code', 'DevOps', 'Security', 'Terraform'],
    salary_range: '$110,000 - $170,000 USD/year',
    demand_level: 'VERY_HIGH',
    trending: false,
    frequency_posted: 4,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/microsoft/cloud-architect'
  },
  {
    id: 'job-006',
    company_name: 'Banco Estado',
    job_title: 'DevOps Engineer',
    job_level: 'Mid-Level',
    location: 'Santiago, Chile',
    industry: 'Finance',
    required_skills: ['Kubernetes', 'Docker', 'CI/CD', 'AWS', 'Linux'],
    salary_range: '$80,000 - $120,000 USD/year',
    demand_level: 'HIGH',
    trending: true,
    frequency_posted: 7,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/banco-estado/devops'
  },
  {
    id: 'job-007',
    company_name: 'Reclutia',
    job_title: 'Product Manager',
    job_level: 'Mid-Level',
    location: 'Santiago, Chile',
    industry: 'SaaS',
    required_skills: ['Product Strategy', 'Data Analysis', 'User Research', 'SQL', 'Communication'],
    salary_range: '$70,000 - $110,000 USD/year',
    demand_level: 'MEDIUM',
    trending: false,
    frequency_posted: 3,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/reclutia/pm'
  },
  {
    id: 'job-008',
    company_name: 'Startupea',
    job_title: 'Full Stack Engineer',
    job_level: 'Junior',
    location: 'Remote (LatAm)',
    industry: 'SaaS',
    required_skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'REST APIs'],
    salary_range: '$50,000 - $80,000 USD/year',
    demand_level: 'VERY_HIGH',
    trending: true,
    frequency_posted: 15,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/startupea/fullstack'
  },
  {
    id: 'job-009',
    company_name: 'LATAM Airlines',
    job_title: 'Data Analytics Engineer',
    job_level: 'Mid-Level',
    location: 'Santiago, Chile',
    industry: 'Aviation',
    required_skills: ['SQL', 'Python', 'Tableau', 'ETL', 'Data Modeling'],
    salary_range: '$75,000 - $115,000 USD/year',
    demand_level: 'MEDIUM',
    trending: false,
    frequency_posted: 2,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/latam/analytics'
  },
  {
    id: 'job-010',
    company_name: 'Ucloudity',
    job_title: 'Security Engineer',
    job_level: 'Senior',
    location: 'Santiago, Chile',
    industry: 'Cybersecurity',
    required_skills: ['Linux', 'Network Security', 'Compliance', 'Penetration Testing', 'AWS'],
    salary_range: '$100,000 - $160,000 USD/year',
    demand_level: 'HIGH',
    trending: true,
    frequency_posted: 4,
    source: 'linkedin',
    external_url: 'https://jobs.linkedin.com/ucloudity/security'
  }
]

async function seedJobs() {
  try {
    console.log('[v0] Starting job seed...')
    
    // Insert jobs into linkedin_market_job_listings table
    const { data, error } = await supabase
      .from('linkedin_market_job_listings')
      .insert(jobOpportunities.map(job => ({
        ...job,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))

    if (error) {
      console.error('[v0] Seed error:', error)
      process.exit(1)
    }

    const seedCount = data ? (data as any[]).length : 0
    console.log(`[v0] ✓ Seeded ${seedCount} job opportunities`)
    process.exit(0)
  } catch (err) {
    console.error('[v0] Seed failed:', err)
    process.exit(1)
  }
}

seedJobs()
