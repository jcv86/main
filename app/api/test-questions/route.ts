import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("type")

    if (!testType) {
      return NextResponse.json({ error: "Test type is required" }, { status: 400 })
    }

    // Try to fetch from database first
    try {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_type", testType)
        .order("question_number")

      if (!error && data && data.length > 0) {
        const formattedData = data.map((question) => ({
          ...question,
          options: typeof question.options === "string" ? JSON.parse(question.options) : question.options,
        }))
        return NextResponse.json(formattedData)
      }
    } catch (dbError) {
      console.log("Database not available, using mock data")
    }

    // Fallback to mock data
    const mockQuestions = getMockQuestions(testType)
    return NextResponse.json(mockQuestions)
  } catch (error) {
    console.error("Error fetching test questions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getMockQuestions(testType: string) {
  if (testType === "emotional-intelligence") {
    return [
      {
        id: 1,
        test_type: "emotional-intelligence",
        question_number: 1,
        question_text: "¿Cómo reaccionas cuando alguien te critica constructivamente?",
        options: [
          "Me molesto y me pongo a la defensiva",
          "Escucho pero no cambio mi comportamiento",
          "Considero la crítica y reflexiono sobre ella",
          "Agradezco la retroalimentación y busco mejorar",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
      },
      {
        id: 2,
        test_type: "emotional-intelligence",
        question_number: 2,
        question_text: "Cuando estás muy estresado en el trabajo, ¿qué haces?",
        options: [
          "Exploto y descargo mi frustración con otros",
          "Me quedo callado pero sigo sintiéndome mal",
          "Tomo un descanso para calmarme",
          "Uso técnicas de respiración y manejo del estrés",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
      },
      {
        id: 3,
        test_type: "emotional-intelligence",
        question_number: 3,
        question_text: "¿Qué te motiva más en tu trabajo?",
        options: [
          "Solo el salario y los beneficios",
          "El reconocimiento de otros",
          "Los desafíos y el crecimiento personal",
          "Hacer una diferencia significativa",
        ],
        category: "motivation",
        question_type: "multiple_choice",
      },
      {
        id: 4,
        test_type: "emotional-intelligence",
        question_number: 4,
        question_text: "Cuando un compañero está visiblemente molesto, ¿cómo respondes?",
        options: [
          "Lo ignoro, no es mi problema",
          "Le pregunto qué pasa pero no profundizo",
          "Trato de entender cómo se siente",
          "Ofrezco apoyo y ayuda específica",
        ],
        category: "empathy",
        question_type: "multiple_choice",
      },
      {
        id: 5,
        test_type: "emotional-intelligence",
        question_number: 5,
        question_text: "En una reunión de equipo con conflicto, ¿cómo actúas?",
        options: [
          "Evito participar en la discusión",
          "Tomo partido por una de las partes",
          "Trato de mediar y encontrar puntos en común",
          "Facilito una solución colaborativa",
        ],
        category: "social_skills",
        question_type: "multiple_choice",
      },
      {
        id: 6,
        test_type: "emotional-intelligence",
        question_number: 6,
        question_text: "¿Qué tan bien reconoces tus propias emociones cuando surgen?",
        options: [
          "Raramente me doy cuenta de lo que siento",
          "A veces noto mis emociones después de un tiempo",
          "Generalmente reconozco mis emociones cuando aparecen",
          "Siempre estoy consciente de mis estados emocionales",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
      },
      {
        id: 7,
        test_type: "emotional-intelligence",
        question_number: 7,
        question_text: "Cuando cometes un error importante, ¿cómo reaccionas?",
        options: [
          "Me culpo severamente y me siento terrible por días",
          "Trato de olvidarlo rápidamente",
          "Analizo qué salió mal y aprendo de ello",
          "Lo veo como una oportunidad de crecimiento y mejora",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
      },
      {
        id: 8,
        test_type: "emotional-intelligence",
        question_number: 8,
        question_text: "¿Qué te impulsa a seguir adelante cuando enfrentas obstáculos?",
        options: [
          "La presión externa y las expectativas de otros",
          "El miedo al fracaso",
          "Mi deseo personal de lograr mis metas",
          "La pasión por lo que hago y el impacto positivo",
        ],
        category: "motivation",
        question_type: "multiple_choice",
      },
      {
        id: 9,
        test_type: "emotional-intelligence",
        question_number: 9,
        question_text: "¿Qué tan bien puedes 'leer' las emociones de otras personas?",
        options: [
          "Me cuesta mucho entender cómo se sienten otros",
          "A veces capto señales emocionales obvias",
          "Generalmente puedo percibir el estado emocional de otros",
          "Soy muy hábil detectando emociones sutiles en otros",
        ],
        category: "empathy",
        question_type: "multiple_choice",
      },
      {
        id: 10,
        test_type: "emotional-intelligence",
        question_number: 10,
        question_text: "¿Cómo manejas los desacuerdos con colegas o amigos?",
        options: [
          "Evito el conflicto a toda costa",
          "Insisto en que tengo razón hasta que ceden",
          "Busco un compromiso que funcione para ambos",
          "Facilito una conversación abierta para entender todas las perspectivas",
        ],
        category: "social_skills",
        question_type: "multiple_choice",
      },
      {
        id: 11,
        test_type: "emotional-intelligence",
        question_number: 11,
        question_text: "¿Con qué frecuencia reflexionas sobre tus reacciones emocionales?",
        options: [
          "Nunca pienso en por qué reacciono como lo hago",
          "Ocasionalmente me pregunto sobre mis reacciones",
          "Regularmente analizo mis respuestas emocionales",
          "Constantemente evalúo y aprendo de mis reacciones",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
      },
      {
        id: 12,
        test_type: "emotional-intelligence",
        question_number: 12,
        question_text: "Cuando te sientes abrumado, ¿qué estrategia usas?",
        options: [
          "Me paralizo y no puedo hacer nada productivo",
          "Trabajo más duro sin parar hasta terminar",
          "Tomo descansos y organizo mis prioridades",
          "Uso técnicas específicas de manejo del estrés y busco apoyo",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
      },
      {
        id: 13,
        test_type: "emotional-intelligence",
        question_number: 13,
        question_text: "¿Cómo te mantienes motivado en proyectos de largo plazo?",
        options: [
          "Me cuesta mantener el interés por mucho tiempo",
          "Dependo de recordatorios externos y presión",
          "Me enfoco en los beneficios a largo plazo",
          "Encuentro significado personal y celebro pequeños logros",
        ],
        category: "motivation",
        question_type: "multiple_choice",
      },
      {
        id: 14,
        test_type: "emotional-intelligence",
        question_number: 14,
        question_text: "Cuando alguien está pasando por un momento difícil, ¿cómo respondes?",
        options: [
          "No sé qué decir, así que evito el tema",
          "Trato de animarlos diciéndoles que todo estará bien",
          "Escucho activamente y valido sus sentimientos",
          "Ofrezco apoyo emocional específico y ayuda práctica",
        ],
        category: "empathy",
        question_type: "multiple_choice",
      },
      {
        id: 15,
        test_type: "emotional-intelligence",
        question_number: 15,
        question_text: "¿Cómo construyes relaciones sólidas en el trabajo?",
        options: [
          "Me enfoco solo en completar mis tareas",
          "Soy amigable pero mantengo distancia profesional",
          "Busco oportunidades para colaborar y conocer a otros",
          "Invierto tiempo en entender y apoyar a mis colegas",
        ],
        category: "social_skills",
        question_type: "multiple_choice",
      },
      {
        id: 16,
        test_type: "emotional-intelligence",
        question_number: 16,
        question_text: "¿Qué tan consciente eres de cómo tus emociones afectan tu rendimiento?",
        options: [
          "No veo conexión entre mis emociones y mi trabajo",
          "A veces noto que mis emociones impactan mi productividad",
          "Generalmente entiendo cómo mis emociones influyen en mi desempeño",
          "Siempre monitoreo y ajusto mi estado emocional para optimizar mi rendimiento",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
      },
      {
        id: 17,
        test_type: "emotional-intelligence",
        question_number: 17,
        question_text: "Ante una crítica injusta, ¿cuál es tu reacción típica?",
        options: [
          "Me enojo y respondo defensivamente de inmediato",
          "Me siento herido pero no digo nada",
          "Tomo tiempo para procesar antes de responder",
          "Mantengo la calma y busco entender la perspectiva del otro",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
      },
      {
        id: 18,
        test_type: "emotional-intelligence",
        question_number: 18,
        question_text: "¿Qué te da más satisfacción en tu trabajo?",
        options: [
          "Completar tareas y cumplir con los requisitos mínimos",
          "Recibir reconocimiento y elogios de otros",
          "Superar desafíos y alcanzar metas personales",
          "Contribuir a algo más grande que yo mismo",
        ],
        category: "motivation",
        question_type: "multiple_choice",
      },
      {
        id: 19,
        test_type: "emotional-intelligence",
        question_number: 19,
        question_text: "¿Cómo respondes cuando notas que alguien se siente excluido en un grupo?",
        options: [
          "No es mi responsabilidad, cada quien debe integrarse",
          "Lo noto pero no sé cómo ayudar",
          "Trato de incluirlos en la conversación",
          "Activamente trabajo para que se sientan bienvenidos y valorados",
        ],
        category: "empathy",
        question_type: "multiple_choice",
      },
      {
        id: 20,
        test_type: "emotional-intelligence",
        question_number: 20,
        question_text: "¿Cómo manejas las conversaciones difíciles?",
        options: [
          "Las evito hasta que no tengo otra opción",
          "Las abordo directamente sin considerar los sentimientos",
          "Preparo lo que voy a decir y elijo el momento adecuado",
          "Creo un ambiente seguro y busco soluciones mutuamente beneficiosas",
        ],
        category: "social_skills",
        question_type: "multiple_choice",
      },
      {
        id: 21,
        test_type: "emotional-intelligence",
        question_number: 21,
        question_text: "¿Qué tan bien identificas los factores que desencadenan tus emociones?",
        options: [
          "No tengo idea de qué causa mis cambios emocionales",
          "A veces puedo identificar algunos desencadenantes obvios",
          "Generalmente reconozco qué situaciones afectan mis emociones",
          "Tengo un conocimiento profundo de mis patrones emocionales",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
      },
      {
        id: 22,
        test_type: "emotional-intelligence",
        question_number: 22,
        question_text: "Cuando las cosas no salen como esperabas, ¿cómo te adaptas?",
        options: [
          "Me frustro y me cuesta mucho ajustarme",
          "Me quejo pero eventualmente me adapto",
          "Acepto el cambio y busco nuevas oportunidades",
          "Veo los cambios como oportunidades de crecimiento y me adapto rápidamente",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
      },
      {
        id: 23,
        test_type: "emotional-intelligence",
        question_number: 23,
        question_text: "¿Cómo te recuperas de los fracasos o decepciones?",
        options: [
          "Me toma mucho tiempo recuperarme y a menudo me rindo",
          "Eventualmente sigo adelante pero con menos entusiasmo",
          "Aprendo de la experiencia y vuelvo a intentarlo",
          "Uso los fracasos como combustible para mejorar y crecer",
        ],
        category: "motivation",
        question_type: "multiple_choice",
      },
      {
        id: 24,
        test_type: "emotional-intelligence",
        question_number: 24,
        question_text: "¿Qué tan bien puedes ponerte en el lugar de otra persona?",
        options: [
          "Me cuesta entender perspectivas diferentes a la mía",
          "Puedo entender otros puntos de vista cuando me los explican",
          "Generalmente puedo ver las situaciones desde múltiples perspectivas",
          "Naturalmente considero y entiendo las experiencias de otros",
        ],
        category: "empathy",
        question_type: "multiple_choice",
      },
      {
        id: 25,
        test_type: "emotional-intelligence",
        question_number: 25,
        question_text: "¿Cómo influyes positivamente en el ambiente de tu equipo?",
        options: [
          "No creo que tenga mucha influencia en el ambiente del equipo",
          "Trato de mantener una actitud positiva",
          "Contribuyo activamente a crear un ambiente colaborativo",
          "Lidero con el ejemplo y ayudo a otros a dar lo mejor de sí",
        ],
        category: "social_skills",
        question_type: "multiple_choice",
      },
      {
        id: 26,
        test_type: "emotional-intelligence",
        question_number: 26,
        question_text: "¿Con qué frecuencia evalúas tus fortalezas y áreas de mejora emocional?",
        options: [
          "Nunca pienso en mis habilidades emocionales",
          "Ocasionalmente reflexiono sobre cómo manejo las emociones",
          "Regularmente evalúo mi inteligencia emocional",
          "Constantemente trabajo en desarrollar mi inteligencia emocional",
        ],
        category: "self_awareness",
        question_type: "multiple_choice",
      },
      {
        id: 27,
        test_type: "emotional-intelligence",
        question_number: 27,
        question_text: "¿Cómo manejas la presión de los plazos ajustados?",
        options: [
          "Me paralizo y no puedo funcionar efectivamente",
          "Me estreso mucho pero logro completar el trabajo",
          "Mantengo la calma y priorizo las tareas más importantes",
          "Prospero bajo presión y uso técnicas para mantener la claridad mental",
        ],
        category: "self_regulation",
        question_type: "multiple_choice",
      },
      {
        id: 28,
        test_type: "emotional-intelligence",
        question_number: 28,
        question_text: "¿Qué te impulsa a buscar oportunidades de crecimiento profesional?",
        options: [
          "Principalmente el aumento de salario",
          "La presión de otros o las expectativas sociales",
          "Mi deseo de aprender y mejorar continuamente",
          "Mi pasión por hacer una contribución significativa",
        ],
        category: "motivation",
        question_type: "multiple_choice",
      },
      {
        id: 29,
        test_type: "emotional-intelligence",
        question_number: 29,
        question_text: "¿Cómo respondes cuando alguien expresa emociones intensas contigo?",
        options: [
          "Me siento incómodo y trato de cambiar el tema",
          "Escucho pero no sé cómo responder apropiadamente",
          "Valido sus sentimientos y ofrezco apoyo",
          "Creo un espacio seguro para que expresen sus emociones completamente",
        ],
        category: "empathy",
        question_type: "multiple_choice",
      },
      {
        id: 30,
        test_type: "emotional-intelligence",
        question_number: 30,
        question_text: "¿Cómo construyes consenso cuando hay opiniones divididas en tu equipo?",
        options: [
          "Dejo que otros resuelvan los desacuerdos",
          "Apoyo la opinión de la persona con más autoridad",
          "Facilito la discusión para encontrar puntos en común",
          "Guío al equipo hacia una solución que integre las mejores ideas de todos",
        ],
        category: "social_skills",
        question_type: "multiple_choice",
      },
    ]
  }
  return []
}
