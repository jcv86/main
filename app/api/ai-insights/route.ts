import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { personalityResults } = await request.json()

    // In a real implementation, you would call OpenAI API here
    // For now, we'll return a comprehensive mock analysis

    const mockAnalysis = `Tu perfil de personalidad revela una combinación excepcional de creatividad estructurada y liderazgo empático. Con una puntuación alta en Apertura (${personalityResults.traits.openness}%) y Responsabilidad (${personalityResults.traits.conscientiousness}%), demuestras una rara capacidad para equilibrar la innovación con la ejecución práctica.

**🎯 Insights Clave:**

**Perfil Cognitivo**: Tu alta apertura combinada con consciencia elevada sugiere un pensador estratégico que puede generar ideas innovadoras y llevarlas a la realidad de manera sistemática. Esta combinación es especialmente valiosa en roles de liderazgo de producto o consultoría estratégica.

**Estilo de Liderazgo**: Tu extraversión moderada-alta (${personalityResults.traits.extraversion}%) junto con agreeableness equilibrada (${personalityResults.traits.agreeableness}%) indica un estilo de liderazgo colaborativo pero decisivo. Puedes motivar equipos sin ser dominante, una cualidad muy buscada en el mercado laboral chileno actual.

**Ventaja Competitiva**: Tu bajo neuroticismo (${personalityResults.traits.neuroticism}%) es una fortaleza significativa en entornos de alta presión. Esta estabilidad emocional, combinada con tu creatividad, te posiciona idealmente para roles en startups o empresas en transformación digital.

**🏢 Recomendaciones Estratégicas para Chile:**

**Sector Tecnológico**: Considera roles en Product Management o Innovation Lead en empresas como:
- Cornershop (Uber) - Liderazgo de producto
- NotCo - Innovación y desarrollo
- Fintual - Estrategia y crecimiento
- Mercado Libre Chile - Gestión de equipos

**Consultoría**: Tu perfil es ideal para consultorías estratégicas como McKinsey Chile, BCG, o Deloitte, donde la creatividad estructurada es clave.

**📈 Desarrollo Profesional:**
1. **Design Thinking**: Potencia tu creatividad natural con metodologías estructuradas
2. **Metodologías Ágiles**: Combina tu organización con flexibilidad
3. **Liderazgo Adaptativo**: Desarrolla tu capacidad de liderar en ambientes cambiantes

**⚠️ Puntos Ciegos a Considerar:**
- Tu perfeccionismo puede ralentizar la toma de decisiones en entornos de startup
- Considera desarrollar mayor tolerancia a la ambigüedad para maximizar tu potencial innovador

**💰 Expectativas Salariales (Chile 2024):**
- Roles junior: $1.2M - $1.8M CLP
- Roles senior: $2.5M - $4M CLP  
- Liderazgo: $4M - $8M CLP

Este perfil te posiciona en el **top 15%** de candidatos para roles de liderazgo en el mercado chileno actual.`

    return NextResponse.json({
      analysis: mockAnalysis,
      success: true,
    })
  } catch (error) {
    console.error("Error generating AI insights:", error)

    // Return fallback analysis
    return NextResponse.json({
      analysis: `**Análisis de Personalidad Profesional**

Tu combinación única de rasgos de personalidad te posiciona como un profesional versátil con gran potencial de crecimiento en el mercado laboral chileno.

**Fortalezas Clave:**
- Equilibrio entre creatividad e implementación
- Capacidad de liderazgo colaborativo
- Adaptabilidad a entornos cambiantes
- Estabilidad emocional en situaciones de presión

**Oportunidades de Carrera:**
- Roles de gestión e innovación
- Posiciones de liderazgo de equipos
- Consultoría estratégica
- Emprendimiento y startups

**Recomendaciones de Desarrollo:**
- Continúa desarrollando habilidades de liderazgo
- Explora metodologías de innovación
- Considera roles con mayor responsabilidad estratégica

Este análisis está basado en tu perfil de personalidad y las tendencias actuales del mercado laboral chileno.`,
      success: true,
    })
  }
}
