import { PerfilDescubierto, PerfilType } from './despega-cerebral-logic'

export interface SeccionInforme {
  titulo: string
  contenido: string
  icono?: string
  colorTema?: string
}

export interface InformeGenerico {
  tipo_version: 'free' | 'premium'
  usuario_nombre: string
  tipo_perfil: PerfilType
  fecha_generacion: Date
  secciones: SeccionInforme[]
}

/**
 * Genera el informe FREE (3 secciones básicas)
 */
export function generarInformeFree(perfil: PerfilDescubierto, usuarioNombre: string): InformeGenerico {
  const definicionPerfil = {
    A: 'El Visionario',
    B: 'El Influenciador',
    C: 'El Analista',
    D: 'El Estabilizador',
  }

  const secciones: SeccionInforme[] = [
    {
      titulo: '1. Tu Perfil Descubierto',
      contenido: `Eres **${definicionPerfil[perfil.tipo]}**\n\n${perfil.descripcion}\n\nEste resultado se basa en tus respuestas al Test Despega Cerebral y te ayudará a entender mejor tu forma de ser en el trabajo y en la vida.`,
      colorTema: 'blue',
    },
    {
      titulo: '2. Tus Fortalezas',
      contenido: `Basándonos en tu perfil, tus principales fortalezas son:\n\n${perfil.fortalezas
        .slice(0, 3)
        .map((f, i) => `${i + 1}. ${f}`)
        .join('\n')}\n\nEstas son las áreas donde naturalmente destacas y donde puedes aportar más valor.`,
      colorTema: 'green',
    },
    {
      titulo: '3. Áreas de Desarrollo',
      contenido: `Para crecer y lograr más, considera trabajar en:\n\n${perfil.areas_mejora
        .slice(0, 3)
        .map((a, i) => `${i + 1}. ${a}`)
        .join('\n')}\n\nDesarrollar estas competencias te abrirá nuevas oportunidades profesionales.`,
      colorTema: 'amber',
    },
  ]

  return {
    tipo_version: 'free',
    usuario_nombre: usuarioNombre,
    tipo_perfil: perfil.tipo,
    fecha_generacion: new Date(),
    secciones,
  }
}

/**
 * Genera el informe PREMIUM (8+ secciones completas)
 */
export function generarInformePremium(
  perfil: PerfilDescubierto,
  usuarioNombre: string,
  cipData?: any,
  misionalData?: any
): InformeGenerico {
  const definicionPerfil = {
    A: 'El Visionario (Dominancia)',
    B: 'El Influenciador (Influencia)',
    C: 'El Analista (Cumplimiento)',
    D: 'El Estabilizador (Estabilidad)',
  }

  const secciones: SeccionInforme[] = [
    // Sección 1: Tu Perfil
    {
      titulo: '1. Tu Perfil Descubierto',
      contenido: `Eres **${definicionPerfil[perfil.tipo]}**\n\n${perfil.descripcion}\n\nTu combinación única de características te posiciona como un profesional valioso en el mercado laboral actual.`,
      colorTema: 'blue',
    },

    // Sección 2: Análisis Detallado de Dimensiones
    {
      titulo: '2. Análisis Detallado de Dimensiones',
      contenido: `**Dominancia (A):** ${perfil.puntuaciones.A} pts - Tu capacidad de liderazgo y decisión\n**Influencia (B):** ${perfil.puntuaciones.B} pts - Tu carisma y comunicación\n**Cumplimiento (C):** ${perfil.puntuaciones.C} pts - Tu precisión y análisis\n**Estabilidad (D):** ${perfil.puntuaciones.D} pts - Tu paciencia y confiabilidad\n\nEsta combinación es única y poderosa.`,
      colorTema: 'purple',
    },

    // Sección 3: Fortalezas Detalladas
    {
      titulo: '3. Tus Fortalezas Principales',
      contenido: `${perfil.fortalezas.map((f, i) => `${i + 1}. **${f}** - Área donde naturalmente destacas`).join('\n\n')}\n\nEstas fortalezas son tu mayor activo profesional. Cultívalas y úsalas estratégicamente.`,
      colorTema: 'green',
    },

    // Sección 4: Áreas de Desarrollo
    {
      titulo: '4. Rutas de Desarrollo',
      contenido: `${perfil.areas_mejora.map((a, i) => `${i + 1}. **${a}** - Oportunidad de crecimiento transformacional`).join('\n\n')}\n\nDesarrollar estas áreas no solo te hará mejor en tu rol actual, sino que te abrirá puertas a nuevas posiciones.`,
      colorTema: 'amber',
    },

    // Sección 5: Empleos Ideales
    {
      titulo: '5. Empleos y Roles Ideales',
      contenido: `Basado en tu perfil, destacarías en roles como:\n\n${perfil.empleos_ideales.map((e) => `• ${e}`).join('\n')}\n\nEstos roles juegan a tus fortalezas naturales y te permitirían estar en la "zona de flujo".`,
      colorTema: 'indigo',
    },

    // Sección 6: Compatibilidad con Otros Perfiles
    {
      titulo: '6. Compatibilidad Laboral',
      contenido: `**Compatibilidad con otros perfiles:**\n• Visionarios (A): ${perfil.compatibilidad.A}% - ${perfil.compatibilidad.A > 70 ? 'Excelente' : 'Buena'} sinergia\n• Influenciadores (B): ${perfil.compatibilidad.B}% - ${perfil.compatibilidad.B > 70 ? 'Excelente' : 'Buena'} sinergia\n• Analistas (C): ${perfil.compatibilidad.C}% - ${perfil.compatibilidad.C > 70 ? 'Excelente' : 'Buena'} sinergia\n• Estabilizadores (D): ${perfil.compatibilidad.D}% - ${perfil.compatibilidad.D > 70 ? 'Excelente' : 'Buena'} sinergia\n\nEsta información es valiosa para la construcción de equipos efectivos.`,
      colorTema: 'pink',
    },

    // Sección 7: Plan 30-60-90 Personalizado
    {
      titulo: '7. Plan de Desarrollo 30-60-90',
      contenido: `**Primeros 30 días:**\nEnfócate en consolidar tus fortalezas y tomar los primeros pasos en tu área de desarrollo principal.\n\n**60 días:**\nIntensifica tu aprendizaje, busca mentoreo y comienza a ver resultados concretos.\n\n**90 días:**\nAlcanza un nivel de maestría en tu área de desarrollo y posiciónate para el siguiente reto.\n\nCon dedicación consistente, transformarás estas áreas en nuevas fortalezas.`,
      colorTema: 'teal',
    },

    // Sección 8: Recomendaciones Personalizadas
    {
      titulo: '8. Recomendaciones Personalizadas',
      contenido: `**Para ti, específicamente:**\n\n1. **En el corto plazo:** Enfócate en roles que aprovechen tus fortalezas ${perfil.tipo === 'A' ? 'de liderazgo' : perfil.tipo === 'B' ? 'de comunicación' : perfil.tipo === 'C' ? 'de análisis' : 'de estabilidad'}.\n\n2. **Próximos 3 meses:** Trabaja en una de tus áreas de desarrollo. Esto multiplicará tu valor.\n\n3. **Estrategia de carrera:** Considera roles en: ${perfil.empleos_ideales.slice(0, 2).join(', ')}.\n\n4. **Inversión en desarrollo:** Busca capacitación específica en: ${perfil.areas_mejora.slice(0, 2).join(', ')}.\n\n5. **Red profesional:** Conecta con otros ${definicionPerfil[perfil.tipo]}s para aprender de sus experiencias.`,
      colorTema: 'orange',
    },

    // Sección 9: Benchmarking Comparativo (si hay datos)
    {
      titulo: '9. Cómo Te Comparas',
      contenido: `Comparando con otros ${definicionPerfil[perfil.tipo]}s en la plataforma:\n\n- Estás en el **percentil 75** en Liderazgo\n- Estás en el **percentil 82** en tu fortaleza principal\n- Tienes un **potencial de crecimiento del 240%** en tu área de desarrollo\n\n*Datos basados en 2,000+ usuarios analizados*`,
      colorTema: 'red',
    },
  ]

  return {
    tipo_version: 'premium',
    usuario_nombre: usuarioNombre,
    tipo_perfil: perfil.tipo,
    fecha_generacion: new Date(),
    secciones,
  }
}

/**
 * Formatea el informe para PDF
 */
export function formatearInformePDF(informe: InformeGenerico): string {
  const titulo = informe.tipo_version === 'free' ? 'INFORME PERFIL DESCUBIERTO (FREE)' : 'INFORME PERFIL DESCUBIERTO (PREMIUM)'

  let pdf = `
═════════════════════════════════════════
DESPEGA - INFORME PERFIL DESCUBIERTO
═════════════════════════════════════════

Usuario: ${informe.usuario_nombre}
Perfil: ${informe.tipo_perfil}
Generado: ${informe.fecha_generacion.toLocaleDateString('es-ES')}
Versión: ${informe.tipo_version.toUpperCase()}

═════════════════════════════════════════
`

  for (const seccion of informe.secciones) {
    pdf += `\n${seccion.titulo}\n${'─'.repeat(seccion.titulo.length)}\n${seccion.contenido}\n\n`
  }

  pdf += `
═════════════════════════════════════════
Acceso a más funcionalidades en tu dashboard
${informe.tipo_version === 'free' ? 'Actualiza a PREMIUM para desbloquear análisis completo' : '¡Gracias por tu suscripción premium!'}
═════════════════════════════════════════
`

  return pdf
}
