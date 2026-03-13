// DISC Assessment - 28 preguntas de evaluación de personalidad
// Basado en el modelo DISC: Dominance, Influence, Steadiness, Conscientiousness

export interface DiscQuestion {
  id: number
  text: string
  category: 'D' | 'I' | 'S' | 'C'
  trait: string
}

export const DISC_QUESTIONS: DiscQuestion[] = [
  // DOMINANCE (D) - Conducir, Controlar, Decidir
  { id: 1, text: "Prefiero tomar decisiones rápidamente, incluso sin toda la información", category: 'D', trait: 'decision_speed' },
  { id: 2, text: "Me gusta estar en control de las situaciones y ser responsable de resultados", category: 'D', trait: 'control' },
  { id: 3, text: "Soy competitivo y busco constantemente ganar o superar a otros", category: 'D', trait: 'competitiveness' },
  { id: 4, text: "Me agrada desafiar el status quo y proponer nuevas formas de hacer las cosas", category: 'D', trait: 'challenge' },
  { id: 5, text: "Prefiero enfrentar conflictos directamente en lugar de evitarlos", category: 'D', trait: 'directness' },
  { id: 6, text: "Soy directo en mi comunicación, incluso si puedo herir sentimientos", category: 'D', trait: 'bluntness' },
  { id: 7, text: "Me motiva la oportunidad de liderar y dirigir a otros", category: 'D', trait: 'leadership' },

  // INFLUENCE (I) - Inspirar, Influir, Impresionar
  { id: 8, text: "Disfruto interactuando con personas nuevas y haciendo nuevos amigos", category: 'I', trait: 'sociability' },
  { id: 9, text: "Soy entusiasta y contagio mi energía a otros", category: 'I', trait: 'enthusiasm' },
  { id: 10, text: "Prefiero hablar y persuadir antes que escribir o analizar datos", category: 'I', trait: 'communication_style' },
  { id: 11, text: "Me encanta ser el centro de atención en grupos o reuniones", category: 'I', trait: 'attention_seeking' },
  { id: 12, text: "Soy optimista y veo el lado positivo de las situaciones", category: 'I', trait: 'optimism' },
  { id: 13, text: "Me motivan los elogios y el reconocimiento de otros", category: 'I', trait: 'recognition' },
  { id: 14, text: "Prefiero ambiente dinámico y variado al trabajo rutinario", category: 'I', trait: 'variety' },

  // STEADINESS (S) - Servir, Sostener, Apoyar
  { id: 15, text: "Valoro la estabilidad y predictibilidad en mi trabajo y vida", category: 'S', trait: 'stability' },
  { id: 16, text: "Soy paciente y puedo esperar a que las cosas se desarrollen naturalmente", category: 'S', trait: 'patience' },
  { id: 17, text: "Me gusta trabajar en equipo y colaborar con otros", category: 'S', trait: 'teamwork' },
  { id: 18, text: "Prefiero evitar cambios abruptos y adaptar gradualmente", category: 'S', trait: 'change_resistance' },
  { id: 19, text: "Soy buen oyente y disfruto ayudando a otros con sus problemas", category: 'S', trait: 'empathy' },
  { id: 20, text: "Valoro las relaciones personales sobre el logro individual", category: 'S', trait: 'relationships' },
  { id: 21, text: "Soy leal y consistente en mis compromisos", category: 'S', trait: 'loyalty' },

  // CONSCIENTIOUSNESS (C) - Cumplir, Comprobar, Calcular
  { id: 22, text: "Me agrada analizar datos y información antes de tomar decisiones", category: 'C', trait: 'analysis' },
  { id: 23, text: "Soy detallista y me preocupa que todo esté correcto", category: 'C', trait: 'attention_detail' },
  { id: 24, text: "Prefiero seguir procedimientos establecidos y normas", category: 'C', trait: 'compliance' },
  { id: 25, text: "Soy crítico y cuestiono las cosas que no tienen lógica clara", category: 'C', trait: 'criticism' },
  { id: 26, text: "Me motiva hacer un trabajo de alta calidad, incluso si toma más tiempo", category: 'C', trait: 'quality' },
  { id: 27, text: "Prefiero trabajar solo en tareas complejas que requieren concentración", category: 'C', trait: 'independence' },
  { id: 28, text: "Soy cauteloso y prefiero analizar riesgos antes de actuar", category: 'C', trait: 'caution' },
]
