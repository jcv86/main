// CANON Rules Engine v1.1 - Nivel 3-4
// Motor que mapea Respuesta → Regla → Salida con Trazabilidad Completa
// Incluye validación de contradicciones, factores de riesgo, y stress-testing

export interface C2Responses {
  tiempo_disponible_diario_minutos: number
  energia_nivel_actual: number
  barreras_principales: string[]
  formato_preferido: "video" | "texto" | "audio" | "mixto"
  soporte_necesario: "autodidacta" | "grupo" | "mentor" | "estructura"
  contexto_vida: string
  metrica_exito: string
  expectativa_30_dias: string
  expectativa_60_dias: string
  expectativa_90_dias: string
}

export interface CanonRule {
  id: string
  priority: number // 1-10, mayor = más importante
  condition: (responses: Record<number, any>) => boolean
  output: (responses: Record<number, any>) => CanonAction
  trazability: string // Descripción de por qué se aplicó esta regla
}

export interface CanonAction {
  id: string
  type: 'mission' | 'habit' | 'learning' | 'reflection'
  title: string
  description: string
  duration: number // minutos
  frequency: 'daily' | 'weekly' | 'twice-weekly'
  phase: 30 | 60 | 90 // En qué fase del 90 (30, 60 o 90 días)
  tags: string[]
  trazability_source_response_ids: number[] // Qué preguntas generaron esto
  difficulty: 'easy' | 'medium' | 'hard'
  success_metric: string
}

export interface GeneratedRoute {
  mision_30: MisionMilestone
  mision_60: MisionMilestone
  mision_90: MisionMilestone
  recomendaciones_personalizadas: string[]
  contradicciones_detectadas: string[]
  factores_riesgo: string[]
  factores_exito: string[]
}

export interface MisionMilestone {
  objetivo_principal: string
  tareas_clave: string[]
  metricas: string[]
  formato_recomendado: string
  intensidad: "suave" | "moderada" | "alta"
  soporte_recomendado: string[]
}

// ========== CLASE PRINCIPAL: CANON RULES ENGINE ==========

export class CanonRulesEngine {
  /**
   * Genera una ruta personalizada completa basada en todas las respuestas
   */
  static generateRoute(
    c2Responses: C2Responses,
    a1Profile: string,
    c1Context: Record<number, string>
  ): GeneratedRoute {
    const reglas = this.evaluateRules(c2Responses, a1Profile)
    const contradicciones = this.detectContradicciones(c2Responses)
    const factoresRiesgo = this.identifyRiskFactors(c2Responses)
    const factoresExito = this.identifySuccessFactors(c2Responses, a1Profile)

    return {
      mision_30: this.generateMilestone30(c2Responses, reglas),
      mision_60: this.generateMilestone60(c2Responses, reglas),
      mision_90: this.generateMilestone90(c2Responses, reglas),
      recomendaciones_personalizadas: reglas.recomendaciones,
      contradicciones_detectadas: contradicciones,
      factores_riesgo: factoresRiesgo,
      factores_exito: factoresExito,
    }
  }

  private static evaluateRules(c2: C2Responses, profile: string) {
    const recomendaciones: string[] = []
    const reglas = {
      tiempoIntensidad: this.evaluateTimeRules(c2.tiempo_disponible_diario_minutos),
      energiaIntensidad: this.evaluateEnergyRules(c2.energia_nivel_actual),
      barrierasAjustes: this.evaluateBarrierRules(c2.barreras_principales),
      formatoRecomendado: this.evaluateFormatRules(c2.formato_preferido),
      soporteEstructura: this.evaluateSupportRules(c2.soporte_necesario),
    }

    // Combina reglas para generar recomendaciones coherentes
    if (c2.tiempo_disponible_diario_minutos < 30) {
      recomendaciones.push(
        "Enfocamos en micro-sesiones de 15 min máximo para máxima consistencia"
      )
      recomendaciones.push(
        "Formato audio/video corto es ideal para tu restricción de tiempo"
      )
    } else if (c2.tiempo_disponible_diario_minutos >= 60) {
      recomendaciones.push(
        "Tienes espacio para profundizar - incluimos desafíos opcionales"
      )
      recomendaciones.push(
        "Sesiones de 45-60 min permiten práctica real y feedback"
      )
    }

    if (c2.energia_nivel_actual <= 4) {
      recomendaciones.push(
        "Primer mes enfocado en pequeñas victorias para construir momentum"
      )
      recomendaciones.push(
        "Aumentamos intensidad gradualmente a medida que gana energía"
      )
    }

    if (c2.barreras_principales.includes("confianza")) {
      recomendaciones.push(
        "Incluimos validaciones frecuentes y feedback positivo en cada paso"
      )
    }

    if (c2.soporte_necesario === "mentor") {
      recomendaciones.push(
        "Recomendamos sesiones semanales con un coach especializado"
      )
    } else if (c2.soporte_necesario === "grupo") {
      recomendaciones.push(
        "Integración en comunidad de aprendizaje con accountability partners"
      )
    }

    return { ...reglas, recomendaciones }
  }

  private static evaluateTimeRules(minutos: number) {
    if (minutos < 15) return "muy_corta"
    if (minutos < 30) return "corta"
    if (minutos < 60) return "moderada"
    return "extensa"
  }

  private static evaluateEnergyRules(nivel: number) {
    if (nivel <= 3) return "baja"
    if (nivel <= 6) return "media"
    return "alta"
  }

  private static evaluateBarrierRules(barreras: string[]) {
    const ajustes: Record<string, string> = {}
    if (barreras.includes("tiempo")) ajustes.tiempo = "micro-sesiones"
    if (barreras.includes("dinero")) ajustes.recursos = "contenido_gratuito"
    if (barreras.includes("confianza")) ajustes.confianza = "mas_validacion"
    if (barreras.includes("contexto")) ajustes.contexto = "flexible_timing"
    return ajustes
  }

  private static evaluateFormatRules(formato: string) {
    return formato === "mixto" ? ["video", "texto", "audio"] : [formato]
  }

  private static evaluateSupportRules(soporte: string) {
    const estructuras: Record<string, string[]> = {
      autodidacta: ["recursos_self_paced", "checklists_claros"],
      grupo: ["comunidad", "accountability_partners"],
      mentor: ["sesiones_semanales", "seguimiento_personalizado"],
      estructura: ["calendario_diario", "recordatorios", "micro_goals"],
    }
    return estructuras[soporte] || []
  }

  private static detectContradicciones(c2: C2Responses): string[] {
    const contradicciones: string[] = []

    // Si dice poco tiempo pero expects gran cambio
    if (
      c2.tiempo_disponible_diario_minutos < 30 &&
      c2.expectativa_90_dias.toLowerCase().includes("carrera")
    ) {
      contradicciones.push(
        "⚠️ Esperas un cambio de carrera en 90 días con <30 min/día. Esto es muy agresivo. Recomendamos recalibrar el objetivo o aumentar tiempo."
      )
    }

    // Si energía baja pero expects resultados inmediatos
    if (c2.energia_nivel_actual <= 3 && c2.expectativa_30_dias.length < 10) {
      contradicciones.push(
        "⚠️ Tu energía es baja pero esperas resultados en 30 días. Sugerimos enfocarnos primero en recuperar energía."
      )
    }

    // Si barreras = "todo" pero soporte = "autodidacta"
    if (
      c2.barreras_principales.length >= 4 &&
      c2.soporte_necesario === "autodidacta"
    ) {
      contradicciones.push(
        "⚠️ Tienes múltiples barreras pero elegiste ser autodidacta. Considera soporte de grupo o mentor."
      )
    }

    return contradicciones
  }

  private static identifyRiskFactors(c2: C2Responses): string[] {
    const riesgos: string[] = []

    if (c2.tiempo_disponible_diario_minutos < 15) {
      riesgos.push("Consistencia baja por tiempo muy limitado")
    }
    if (c2.energia_nivel_actual <= 2) {
      riesgos.push("Riesgo de abandono por energía muy baja")
    }
    if (
      c2.barreras_principales.includes("confianza") &&
      c2.soporte_necesario === "autodidacta"
    ) {
      riesgos.push("Sin validación externa, confianza puede disminuir")
    }

    return riesgos
  }

  private static identifySuccessFactors(c2: C2Responses, profile: string): string[] {
    const factores: string[] = []

    if (c2.energia_nivel_actual >= 7) {
      factores.push("Alta energía = momentum natural para lograr más")
    }
    if (c2.tiempo_disponible_diario_minutos >= 45) {
      factores.push("Tiempo suficiente para práctica real y consolidación")
    }
    if (c2.soporte_necesario === "mentor" || c2.soporte_necesario === "grupo") {
      factores.push("Soporte externo aumenta accountability y resultados")
    }
    if (c2.barreras_principales.length === 0) {
      factores.push("Sin barreras percibidas = alta probabilidad de éxito")
    }

    return factores
  }

  private static generateMilestone30(c2: C2Responses, reglas: any): MisionMilestone {
    return {
      objetivo_principal: "Establecer la base y generar primer momentum",
      tareas_clave: [
        "Día 1-5: Claridad - entender exactamente qué quieres lograr",
        "Día 6-15: Primeros pasos - tomar acción pequeña pero consistente",
        "Día 16-30: Consolidar - celebrar primeras victorias",
      ],
      metricas: ["Consistencia: 80% de sesiones completadas", "Energía: mantener o +1 nivel"],
      formato_recomendado: reglas.formatoRecomendado || "mixto",
      intensidad: c2.energia_nivel_actual <= 3 ? "suave" : "moderada",
      soporte_recomendado: reglas.soporteEstructura,
    }
  }

  private static generateMilestone60(c2: C2Responses, reglas: any): MisionMilestone {
    return {
      objetivo_principal: "Profundizar habilidades y aumentar desafío",
      tareas_clave: [
        "Ampliar práctica a contextos más retadores",
        "Recibir feedback estructurado",
        "Ajustar estrategia según resultados del mes 1-2",
      ],
      metricas: ["Profundidad: práctica real en contexto laboral", "Feedback: +1 mejora percibida"],
      formato_recomendado: reglas.formatoRecomendado || "mixto",
      intensidad: "moderada",
      soporte_recomendado: reglas.soporteEstructura,
    }
  }

  private static generateMilestone90(c2: C2Responses, reglas: any): MisionMilestone {
    return {
      objetivo_principal: "Integración completa - nuevo hábito instalado",
      tareas_clave: [
        "Aplicar aprendizajes en decisiones reales",
        "Medir impacto real en carrera/vida",
        "Planear siguientes 90 días",
      ],
      metricas: ["Sostenibilidad: nuevo comportamiento es automático", "Impacto: métrica de éxito alcanzada"],
      formato_recomendado: reglas.formatoRecomendado || "mixto",
      intensidad: "moderada",
      soporte_recomendado: reglas.soporteEstructura,
    }
  }
}
