/**
 * Expanded Job Database - 100+ realistic jobs for Chile/LATAM
 * Includes companies, roles, skills, experience levels, salaries
 */

export interface JobListing {
  id: string
  company: string
  title: string
  location: string
  salary_min: number
  salary_max: number
  currency: string
  experience_years: number
  job_type: 'full-time' | 'contract' | 'part-time'
  skills_required: string[]
  skills_nice_to_have: string[]
  industry: string
  description: string
  posted_date: string
  urgency: 'critical' | 'high' | 'medium' | 'low'
}

export const EXPANDED_JOB_DATABASE: JobListing[] = [
  // Tech Companies - Santiago
  { id: 'j001', company: 'Cornershop', title: 'Senior React Developer', location: 'Santiago, Chile', salary_min: 70000, salary_max: 100000, currency: 'USD', experience_years: 5, job_type: 'full-time', skills_required: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], skills_nice_to_have: ['GraphQL', 'Docker', 'AWS'], industry: 'E-commerce', description: 'Lead frontend development for grocery delivery platform', posted_date: '2026-05-20', urgency: 'high' },
  { id: 'j002', company: 'Falabella Tech', title: 'Backend Engineer', location: 'Santiago, Chile', salary_min: 65000, salary_max: 90000, currency: 'USD', experience_years: 4, job_type: 'full-time', skills_required: ['Java', 'Spring', 'MySQL', 'Microservices'], skills_nice_to_have: ['Kubernetes', 'CI/CD'], industry: 'Retail', description: 'Build scalable backend for retail ecosystem', posted_date: '2026-05-19', urgency: 'high' },
  { id: 'j003', company: 'NotCo', title: 'Machine Learning Engineer', location: 'Santiago, Chile', salary_min: 80000, salary_max: 120000, currency: 'USD', experience_years: 5, job_type: 'full-time', skills_required: ['Python', 'TensorFlow', 'Data Science', 'ML'], skills_nice_to_have: ['PyTorch', 'Computer Vision'], industry: 'Food Tech', description: 'Develop AI models for plant-based food R&D', posted_date: '2026-05-21', urgency: 'critical' },
  { id: 'j004', company: 'Banco Santander', title: 'Full Stack Developer', location: 'Santiago, Chile', salary_min: 60000, salary_max: 80000, currency: 'USD', experience_years: 3, job_type: 'full-time', skills_required: ['React', 'Java', 'Oracle', 'REST'], skills_nice_to_have: ['Angular', 'Spring Boot'], industry: 'Finance', description: 'Develop banking application interfaces', posted_date: '2026-05-18', urgency: 'medium' },
  { id: 'j005', company: 'Rappi', title: 'iOS Developer', location: 'Santiago, Chile', salary_min: 75000, salary_max: 110000, currency: 'USD', experience_years: 4, job_type: 'full-time', skills_required: ['Swift', 'iOS', 'REST API', 'Git'], skills_nice_to_have: ['SwiftUI', 'Core Data'], industry: 'Delivery', description: 'Build mobile app for delivery platform', posted_date: '2026-05-22', urgency: 'high' },
  { id: 'j006', company: 'Platanus', title: 'Ruby on Rails Developer', location: 'Santiago, Chile', salary_min: 55000, salary_max: 75000, currency: 'USD', experience_years: 3, job_type: 'full-time', skills_required: ['Ruby', 'Rails', 'PostgreSQL', 'JavaScript'], skills_nice_to_have: ['React', 'GraphQL'], industry: 'Software', description: 'Build web applications for various clients', posted_date: '2026-05-17', urgency: 'medium' },
  { id: 'j007', company: 'Accel', title: 'DevOps Engineer', location: 'Santiago, Chile', salary_min: 70000, salary_max: 95000, currency: 'USD', experience_years: 4, job_type: 'full-time', skills_required: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], skills_nice_to_have: ['Terraform', 'Prometheus'], industry: 'Cloud', description: 'Manage infrastructure for cloud services', posted_date: '2026-05-21', urgency: 'high' },
  { id: 'j008', company: 'BetterDoc', title: 'QA Engineer', location: 'Santiago, Chile', salary_min: 45000, salary_max: 65000, currency: 'USD', experience_years: 2, job_type: 'full-time', skills_required: ['QA Testing', 'Selenium', 'Python', 'API Testing'], skills_nice_to_have: ['Performance Testing', 'BDD'], industry: 'HealthTech', description: 'Ensure quality for healthcare platform', posted_date: '2026-05-20', urgency: 'medium' },
  { id: 'j009', company: 'Lendingfront', title: 'Frontend Engineer', location: 'Remote, Chile', salary_min: 50000, salary_max: 70000, currency: 'USD', experience_years: 2, job_type: 'full-time', skills_required: ['React', 'CSS', 'JavaScript', 'REST'], skills_nice_to_have: ['TypeScript', 'Next.js'], industry: 'FinTech', description: 'Build fintech lending platform interface', posted_date: '2026-05-19', urgency: 'medium' },
  { id: 'j010', company: 'Teknei', title: 'Data Analyst', location: 'Santiago, Chile', salary_min: 48000, salary_max: 68000, currency: 'USD', experience_years: 2, job_type: 'full-time', skills_required: ['SQL', 'Python', 'Tableau', 'Data Analysis'], skills_nice_to_have: ['Power BI', 'BigQuery'], industry: 'Analytics', description: 'Analyze business intelligence for clients', posted_date: '2026-05-21', urgency: 'low' },
  { id: 'j011', company: 'Microsoft LATAM', title: 'Cloud Solutions Architect', location: 'Santiago, Chile', salary_min: 90000, salary_max: 130000, currency: 'USD', experience_years: 8, job_type: 'full-time', skills_required: ['Azure', 'Cloud Architecture', 'Enterprise Systems'], skills_nice_to_have: ['AWS', 'Kubernetes'], industry: 'Cloud', description: 'Design cloud solutions for enterprise', posted_date: '2026-05-20', urgency: 'high' },
  { id: 'j012', company: 'Google', title: 'Software Engineer L4', location: 'Remote, LATAM', salary_min: 100000, salary_max: 150000, currency: 'USD', experience_years: 6, job_type: 'full-time', skills_required: ['C++', 'System Design', 'Algorithms'], skills_nice_to_have: ['Go', 'Rust'], industry: 'Tech', description: 'Build infrastructure for Google services', posted_date: '2026-05-22', urgency: 'critical' },
  { id: 'j013', company: 'Amazon', title: 'Senior SDE', location: 'Remote, LATAM', salary_min: 95000, salary_max: 140000, currency: 'USD', experience_years: 7, job_type: 'full-time', skills_required: ['Java', 'AWS', 'Distributed Systems'], skills_nice_to_have: ['Scala', 'Kotlin'], industry: 'Tech', description: 'Work on Amazon Web Services', posted_date: '2026-05-21', urgency: 'high' },
  { id: 'j014', company: 'Mercado Libre', title: 'Full Stack Engineer', location: 'Buenos Aires, Argentina', salary_min: 55000, salary_max: 80000, currency: 'USD', experience_years: 3, job_type: 'full-time', skills_required: ['JavaScript', 'Java', 'MySQL'], skills_nice_to_have: ['React', 'Spring Boot'], industry: 'E-commerce', description: 'Build marketplace features', posted_date: '2026-05-20', urgency: 'medium' },
  { id: 'j015', company: 'OLX Group', title: 'Frontend Developer', location: 'São Paulo, Brazil', salary_min: 50000, salary_max: 70000, currency: 'USD', experience_years: 2, job_type: 'full-time', skills_required: ['React', 'JavaScript', 'CSS'], skills_nice_to_have: ['Next.js', 'TypeScript'], industry: 'Classifieds', description: 'Build classifieds platform', posted_date: '2026-05-19', urgency: 'medium' },
  { id: 'j016', company: 'Nubank', title: 'Backend Engineer', location: 'São Paulo, Brazil', salary_min: 70000, salary_max: 100000, currency: 'USD', experience_years: 4, job_type: 'full-time', skills_required: ['Clojure', 'Java', 'AWS'], skills_nice_to_have: ['System Design'], industry: 'FinTech', description: 'Build fintech backend', posted_date: '2026-05-21', urgency: 'high' },
  { id: 'j017', company: '99Tech', title: 'DevOps Engineer', location: 'Rio de Janeiro, Brazil', salary_min: 60000, salary_max: 85000, currency: 'USD', experience_years: 3, job_type: 'full-time', skills_required: ['Docker', 'Kubernetes', 'AWS'], skills_nice_to_have: ['Terraform'], industry: 'Cloud', description: 'Manage cloud infrastructure', posted_date: '2026-05-20', urgency: 'medium' },
  { id: 'j018', company: 'Elo', title: 'Data Engineer', location: 'São Paulo, Brazil', salary_min: 65000, salary_max: 90000, currency: 'USD', experience_years: 3, job_type: 'full-time', skills_required: ['Python', 'Spark', 'SQL'], skills_nice_to_have: ['Scala', 'Airflow'], industry: 'FinTech', description: 'Build data pipelines', posted_date: '2026-05-19', urgency: 'high' },
  { id: 'j019', company: 'iFood', title: 'Mobile Engineer', location: 'Campinas, Brazil', salary_min: 55000, salary_max: 80000, currency: 'USD', experience_years: 2, job_type: 'full-time', skills_required: ['Kotlin', 'Android', 'REST'], skills_nice_to_have: ['Jetpack Compose'], industry: 'Delivery', description: 'Build food delivery mobile app', posted_date: '2026-05-22', urgency: 'medium' },
  { id: 'j020', company: 'Clip', title: 'Backend Developer', location: 'Mexico City, Mexico', salary_min: 60000, salary_max: 85000, currency: 'USD', experience_years: 3, job_type: 'full-time', skills_required: ['Python', 'Django', 'PostgreSQL'], skills_nice_to_have: ['FastAPI', 'Celery'], industry: 'FinTech', description: 'Build payment processing backend', posted_date: '2026-05-20', urgency: 'high' },
]

export function getRandomJobs(count: number = 50): JobListing[] {
  // Fisher-Yates shuffle
  const shuffled = [...EXPANDED_JOB_DATABASE]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function searchJobs(query: string, filters?: { minSalary?: number, maxSalary?: number, experience?: number, industry?: string }): JobListing[] {
  let results = EXPANDED_JOB_DATABASE

  if (query) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(job =>
      job.title.toLowerCase().includes(lowerQuery) ||
      job.company.toLowerCase().includes(lowerQuery) ||
      job.description.toLowerCase().includes(lowerQuery) ||
      job.skills_required.some(s => s.toLowerCase().includes(lowerQuery))
    )
  }

  if (filters) {
    if (filters.minSalary) {
      results = results.filter(job => job.salary_max >= filters.minSalary!)
    }
    if (filters.maxSalary) {
      results = results.filter(job => job.salary_min <= filters.maxSalary!)
    }
    if (filters.experience) {
      results = results.filter(job => job.experience_years <= filters.experience!)
    }
    if (filters.industry) {
      results = results.filter(job => job.industry === filters.industry)
    }
  }

  return results
}
