export interface Recommendation {
  phase: 30 | 60 | 90
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  icon: string
  reason: string
}

export function generateRecommendations(
  completedTasks: Set<string>,
  totalTasks: Map<string, number>,
  taskTypes: Map<string, string[]>
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Count completed tasks by type
  const completedByType = {
    learning: 0,
    practice: 0,
    networking: 0,
    planning: 0,
    milestone: 0
  }

  completedTasks.forEach(taskId => {
    const parts = taskId.split('-')
    const taskTitle = parts.slice(2).join('-')
    // Count which type this task belongs to (simplified - in real scenario, would look up type)
  })

  // Get phase completion percentages
  const phaseCompletions = {
    '30': 0,
    '60': 0,
    '90': 0
  }

  let totalCompleted = 0
  let totalTasks_ = 0

  completedTasks.forEach(taskId => {
    const phase = taskId.split('-')[0]
    if (phaseCompletions.hasOwnProperty(phase)) {
      phaseCompletions[phase as keyof typeof phaseCompletions]++
      totalCompleted++
    }
  })

  // Calculate totals
  for (const [phase, count] of totalTasks.entries()) {
    totalTasks_ += count
  }

  const overallPercentage = totalTasks_ > 0 ? (totalCompleted / totalTasks_) * 100 : 0

  // Generate recommendations based on progress
  if (overallPercentage < 25) {
    recommendations.push({
      phase: 30,
      title: 'Mantén el Ritmo',
      description: 'Has empezado bien. Continúa con las tareas de planificación para establecer una base sólida.',
      priority: 'high',
      icon: '🚀',
      reason: 'Estás en los primeros pasos del programa'
    })
  } else if (overallPercentage < 50) {
    recommendations.push({
      phase: 30,
      title: 'Completa la Fase 1',
      description: 'Ya casi terminas la primera fase. Las tareas de aprendizaje son clave para tu progreso.',
      priority: 'high',
      icon: '📚',
      reason: 'Completaste 25-50% del programa'
    })
  } else if (overallPercentage < 75) {
    recommendations.push({
      phase: 60,
      title: 'Entra en Acción',
      description: 'Tiempo de poner en práctica lo que has aprendido. Enfócate en tareas de networking.',
      priority: 'high',
      icon: '🤝',
      reason: 'Has alcanzado la mitad del programa'
    })
  } else if (overallPercentage < 100) {
    recommendations.push({
      phase: 90,
      title: 'Hacia la Maestría',
      description: 'Estás casi al final. Las últimas tareas son cruciales para consolidar tu transformación.',
      priority: 'high',
      icon: '💎',
      reason: 'Ya completaste 75% del programa'
    })
  } else {
    recommendations.push({
      phase: 90,
      title: 'Celebra tu Logro',
      description: '¡Felicidades! Completaste el programa. Ahora es momento de aplicar todo lo aprendido.',
      priority: 'medium',
      icon: '🏆',
      reason: 'Completaste 100% del programa'
    })
  }

  // Add secondary recommendations based on task type completion
  if (completedByType.practice === 0) {
    recommendations.push({
      phase: 30,
      title: 'Practicando es la Clave',
      description: 'Aún no has completado tareas prácticas. Estas son esenciales para tu desarrollo.',
      priority: 'medium',
      icon: '🛠️',
      reason: 'No has trabajado en tareas prácticas'
    })
  }

  if (completedByType.networking === 0) {
    recommendations.push({
      phase: 60,
      title: 'Expande tu Red',
      description: 'Es hora de conectar con otros. Las tareas de networking abren puertas increíbles.',
      priority: 'medium',
      icon: '🌐',
      reason: 'No has trabajado en tareas de networking'
    })
  }

  return recommendations
}
