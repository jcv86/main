/**
 * CV Parser - Extracts structured data from CV text
 * Identifies sections, skills, experience, education, contact info
 */

interface CVSection {
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'unknown'
  content: string[]
  confidence: number
}

export interface ParsedCV {
  rawText: string
  sections: CVSection[]
  extractedSkills: string[]
  extractedExperience: {
    title: string
    company: string
    duration: string
    description: string[]
  }[]
  extractedEducation: {
    degree: string
    institution: string
    year: string
  }[]
  contactInfo: {
    email?: string
    phone?: string
    linkedin?: string
  }
  atsReadability: {
    hasContactInfo: boolean
    hasStrongSummary: boolean
    hasClearSections: boolean
    usesBulletPoints: boolean
    hasMetrics: boolean
    hasActionVerbs: boolean
  }
}

const SECTION_HEADERS = {
  experience: ['experiencia', 'experience', 'trabajo', 'employment', 'historial laboral'],
  education: ['educación', 'education', 'estudio', 'formación', 'estudios'],
  skills: ['habilidades', 'skills', 'competencias', 'competences', 'conocimientos'],
  certifications: ['certificaciones', 'certifications', 'certificados', 'cursos'],
  summary: ['perfil', 'resumen', 'summary', 'objective', 'acerca de', 'about me']
}

const ACTION_VERBS = [
  'Developed', 'Designed', 'Implemented', 'Led', 'Managed', 'Created', 
  'Built', 'Launched', 'Improved', 'Reduced', 'Increased', 'Optimized',
  'Coordinated', 'Directed', 'Established', 'Achieved', 'Drove', 'Transformed'
]

const TECH_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'SQL',
  'Docker', 'AWS', 'GCP', 'Azure', 'MongoDB', 'PostgreSQL', 'Redis',
  'Go', 'Rust', 'Java', 'C++', 'C#', '.NET', 'PHP', 'Ruby',
  'Vue', 'Angular', 'Next.js', 'Django', 'Flask', 'Spring', 'Express'
]

export function parseCV(text: string): ParsedCV {
  const cleanText = text.trim()
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l)

  // Extract contact info
  const contactInfo = extractContactInfo(cleanText)

  // Split into sections
  const sections = identifySections(lines)

  // Extract structured data
  const skills = extractSkills(sections, cleanText)
  const experience = extractExperience(sections)
  const education = extractEducation(sections)

  // Calculate ATS readability metrics
  const atsReadability = calculateATSReadability(cleanText, lines, skills, experience)

  return {
    rawText: cleanText,
    sections,
    extractedSkills: skills,
    extractedExperience: experience,
    extractedEducation: education,
    contactInfo,
    atsReadability
  }
}

function extractContactInfo(text: string): ParsedCV['contactInfo'] {
  const info: ParsedCV['contactInfo'] = {}

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i)
  if (emailMatch) info.email = emailMatch[0]

  // Phone
  const phoneMatch = text.match(/(\+?[0-9]{1,3}[-.\s]?)?[0-9]{2,4}[-.\s]?[0-9]{2,4}[-.\s]?[0-9]{2,4}/)
  if (phoneMatch) info.phone = phoneMatch[0]

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/i)
  if (linkedinMatch) info.linkedin = linkedinMatch[0]

  return info
}

function identifySections(lines: string[]): CVSection[] {
  const sections: CVSection[] = []
  let currentSection: CVSection | null = null

  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    let isHeader = false

    // Check if line is a section header
    for (const [sectionType, headers] of Object.entries(SECTION_HEADERS)) {
      if (headers.some(h => lowerLine.includes(h))) {
        if (currentSection) sections.push(currentSection)
        currentSection = {
          type: sectionType as CVSection['type'],
          content: [],
          confidence: 0.95
        }
        isHeader = true
        break
      }
    }

    // Add to current section
    if (!isHeader && currentSection) {
      currentSection.content.push(line)
    } else if (!isHeader && !currentSection) {
      if (!sections.find(s => s.type === 'summary')) {
        if (!currentSection || currentSection.type !== 'summary') {
          currentSection = {
            type: 'summary',
            content: [line],
            confidence: 0.7
          }
        }
      }
    }
  }

  if (currentSection) sections.push(currentSection)

  return sections
}

function extractSkills(sections: CVSection[], text: string): string[] {
  const skills = new Set<string>()

  // From dedicated skills section
  const skillsSection = sections.find(s => s.type === 'skills')
  if (skillsSection) {
    const content = skillsSection.content.join(' ')
    TECH_SKILLS.forEach(skill => {
      if (content.toLowerCase().includes(skill.toLowerCase())) {
        skills.add(skill)
      }
    })

    // Split by common delimiters
    const tokens = content.split(/[,;•\n|]/).map(t => t.trim()).filter(t => t.length > 2 && t.length < 50)
    tokens.forEach(token => {
      if (token.length > 3 && !token.includes('•')) skills.add(token)
    })
  }

  // Find tech skills in full text
  TECH_SKILLS.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      skills.add(skill)
    }
  })

  return Array.from(skills)
}

function extractExperience(sections: CVSection[]): ParsedCV['extractedExperience'] {
  const expSection = sections.find(s => s.type === 'experience')
  if (!expSection) return []

  const experiences: ParsedCV['extractedExperience'] = []
  let current: ParsedCV['extractedExperience'][0] | null = null

  for (const line of expSection.content) {
    // Look for job title (usually all caps or after company name)
    if (line.includes('-') || line.includes('|')) {
      if (current) experiences.push(current)

      const parts = line.split(/[-|]/)
      current = {
        title: parts[0].trim(),
        company: parts[1]?.trim() || '',
        duration: parts[2]?.trim() || '',
        description: []
      }
    } else if (current && line.trim()) {
      current.description.push(line)
    }
  }

  if (current) experiences.push(current)
  return experiences
}

function extractEducation(sections: CVSection[]): ParsedCV['extractedEducation'] {
  const eduSection = sections.find(s => s.type === 'education')
  if (!eduSection) return []

  return eduSection.content.map(line => {
    const parts = line.split(/[-|,]/).map(p => p.trim())
    return {
      degree: parts[0] || '',
      institution: parts[1] || '',
      year: parts[2] || ''
    }
  })
}

function calculateATSReadability(text: string, lines: string[], skills: string[], experience: any[]): ParsedCV['atsReadability'] {
  return {
    hasContactInfo: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text),
    hasStrongSummary: lines.length > 5 && text.length > 200,
    hasClearSections: (text.toLowerCase().match(/(experiencia|education|skills)/gi)?.length || 0) >= 2,
    usesBulletPoints: text.includes('•') || (text.includes('-') && lines.filter(l => l.startsWith('-')).length > 5),
    hasMetrics: /\d+\%|\d+\+|increased|improved|reduced|achieved/i.test(text),
    hasActionVerbs: ACTION_VERBS.some(verb => text.includes(verb))
  }
}
