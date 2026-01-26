import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SimulationResult {
  userId: string
  day: number
  T_capacidad_actual: number
  P_success: number
  tareas_completadas: number
  alertas: string[]
  estado: string
}

// Simulate capacity calculations with randomness
async function simulateDay(
  userId: string,
  day: number,
  previousCapacity: number
): Promise<SimulationResult> {
  // Simulate fatigue/recovery cycle
  const fatigue = Math.sin((day * Math.PI) / 7) * 20 + Math.random() * 10
  const T_capacidad_actual = Math.max(10, Math.min(90, previousCapacity + fatigue))
  
  // Probability of success based on capacity
  const P_success = Math.min(1, T_capacidad_actual / 100)
  
  // Simulate tasks completed
  const tasas_completadas = Math.floor(Math.random() * 5 * P_success)
  
  // Check thresholds
  const alertas: string[] = []
  if (T_capacidad_actual <= 15) {
    alertas.push('⚠️ CRÍTICA: Capacidad en zona de frustración alta')
  }
  if (T_capacidad_actual >= 68 && T_capacidad_actual <= 72) {
    alertas.push('✓ ÓPTIMA: En zona de compromiso fuerte')
  }

  // Log to database
  const { error } = await supabase
    .from('daily_capacity')
    .insert({
      user_id: userId,
      fecha: new Date(Date.now() - (7 - day) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      T_capacidad_actual,
      P_success,
      modo_activo: 'A1',
      fase: day <= 30 ? 'A1 Base' : day <= 60 ? 'A1 30 días' : 'A1 60 días',
    })

  return {
    userId,
    day,
    T_capacidad_actual: Math.round(T_capacidad_actual * 100) / 100,
    P_success: Math.round(P_success * 100) / 100,
    tareas_completadas: tasas_completadas,
    alertas,
    estado: T_capacidad_actual <= 15 ? 'CRÍTICA' : T_capacidad_actual >= 68 ? 'ÓPTIMA' : 'COMPROMISO',
  }
}

async function runSimulation() {
  console.log('🚀 Iniciando simulación CIP...\n')

  const testUserIds = ['test-user-1', 'test-user-2', 'test-user-3']
  const allResults: SimulationResult[] = []

  for (const userId of testUserIds) {
    console.log(`\n👤 Simulando usuario: ${userId}`)
    console.log('='.repeat(60))

    // Initialize capacity profile
    const { error: initError } = await supabase
      .from('user_capacity_profile')
      .insert({
        user_id: userId,
        a1_base: 40,
        modo_activo: 'A1',
        fase: 'A1 Base',
        ultima_actualizacion: new Date().toISOString(),
      })
      .select()

    if (initError && !initError.message.includes('duplicate')) {
      console.error('Error inicializando perfil:', initError)
      continue
    }

    let previousCapacity = 40
    for (let day = 1; day <= 7; day++) {
      const result = await simulateDay(userId, day, previousCapacity)
      allResults.push(result)

      console.log(`\n📅 Día ${day}:`)
      console.log(`   Capacidad: ${result.T_capacidad_actual}% (${result.estado})`)
      console.log(`   Prob. Éxito: ${(result.P_success * 100).toFixed(0)}%`)
      console.log(`   Tareas: ${result.tareas_completadas}`)
      if (result.alertas.length > 0) {
        result.alertas.forEach(alerta => console.log(`   ${alerta}`))
      }

      previousCapacity = result.T_capacidad_actual
    }
  }

  // Summary statistics
  console.log('\n\n📊 RESUMEN DE SIMULACIÓN')
  console.log('='.repeat(60))
  console.log(`Total de usuarios simulados: ${testUserIds.length}`)
  console.log(`Total de días simulados: ${allResults.length}`)
  
  const avgCapacity = allResults.reduce((acc, r) => acc + r.T_capacidad_actual, 0) / allResults.length
  const optimalDays = allResults.filter(r => r.T_capacidad_actual >= 68).length
  const criticalDays = allResults.filter(r => r.T_capacidad_actual <= 15).length
  const totalTasks = allResults.reduce((acc, r) => acc + r.tareas_completadas, 0)

  console.log(`Capacidad promedio: ${avgCapacity.toFixed(2)}%`)
  console.log(`Días en zona óptima (68-100%): ${optimalDays} (${((optimalDays / allResults.length) * 100).toFixed(1)}%)`)
  console.log(`Días en zona crítica (<15%): ${criticalDays} (${((criticalDays / allResults.length) * 100).toFixed(1)}%)`)
  console.log(`Total tareas completadas: ${totalTasks}`)

  console.log('\n✅ Simulación completada exitosamente!')
}

// Run simulation
runSimulation().catch(err => {
  console.error('Error en simulación:', err)
  process.exit(1)
})
