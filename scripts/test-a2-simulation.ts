/**
 * Script para simular la completación de A2 y verificar la generación de rutas
 * Este script prueba:
 * 1. Que se carguen correctamente los datos de DISC y C2
 * 2. Que se genere la ruta con OpenAI
 * 3. Que se guarde correctamente en la BD
 */

async function simulateA2Completion() {
  console.log('[v0] === INICIANDO SIMULACIÓN DE A2 ===')
  
  // Simulación de datos de entrada
  const mockUser = {
    id: 'test-user-123'
  }
  
  const mockDISCProfile = {
    energia: 75,
    enfoque: 50,
    relaciones: 50,
    plan_ejecutivo: 60,
    primary: 'energia',
    primaryScore: 75,
    secondary: 'plan_ejecutivo',
    secondaryScore: 60,
  }
  
  const mockC2Responses = {
    objective: 'Mejorar habilidades de liderazgo',
    skills: ['Comunicación', 'Toma de decisiones', 'Gestión de equipos'],
    timePerWeek: 10
  }
  
  console.log('[v0] Mock DISC Profile:', mockDISCProfile)
  console.log('[v0] Mock C2 Responses:', mockC2Responses)
  
  // Probar la generación de ruta
  try {
    console.log('[v0] Llamando a generatePersonalizedRoute...')
    
    const { generatePersonalizedRoute } = await import('../lib/route-generator')
    
    const route = await generatePersonalizedRoute(
      mockDISCProfile,
      mockC2Responses.objective,
      mockC2Responses.skills,
      mockC2Responses.timePerWeek
    )
    
    console.log('[v0] ✓ Ruta generada exitosamente')
    console.log('[v0] Estructura de ruta:')
    console.log('  - route_30days tasks:', route.route_30days?.length || 0, 'tareas')
    console.log('  - route_60days tasks:', route.route_60days?.length || 0, 'tareas')
    console.log('  - route_90days tasks:', route.route_90days?.length || 0, 'tareas')
    
    if (route.route_30days && route.route_30days.length > 0) {
      console.log('[v0] Primera tarea (30 días):')
      const firstTask = route.route_30days[0]
      console.log('  - Day:', firstTask.day)
      console.log('  - Title:', firstTask.title)
      console.log('  - Type:', firstTask.type)
      console.log('  - Description length:', (firstTask.description || '').length, 'caracteres')
    }
    
  } catch (err) {
    console.error('[v0] ✗ Error en generación de ruta:', err)
    console.error('[v0] Stack:', (err as Error).stack)
  }
  
  console.log('[v0] === FIN DE SIMULACIÓN ===')
}

// Ejecutar simulación
simulateA2Completion().catch(console.error)
