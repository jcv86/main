/** Read-only navigation model. It never grants access or writes completion flags. */
export const FLOW_VERSION = 'a1-a4-continuity.v1'
export interface OnboardingFlags {
  onboarding_conozcamonos_1_completed?: boolean | null
  onboarding_completed?: boolean | null
  a1_cerebral_intro_seen?: boolean | null
  a1_cerebral_completed?: boolean | null
  a1_test_completed?: boolean | null
  onboarding_cerebral_completed?: boolean | null
  conozcamonos_2_completed?: boolean | null
  a1_report_seen?: boolean | null
  a1_results_saved?: boolean | null
  a2_intro_seen?: boolean | null
}
export const ONBOARDING_PATHS = [
  '/despega/conozcamonos-1', '/despega/a1-cerebral-intro', '/despega/a1-cerebral',
  '/despega/conozcamonos-2', '/despega/a1-report', '/despega/a2/intro', '/despega/a2',
] as const
export type OnboardingPath = (typeof ONBOARDING_PATHS)[number]

export function canonicalOnboardingPath(profile: OnboardingFlags): OnboardingPath {
  if (!(profile.onboarding_conozcamonos_1_completed || profile.onboarding_completed)) return ONBOARDING_PATHS[0]
  if (!profile.a1_cerebral_intro_seen) return ONBOARDING_PATHS[1]
  if (!(profile.a1_cerebral_completed || profile.a1_test_completed || profile.onboarding_cerebral_completed)) return ONBOARDING_PATHS[2]
  if (!profile.conozcamonos_2_completed) return ONBOARDING_PATHS[3]
  if (!(profile.a1_report_seen || profile.a1_results_saved)) return ONBOARDING_PATHS[4]
  if (!profile.a2_intro_seen) return ONBOARDING_PATHS[5]
  return ONBOARDING_PATHS[6]
}

export type FlowStage = 'A1' | 'A2' | 'A3' | 'A4'
export interface FlowAction { href: string; label: string; title: string; description: string }
export interface FlowInput {
  profile: OnboardingFlags
  access: { a1: boolean; a2: boolean; a3: boolean; a4: boolean }
  currentModule: string
  highestA2DayUnlocked: number
  completedA2Days: unknown[]
  completedA3Modules: unknown[]
  a3RouteClosed: boolean
}
const checkpoint = 'career-mirror'
const stages = [
  { id: 'A1', title: 'Despega Cerebral', href: '/despega/a1-report', purpose: 'Reconocer tus preferencias, contexto y matices.', carried: 'Una lectura autodeclarada y trazable; no una lista de capacidades demostradas.' },
  { id: 'A2', title: 'Tu Ruta', href: '/despega/a2', purpose: 'Traducir tu objetivo en acciones y entregables.', carried: 'Progreso y evidencia registrada. Comienza con 30 días y puede ampliarse a 60/90.' },
  { id: 'A3', title: 'Entrenamiento', href: '/despega/a3', purpose: 'Practicar y contrastar las hipótesis con experiencias.', carried: 'El primer checkpoint aparece desde el Día 7 de A2; no exige esperar 30 días.' },
  { id: 'A4', title: 'Radar Estratégico', href: '/despega/a4', purpose: 'Contrastar tu dirección con señales y decisiones.', carried: 'Se habilita con el cierre verificado de la ruta A3, no por contar sesiones.' },
] as const
const onboardingCopy: Record<OnboardingPath, [string,string]> = {
  '/despega/conozcamonos-1': ['Completar mi contexto inicial', 'Ubica tu punto de partida antes de interpretar preferencias.'],
  '/despega/a1-cerebral-intro': ['Conocer Despega Cerebral', 'Revisa cómo responder y qué puede aportar esta evaluación.'],
  '/despega/a1-cerebral': ['Continuar mi evaluación A1', 'Completa las elecciones pendientes sin fabricar resultados.'],
  '/despega/conozcamonos-2': ['Completar mi contexto posterior', 'Añade tu objetivo y restricciones antes del informe A1.'],
  '/despega/a1-report': ['Revisar mi lectura individual', 'Revisa tu informe y sus matices antes de introducir Tu Ruta.'],
  '/despega/a2/intro': ['Conocer mi Ruta de 30 días', 'Revisa el ciclo inicial, sus ampliaciones y los checkpoints de entrenamiento.'],
  '/despega/a2': ['Continuar Tu Ruta', 'Retoma las acciones habilitadas de tu recorrido.'],
}

function days(value: unknown[]): number[] {
  return [...new Set(value.filter((v): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 90))].sort((a,b)=>a-b)
}

export function buildJourneyFlow(input: FlowInput) {
  const onboardingPath = canonicalOnboardingPath(input.profile)
  const onboardingComplete = onboardingPath === '/despega/a2'
  const completedDays = days(input.completedA2Days)
  const completed = new Set(completedDays)
  const initialDays = completedDays.filter(day=>day<=30).length
  const modules = [...new Set(input.completedA3Modules.filter((v): v is string=>typeof v==='string' && Boolean(v.trim())).map(v=>v.trim()))]
  const unlocked = Number.isInteger(input.highestA2DayUnlocked) ? Math.max(1,Math.min(90,input.highestA2DayUnlocked)) : 1
  const resumeDay = Array.from({length:unlocked},(_,i)=>i+1).find(day=>!completed.has(day)) ?? unlocked
  const checkpointPending = input.access.a3 && unlocked>=7 && !modules.includes(checkpoint)
  const radarAvailable = onboardingComplete && input.access.a4 && input.a3RouteClosed
  let next: FlowAction
  if (!onboardingComplete) {
    const [label,description]=onboardingCopy[onboardingPath]
    next={href:onboardingPath,label,title:'Completa tu punto de partida',description}
  } else if (!input.access.a2) {
    next={href:'/despega/a2/intro',label:'Revisar acceso a Tu Ruta',title:'Tu acceso requiere comprobación',description:'La navegación no sustituye las comprobaciones del servidor ni habilita etapas por sí sola.'}
  } else if (radarAvailable) {
    next={href:'/despega/a4',label:'Abrir Radar Estratégico',title:'Conecta tu avance con decisiones',description:'El cierre de A3 está registrado. Revisa señales, decisiones y sus resultados.'}
  } else if (checkpointPending) {
    next={href:'/despega/a3/career-mirror',label:'Realizar el checkpoint del Día 7',title:'Tu Ruta y Entrenamiento se conectan aquí',description:'Completa Career Mirror y vuelve a Tu Ruta. Entrenamiento no exige terminar primero los 30 días.'}
  } else if (input.access.a3 && (input.currentModule==='A3' || modules.length>0 || initialDays===30)) {
    next={href:'/despega/a3',label:'Continuar Entrenamiento',title:'Contrasta tu avance con práctica',description:input.a3RouteClosed?'Tu cierre está registrado; revisa la sincronización del acceso antes de abrir A4.':'Retoma el siguiente módulo habilitado. El número de sesiones no reemplaza el cierre de la ruta.'}
  } else if (initialDays===30) {
    next={href:'/despega/a2/resultados',label:'Revisar mi ciclo de 30 días',title:'Revisa la evidencia de tu ciclo inicial',description:'Treinta días registrados no son noventa. Revisa el balance y las opciones habilitadas para continuar.'}
  } else {
    next={href:`/despega/a2/dia-${resumeDay}`,label:`Continuar día ${resumeDay}`,title:'Retoma una acción pendiente',description:'Se prioriza el primer día sin finalización registrada dentro de lo habilitado; un día abierto no se cuenta como completado.'}
  }
  const cards=stages.map(stage=>{
    const allowed=stage.id==='A4'?radarAvailable:input.access[stage.id.toLowerCase() as keyof FlowInput['access']]
    const done=stage.id==='A1'?onboardingComplete:stage.id==='A2'?completedDays.length===90:stage.id==='A3'?input.a3RouteClosed:false
    const active=allowed&&(stage.id==='A4'?radarAvailable:stage.id==='A1'?!onboardingComplete:next.href.startsWith(`/despega/${stage.id.toLowerCase()}`))
    const state=!allowed?'locked':done?'completed':active?'active':'available'
    const detail=stage.id==='A1'?(onboardingComplete?'Lectura y contexto revisados':'Contexto, evaluación, C2 e informe antes de A2')
      :stage.id==='A2'?`${initialDays}/30 días del ciclo inicial · ${completedDays.length} días registrados en total`
      :stage.id==='A3'?(input.a3RouteClosed?'Cierre de ruta registrado':modules.includes(checkpoint)?'Primer checkpoint registrado; continúa los módulos habilitados':'Primer checkpoint desde el Día 7 de A2')
      :radarAvailable?'Acceso respaldado por el cierre de A3':'Pendiente de cierre verificado de A3 y acceso autorizado'
    return {...stage,state,detail,href:allowed?(stage.id==='A1'&&!onboardingComplete?onboardingPath:stage.href):null}
  })
  return {version:FLOW_VERSION,onboardingPath,next,cards,completedDays,initialDays,initialProgress:Math.round(initialDays/30*100),resumeDay,checkpointPending,radarAvailable,completedStages:cards.filter(c=>c.state==='completed').length}
}
export type JourneyFlow = ReturnType<typeof buildJourneyFlow>
