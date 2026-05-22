import { INTERVIEWER_AGENTS } from './interviewer-agents'

/**
 * Avatar Integration with A2-Routes Curriculum
 * Maps the 6 coaches from A3 to recommended practice moments in the 90-day journey
 * 
 * Coaches are the actual A3 interviewers:
 * - Sofia: Reclutadora Senior
 * - Marco: Manager Senior de Ingeniería
 * - Elena: VP Talent & Culture
 * - David: Tech Lead & Architect
 * - Alex: Product Manager
 * - Jordan: CEO Advisor & Consultant
 */

interface AvatarRecommendation {
  avatarId: string
  day: number
  purpose: string
  difficulty: 'basico' | 'intermedio' | 'avanzado'
}

// Mapping of 6 coaches from A3 to their curriculum integration points
export const AVATAR_CURRICULUM_MAP: AvatarRecommendation[] = [
  // MES 1: FOUNDATION - Sofia (Reclutadora Senior) - Build confidence
  { avatarId: 'interviewer-classic-1', day: 15, purpose: 'Primera entrevista simulada - confianza básica', difficulty: 'basico' },
  { avatarId: 'interviewer-classic-1', day: 20, purpose: 'Segunda ronda con Sofia - refuerzo de comunicación', difficulty: 'basico' },

  // MES 2: ACCELERATION - Multiple coaches, increasing difficulty
  // Marco (Tech Lead) - Technical foundation
  { avatarId: 'interviewer-classic-2', day: 31, purpose: 'Profundizar habilidad - evaluación técnica Marco', difficulty: 'intermedio' },
  { avatarId: 'interviewer-classic-2', day: 35, purpose: 'Proyecto complejo - evaluación técnica profunda', difficulty: 'intermedio' },
  
  // Elena (VP) - Leadership angle
  { avatarId: 'interviewer-classic-3', day: 42, purpose: 'Participación en comunidad - perspectiva estratégica Elena', difficulty: 'intermedio' },
  { avatarId: 'interviewer-classic-3', day: 48, purpose: 'Buscar oportunidades - pensamiento de VP', difficulty: 'intermedio' },
  
  // David (Tech Lead & Mentor) - Balance technical with mentorship
  { avatarId: 'interviewer-classic-4', day: 52, purpose: 'Evaluación de gaps - retroalimentación de David', difficulty: 'intermedio' },
  { avatarId: 'interviewer-classic-4', day: 55, purpose: 'Hito 55 días - checkpoint y mentoría técnica', difficulty: 'intermedio' },
  
  // MES 3: MASTERY - Two advanced coaches
  // Alex (Product Manager) - Cross-functional skills
  { avatarId: 'interviewer-modern-1', day: 60, purpose: 'Mes 2 completo - perspectiva de producto Alex', difficulty: 'avanzado' },
  { avatarId: 'interviewer-modern-1', day: 70, purpose: 'Especialización - pensamiento de producto', difficulty: 'avanzado' },
  
  // Jordan (CEO Advisor) - Advanced coaching and leadership mastery
  { avatarId: 'interviewer-modern-2', day: 75, purpose: 'Posicionamiento experto - coaching ejecutivo Jordan', difficulty: 'avanzado' },
  { avatarId: 'interviewer-modern-2', day: 82, purpose: 'Pre-final - sesión de coaching avanzada', difficulty: 'avanzado' },
  { avatarId: 'interviewer-modern-2', day: 90, purpose: 'Hito 90 días - reflexión final con mentor', difficulty: 'avanzado' }
]

/**
 * Get recommended avatars/coaches for a specific day
 * Returns list of coach IDs recommended for that curriculum day
 */
export function getRecommendedAvatars(day: number): string[] {
  return AVATAR_CURRICULUM_MAP
    .filter(rec => rec.day === day)
    .map(rec => rec.avatarId)
}

/**
 * Get coach config merged with curriculum context
 * Uses the actual INTERVIEWER_AGENTS from A3
 */
export function getAvatarConfig(avatarId: string) {
  const agent = INTERVIEWER_AGENTS[avatarId as keyof typeof INTERVIEWER_AGENTS]
  if (!agent) return null

  const curriculumContext = AVATAR_CURRICULUM_MAP.filter(rec => rec.avatarId === avatarId)

  return {
    ...agent,
    curriculumIntegration: curriculumContext,
    videoConfig: {
      greeting: `/videos/avatars/${avatarId}/greeting.mp4`,
      thinking: `/videos/avatars/${avatarId}/thinking.mp4`,
      farewell: `/videos/avatars/${avatarId}/farewell.mp4`
    }
  }
}

/**
 * Get all coach configs with their curriculum mapping
 */
export function getAllAvatarConfigs() {
  const uniqueIds = [...new Set(AVATAR_CURRICULUM_MAP.map(rec => rec.avatarId))]
  return uniqueIds.map(id => getAvatarConfig(id)).filter(Boolean)
}

/**
 * Coach/Avatar IDs used in A3:
 * - 'interviewer-classic-1': Sofia - Reclutadora Senior
 * - 'interviewer-classic-2': Marco - Manager Senior de Ingeniería
 * - 'interviewer-classic-3': Elena - VP Talent & Culture
 * - 'interviewer-classic-4': David - Tech Lead & Architect
 * - 'interviewer-modern-1': Alex - Product Manager
 * - 'interviewer-modern-2': Jordan - CEO Advisor & Consultant
 */
