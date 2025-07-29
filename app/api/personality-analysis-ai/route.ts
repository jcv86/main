import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, testType, results, rawAnswers } = await request.json()

    if (!userId || !testType || !results) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate AI analysis based on test type and results
    const aiAnalysis = await generatePersonalityAnalysis(testType, results, rawAnswers)

    // Save test results to database
    const { data: testResult, error: testError } = await supabase
      .from("personality_test_results")
      .insert({
        user_id: userId,
        test_type: testType,
        results,
        raw_answers: rawAnswers,
        ai_analysis: aiAnalysis,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (testError) {
      console.error("Error saving test results:", testError)
      return NextResponse.json({ error: "Failed to save test results" }, { status: 500 })
    }

    // Update coach memory with personality insights
    await updateCoachMemory(userId, testType, results, aiAnalysis)

    // Generate personalized recommendations
    const recommendations = await generateRecommendations(userId, testResult.id, testType, results)

    return NextResponse.json({
      success: true,
      testResult,
      aiAnalysis,
      recommendations,
    })
  } catch (error) {
    console.error("Error in personality analysis:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generatePersonalityAnalysis(testType: string, results: any, rawAnswers: any): Promise<string> {
  // In a real implementation, this would call OpenAI GPT-4
  // For now, we'll generate comprehensive analysis based on test type

  switch (testType) {
    case "big_five":
      return generateBigFiveAnalysis(results)
    case "disc":
      return generateDISCAnalysis(results)
    case "mbti":
      return generateMBTIAnalysis(results)
    case "values":
      return generateValuesAnalysis(results)
    default:
      return "Análisis de personalidad completado exitosamente."
  }
}

function generateBigFiveAnalysis(results: any): string {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = results

  const analysis = `**🧠 Análisis Completo de Personalidad Big Five**

Tu perfil de personalidad revela una combinación única de rasgos que te posicionan de manera distintiva en el mercado laboral chileno.

**📊 Perfil Detallado:**

**Apertura a la Experiencia (${openness}%)**
${
  openness >= 70
    ? `Tu alta apertura te convierte en un innovador natural. Eres curioso, creativo y te adaptas bien a los cambios del mercado tech chileno. Las empresas como NotCo, Fintual y startups locales valorarán tu capacidad de pensar fuera de la caja.`
    : openness >= 40
      ? `Tienes un equilibrio saludable entre innovación y practicidad. Puedes adaptarte a nuevas tecnologías mientras mantienes un enfoque realista, ideal para empresas establecidas como Banco de Chile o Falabella.`
      : `Prefieres métodos probados y estabilidad. Esta característica es valiosa en roles que requieren consistencia y atención al detalle, como en el sector bancario o empresas tradicionales chilenas.`
}

**Responsabilidad (${conscientiousness}%)**
${
  conscientiousness >= 70
    ? `Tu alta responsabilidad te convierte en un empleado extremadamente confiable. Los empleadores chilenos valoran mucho esta característica. Eres ideal para roles de liderazgo y gestión de proyectos críticos.`
    : conscientiousness >= 40
      ? `Tienes un buen equilibrio entre organización y flexibilidad. Puedes seguir procesos cuando es necesario, pero también adaptarte a entornos dinámicos como startups.`
      : `Tu flexibilidad y espontaneidad pueden ser valiosas en entornos creativos y startups que requieren adaptabilidad rápida.`
}

**Extraversión (${extraversion}%)**
${
  extraversion >= 70
    ? `Tu alta extraversión es una gran ventaja en Chile, donde las relaciones personales son fundamentales en los negocios. Eres ideal para roles de ventas, liderazgo de equipos y networking profesional.`
    : extraversion >= 40
      ? `Tu equilibrio entre sociabilidad e independencia te permite trabajar bien tanto en equipo como de forma autónoma. Esta versatilidad es muy valorada en el mercado chileno.`
      : `Tu preferencia por el trabajo independiente y la reflexión profunda te hace ideal para roles técnicos especializados y análisis detallado.`
}

**Amabilidad (${agreeableness}%)**
${
  agreeableness >= 70
    ? `Tu alta amabilidad se alinea perfectamente con la cultura laboral chilena, donde se valora el buen trato y la colaboración. Eres excelente para roles en RRHH, atención al cliente y trabajo en equipo.`
    : agreeableness >= 40
      ? `Tu equilibrio entre cooperación y asertividad te permite colaborar efectivamente mientras defiendes tus ideas cuando es necesario.`
      : `Tu enfoque directo y competitivo puede ser valioso en roles de liderazgo que requieren tomar decisiones difíciles y negociaciones complejas.`
}

**Estabilidad Emocional (${100 - neuroticism}%)**
${
  neuroticism <= 30
    ? `Tu excelente estabilidad emocional es una fortaleza significativa. Manejas bien la presión y el estrés, cualidades muy valoradas en roles de liderazgo en Chile.`
    : neuroticism <= 60
      ? `Tienes una estabilidad emocional adecuada que te permite manejar la mayoría de situaciones laborales con calma y profesionalismo.`
      : `Tu sensibilidad emocional puede traducirse en mayor empatía y conciencia de los riesgos, valiosas en ciertos roles del mercado chileno.`
}

**🎯 Recomendaciones Estratégicas para Chile:**

**Sectores Ideales:**
- Tecnología y Startups (NotCo, Fintual, Cornershop)
- Servicios Financieros (Bancos, Fintech)
- Consultoría (McKinsey, Deloitte Chile)
- Retail y E-commerce (Falabella, Mercado Libre)

**Roles Recomendados:**
${getRecommendedRoles(results)}

**💰 Expectativas Salariales (Chile 2024):**
- Roles junior: $1.2M - $2.0M CLP
- Roles semi-senior: $2.0M - $3.5M CLP  
- Roles senior: $3.5M - $6.0M CLP
- Liderazgo: $5.0M - $10M CLP

**🚀 Plan de Desarrollo:**
1. **Fortalece tus puntos fuertes** mediante proyectos desafiantes
2. **Desarrolla áreas de mejora** con cursos específicos
3. **Construye tu red profesional** en el ecosistema tech chileno
4. **Considera certificaciones** relevantes para tu perfil

Este análisis te posiciona en el **top ${Math.max(15, 100 - Math.round((openness + conscientiousness + extraversion + agreeableness + (100 - neuroticism)) / 5))}%** de candidatos para roles de tu nivel en el mercado chileno.`

  return analysis
}

function generateDISCAnalysis(results: any): string {
  const { primary_type, secondary_type, scores } = results

  return `**🎯 Análisis DISC Completo**

Tu perfil DISC ${primary_type}${secondary_type || ""} revela un estilo de trabajo y comunicación único que es altamente valorado en el mercado laboral chileno.

**📊 Tu Perfil DISC:**
- **Dominancia (D):** ${scores.D}%
- **Influencia (I):** ${scores.I}%
- **Estabilidad (S):** ${scores.S}%
- **Cumplimiento (C):** ${scores.C}%

**🔍 Análisis Detallado:**

${getDISCTypeAnalysis(primary_type, scores)}

**💼 Aplicación en el Mercado Chileno:**

Tu perfil ${primary_type} es especialmente valioso en:
- Empresas que buscan ${getDISCStrengths(primary_type)}
- Roles que requieren ${getDISCSkills(primary_type)}
- Equipos que necesitan ${getDISCTeamContribution(primary_type)}

**🎯 Estrategias de Comunicación:**
${getDISCCommunicationTips(primary_type)}

**📈 Oportunidades de Desarrollo:**
${getDISCDevelopmentAreas(primary_type, scores)}

Este perfil te posiciona idealmente para roles de liderazgo y colaboración en el dinámico mercado laboral chileno.`
}

function generateMBTIAnalysis(results: any): string {
  const { type, preferences } = results

  return `**🧭 Análisis MBTI Completo - Tipo ${type}**

Tu tipo de personalidad ${type} representa una combinación única de preferencias que define tu estilo natural de trabajo y toma de decisiones.

**🔤 Desglose de tu Tipo:**
- **${preferences.EI}:** ${preferences.EI === "E" ? "Extraversión - Te energizas con la interacción social" : "Introversión - Te energizas con la reflexión interna"}
- **${preferences.SN}:** ${preferences.SN === "S" ? "Sensación - Te enfocas en hechos y detalles concretos" : "Intuición - Te enfocas en posibilidades y patrones"}
- **${preferences.TF}:** ${preferences.TF === "T" ? "Pensamiento - Tomas decisiones basadas en lógica" : "Sentimiento - Tomas decisiones basadas en valores"}
- **${preferences.JP}:** ${preferences.JP === "J" ? "Juicio - Prefieres estructura y planificación" : "Percepción - Prefieres flexibilidad y adaptabilidad"}

**💡 Tu Perfil en el Contexto Chileno:**

${getMBTIAnalysis(type)}

**🎯 Carreras Ideales:**
${getMBTICareers(type)}

**🤝 Estilo de Trabajo:**
${getMBTIWorkStyle(type)}

**📈 Desarrollo Profesional:**
${getMBTIDevelopment(type)}

Tu tipo ${type} representa aproximadamente el ${getMBTIPercentage(type)}% de la población, lo que te da una perspectiva única y valiosa en equipos diversos.`
}

function generateValuesAnalysis(results: any): string {
  const { topValues, scores } = results

  return `**⭐ Análisis de Valores Profesionales**

Tus valores fundamentales guían tus decisiones de carrera y determinan qué tipo de trabajo te brindará mayor satisfacción y éxito.

**🏆 Tus Valores Principales:**
${topValues.map((value: string, index: number) => `${index + 1}. **${value}** (${scores[value]}%)`).join("\n")}

**🎯 Significado de tus Valores:**

${getValuesAnalysis(topValues, scores)}

**💼 Ambientes Laborales Ideales:**
${getIdealWorkEnvironments(topValues)}

**🏢 Empresas Chilenas Alineadas:**
${getAlignedChileanCompanies(topValues)}

**🚀 Recomendaciones de Carrera:**
${getCareerRecommendationsByValues(topValues)}

Tus valores te posicionan para encontrar trabajo significativo y satisfactorio en el mercado chileno, especialmente en organizaciones que compartan tu visión y principios.`
}

// Helper functions for analysis generation
function getRecommendedRoles(results: any): string {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = results

  const roles = []

  if (openness >= 70 && conscientiousness >= 60) {
    roles.push("Product Manager", "Innovation Lead", "Consultor de Transformación Digital")
  }

  if (extraversion >= 70 && agreeableness >= 60) {
    roles.push("Gerente de RRHH", "Account Manager", "Líder de Equipos")
  }

  if (conscientiousness >= 70 && neuroticism <= 40) {
    roles.push("Ingeniero de Software Senior", "Project Manager", "Arquitecto de Soluciones")
  }

  if (openness >= 60 && extraversion >= 60) {
    roles.push("Consultor", "Business Development", "Gerente de Marketing")
  }

  return roles.length > 0 ? roles.join(", ") : "Desarrollador, Analista, Especialista técnico"
}

function getDISCTypeAnalysis(type: string, scores: any): string {
  const analyses = {
    D: `Como tipo **Dominante**, eres un líder natural orientado a resultados. Tu alta puntuación en Dominancia (${scores.D}%) indica que te motivan los desafíos y tomas decisiones rápidas. En el contexto chileno, esto te posiciona bien para roles ejecutivos y de liderazgo.`,
    I: `Como tipo **Influyente**, eres sociable y persuasivo. Tu alta puntuación en Influencia (${scores.I}%) muestra que te energizas con las personas y eres excelente comunicador. En Chile, donde las relaciones son clave, esta es una gran fortaleza.`,
    S: `Como tipo **Estable**, eres confiable y colaborativo. Tu alta puntuación en Estabilidad (${scores.S}%) indica que valoras la armonía y la consistencia. En la cultura laboral chilena, esto te hace un miembro de equipo muy valorado.`,
    C: `Como tipo **Cumplidor**, eres analítico y preciso. Tu alta puntuación en Cumplimiento (${scores.C}%) muestra que valoras la calidad y los estándares altos. En el mercado chileno, esto es especialmente valioso en roles técnicos y de calidad.`,
  }

  return analyses[type as keyof typeof analyses] || "Análisis personalizado de tu perfil DISC."
}

function getDISCStrengths(type: string): string {
  const strengths = {
    D: "liderazgo decisivo y orientación a resultados",
    I: "habilidades de comunicación y construcción de relaciones",
    S: "estabilidad, lealtad y trabajo en equipo",
    C: "precisión, calidad y análisis detallado",
  }

  return strengths[type as keyof typeof strengths] || "versatilidad y adaptabilidad"
}

function getDISCSkills(type: string): string {
  const skills = {
    D: "toma de decisiones rápida y liderazgo bajo presión",
    I: "persuasión, networking y motivación de equipos",
    S: "colaboración, mediación y soporte constante",
    C: "análisis crítico, control de calidad y planificación detallada",
  }

  return skills[type as keyof typeof skills] || "habilidades diversas"
}

function getDISCTeamContribution(type: string): string {
  const contributions = {
    D: "dirección clara y impulso hacia objetivos",
    I: "energía positiva y cohesión grupal",
    S: "estabilidad y apoyo incondicional",
    C: "rigor metodológico y atención al detalle",
  }

  return contributions[type as keyof typeof contributions] || "perspectiva única"
}

function getDISCCommunicationTips(type: string): string {
  const tips = {
    D: "• Sé directo y conciso\n• Enfócate en resultados y beneficios\n• Evita detalles excesivos\n• Presenta opciones y deja que decidan",
    I: "• Sé entusiasta y positivo\n• Incluye historias y ejemplos personales\n• Permite tiempo para socializar\n• Reconoce sus contribuciones públicamente",
    S: '• Sé paciente y comprensivo\n• Proporciona seguridad y apoyo\n• Explica el "por qué" detrás de los cambios\n• Permite tiempo para procesar información',
    C: "• Proporciona datos y evidencia\n• Sé preciso y bien preparado\n• Respeta su necesidad de tiempo para decidir\n• Enfócate en la calidad y exactitud",
  }

  return tips[type as keyof typeof tips] || "Adapta tu comunicación según el contexto"
}

function getDISCDevelopmentAreas(type: string, scores: any): string {
  const areas = {
    D: `• Desarrolla paciencia y habilidades de escucha\n• Practica la delegación efectiva\n• Mejora la consideración hacia otros estilos\n• Trabaja en la construcción de consenso`,
    I: `• Enfócate en el seguimiento y los detalles\n• Desarrolla habilidades de planificación\n• Practica la escucha activa\n• Mejora la gestión del tiempo`,
    S: `• Desarrolla confianza para expresar opiniones\n• Practica la toma de decisiones rápidas\n• Mejora habilidades de presentación\n• Trabaja en la adaptabilidad al cambio`,
    C: `• Desarrolla habilidades interpersonales\n• Practica la comunicación informal\n• Mejora la flexibilidad ante cambios\n• Trabaja en la toma de riesgos calculados`,
  }

  return areas[type as keyof typeof areas] || "Continúa desarrollando tus habilidades de manera integral"
}

// MBTI helper functions
function getMBTIAnalysis(type: string): string {
  const analyses: Record<string, string> = {
    INTJ: 'Como "El Arquitecto", eres un estratega natural con una visión clara del futuro. En Chile, tu capacidad de planificación a largo plazo es muy valorada en roles de consultoría y liderazgo estratégico.',
    ENTJ: 'Como "El Comandante", eres un líder nato con habilidades ejecutivas excepcionales. El mercado chileno valora tu capacidad de dirigir equipos y ejecutar estrategias complejas.',
    INFP: 'Como "El Mediador", aportas autenticidad y valores sólidos al trabajo. En Chile, tu capacidad de conectar con otros y mantener la armonía es especialmente valiosa.',
    ENFP: 'Como "El Activista", eres innovador y entusiasta. Tu energía y creatividad son perfectas para el dinámico ecosistema de startups chilenas.',
    // Add more types as needed
  }

  return analyses[type] || `Tu tipo ${type} aporta una perspectiva única y valiosa al mercado laboral chileno.`
}

function getMBTICareers(type: string): string {
  const careers: Record<string, string> = {
    INTJ: "Consultor Estratégico, Arquitecto de Software, Investigador, Analista de Sistemas",
    ENTJ: "CEO, Director de Operaciones, Consultor Senior, Gerente General",
    INFP: "Psicólogo, Escritor, Consejero, Especialista en RRHH",
    ENFP: "Marketing Manager, Consultor de Innovación, Emprendedor, Coach",
    // Add more types
  }

  return careers[type] || "Roles que aprovechen tus fortalezas naturales"
}

function getMBTIWorkStyle(type: string): string {
  const styles: Record<string, string> = {
    INTJ: "Prefieres trabajar de forma independiente en proyectos complejos, con tiempo para planificar y ejecutar estrategias a largo plazo.",
    ENTJ: "Te destacas liderando equipos hacia objetivos ambiciosos, organizando recursos y tomando decisiones ejecutivas.",
    INFP: "Trabajas mejor en ambientes que respeten tus valores, con flexibilidad para expresar tu creatividad y autenticidad.",
    ENFP: "Te energizas con la variedad, la colaboración y la oportunidad de explorar nuevas ideas y posibilidades.",
  }

  return styles[type] || "Tu estilo de trabajo único aporta valor a cualquier equipo"
}

function getMBTIDevelopment(type: string): string {
  const development: Record<string, string> = {
    INTJ: "Desarrolla habilidades de comunicación interpersonal y practica la flexibilidad en la implementación de planes.",
    ENTJ: "Trabaja en la paciencia y la consideración hacia diferentes estilos de trabajo en tu equipo.",
    INFP: "Desarrolla confianza en la presentación de ideas y practica la toma de decisiones bajo presión.",
    ENFP: "Mejora el seguimiento de proyectos y desarrolla habilidades de planificación detallada.",
  }

  return development[type] || "Continúa desarrollando tanto tus fortalezas como áreas de crecimiento"
}

function getMBTIPercentage(type: string): string {
  // Approximate percentages for MBTI types
  const percentages: Record<string, string> = {
    INTJ: "2-4",
    ENTJ: "2-4",
    INFP: "4-5",
    ENFP: "6-8",
    ISTJ: "11-14",
    ESTJ: "8-12",
    // Add more as needed
  }

  return percentages[type] || "3-5"
}

// Values analysis helper functions
function getValuesAnalysis(topValues: string[], scores: any): string {
  const valueDescriptions: Record<string, string> = {
    Autonomía:
      "Valoras la independencia y la libertad para tomar tus propias decisiones. Buscas roles donde puedas tener control sobre tu trabajo.",
    Creatividad:
      "Te motiva la innovación y la expresión creativa. Prefieres trabajos que te permitan generar ideas nuevas y originales.",
    Estabilidad:
      "Priorizas la seguridad laboral y la predictibilidad. Valoras empleadores confiables con beneficios sólidos.",
    "Impacto Social":
      "Te impulsa hacer una diferencia positiva en la sociedad. Buscas trabajo que contribuya al bienestar común.",
    Crecimiento: "Valoras las oportunidades de aprendizaje y desarrollo profesional continuo.",
    Reconocimiento:
      "Te motiva el reconocimiento por tu trabajo y logros. Valoras la visibilidad y el prestigio profesional.",
    Equilibrio:
      "Priorizas el balance entre vida personal y profesional. Buscas flexibilidad y tiempo para otras actividades.",
    Colaboración: "Te energiza trabajar en equipo y construir relaciones sólidas con colegas.",
  }

  return topValues
    .map(
      (value) =>
        `**${value}:** ${valueDescriptions[value] || "Un valor importante que guía tus decisiones profesionales."}`,
    )
    .join("\n\n")
}

function getIdealWorkEnvironments(topValues: string[]): string {
  const environments = []

  if (topValues.includes("Autonomía")) {
    environments.push("Trabajo remoto o híbrido con alta flexibilidad")
  }
  if (topValues.includes("Creatividad")) {
    environments.push("Startups innovadoras y agencias creativas")
  }
  if (topValues.includes("Estabilidad")) {
    environments.push("Empresas establecidas con estructura organizacional clara")
  }
  if (topValues.includes("Impacto Social")) {
    environments.push("ONGs, empresas B-Corp, organizaciones con propósito social")
  }
  if (topValues.includes("Colaboración")) {
    environments.push("Equipos multidisciplinarios y culturas colaborativas")
  }

  return environments.length > 0 ? environments.join("\n• ") : "Ambientes que respeten tus valores fundamentales"
}

function getAlignedChileanCompanies(topValues: string[]): string {
  const companies = []

  if (topValues.includes("Innovación") || topValues.includes("Creatividad")) {
    companies.push("NotCo, Fintual, Cornershop, Betterfly")
  }
  if (topValues.includes("Estabilidad")) {
    companies.push("Banco de Chile, Falabella, Entel, Cencosud")
  }
  if (topValues.includes("Impacto Social")) {
    companies.push("Fundación Chile, Teach for Chile, Techo, Desafío Levantemos Chile")
  }
  if (topValues.includes("Crecimiento")) {
    companies.push("Mercado Libre, Chiper, Buk, Khipu")
  }

  return companies.length > 0 ? companies.join(", ") : "Empresas que compartan tu visión y valores"
}

function getCareerRecommendationsByValues(topValues: string[]): string {
  const recommendations = []

  if (topValues.includes("Autonomía")) {
    recommendations.push("Consultoría independiente, Freelancing, Emprendimiento")
  }
  if (topValues.includes("Creatividad")) {
    recommendations.push("Diseño UX/UI, Marketing Creativo, Product Management")
  }
  if (topValues.includes("Impacto Social")) {
    recommendations.push("Gestión de Proyectos Sociales, Responsabilidad Social Corporativa")
  }
  if (topValues.includes("Liderazgo")) {
    recommendations.push("Gerencia, Dirección de Equipos, Consultoría Estratégica")
  }

  return recommendations.length > 0 ? recommendations.join("\n• ") : "Roles que se alineen con tus valores principales"
}

async function updateCoachMemory(userId: string, testType: string, results: any, analysis: string) {
  try {
    // Store personality insights in coach memory
    const memoryEntries = [
      {
        user_id: userId,
        memory_type: "personality",
        key: `${testType}_results`,
        value: results,
        context: `Resultados del test ${testType} completado`,
      },
      {
        user_id: userId,
        memory_type: "personality",
        key: `${testType}_analysis`,
        value: { analysis, generated_at: new Date().toISOString() },
        context: `Análisis IA del test ${testType}`,
      },
    ]

    for (const entry of memoryEntries) {
      await supabase.from("coach_memory").upsert(entry, { onConflict: "user_id,memory_type,key" })
    }

    // Store key personality traits for quick access
    if (testType === "big_five") {
      const traits = {
        dominant_traits: Object.entries(results)
          .filter(([_, score]) => (score as number) >= 70)
          .map(([trait, _]) => trait),
        personality_summary: `${testType.toUpperCase()} profile completed`,
        communication_style: getCommunicationStyle(results),
      }

      await supabase.from("coach_memory").upsert(
        {
          user_id: userId,
          memory_type: "preferences",
          key: "personality_traits",
          value: traits,
          context: "Key personality traits for coach adaptation",
        },
        { onConflict: "user_id,memory_type,key" },
      )
    }
  } catch (error) {
    console.error("Error updating coach memory:", error)
  }
}

function getCommunicationStyle(results: any): string {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = results

  if (extraversion >= 70 && agreeableness >= 60) {
    return "friendly_collaborative"
  } else if (conscientiousness >= 70 && neuroticism <= 40) {
    return "structured_professional"
  } else if (openness >= 70) {
    return "creative_innovative"
  } else {
    return "balanced_adaptive"
  }
}

async function generateRecommendations(userId: string, testResultId: string, testType: string, results: any) {
  try {
    const recommendations = []

    // Generate book recommendations based on personality
    const bookRecs = await generateBookRecommendations(testType, results)
    recommendations.push(
      ...bookRecs.map((book) => ({
        user_id: userId,
        test_result_id: testResultId,
        recommendation_type: "book",
        item_id: book.id,
        title: book.title,
        description: book.description,
        reason: book.reason,
        priority: book.priority,
      })),
    )

    // Generate skill development recommendations
    const skillRecs = generateSkillRecommendations(testType, results)
    recommendations.push(
      ...skillRecs.map((skill) => ({
        user_id: userId,
        test_result_id: testResultId,
        recommendation_type: "skill",
        title: skill.title,
        description: skill.description,
        reason: skill.reason,
        priority: skill.priority,
      })),
    )

    // Generate career recommendations
    const careerRecs = generateCareerRecommendations(testType, results)
    recommendations.push(
      ...careerRecs.map((career) => ({
        user_id: userId,
        test_result_id: testResultId,
        recommendation_type: "career",
        title: career.title,
        description: career.description,
        reason: career.reason,
        priority: career.priority,
      })),
    )

    // Save recommendations to database
    if (recommendations.length > 0) {
      const { error } = await supabase.from("test_recommendations").insert(recommendations)

      if (error) {
        console.error("Error saving recommendations:", error)
      }
    }

    return recommendations
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return []
  }
}

async function generateBookRecommendations(testType: string, results: any) {
  // Get books from library that match personality traits
  const { data: books } = await supabase.from("library_books").select("*").limit(20)

  if (!books) return []

  const recommendations = []

  // Match books based on personality results
  if (testType === "big_five") {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = results

    if (openness >= 70) {
      const creativityBooks = books.filter(
        (book) =>
          book.tags?.includes("Creatividad") || book.tags?.includes("Innovación") || book.category === "Creatividad",
      )
      recommendations.push(
        ...creativityBooks.slice(0, 2).map((book) => ({
          ...book,
          reason: "Tu alta apertura indica que disfrutarás explorando nuevas ideas y enfoques creativos",
          priority: 1,
        })),
      )
    }

    if (conscientiousness >= 70) {
      const productivityBooks = books.filter(
        (book) =>
          book.tags?.includes("Productividad") || book.tags?.includes("Hábitos") || book.category === "Productividad",
      )
      recommendations.push(
        ...productivityBooks.slice(0, 2).map((book) => ({
          ...book,
          reason: "Tu alta responsabilidad se beneficiará de técnicas avanzadas de productividad y organización",
          priority: 1,
        })),
      )
    }

    if (extraversion >= 70) {
      const leadershipBooks = books.filter((book) => book.tags?.includes("Liderazgo") || book.category === "Liderazgo")
      recommendations.push(
        ...leadershipBooks.slice(0, 2).map((book) => ({
          ...book,
          reason: "Tu extraversión natural te posiciona para roles de liderazgo y gestión de equipos",
          priority: 1,
        })),
      )
    }

    if (neuroticism >= 60) {
      const wellnessBooks = books.filter(
        (book) =>
          book.tags?.includes("Bienestar") ||
          book.tags?.includes("Mindfulness") ||
          book.category === "Desarrollo Personal",
      )
      recommendations.push(
        ...wellnessBooks.slice(0, 2).map((book) => ({
          ...book,
          reason: "Estos recursos te ayudarán a desarrollar mayor estabilidad emocional y manejo del estrés",
          priority: 2,
        })),
      )
    }
  }

  return recommendations.slice(0, 5) // Limit to top 5 recommendations
}

function generateSkillRecommendations(testType: string, results: any) {
  const recommendations = []

  if (testType === "big_five") {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = results

    if (openness >= 70) {
      recommendations.push({
        title: "Design Thinking",
        description: "Metodología para innovación y resolución creativa de problemas",
        reason: "Tu alta apertura te permitirá destacar en procesos de innovación estructurada",
        priority: 1,
      })
    }

    if (conscientiousness >= 70) {
      recommendations.push({
        title: "Gestión de Proyectos (PMP)",
        description: "Certificación profesional en gestión de proyectos",
        reason: "Tu organización natural te hace ideal para liderar proyectos complejos",
        priority: 1,
      })
    }

    if (extraversion >= 70) {
      recommendations.push({
        title: "Comunicación Efectiva y Presentaciones",
        description: "Habilidades avanzadas de comunicación y oratoria",
        reason: "Tu sociabilidad natural se potenciará con técnicas profesionales de comunicación",
        priority: 1,
      })
    }

    if (agreeableness >= 70) {
      recommendations.push({
        title: "Mediación y Resolución de Conflictos",
        description: "Técnicas para manejar conflictos y facilitar acuerdos",
        reason: "Tu naturaleza colaborativa te hace ideal para roles de mediación",
        priority: 2,
      })
    }

    if (neuroticism >= 60) {
      recommendations.push({
        title: "Inteligencia Emocional",
        description: "Desarrollo de habilidades de autoconciencia y autorregulación",
        reason: "Fortalecerá tu capacidad de manejar emociones en entornos profesionales",
        priority: 1,
      })
    }
  }

  return recommendations
}

function generateCareerRecommendations(testType: string, results: any) {
  const recommendations = []

  if (testType === "big_five") {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = results

    if (openness >= 70 && conscientiousness >= 60) {
      recommendations.push({
        title: "Product Manager",
        description: "Lidera el desarrollo de productos innovadores combinando creatividad y ejecución",
        reason: "Tu combinación de apertura y responsabilidad es ideal para este rol estratégico",
        priority: 1,
      })
    }

    if (extraversion >= 70 && agreeableness >= 60) {
      recommendations.push({
        title: "Gerente de Recursos Humanos",
        description: "Gestiona talento y cultura organizacional",
        reason: "Tu sociabilidad y empatía son perfectas para liderar equipos y desarrollar talento",
        priority: 1,
      })
    }

    if (conscientiousness >= 70 && neuroticism <= 40) {
      recommendations.push({
        title: "Ingeniero de Software Senior",
        description: "Desarrolla soluciones técnicas complejas y lidera proyectos de ingeniería",
        reason: "Tu organización y estabilidad emocional son ideales para roles técnicos de liderazgo",
        priority: 1,
      })
    }

    if (openness >= 60 && extraversion >= 60) {
      recommendations.push({
        title: "Consultor de Innovación",
        description: "Ayuda a empresas a transformarse digitalmente y adoptar nuevas tecnologías",
        reason: "Tu creatividad y habilidades sociales son perfectas para la consultoría estratégica",
        priority: 2,
      })
    }
  }

  return recommendations
}
