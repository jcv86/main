// Route Generator - Genera rutas personalizadas de 30/60/90 días con IA

import { DiscProfile } from './disc-calculator'
import { callOpenAI } from './openai-helper'
import { getAvailableDays, getTaskDetail } from './task-details'

export interface RouteActionItem {
  day: number
  title: string
  description: string
  type: 'learning' | 'practice' | 'networking' | 'planning' | 'milestone'
  resources?: string[]
  timeEstimate: number // minutes
}

export interface PersonalizedRoute {
  route_30days: RouteActionItem[]
  route_60days: RouteActionItem[]
  route_90days: RouteActionItem[]
  milestones: {
    day_30: string
    day_60: string
    day_90: string
  }
  successMetrics: string[]
}

export async function generatePersonalizedRoute(
  discProfile: DiscProfile,
  objective: string,
  skills: string[],
  timePerWeek: number
): Promise<PersonalizedRoute> {
  // Adapt route based on Despega profile
  const isEnergia = discProfile.primary === 'energia'
  const isEnfoque = discProfile.primary === 'enfoque'
  const isRelaciones = discProfile.primary === 'relaciones'
  const isPlanEjecutivo = discProfile.primary === 'plan_ejecutivo'

  // Get AI-generated content for each phase
  let aiContent = { phase30: '', phase60: '', phase90: '' }
  try {
    const prompt = `Eres un experto en desarrollo profesional. Crea un plan de 90 días personalizado para:
- Objetivo: ${objective}
- Habilidades a desarrollar: ${skills.join(', ')}
- Horas por semana disponibles: ${timePerWeek}
- Perfil DISC: ${discProfile.primary}
- Disponibilidad: ${timePerWeek} horas por semana

Responde en JSON con el siguiente formato:
{
  "phase30": "Descripción de objetivos para el primer mes",
  "phase60": "Descripción de objetivos para el segundo mes",
  "phase90": "Descripción de objetivos para el tercer mes"
}`

    aiContent = await callOpenAI(
      [{ role: 'user', content: prompt }],
      'gpt-4o-mini',
      { temperature: 0.8, max_tokens: 1500 }
    ).then(content => {
      try {
        return JSON.parse(content)
      } catch {
        return { phase30: '', phase60: '', phase90: '' }
      }
    })
  } catch (err) {
    console.log('[v0] AI content generation skipped, using template')
  }

  // Generate 30-day route from task-details database
  const availableDays = getAvailableDays()
  const route_30days: RouteActionItem[] = availableDays
    .filter(day => day <= 30)
    .map(day => {
      const taskDetail = getTaskDetail(day)
      if (!taskDetail) {
        return {
          day,
          title: `Day ${day}`,
          description: 'Task pending',
          type: 'planning' as const,
          timeEstimate: 60
        }
      }
      
      // Map task type from title patterns
      let type: 'learning' | 'practice' | 'networking' | 'planning' | 'milestone' = 'planning'
      const lowerTitle = taskDetail.title.toLowerCase()
      
      if (lowerTitle.includes('aprender') || lowerTitle.includes('curso') || lowerTitle.includes('aprendizaje') || lowerTitle.includes('avanza')) type = 'learning'
      else if (lowerTitle.includes('proyecto') || lowerTitle.includes('práctica') || lowerTitle.includes('practica') || lowerTitle.includes('práct') || lowerTitle.includes('build') || lowerTitle.includes('mock')) type = 'practice'
      else if (lowerTitle.includes('networking') || lowerTitle.includes('conecta') || lowerTitle.includes('outreach') || lowerTitle.includes('interview')) type = 'networking'
      else if (lowerTitle.includes('checkpoint') || lowerTitle.includes('revisión') || lowerTitle.includes('review') || lowerTitle.includes('reflexión')) type = 'planning'
      else if (lowerTitle.includes('milestone') || lowerTitle.includes('completado') || lowerTitle.includes('assessment') || day === 30) type = 'milestone'
      
      // Calculate total time from all steps
      const totalTime = taskDetail.steps.reduce((sum, step) => {
        const minutes = step.duration.includes('h') 
          ? parseInt(step.duration) * 60
          : parseInt(step.duration)
        return sum + minutes
      }, 0)
      
      return {
        day: taskDetail.day,
        title: taskDetail.title,
        description: taskDetail.fullDescription,
        type,
        timeEstimate: totalTime || 120,
        resources: taskDetail.resources?.map(r => r.title)
      }
    })

  const route_60days: RouteActionItem[] = availableDays
    .filter(day => day > 30 && day <= 60)
    .map(day => {
      const taskDetail = getTaskDetail(day)
      if (!taskDetail) {
        return {
          day,
          title: `Día ${day}`,
          description: 'Tarea pendiente',
          type: 'planning' as const,
          timeEstimate: 60
        }
      }
      
      // Map task type from title patterns
      let type: 'learning' | 'practice' | 'networking' | 'planning' | 'milestone' = 'planning'
      const lowerTitle = taskDetail.title.toLowerCase()
      
      if (lowerTitle.includes('aprender') || lowerTitle.includes('curso') || lowerTitle.includes('aprendizaje') || lowerTitle.includes('análisis') || lowerTitle.includes('profundizar')) type = 'learning'
      else if (lowerTitle.includes('proyecto') || lowerTitle.includes('práctica') || lowerTitle.includes('practica') || lowerTitle.includes('práct') || lowerTitle.includes('build')) type = 'practice'
      else if (lowerTitle.includes('networking') || lowerTitle.includes('conecta') || lowerTitle.includes('entrevista') || lowerTitle.includes('buscar') || lowerTitle.includes('participar') || lowerTitle.includes('activación')) type = 'networking'
      else if (lowerTitle.includes('checkpoint') || lowerTitle.includes('revisión') || lowerTitle.includes('review') || lowerTitle.includes('reflexión') || lowerTitle.includes('evaluación')) type = 'planning'
      else if (lowerTitle.includes('milestone') || lowerTitle.includes('completado') || lowerTitle.includes('assessment') || day === 60) type = 'milestone'
      
      // Calculate total time from all steps
      const totalTime = taskDetail.steps.reduce((sum, step) => {
        const minutes = step.duration.includes('h') 
          ? parseInt(step.duration) * 60
          : parseInt(step.duration)
        return sum + minutes
      }, 0)
      
      return {
        day: taskDetail.day,
        title: taskDetail.title,
        description: taskDetail.fullDescription,
        type,
        timeEstimate: totalTime || 120,
        resources: taskDetail.resources?.map(r => r.title)
      }
    })

  const route_90days: RouteActionItem[] = availableDays
    .filter(day => day > 60 && day <= 90)
    .map(day => {
      const taskDetail = getTaskDetail(day)
      if (!taskDetail) {
        return {
          day,
          title: `Día ${day}`,
          description: 'Tarea pendiente',
          type: 'planning' as const,
          timeEstimate: 60
        }
      }
      
      // Map task type from title patterns
      let type: 'learning' | 'practice' | 'networking' | 'planning' | 'milestone' = 'planning'
      const lowerTitle = taskDetail.title.toLowerCase()
      
      if (lowerTitle.includes('aprender') || lowerTitle.includes('especialización') || lowerTitle.includes('liderazgo') || lowerTitle.includes('experto')) type = 'learning'
      else if (lowerTitle.includes('proyecto') || lowerTitle.includes('capstone') || lowerTitle.includes('práctica') || lowerTitle.includes('practica') || lowerTitle.includes('preparación')) type = 'practice'
      else if (lowerTitle.includes('networking') || lowerTitle.includes('activación') || lowerTitle.includes('mercado') || lowerTitle.includes('pitch')) type = 'networking'
      else if (lowerTitle.includes('checkpoint') || lowerTitle.includes('revisión') || lowerTitle.includes('review') || lowerTitle.includes('reflexión') || lowerTitle.includes('evaluación')) type = 'planning'
      else if (lowerTitle.includes('milestone') || lowerTitle.includes('completado') || lowerTitle.includes('assessment') || lowerTitle.includes('mes 1') || day === 90) type = 'milestone'
      
      // Calculate total time from all steps
      const totalTime = taskDetail.steps.reduce((sum, step) => {
        const minutes = step.duration.includes('h') 
          ? parseInt(step.duration) * 60
          : parseInt(step.duration)
        return sum + minutes
      }, 0)
      
      return {
        day: taskDetail.day,
        title: taskDetail.title,
        description: taskDetail.fullDescription,
        type,
        timeEstimate: totalTime || 120,
        resources: taskDetail.resources?.map(r => r.title)
      }
    })

  return {
    route_30days,
    route_60days,
    route_90days,
    milestones: {
      day_30: `Has completado el foundation - conoces el rol, tienes plan, iniciaste aprendizaje`,
      day_60: `Tienes habilidades intermedias, proyectos completados, red de contactos establecida`,
      day_90: `Eres candidato competitivo, tienes portfolio, clara oportunidad de cambio`
    },
    successMetrics: [
      'Completar todos los módulos de aprendizaje planificados',
      'Crear 3+ proyectos prácticos que demuestren habilidades',
      'Conectar con 10+ personas en tu área objetivo',
      'Tener oferta de trabajo o clara oportunidad de ascenso',
      'Sentir confianza en tu nueva dirección profesional'
    ]
  }
}
