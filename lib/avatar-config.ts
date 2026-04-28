// Avatar Configuration for DTC Interview System
// Maps the 6 avatars with their characteristics, videos, and A2-Routes touchpoints

export const AVATAR_CONFIG = {
  'sofia-navarro': {
    name: 'Sofía Navarro',
    role: 'Orientadora Profesional',
    bio: 'Especialista en orientación de carrera con 10+ años de experiencia',
    tone: 'Empática, constructiva, motivadora',
    difficulty: 1,
    specialization: 'Fundamentos y confianza',
    videos: {
      greeting: '/videos/avatars/sofia-greeting.mp4',
      thinking: '/videos/avatars/sofia-thinking.mp4',
      farewell: '/videos/avatars/sofia-farewell.mp4'
    },
    recommendedDays: [15, 20],
    image: '/images/interviewers/sofia-navarro.jpg',
    color: '#4F46E5'
  },
  'andres-rojas': {
    name: 'Andrés Rojas',
    role: 'Reclutador Técnico',
    bio: 'Reclutador de tech companies, enfocado en skills y cultura',
    tone: 'Profesional, directo, pragmático',
    difficulty: 2,
    specialization: 'Habilidades técnicas y cultura',
    videos: {
      greeting: '/videos/avatars/andres-greeting.mp4',
      thinking: '/videos/avatars/andres-thinking.mp4',
      farewell: '/videos/avatars/andres-farewell.mp4'
    },
    recommendedDays: [31, 35, 42],
    image: '/images/interviewers/andres-rojas.jpg',
    color: '#06B6D4'
  },
  'valentina-muñoz': {
    name: 'Valentina Muñoz',
    role: 'Jefa de Equipo',
    bio: 'Líder de equipo con experiencia en scaling y liderazgo',
    tone: 'Exigente, pero justa, orientada a resultados',
    difficulty: 3,
    specialization: 'Liderazgo y gestión de equipos',
    videos: {
      greeting: '/videos/avatars/valentina-greeting.mp4',
      thinking: '/videos/avatars/valentina-thinking.mp4',
      farewell: '/videos/avatars/valentina-farewell.mp4'
    },
    recommendedDays: [42, 48, 52],
    image: '/images/interviewers/valentina-muñoz.jpg',
    color: '#EC4899'
  },
  'mateo-silva': {
    name: 'Mateo Silva',
    role: 'Co-founder Startup',
    bio: 'Emprendedor de startup tech, busca personas versátiles',
    tone: 'Rápido, informal, orientado a ownership',
    difficulty: 3,
    specialization: 'Versatilidad y emprendimiento',
    videos: {
      greeting: '/videos/avatars/mateo-greeting.mp4',
      thinking: '/videos/avatars/mateo-thinking.mp4',
      farewell: '/videos/avatars/mateo-farewell.mp4'
    },
    recommendedDays: [48, 55, 60],
    image: '/images/interviewers/mateo-silva.jpg',
    color: '#F59E0B'
  },
  'camila-rivera': {
    name: 'Camila Rivera',
    role: 'VP Product & Strategy',
    bio: 'Ejecutiva senior con visión estratégica y exigencia alta',
    tone: 'Estratégica, desafiante, pensamiento crítico',
    difficulty: 4,
    specialization: 'Pensamiento estratégico',
    videos: {
      greeting: '/videos/avatars/camila-greeting.mp4',
      thinking: '/videos/avatars/camila-thinking.mp4',
      farewell: '/videos/avatars/camila-farewell.mp4'
    },
    recommendedDays: [60, 70, 75],
    image: '/images/interviewers/camila-rivera.jpg',
    color: '#10B981'
  },
  'rafael-araya': {
    name: 'Rafael Araya',
    role: 'Senior Advisor & Executive Coach',
    bio: 'Consultor C-level con 20+ años en transformación empresarial',
    tone: 'Mentor, desafiante, exigente con excelencia',
    difficulty: 4,
    specialization: 'Liderazgo ejecutivo y mentalidad',
    videos: {
      greeting: '/videos/avatars/rafael-greeting.mp4',
      thinking: '/videos/avatars/rafael-thinking.mp4',
      farewell: '/videos/avatars/rafael-farewell.mp4'
    },
    recommendedDays: [75, 82, 90],
    image: '/images/interviewers/rafael-araya.jpg',
    color: '#8B5CF6'
  }
}

// Mapping de avatares a días específicos del A2-Routes
export const AVATAR_PRACTICE_SCHEDULE = {
  15: ['sofia-navarro'],
  20: ['sofia-navarro', 'andres-rojas'],
  31: ['andres-rojas'],
  35: ['andres-rojas', 'valentina-muñoz'],
  42: ['valentina-muñoz', 'mateo-silva'],
  48: ['mateo-silva'],
  52: ['andres-rojas', 'valentina-muñoz'],
  55: ['mateo-silva', 'camila-rivera'],
  60: ['camila-rivera', 'rafael-araya'],
  70: ['camila-rivera'],
  75: ['rafael-araya'],
  82: ['rafael-araya'],
  90: ['rafael-araya'] // Panel simulado o Rafael a máxima dificultad
}

export function getAvatarConfig(avatarId: string) {
  return AVATAR_CONFIG[avatarId as keyof typeof AVATAR_CONFIG]
}

export function getRecommendedAvatars(day: number) {
  return AVATAR_PRACTICE_SCHEDULE[day as keyof typeof AVATAR_PRACTICE_SCHEDULE] || []
}
