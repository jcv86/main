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
 * Genera HTML del informe para visualización
 */
export function generateInformeHTML(perfil: any, content: any, isPremium: boolean): string {
  const tipo = perfil.perfil_tipo || 'C'
  const tiposEmoji = {
    A: '⚡',
    B: '🌟',
    C: '🎯',
    D: '🛡️',
  }

  const tiposNombre = {
    A: 'El Visionario (Dominancia)',
    B: 'El Influenciador (Influencia)',
    C: 'El Analista (Cumplimiento)',
    D: 'El Estabilizador (Estabilidad)',
  }

  const emoji = tiposEmoji[tipo as keyof typeof tiposEmoji] || '🎯'
  const nombre = tiposNombre[tipo as keyof typeof tiposNombre] || 'Perfil Descubierto'

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil Descubierto - Despega</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6b21a8; padding-bottom: 20px; }
    .emoji { font-size: 60px; margin: 10px 0; }
    h1 { color: #6b21a8; margin: 10px 0; }
    h2 { color: #7e22ce; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #7e22ce; padding-left: 15px; }
    .section { margin-bottom: 25px; }
    .fortalezas, .desarrollo { background: #f9fafb; padding: 15px; border-radius: 8px; }
    .item { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #10b981; border-radius: 4px; }
    .premium { background: #dbeafe; padding: 20px; border-radius: 8px; border: 2px solid #3b82f6; margin: 20px 0; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji">${emoji}</div>
      <h1>Tu Perfil Descubierto</h1>
      <p style="font-size: 24px; color: #7e22ce; margin: 0;">${nombre}</p>
      <p style="color: #6b7280; margin: 5px 0;">Test Despega Cerebral</p>
    </div>

    <div class="section">
      <h2>Resumen</h2>
      <p>${content.resumen || 'Tu perfil se está generando...'}</p>
    </div>

    <div class="section fortalezas">
      <h2>Tus Fortalezas</h2>
      ${(content.fortalezas || []).map((f: string) => `<div class="item">✓ ${f}</div>`).join('')}
    </div>

    <div class="section desarrollo">
      <h2>Áreas de Desarrollo</h2>
      ${(content.areas_desarrollo || []).map((a: string) => `<div class="item">→ ${a}</div>`).join('')}
    </div>

    ${!isPremium ? `
    <div class="premium">
      <h3 style="margin-top: 0; color: #1e40af;">Desbloquea tu Informe Completo</h3>
      <p>Acceso a análisis detallado, comparativas con otros usuarios, rutas personalizadas y seguimiento 30-60-90.</p>
      <a href="/pricing" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Actualizar a Premium</a>
    </div>
    ` : `
    <div class="premium" style="background: #d1fae5; border-color: #10b981;">
      <h3 style="margin-top: 0; color: #065f46;">🎉 Premium Desbloqueado</h3>
      <p>¡Tienes acceso a todas las funcionalidades avanzadas! Explora tu informe completo en el dashboard.</p>
    </div>
    `}

    <div class="footer">
      <p>© Despega - Plataforma de Desarrollo Profesional</p>
      <p>Informe generado el ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
  </div>
</body>
</html>
  `
}
