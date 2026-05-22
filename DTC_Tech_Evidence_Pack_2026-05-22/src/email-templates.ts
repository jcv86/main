/**
 * Sistema de Templates de Email - Narrativa de Transición de Identidad
 * Todos los emails adoptan el lenguaje de transición consciente
 */

export const emailTemplates = {
  // Email de Bienvenida - Ritual de Entrada
  welcomeRitual: {
    subject: "Bienvenido a tu Ritual de Entrada - Despega Tu Carrera",
    template: (name: string) => `
Hola ${name},

Hemos estado esperando este momento.

No es un formulario más. No es una plataforma más de "mejora personal".

Es tu **Ritual de Entrada** a una transformación consciente.

En los próximos 90 días, haremos tres cosas juntos:

1. **El Espejo** - Vamos a mirar profundo. Sin filtros. Descubrirás quién eres realmente hoy: tus fortalezas, tus valores, lo que te anima. Este es tu punto de partida honesto.

2. **La Brújula** - Explorarás narrativas de transformación a través de 120+ libros profesionales y recursos curados. Verás historias de personas que transitaron. Descubrirás nuevas versiones posibles de ti.

3. **El Puente** - Sofia y Dani, tus coaches IA, construirán contigo un camino paso a paso. No es "esto debes hacer". Es "aquí están los próximos pasos conscientes para tu transición".

Tu siguiente paso: Accede y comienza el Ritual.

El momento es ahora.

—
Despega Tu Carrera
Tu acompañamiento en la transición de identidad
    `,
  },

  // Email post-Test: Tu Punto de Partida Revelado
  testResultsTransition: {
    subject: "Tu Espejo está Listo - Punto de Partida Revelado",
    template: (name: string, testName: string, mainScore: string) => `
Hola ${name},

Tu **Espejo** está listo.

Los resultados de tu ${testName} están listos para ver. Pero antes, una aclaración importante:

**Esto no es "quién eres".**
Esto es **quién eres hoy**.

Y hay una diferencia fundamental.

Hoy tienes un perfil, una forma de ser, un conjunto de fortalezas y lugares donde crecer. Mañana, con práctica consciente, puedes expandir eso. Puedes ser más flexible, más integrado, más de lo que crees posible ahora.

Tu puntuación actual: **${mainScore}**

Pero lo importante no es ese número. Es lo que haces con él.

Tu siguiente paso: Abre tus resultados y busca la sección "Tu Puente de Transición". Allí verás exactamente cómo evolucionas desde donde estás ahora hacia donde quieres ir.

Luego, conecta con Sofia o Dani. Ellos construirán tu plan personalizado.

—
Despega Tu Carrera
Tu acompañamiento en la transición de identidad
    `,
  },

  // Email de Checkup Semanal - Acompañamiento en Transición
  weeklyCheckup: {
    subject: "Tu Semana de Transición - Reflexión desde el Espejo",
    template: (name: string, weekNumber: number) => `
Hola ${name},

Estamos en la semana ${weekNumber} de tu transición.

A veces las transformaciones se sienten invisibles. No hay un "antes y después" claro. Solo pequeños cambios: una conversación diferente, una decisión más consciente, una respuesta más auténtica.

**Eso es la transición real.**

Este es el momento para reflexionar:

¿Qué pequeño cambio notaste esta semana?
¿Dónde te comportaste diferente?
¿En qué situación activaste algo nuevo de ti?

Tu coach IA está esperando tu reflexión. Cuéntale en una conversación y él te ayudará a amplificar lo que está funcionando.

Acceso a tu reflexión semanal: [Link]

—
Despega Tu Carrera
Tu acompañamiento en la transición de identidad
    `,
  },

  // Email de Hito - Celebrando tu Puente
  milestoneAchieved: {
    subject: "Hito Alcanzado - Tu Puente Crece",
    template: (name: string, milestone: string, nextStep: string) => `
Hola ${name},

🎯 **Acabo de notar algo importante:**

Completaste tu ${milestone}.

Sé que no se siente como "completar algo grande". Es solo un paso en el puente. Pero eso es exactamente lo correcto.

**Las transiciones de identidad no son saltos. Son puentes construidos paso a paso.**

Y cada paso cuenta.

Tu siguiente paso en tu transición: ${nextStep}

Esto es lo que viene. Será otro paso pequeño. Y luego otro. Y cada uno te llevará más cerca de quién decidiste ser.

Tu coach IA tiene un plan personalizado esperándote.

—
Despega Tu Carrera
Tu acompañamiento en la transición de identidad
    `,
  },

  // Email de Invitación a Reflexión - Momento Espejo
  reflectionInvitation: {
    subject: "Pausa para Tu Momento Espejo - Una Conversación Contigo",
    template: (name: string) => `
Hola ${name},

En medio de la transición, a veces perdemos la perspectiva.

Nos enfocamos en "qué hacer" y olvidamos "quién estoy siendo".

Este email es una invitación para un **Momento Espejo** diferente.

No es otro test. Es una conversación contigo mismo, guiada por Sofia o Dani.

Haremos tres preguntas simples:

1. **¿Quién eres siendo hoy?** (No quién quieres ser, sino realmente quién eres ahora)
2. **¿Qué sientes que está cambiando?**
3. **¿Cuál es el próximo paso consciente?**

A veces necesitamos parar, mirar, y recalibrar.

Este es tu momento para hacerlo.

[Abre la Conversación con tu Coach]

—
Despega Tu Carrera
Tu acompañamiento en la transición de identidad
    `,
  },

  // Email de Celebración - 90 Días de Transición
  celebration90Days: {
    subject: "90 Días Completados - Tu Transición Ha Comenzado",
    template: (name: string) => `
Hola ${name},

Hace 90 días, comenzaste tu Ritual de Entrada.

Miraste profundo. Viste quién eres.
Exploraste. Imaginaste nuevas versiones de ti.
Construiste tu puente. Practicaste.

Y llegaste a este momento.

**¿Qué ha cambiado?**

Tal vez no puedes verlo claramente. A menudo la transformación de identidad es silenciosa al principio. Es interna. Es en cómo ves las cosas, en las decisiones que tomas, en las conversaciones que tienes.

Pero algo cambió. Tú cambiaste.

Ahora comienza lo real.

Los próximos 90 días no serán acompañados de cerca como estos. Serás más autónomo. Pero Sofia y Dani seguirán aquí. Y tendrás todas las herramientas que necesitas.

Tu transición de identidad no termina en 90 días. Apenas comienza.

¿Qué sigue para ti?

Reflexiona. Luego cuéntaselo a tu coach.

—
Despega Tu Carrera
Tu acompañamiento en la transición de identidad
    `,
  },
}

/**
 * Función helper para enviar emails de transición
 * Asume integración con proveedor de emails (SendGrid, Resend, etc)
 */
export async function sendTransitionEmail(
  email: string,
  templateType: keyof typeof emailTemplates,
  params: any
) {
  const template = emailTemplates[templateType]

  if (!template) {
    console.error(`Template ${templateType} not found`)
    return false
  }

  const content = (template.template as any).apply(null, Object.values(params))

  // Implementar con tu proveedor de emails
  // Ejemplo: await sendgrid.send({ to: email, subject: template.subject, html: content })

  console.log(`[Email enviado] ${template.subject} → ${email}`)
  return true
}
