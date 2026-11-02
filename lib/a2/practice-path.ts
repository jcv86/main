import type { A2DailyMission } from '@/lib/a2-mission.types'
import type { A2RouteAdaptation } from '@/lib/a2/route-adaptation'

export type A2PracticePath = 'persona' | 'profesional' | 'ambos'

/** Only explicit profile choices determine the path; DISC and free text do not. */
export function resolveA2PracticePath(profile: unknown): A2PracticePath {
  const value = profile && typeof profile === 'object' ? profile as Record<string, unknown> : {}
  if (value.camino_foco === 'persona' || value.camino_foco === 'profesional' || value.camino_foco === 'ambos') return value.camino_foco
  if (value.camino_persona_active === true && value.camino_profesional_active === false) return 'persona'
  if (value.camino_profesional_active === true && value.camino_persona_active === false) return 'profesional'
  return 'ambos'
}

// Adapt the existing sequence (goal, evidence, practice, review) to a personal goal.
// These are practice prompts, not an empirically validated intervention or assessment.
const PERSONAL_STEPS: Array<[string, string, string]> = [
  ['Tu acuerdo de 30 días', 'Define un cambio personal observable, el tiempo disponible y una primera acción pequeña.', 'Objetivo propio, señal de avance y tres momentos de revisión: días 10, 20 y 30.'],
  ['Tu carpeta de evidencias', 'Reúne ejemplos reales de algo que ya haces o has aprendido, también fuera del trabajo.', 'Una carpeta o lista de ejemplos propios con su contexto.'],
  ['Observa tu contexto', 'Observa tres situaciones cotidianas relacionadas con tu objetivo y anota qué facilita o dificulta actuar.', 'Tres observaciones propias y una oportunidad concreta de práctica.'],
  ['Tu punto de partida', 'Escribe qué quieres cambiar, qué haces hoy, qué evidencia tienes y qué necesitas explorar.', 'Un tablero de cuatro preguntas con una hipótesis que puedas poner a prueba.'],
  ['Explica tu objetivo', 'Escribe dos formas de explicar tu objetivo y prueba una con alguien de confianza o leyéndola en voz alta.', 'Dos versiones, la reacción observada y una versión revisada.'],
  ['Una explicación fiel', 'Ajusta tu explicación al contexto sin atribuirte experiencias o resultados que aún no tienes.', 'Una explicación breve y un ejemplo real que la respalde.'],
  ['Primera revisión', 'Revisa la evidencia de esta semana e identifica qué cambió y qué sigue pendiente.', 'Una síntesis con evidencia, límite y siguiente acción.'],
  ['Recupera experiencias', 'Recuerda situaciones en que practicaste algo relacionado con tu objetivo, en casa, estudios o comunidad.', 'Ejemplos propios con situación, acción y resultado observado.'],
  ['Describe una acción', 'Elige un ejemplo y distingue lo que hiciste tú de lo que hicieron otras personas.', 'Un relato concreto de una acción propia.'],
  ['Revisión del día 10', 'Compara tu punto de partida con la evidencia de hoy y ajusta el alcance si hace falta.', 'Balance del primer tramo y un ajuste que conserva lo ya realizado.'],
  ['Elige qué practicar', 'Elige una habilidad o conducta pequeña que apoye tu objetivo.', 'Una práctica con contexto, duración y señal observable.'],
  ['Prepara tu práctica', 'Prepara los materiales o el entorno que necesitas para realizar esa acción.', 'Un recurso utilizable o una preparación documentada.'],
  ['Prueba una vez', 'Realiza la acción elegida y registra lo ocurrido, incluido lo que no salió como esperabas.', 'Primer intento y resultado observado, sin inventar cifras.'],
  ['Identifica una barrera', 'Revisa qué facilitó o dificultó tu intento y reduce una barrera concreta.', 'Una barrera identificada y un ajuste de tiempo, apoyo o alcance.'],
  ['Pide una observación', 'Pide a alguien una observación sobre tu práctica o revísala con criterios explícitos.', 'Una observación vinculada a un ejemplo, sin convertir una opinión en un hecho.'],
  ['Segundo intento', 'Repite la práctica aplicando un solo cambio de la revisión anterior.', 'Primer y segundo intento con el cambio aplicado y su resultado.'],
  ['Conserva un recurso', 'Convierte lo aprendido en una nota, lista o herramienta reutilizable.', 'Un recurso propio con instrucciones de uso.'],
  ['Prueba en otro contexto', 'Aplica la acción en una situación cotidiana diferente y observa qué cambia.', 'Una comparación entre dos contextos.'],
  ['Registra tu autonomía', 'Intenta la acción sin consultar la ayuda durante la ejecución; después revisa qué necesitaste.', 'Un intento propio y una lista de apoyos aún necesarios.'],
  ['Revisión del día 20', 'Contrasta lo logrado con el objetivo inicial y elige un ajuste para el último tramo.', 'Balance con evidencia y un próximo paso viable.'],
  ['Define una acción real', 'Elige una acción concreta para una situación de tu vida diaria relacionada con tu objetivo.', 'Qué harás, cuándo y cómo reconocerás que lo hiciste.'],
  ['Prepara una dificultad', 'Anticipa una barrera probable y escribe una alternativa que mantenga el objetivo.', 'Un plan «si ocurre esto, haré esto otro».'],
  ['Haz la acción', 'Realiza la acción y registra lo observado, aunque el resultado sea parcial.', 'Una evidencia de la acción y su resultado real.'],
  ['Revisa el resultado', 'Distingue lo que observaste, lo que interpretas y lo que todavía no sabes.', 'Una revisión con hechos, dudas y siguiente ajuste.'],
  ['Repite con un ajuste', 'Repite una acción aplicando un cambio concreto y conserva el intento anterior.', 'Dos intentos comparables y el ajuste aplicado.'],
  ['Organiza tus evidencias', 'Selecciona los ejemplos que mejor muestran tu avance y añade contexto.', 'Una selección de evidencias propias con fecha y explicación.'],
  ['Tu carpeta personal', 'Prepara una síntesis de lo practicado y de lo que puedes mostrar hoy.', 'Una carpeta o texto personal fiel; un CV o una vacante no son necesarios.'],
  ['Prueba sin ayuda', 'Realiza una práctica comparable sin ayuda durante el intento y después revisa el resultado.', 'Un intento propio, sus límites y lo que quieres seguir practicando.'],
  ['Decide el siguiente paso', 'Elige si quieres mantener, ajustar o cambiar tu objetivo según tus evidencias.', 'Una decisión propia con razones y una próxima acción.'],
  ['Cierre de tus 30 días', 'Compara el inicio y el cierre, selecciona tus evidencias y decide cómo continuar.', 'Balance final: objetivo, evidencias, cambios, límites y próximo paso.'],
]

export function missionForA2Path(base: A2DailyMission, path: A2PracticePath): A2DailyMission {
  if (path !== 'persona') return base
  const cycleDay = ((base.day - 1) % 30) + 1
  const cycle = Math.ceil(base.day / 30)
  const [title, task, deliverable] = PERSONAL_STEPS[cycleDay - 1]
  return {
    ...base,
    practiceTrack: 'persona',
    title: cycle === 1 ? title : `Ciclo ${cycle}: ${title}`,
    subtitle: cycle === 1 ? 'Una acción para el objetivo personal que tú elegiste.' : 'Repite la práctica con una situación nueva y compara tus evidencias con el ciclo anterior.',
    missionType: [7, 10, 20, 30].includes(cycleDay) ? 'debrief' : [13, 18, 23, 25, 28].includes(cycleDay) ? 'field_action' : 'builder',
    a3Checkpoint: undefined,
    unlockRequirements: { requiresDay1Passed: false, requiredPreviousDay: base.day > 1 ? base.day - 1 : undefined },
    userGoal: task,
    whyItMatters: 'Conservar lo que haces y revisar un cambio concreto te permite decidir el siguiente paso con tus propias evidencias.',
    instructions: [task, 'Conserva un ejemplo o registro real del trabajo de hoy.', 'Escribe qué aprendiste y una acción pequeña para continuar.'],
    deliverable,
    dtcValidation: { required: false },
    completionResult: { onPass: 'Tu entregable personal quedó registrado.', onFail: 'Completa los campos pendientes o registra una barrera para ajustar la práctica.' },
  }
}

export function personalA2Adaptation(): A2RouteAdaptation {
  return {
    routeCode: 'PERSONA',
    focus: 'El cambio personal que tú elegiste',
    routeName: 'Tu objetivo personal',
    focusQuestion: '¿Cómo se conecta esta acción con el cambio que elegiste?',
    evidencePrompt: 'Conserva un ejemplo propio, una observación o un recurso relacionado con tu objetivo personal.',
    applicationPrompt: 'Elige un ajuste pequeño y viable para tu siguiente intento.',
    qualitySignals: ['Hechos propios', 'Contexto claro', 'Siguiente acción'],
  }
}
