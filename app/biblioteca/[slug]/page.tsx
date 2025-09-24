"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  Clock,
  User,
  Star,
  Bookmark,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  Heart,
  Download,
  ArrowLeft,
} from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  category: string
  content: string
  tags: string[]
  slug: string
  read_count: number
  created_at: string
  updated_at: string
}

// Fallback books data with extensive content
const fallbackBooks: Book[] = [
  {
    id: 4,
    title: "Cómo Ganar Amigos e Influir sobre las Personas",
    author: "Dale Carnegie",
    category: "Comunicación",
    content: `# Cómo Ganar Amigos e Influir sobre las Personas

Este libro clásico de Dale Carnegie, publicado por primera vez en 1936, sigue siendo uno de los libros de desarrollo personal más influyentes de todos los tiempos. Ha vendido más de 30 millones de copias en todo el mundo y ha sido traducido a prácticamente todos los idiomas principales.

## Introducción: El Poder de las Relaciones Humanas

En el mundo moderno, el éxito no depende únicamente de conocimientos técnicos o habilidades específicas. La capacidad de relacionarse efectivamente con otras personas, de influir positivamente en ellas y de construir relaciones sólidas es fundamental para el éxito en cualquier área de la vida.

Dale Carnegie desarrolló estos principios después de años de observar y enseñar a miles de personas en sus cursos de oratoria y relaciones humanas. Los principios que presenta no son teorías abstractas, sino técnicas prácticas probadas en la vida real por innumerables personas.

## PARTE I: TÉCNICAS FUNDAMENTALES PARA TRATAR CON LA GENTE

### Principio 1: No Critiques, No Condenes, No Te Quejes

La crítica es inútil porque pone a la persona a la defensiva y hace que trate de justificarse. La crítica es peligrosa porque hiere el orgullo tan preciado de la persona, lastima su sentido de importancia y despierta su resentimiento.

**Por qué la crítica no funciona:**
- Las personas no se critican a sí mismas por nada, sin importar lo equivocadas que estén
- La crítica pone a las personas a la defensiva y las hace esforzarse por justificarse
- La crítica hiere el orgullo y despierta resentimiento
- Rara vez resulta en cambios positivos duraderos

**Ejemplos históricos:**
Abraham Lincoln aprendió esta lección de manera difícil. En su juventud, solía criticar abiertamente a otros, incluso escribiendo cartas sarcásticas que se publicaban en el periódico local. Una vez casi tuvo que batirse a duelo por una de estas cartas. Esta experiencia le enseñó la futilidad de la crítica, y más tarde se convirtió en un maestro de la diplomacia y la persuasión.

**Alternativas a la crítica:**
- Trata de entender por qué la persona actúa como lo hace
- Busca las razones detrás del comportamiento
- Muestra empatía y comprensión
- Enfócate en soluciones, no en culpas

**Aplicación práctica:**
En lugar de decir "Siempre llegas tarde a las reuniones", prueba con "He notado que has tenido algunos retrasos últimamente. ¿Hay algo en lo que pueda ayudarte para que sea más fácil llegar a tiempo?"

### Principio 2: Demuestra Aprecio Honesto y Sincero

El deseo más profundo del ser humano es el deseo de ser importante. Este deseo hace que las personas se esfuercen por destacar, por ser reconocidas, por sentir que su vida tiene valor y significado.

**La diferencia entre aprecio y adulación:**
- El aprecio es honesto y viene del corazón
- La adulación es superficial y egoísta
- El aprecio se enfoca en acciones y cualidades específicas
- La adulación es genérica y exagerada

**Cómo expresar aprecio genuino:**
1. **Sé específico**: En lugar de "Buen trabajo", di "Me impresionó cómo manejaste la objeción del cliente sobre el precio. Tu explicación fue clara y convincente."

2. **Sé oportuno**: Expresa el aprecio tan pronto como sea posible después de la acción que quieres reconocer.

3. **Sé personal**: Explica cómo la acción de la persona te afectó a ti o al equipo.

4. **Sé público cuando sea apropiado**: El reconocimiento público puede ser especialmente poderoso.

**Ejemplos de aprecio efectivo:**
- "Tu atención al detalle en este informe realmente ayudó a que nuestra presentación fuera exitosa"
- "Aprecio cómo siempre estás dispuesto a ayudar a los nuevos miembros del equipo"
- "Tu creatividad en resolver ese problema nos ahorró mucho tiempo y dinero"

**El poder del aprecio en diferentes contextos:**

**En el trabajo:**
Un gerente que regularmente reconoce las contribuciones específicas de sus empleados verá mayor motivación, productividad y lealtad. Los empleados que se sienten valorados son más propensos a ir más allá de sus responsabilidades básicas.

**En las relaciones personales:**
Las parejas que expresan aprecio mutuo regularmente tienen relaciones más fuertes y duraderas. Los padres que reconocen los esfuerzos de sus hijos, no solo los resultados, crían niños más seguros de sí mismos.

**En el servicio al cliente:**
Los clientes que se sienten apreciados son más leales y más propensos a recomendar tu negocio a otros.

### Principio 3: Despierta en la Otra Persona un Deseo Vehemente

La única manera de influir en alguien es hablar de lo que él quiere y mostrarle cómo conseguirlo. Cada persona está principalmente interesada en sí misma. Sus deseos, sus problemas, sus objetivos son lo que más le importa.

**Cómo identificar lo que otros quieren:**
1. **Escucha activamente**: Presta atención no solo a las palabras, sino a las emociones detrás de ellas
2. **Haz preguntas**: Pregunta sobre sus objetivos, desafíos y aspiraciones
3. **Observa su comportamiento**: Las acciones revelan prioridades
4. **Considera su perspectiva**: Ponte en su lugar

**Técnicas para despertar deseo:**

**La técnica del beneficio mutuo:**
Siempre presenta tus ideas en términos de cómo beneficiarán a la otra persona. En lugar de decir "Necesito que hagas esto", di "Esto te ayudará a lograr..."

**Ejemplos prácticos:**

**En ventas:**
Vendedor promedio: "Este producto tiene las mejores características del mercado"
Vendedor experto: "Este producto te ayudará a ahorrar 3 horas por semana, lo que significa más tiempo para pasar con tu familia"

**En el liderazgo:**
Jefe promedio: "Necesito que trabajes horas extra este fin de semana"
Líder efectivo: "Este proyecto te dará la oportunidad de demostrar tus habilidades de liderazgo y podría ser clave para tu próxima promoción"

**En las relaciones:**
Enfoque inefectivo: "Nunca me ayudas con las tareas domésticas"
Enfoque efectivo: "Cuando compartimos las tareas domésticas, ambos tenemos más tiempo para relajarnos juntos"

**La fórmula WIIFM (What's In It For Me):**
Siempre pregúntate: "¿Qué hay en esto para la otra persona?" Antes de hacer cualquier solicitud o propuesta, identifica claramente cómo beneficiará a la otra persona.

## PARTE II: SEIS MANERAS DE AGRADAR A LA GENTE

### Principio 1: Interésate Genuinamente en Otras Personas

Las personas pueden detectar la diferencia entre interés genuino e interés fingido. El interés real en otros no solo los hace sentir importantes, sino que también enriquece tu propia vida al expandir tu comprensión del mundo.

**Cómo mostrar interés genuino:**

**Técnicas de conversación:**
1. **Haz preguntas abiertas**: En lugar de "¿Te gustó la película?", pregunta "¿Qué fue lo que más te impactó de la película?"

2. **Sigue el hilo**: Cuando alguien menciona algo importante para ellos, profundiza en el tema

3. **Recuerda detalles**: Toma nota mental de información importante y pregunta sobre ello en futuras conversaciones

4. **Muestra curiosidad**: Haz preguntas que demuestren que realmente quieres entender su perspectiva

**Ejemplos de interés genuino:**
- "Me contaste que tu hija empezó en una nueva escuela. ¿Cómo se está adaptando?"
- "Mencionaste que estás aprendiendo fotografía. ¿Qué tipo de fotos te gusta tomar más?"
- "Vi que publicaste sobre tu viaje. ¿Cuál fue tu experiencia favorita?"

**El poder del interés genuino en diferentes situaciones:**

**En networking profesional:**
En lugar de inmediatamente hablar sobre tu negocio, pregunta sobre los desafíos que enfrenta la otra persona en su industria. Esto crea una conexión más profunda y memorable.

**En el servicio al cliente:**
Los representantes que muestran interés genuino en resolver los problemas de los clientes, no solo en cerrar tickets, crean clientes leales de por vida.

**En las relaciones familiares:**
Los padres que muestran interés genuino en los pasatiempos y preocupaciones de sus hijos adolescentes mantienen líneas de comunicación abiertas durante años difíciles.

### Principio 2: Sonríe

Una sonrisa genuina es una de las herramientas más poderosas en las relaciones humanas. Comunica calidez, apertura y positividad sin necesidad de palabras.

**La ciencia detrás de la sonrisa:**
- Las sonrisas son contagiosas debido a las neuronas espejo en nuestro cerebro
- Una sonrisa genuina libera endorfinas tanto en quien sonríe como en quien la recibe
- Las personas que sonríen son percibidas como más competentes, confiables y atractivas

**Tipos de sonrisas:**

**La sonrisa genuina (Sonrisa de Duchenne):**
- Involucra tanto la boca como los ojos
- Crea arrugas alrededor de los ojos
- Es espontánea y natural
- Transmite alegría real

**La sonrisa social:**
- Involucra principalmente la boca
- Es más controlada y consciente
- Útil en situaciones profesionales
- Transmite cortesía y profesionalismo

**Cuándo y cómo sonreír efectivamente:**

**En persona:**
- Sonríe al hacer contacto visual inicial
- Mantén una expresión facial relajada y abierta
- Permite que tu sonrisa sea natural, no forzada

**Por teléfono:**
Aunque la otra persona no pueda verte, sonreír cambia el tono de tu voz, haciéndola más cálida y amigable.

**En comunicaciones escritas:**
Usa un tono positivo y cálido en tus emails y mensajes que refleje la energía de una sonrisa.

**Casos especiales:**

**En situaciones difíciles:**
Una sonrisa empática (no alegre) puede mostrar comprensión y apoyo sin minimizar los problemas de la otra persona.

**En culturas diferentes:**
Sé consciente de que las normas sobre sonreír varían entre culturas. En algunas culturas, sonreír demasiado puede ser visto como superficial.

### Principio 3: Recuerda que el Nombre de una Persona es el Sonido más Dulce

El nombre de una persona es, para esa persona, el sonido más dulce e importante en cualquier idioma. Recordar y usar correctamente el nombre de alguien es una forma simple pero poderosa de mostrar respeto y crear conexión.

**Por qué los nombres son tan importantes:**
- El nombre es parte fundamental de la identidad de una persona
- Usar el nombre de alguien hace que se sienta reconocido y valorado
- Demuestra que prestaste atención y que la persona es importante para ti
- Crea una sensación de familiaridad y confianza

**Técnicas para recordar nombres:**

**En el momento de la presentación:**
1. **Escucha activamente**: Concéntrate completamente cuando te digan su nombre
2. **Repite inmediatamente**: "Mucho gusto, María"
3. **Úsalo en la conversación**: Incorpora el nombre naturalmente 2-3 veces
4. **Haz asociaciones**: Conecta el nombre con algo memorable sobre la persona

**Técnicas de memoria:**
1. **Asociación visual**: Conecta el nombre con una característica física
2. **Asociación de significado**: Si conoces el significado del nombre, úsalo
3. **Rima o aliteración**: Crea una frase memorable (internamente)
4. **Repetición espaciada**: Repite el nombre mentalmente a intervalos

**Cómo usar nombres efectivamente:**

**En conversaciones cara a cara:**
- Usa el nombre al saludar y al despedirte
- Inclúyelo naturalmente durante la conversación
- No lo uses en exceso (puede sonar artificial)

**En comunicaciones escritas:**
- Personaliza emails usando el nombre de la persona
- En lugar de "Estimado cliente", usa "Estimado Sr. García"

**En presentaciones grupales:**
- Usa nombres cuando te dirijas a individuos específicos
- Ayuda a crear conexión personal incluso en grupos grandes

**Errores comunes y cómo evitarlos:**

**Pronunciación incorrecta:**
Si no estás seguro de cómo pronunciar un nombre, pregunta. La mayoría de las personas aprecian el esfuerzo.

**Uso excesivo:**
Usar el nombre demasiado frecuentemente puede sonar manipulativo. Úsalo naturalmente.

**Nombres incorrectos:**
Si te equivocas con el nombre de alguien, discúlpate sinceramente y corrígete inmediatamente.

### Principio 4: Sé un Buen Oyente. Anima a Otros a Hablar de Sí Mismos

La mayoría de las personas están más interesadas en hablar sobre sí mismas que en escuchar sobre ti. Ser un buen oyente es una de las habilidades más valiosas que puedes desarrollar.

**Los elementos de la escucha efectiva:**

**Atención completa:**
- Elimina distracciones (teléfono, computadora, etc.)
- Mantén contacto visual apropiado
- Usa lenguaje corporal que demuestre interés
- Resiste la tentación de planear tu respuesta mientras la otra persona habla

**Escucha activa:**
- Parafrasea lo que escuchaste: "Si entiendo correctamente, estás diciendo que..."
- Haz preguntas de seguimiento: "¿Puedes contarme más sobre eso?"
- Refleja emociones: "Parece que eso fue muy frustrante para ti"
- Resume puntos clave: "Los puntos principales que mencionaste son..."

**Técnicas avanzadas de escucha:**

**La técnica del eco:**
Repite las últimas palabras o frases clave que dijo la persona. Esto los anima a continuar y profundizar.

Ejemplo:
Persona: "Estoy preocupado por la presentación de mañana"
Tú: "¿Preocupado por la presentación?"
Persona: "Sí, es que nunca he presentado ante un grupo tan grande..."

**Preguntas abiertas vs. cerradas:**

**Preguntas cerradas** (respuesta sí/no):
- "¿Te gustó la película?"
- "¿Fue difícil el proyecto?"

**Preguntas abiertas** (invitan a elaborar):
- "¿Qué pensaste sobre la película?"
- "¿Cuáles fueron los mayores desafíos del proyecto?"

**El poder del silencio:**
No tengas miedo de los silencios en la conversación. A menudo, después de una pausa, las personas compartirán información más profunda y significativa.

**Beneficios de ser un buen oyente:**

**En el ámbito profesional:**
- Los líderes que escuchan bien toman mejores decisiones
- Los vendedores que escuchan identifican mejor las necesidades del cliente
- Los colegas que escuchan construyen relaciones más fuertes

**En relaciones personales:**
- Las parejas que se escuchan mutuamente tienen relaciones más satisfactorias
- Los padres que escuchan a sus hijos mantienen mejor comunicación
- Los amigos que escuchan bien son más valorados y buscados

**Errores comunes en la escucha:**

**El "esperando mi turno":**
Planear tu respuesta mientras la otra persona habla en lugar de realmente escuchar.

**El "solucionador":**
Saltar inmediatamente a ofrecer soluciones sin entender completamente el problema.

**El "competidor":**
Tratar de superar cada historia con una propia.

### Principio 5: Habla en Términos de los Intereses de la Otra Persona

Para ser verdaderamente persuasivo e influyente, debes aprender a ver el mundo desde la perspectiva de la otra persona y hablar sobre lo que les interesa.

**Cómo identificar los intereses de otros:**

**Observación directa:**
- ¿De qué hablan con más entusiasmo?
- ¿Qué temas los hacen más animados?
- ¿En qué invierten su tiempo libre?
- ¿Qué libros leen o qué programas ven?

**Preguntas estratégicas:**
- "¿Qué es lo que más te emociona de tu trabajo?"
- "¿Cuáles son tus objetivos para este año?"
- "¿Qué te motivó a elegir esta carrera?"
- "¿Qué haces para relajarte?"

**Investigación previa:**
- Revisa sus perfiles en redes sociales
- Pregunta a conocidos mutuos
- Investiga sobre su industria o campo de trabajo
- Observa su oficina o espacio personal en busca de pistas

**Técnicas para conectar con sus intereses:**

**La técnica del puente:**
Conecta tu mensaje con algo que ya les interesa.

Ejemplo:
Si sabes que alguien es fanático del fútbol, podrías decir: "Este proyecto requiere el mismo tipo de trabajo en equipo que admiras en tu equipo favorito."

**La técnica de la relevancia personal:**
Muestra cómo tu propuesta se relaciona directamente con sus objetivos personales o profesionales.

**Ejemplos prácticos por contexto:**

**En ventas:**
Cliente interesado en eficiencia: "Este software reducirá el tiempo que tu equipo dedica a reportes en un 40%, liberándolos para enfocarse en actividades más estratégicas."

Cliente preocupado por costos: "Aunque la inversión inicial es significativa, el retorno se verá en 8 meses a través de la reducción de costos operativos."

**En liderazgo:**
Empleado ambicioso: "Este proyecto te dará visibilidad con la alta dirección y te permitirá desarrollar habilidades de gestión."

Empleado orientado a la familia: "Completar este proyecto eficientemente te permitirá mantener un mejor equilibrio trabajo-vida."

**En relaciones personales:**
Pareja interesada en viajes: "Si ahorramos en restaurantes este mes, podremos permitirnos ese fin de semana en la playa que querías."

Amigo interesado en fitness: "¿Te gustaría acompañarme al gimnasio? Podríamos motivarnos mutuamente."

### Principio 6: Haz que la Otra Persona se Sienta Importante - y Hazlo Sinceramente

Todas las personas tienen un deseo profundo de sentirse importantes y valoradas. Cuando satisfaces esta necesidad de manera genuina, creas conexiones poderosas y duraderas.

**Formas de hacer que otros se sientan importantes:**

**Reconocimiento público:**
- Menciona sus logros en reuniones
- Comparte sus éxitos en redes sociales (con permiso)
- Presenta a la persona destacando sus fortalezas
- Escribe recomendaciones o testimonios

**Solicitar su opinión:**
- "¿Qué piensas sobre esta propuesta?"
- "Me gustaría conocer tu perspectiva sobre..."
- "Tu experiencia en este tema sería muy valiosa"
- "¿Cómo abordarías este desafío?"

**Delegación significativa:**
- Asigna proyectos importantes
- Da autonomía en la toma de decisiones
- Permite que lideren iniciativas
- Confía en su juicio y experiencia

**La importancia de la sinceridad:**

**Señales de aprecio genuino:**
- Específico en lugar de genérico
- Basado en observaciones reales
- Expresado con emoción auténtica
- Consistente con tus acciones

**Señales de adulación falsa:**
- Elogios exagerados o irreales
- Comentarios genéricos que podrían aplicar a cualquiera
- Timing sospechoso (justo antes de pedir un favor)
- Inconsistencia entre palabras y acciones

**Técnicas avanzadas:**

**La técnica del experto:**
Posiciona a la persona como experta en su área y busca su consejo.

"Dado tu experiencia en marketing digital, ¿cuál crees que sería la mejor estrategia para este lanzamiento?"

**La técnica del mentor:**
Pide que te enseñen algo en lo que son buenos.

"He notado que eres excelente manejando clientes difíciles. ¿Podrías compartir algunos consejos conmigo?"

**La técnica del reconocimiento específico:**
En lugar de "Buen trabajo", sé específico sobre qué fue bueno y por qué importa.

"Tu análisis de los datos de ventas identificó exactamente dónde estábamos perdiendo clientes. Esa información cambió completamente nuestra estrategia."

## PARTE III: LOGRA QUE LA GENTE PIENSE COMO TÚ

### Principio 1: La Única Forma de Ganar una Discusión es Evitándola

Las discusiones rara vez cambian opiniones. En su lugar, tienden a fortalecer las posiciones existentes y crear resentimiento. La persona más sabia evita las discusiones y busca formas más efectivas de influir.

**Por qué las discusiones no funcionan:**

**Psicología de la discusión:**
- Cuando alguien contradice nuestras opiniones, nuestro orgullo está en juego
- El cerebro activa mecanismos de defensa que nos hacen menos receptivos a nueva información
- Las personas se enfocan en ganar, no en encontrar la verdad
- Los argumentos lógicos rara vez cambian creencias emocionales

**Efectos negativos de las discusiones:**
- Dañan las relaciones
- Crean resentimiento duradero
- Polarizan las posiciones
- Reducen la credibilidad futura

**Alternativas efectivas a la discusión:**

**La técnica del acuerdo parcial:**
Encuentra puntos en común antes de abordar las diferencias.

"Estoy de acuerdo contigo en que la calidad es fundamental. Donde podríamos tener perspectivas diferentes es en cómo lograr esa calidad..."

**La técnica de la curiosidad genuina:**
En lugar de argumentar, haz preguntas que inviten a la reflexión.

"Esa es una perspectiva interesante. ¿Qué te llevó a esa conclusión?"

**La técnica del "puede ser":**
Reconoce la posibilidad de que la otra persona tenga razón.

"Puede ser que tengas razón. No había considerado ese ángulo."

**Estrategias para manejar desacuerdos:**

**Paso 1: Controla tu reacción inicial**
- Respira profundamente antes de responder
- Reconoce tus emociones sin actuar sobre ellas
- Recuerda tu objetivo: influir positivamente, no ganar

**Paso 2: Busca entender antes de ser entendido**
- "Ayúdame a entender tu perspectiva"
- "¿Qué información te llevó a esa conclusión?"
- "¿Cuáles son tus principales preocupaciones?"

**Paso 3: Encuentra terreno común**
- Identifica valores compartidos
- Reconoce objetivos mutuos
- Destaca experiencias similares

**Paso 4: Presenta tu perspectiva suavemente**
- "Una forma diferente de verlo podría ser..."
- "Mi experiencia me ha enseñado que..."
- "¿Has considerado la posibilidad de que...?"

### Principio 2: Demuestra Respeto por las Opiniones Ajenas. Jamás Digas "Estás Equivocado"

Decirle a alguien que está equivocado es como darle un golpe directo a su inteligencia, juicio, orgullo y amor propio. Esto inmediatamente crea resistencia y hace que la persona se cierre a cualquier influencia futura.

**El impacto psicológico de "estás equivocado":**
- Ataca la autoestima de la persona
- Activa mecanismos de defensa
- Crea una dinámica de confrontación
- Reduce la receptividad a nuevas ideas

**Alternativas respetuosas:**

**Frases que mantienen la dignidad:**
- "Puede que esté equivocado, pero mi impresión es que..."
- "Tengo una perspectiva diferente sobre esto..."
- "Mi experiencia me ha llevado a una conclusión distinta..."
- "¿Has considerado esta otra posibilidad?"

**La técnica del "sí, y...":**
En lugar de "sí, pero..." que niega lo anterior, usa "sí, y..." que construye sobre ello.

Ejemplo:
Persona: "Creo que deberíamos lanzar el producto inmediatamente"
En lugar de: "Sí, pero no estamos listos"
Usa: "Sí, el momentum es importante, y también quiero asegurarme de que tengamos todos los elementos en su lugar para un lanzamiento exitoso"

**Técnicas avanzadas para manejar desacuerdos:**

**La técnica de la validación emocional:**
Reconoce los sentimientos detrás de la opinión, incluso si no estás de acuerdo con los hechos.

"Puedo ver que esto es realmente importante para ti, y aprecio tu pasión por el proyecto."

**La técnica de la perspectiva múltiple:**
Presenta diferentes puntos de vista sin declarar cuál es "correcto".

"Hay varias formas de ver esta situación. Algunos podrían argumentar que... otros podrían decir que... ¿cuál resuena más contigo?"

**La técnica del experto neutral:**
Cita fuentes externas respetadas en lugar de presentar tu opinión personal.

"Según el estudio de Harvard Business Review, las empresas que implementan esta estrategia ven un aumento promedio del 23% en productividad."

### Principio 3: Si Estás Equivocado, Admítelo Rápida y Enfáticamente

Admitir errores rápidamente y con sinceridad desarma la crítica, genera respeto y a menudo convierte una situación negativa en una positiva.

**Los beneficios de admitir errores:**

**Beneficios psicológicos:**
- Desarma la agresión de la otra persona
- Demuestra humildad y madurez
- Genera respeto y confianza
- Permite enfocarse en soluciones

**Beneficios relacionales:**
- Fortalece las relaciones a largo plazo
- Crea un ambiente de honestidad
- Modela comportamiento positivo para otros
- Reduce conflictos futuros

**Cómo admitir errores efectivamente:**

**Elementos de una disculpa efectiva:**

1. **Reconocimiento específico del error:**
"Me equivoqué al no consultar contigo antes de cambiar el cronograma del proyecto."

2. **Aceptación de responsabilidad:**
"Fue mi decisión y mi error, no hay excusas."

3. **Expresión de remordimiento genuino:**
"Lamento cualquier inconveniente que esto haya causado."

4. **Compromiso de mejora:**
"En el futuro, me aseguraré de comunicar cualquier cambio con anticipación."

5. **Acción correctiva cuando sea posible:**
"¿Qué puedo hacer ahora para minimizar el impacto?"

**Errores comunes al disculparse:**

**La disculpa condicional:**
"Lamento si te ofendí" (implica que tal vez no hiciste nada malo)
Mejor: "Lamento haberte ofendido"

**La disculpa con excusas:**
"Lamento llegar tarde, pero el tráfico estaba terrible"
Mejor: "Lamento llegar tarde. Debí haber salido más temprano"

**La disculpa que culpa a otros:**
"Lamento que el equipo no cumpliera con la fecha límite"
Mejor: "Lamento no haber gestionado mejor el cronograma del equipo"

**Casos especiales:**

**Errores públicos:**
Cuando cometes un error frente a un grupo, admítelo públicamente. Esto demuestra integridad y liderazgo.

**Errores repetidos:**
Si cometes el mismo error varias veces, tu disculpa debe incluir un plan específico para evitar que vuelva a suceder.

**Errores con consecuencias graves:**
En situaciones serias, además de disculparte, toma acción inmediata para minimizar el daño.

### Principio 4: Comienza de Manera Amigable

El tono con el que inicias una conversación establece el ambiente para toda la interacción. Comenzar de manera amigable predispone a la otra persona a ser más receptiva y cooperativa.

**La importancia del primer momento:**

**Primeras impresiones:**
- Las personas forman opiniones en los primeros 7 segundos
- El tono inicial influye en toda la conversación
- Es más fácil mantener un ambiente positivo que recuperarlo
- Las emociones son contagiosas

**Elementos de un inicio amigable:**

**Lenguaje corporal:**
- Sonrisa genuina
- Contacto visual apropiado
- Postura abierta y relajada
- Gestos cálidos

**Tono de voz:**
- Cálido y acogedor
- Ritmo relajado
- Volumen apropiado
- Inflexión positiva

**Palabras de apertura:**
- Saludo personalizado
- Comentario positivo o neutral
- Pregunta sobre su bienestar
- Reconocimiento de su tiempo

**Técnicas para diferentes situaciones:**

**Conversaciones difíciles:**
Incluso cuando debes abordar problemas, comienza reconociendo algo positivo.

"María, realmente aprecio tu dedicación al proyecto. Me gustaría hablar contigo sobre algunas preocupaciones que han surgido..."

**Reuniones de negocios:**
Comienza con conexión personal antes de entrar en temas de trabajo.

"¿Cómo estuvo tu fin de semana? Vi en LinkedIn que tu hija se graduó. ¡Felicidades!"

**Llamadas de ventas:**
Enfócate en el cliente, no en tu producto.

"Gracias por tomarte el tiempo para hablar conmigo hoy. Antes de comenzar, me gustaría conocer un poco más sobre los desafíos que está enfrentando su empresa..."

**Conversaciones por correo electrónico:**
Incluso en comunicaciones escritas, puedes comenzar de manera amigable.

"Espero que hayas tenido una excelente semana. Te escribo para..."

### Principio 5: Consigue que la Otra Persona Diga "Sí, Sí" Inmediatamente

Cuando una persona dice "no", todo su orgullo y personalidad exigen que sea consistente con esa respuesta. Es mucho más difícil cambiar un "no" a un "sí" que obtener un "sí" desde el principio.

**La psicología del "sí":**

**Principio de consistencia:**
Las personas tienen una fuerte necesidad psicológica de ser consistentes con sus compromisos y declaraciones previas.

**Momentum psicológico:**
Cada "sí" hace que el siguiente "sí" sea más probable. Cada "no" hace que el siguiente "no" sea más probable.

**Técnicas para obtener "sí" inicial:**

**Preguntas obvias:**
Comienza con preguntas que cualquier persona razonable respondería afirmativamente.

"¿Está de acuerdo en que la satisfacción del cliente es importante para el éxito del negocio?"

**Valores compartidos:**
Identifica valores que ambos comparten y haz preguntas sobre ellos.

"¿Cree que todos merecen ser tratados con respeto en el lugar de trabajo?"

**Objetivos mutuos:**
Pregunta sobre objetivos que obviamente comparten.

"¿Le gustaría encontrar una solución que beneficie a ambas partes?"

**Estrategias avanzadas:**

**La escalera del sí:**
Construye una serie de preguntas que lleven naturalmente a tu solicitud principal.

Ejemplo para una propuesta de proyecto:
1. "¿Está de acuerdo en que la eficiencia es importante?" (Sí)
2. "¿Cree que automatizar procesos repetitivos podría mejorar la eficiencia?" (Sí)
3. "¿Estaría interesado en explorar opciones que podrían automatizar algunos de sus procesos actuales?" (Sí)
4. "¿Le gustaría que le presente una propuesta específica?" (Más probable que sea sí)

**La técnica del rango:**
En lugar de pedir algo específico, ofrece un rango donde incluso la opción "menor" te beneficia.

"¿Estaría dispuesto a dedicar entre 15 y 30 minutos la próxima semana para revisar esta propuesta?"

**Errores comunes:**

**Preguntas cargadas:**
Evita preguntas que obviamente están diseñadas para manipular.

**Demasiados "síes" seguidos:**
No hagas tantas preguntas obvias que la persona se sienta manipulada.

**Saltar demasiado rápido:**
No vayas directamente de preguntas simples a solicitudes grandes.

### Principio 6: Permite que la Otra Persona Hable Mucho

Las personas se convencen más por las razones que ellas mismas descubren que por las que otros les dan. Cuando permites que otros hablen, les das la oportunidad de convencerse a sí mismos.

**Por qué funciona dejar hablar a otros:**

**Autoconvencimiento:**
- Las personas confían más en sus propias conclusiones
- Hablar ayuda a clarificar pensamientos
- Verbalizar ideas las hace más reales
- La gente se compromete más con sus propias ideas

**Información valiosa:**
- Descubres sus verdaderas motivaciones
- Identificas objeciones no expresadas
- Entiendes su proceso de toma de decisiones
- Aprendes su lenguaje y terminología preferida

**Técnicas para fomentar la conversación:**

**Preguntas abiertas estratégicas:**
- "¿Qué opina sobre...?"
- "¿Cómo ve usted la situación?"
- "¿Qué factores son más importantes para usted?"
- "¿Cuál ha sido su experiencia con...?"

**Seguimiento activo:**
- "Eso es interesante, ¿puede contarme más?"
- "¿Qué lo llevó a esa conclusión?"
- "¿Cómo se siente al respecto?"
- "¿Qué más debería saber sobre esto?"

**Técnicas de silencio estratégico:**
- Haz una pregunta y espera la respuesta completa
- No llenes los silencios inmediatamente
- Usa el contacto visual para mostrar que estás escuchando
- Asiente para mostrar comprensión

**Aplicaciones prácticas:**

**En ventas:**
En lugar de enumerar características del producto, pregunta sobre sus necesidades y deja que te expliquen exactamente lo que buscan.

**En liderazgo:**
En lugar de dar órdenes directas, haz preguntas que guíen a tu equipo hacia las conclusiones correctas.

"¿Qué creen que pasaría si implementáramos esta estrategia?"

**En resolución de conflictos:**
Permite que cada parte explique completamente su perspectiva antes de buscar soluciones.

**En relaciones personales:**
Dale espacio a tu pareja para expresar completamente sus sentimientos antes de responder.

## PARTE IV: SÉ UN LÍDER - CÓMO CAMBIAR A LA GENTE SIN OFENDER NI DESPERTAR RESENTIMIENTO

### Principio 1: Comienza con Elogio y Aprecio Honesto

Cuando necesitas señalar errores o pedir cambios, comenzar con reconocimiento genuino hace que la persona sea más receptiva a la retroalimentación constructiva.

**La psicología del elogio antes de la crítica:**
- Crea un ambiente emocional positivo
- Demuestra que valoras a la persona
- Reduce la defensividad natural
- Establece que tu intención es ayudar, no atacar

**Elementos de un elogio efectivo antes de la retroalimentación:**

**Específico y genuino:**
En lugar de: "Eres un buen empleado"
Usa: "Tu atención al detalle en el informe del mes pasado fue excepcional, especialmente la forma en que organizaste los datos financieros"

**Relevante al tema:**
El elogio debe relacionarse con el área donde vas a dar retroalimentación.

**Reciente y memorable:**
Usa ejemplos específicos que la persona pueda recordar claramente.

**Técnicas avanzadas:**

**La técnica del sándwich mejorado:**
1. Elogio específico y genuino
2. Retroalimentación constructiva
3. Expresión de confianza en su capacidad de mejora
4. Ofrecimiento de apoyo

Ejemplo:
"Juan, tu creatividad en las campañas publicitarias ha sido consistentemente impresionante. La campaña del trimestre pasado generó un 40% más de engagement que el promedio. Me gustaría hablar sobre cómo podemos aplicar esa misma creatividad para mejorar la retención de clientes en nuestros emails de seguimiento. Sé que con tu talento podemos encontrar soluciones innovadoras, y estoy aquí para apoyarte en lo que necesites."

**La técnica del reconocimiento del esfuerzo:**
Reconoce no solo los resultados, sino también el esfuerzo y la intención.

"Aprecio mucho el tiempo extra que dedicaste a este proyecto y tu compromiso con la calidad..."

### Principio 2: Llama la Atención sobre los Errores de Otros Indirectamente

En lugar de señalar errores directamente, usa técnicas que permitan a la persona mantener su dignidad mientras reconoce la necesidad de cambio.

**Técnicas para señalar errores indirectamente:**

**La técnica de la historia personal:**
Comparte una experiencia propia similar donde cometiste un error parecido.

"Cuando empecé en ventas, yo también solía enfocarme mucho en las características del producto. Aprendí que los clientes se conectan más cuando hablamos de beneficios..."

**La técnica de la pregunta reflexiva:**
Haz preguntas que guíen a la persona hacia el reconocimiento del problema.

"¿Qué crees que podría pasar si continuamos con este enfoque?"
"¿Has notado algún patrón en las respuestas de los clientes?"

**La técnica del ejemplo externo:**
Usa ejemplos de otras empresas o situaciones para ilustrar el punto.

"He visto que las empresas más exitosas en nuestra industria tienden a..."

**La técnica de la observación neutral:**
Presenta los hechos sin juicio y permite que la persona saque sus propias conclusiones.

"He notado que en las últimas tres presentaciones, los clientes han hecho preguntas similares sobre el precio al final. ¿Qué piensas sobre esto?"

**Frases útiles para retroalimentación indirecta:**
- "Una cosa que podríamos considerar es..."
- "¿Has pensado en la posibilidad de...?"
- "Algo que he aprendido es que..."
- "Una perspectiva diferente podría ser..."
- "¿Qué pasaría si intentáramos...?"

### Principio 3: Habla de tus Propios Errores antes de Criticar los de la Otra Persona

Compartir tus propios errores y fracasos antes de señalar los de otros crea un ambiente de humildad y aprendizaje mutuo.

**Beneficios de compartir errores propios:**
- Humaniza tu posición de liderazgo
- Reduce la defensividad de la otra persona
- Demuestra que los errores son oportunidades de aprendizaje
- Crea un ambiente de confianza y vulnerabilidad

**Cómo compartir errores efectivamente:**

**Sé específico sobre el error:**
"Cuando tenía tu experiencia, cometí el error de no hacer suficientes preguntas de seguimiento con los clientes..."

**Explica las consecuencias:**
"Como resultado, perdí varias ventas importantes porque no entendía realmente sus necesidades..."

**Comparte la lección aprendida:**
"Esa experiencia me enseñó la importancia de la escucha activa y hacer preguntas abiertas..."

**Conecta con la situación actual:**
"Veo algunas similitudes en la situación que estás enfrentando ahora..."

**Ejemplos prácticos:**

**Para un empleado que llega tarde:**
"Cuando empecé mi carrera, yo también luchaba con la puntualidad. Pensaba que llegar unos minutos tarde no era gran cosa, pero me di cuenta de que afectaba la percepción que otros tenían de mi profesionalismo..."

**Para alguien que evita tareas difíciles:**
"Recuerdo que al principio de mi carrera, yo también tendía a posponer las tareas más desafiantes. Aprendí por las malas que esto solo hacía que los problemas se acumularan..."

**Para un empleado que no delega:**
"Yo solía pensar que podía hacer todo mejor yo mismo. Me tomó años aprender que el verdadero liderazgo significa desarrollar a otros y confiar en su capacidad..."

### Principio 4: Haz Preguntas en Lugar de Dar Órdenes Directas

Las preguntas invitan a la cooperación, mientras que las órdenes pueden generar resistencia. Las personas se sienten más comprometidas con las decisiones en las que participan.

**Beneficios de hacer preguntas:**
- Involucra a la persona en el proceso de toma de decisiones
- Permite que mantengan su dignidad y autonomía
- Genera compromiso con la solución
- Puede revelar mejores alternativas

**Tipos de preguntas efectivas:**

**Preguntas de exploración:**
- "¿Qué opciones ves para abordar este desafío?"
- "¿Cómo crees que deberíamos proceder?"
- "¿Qué recursos necesitarías para lograr esto?"

**Preguntas de consecuencia:**
- "¿Qué crees que pasaría si...?"
- "¿Cuáles podrían ser los riesgos de este enfoque?"
- "¿Cómo afectaría esto a nuestros clientes?"

**Preguntas de compromiso:**
- "¿Te sientes cómodo con este plan?"
- "¿Qué necesitarías para hacer que esto funcione?"
- "¿Cuándo podrías tener esto completado?"

**Transformando órdenes en preguntas:**

**En lugar de:** "Necesitas mejorar tu presentación"
**Pregunta:** "¿Qué crees que podríamos hacer para que tu próxima presentación sea aún más impactante?"

**En lugar de:** "Tienes que llegar más temprano"
**Pregunta:** "¿Qué te ayudaría a llegar más consistentemente a tiempo?"

**En lugar de:** "Debes ser más proactivo"
**Pregunta:** "¿Qué oportunidades ves para tomar más iniciativa en tu rol?"

### Principio 5: Permite que la Otra Persona Salve las Apariencias

Cuando alguien comete un error o necesita cambiar su comportamiento, es crucial permitir que mantenga su dignidad y autoestima.

**Por qué es importante salvar las apariencias:**
- Preserva la autoestima de la persona
- Mantiene relaciones a largo plazo
- Reduce la resistencia al cambio
- Permite que la persona se enfoque en mejorar en lugar de defenderse

**Técnicas para preservar la dignidad:**

**Atribuye errores a circunstancias, no a carácter:**
En lugar de: "Eres desorganizado"
Usa: "Parece que has tenido mucho en tu plato últimamente"

**Ofrece explicaciones alternativas:**
"Probablemente no tuviste toda la información necesaria cuando tomaste esa decisión"

**Enfócate en el futuro, no en el pasado:**
"¿Cómo podemos asegurarnos de que esto funcione mejor la próxima vez?"

**Reconoce las buenas intenciones:**
"Sé que tu intención era ayudar al cliente, y aprecio eso..."

**Ejemplos prácticos:**

**Situación:** Un empleado cometió un error costoso
**Enfoque que salva las apariencias:** "Este tipo de situaciones son complicadas y pueden ser confusas incluso para personas experimentadas. Lo importante ahora es aprender de esto y establecer procesos que nos ayuden a evitar confusiones similares en el futuro."

**Situación:** Alguien no cumplió una fecha límite
**Enfoque que salva las apariencias:** "Sé que has estado manejando múltiples prioridades. ¿Qué podemos hacer para ayudarte a gestionar mejor la carga de trabajo en el futuro?"

### Principio 6: Elogia el Más Pequeño Progreso y Elogia Todo Progreso

El reconocimiento frecuente de pequeñas mejoras es más efectivo que esperar a grandes logros para dar retroalimentación positiva.

**La psicología del refuerzo positivo:**
- Los comportamientos que son recompensados tienden a repetirse
- El reconocimiento inmediato es más efectivo que el tardío
- Los pequeños éxitos construyen confianza para logros mayores
- La atención positiva motiva más que la crítica

**Cómo elogiar el progreso efectivamente:**

**Sé específico sobre la mejora:**
En lugar de: "Estás mejorando"
Usa: "Noté que en la reunión de hoy hiciste tres preguntas excelentes que realmente ayudaron a clarificar los objetivos del proyecto"

**Reconoce el esfuerzo, no solo los resultados:**
"Aprecio el tiempo extra que dedicaste a investigar antes de la presentación"

**Conecta la mejora con objetivos más grandes:**
"Esta mejora en tu comunicación con los clientes va a tener un impacto real en la satisfacción del cliente"

**Técnicas para reconocer progreso:**

**El reconocimiento inmediato:**
Tan pronto como notes una mejora, reconócela.

**El reconocimiento público:**
Cuando sea apropiado, reconoce las mejoras frente a otros.

**El reconocimiento escrito:**
Envía un email o nota reconociendo la mejora específica.

**El reconocimiento progresivo:**
Reconoce mejoras incrementales hacia un objetivo mayor.

**Ejemplos por contexto:**

**Para alguien que está aprendiendo una nueva habilidad:**
"Tu presentación de hoy fue mucho más clara que la anterior. Especialmente me gustó cómo organizaste los puntos principales al principio."

**Para alguien que está cambiando un comportamiento:**
"He notado que has estado llegando puntualmente toda esta semana. Eso realmente ayuda a que nuestras reuniones comiencen de manera más efectiva."

**Para alguien que está desarrollando confianza:**
"La forma en que manejaste esa pregunta difícil del cliente mostró mucha seguridad. Tu respuesta fue clara y profesional."

### Principio 7: Atribuye a la Otra Persona una Buena Reputación para que se Interese en Mantenerla

Las personas tienden a vivir de acuerdo con las expectativas que otros tienen de ellas. Cuando atribuyes cualidades positivas a alguien, es más probable que actúe de acuerdo con esas cualidades.

**La psicología de las expectativas:**
- Las personas quieren ser consistentes con cómo otros las ven
- Las expectativas positivas crean presión social constructiva
- La gente se esfuerza por mantener una buena reputación
- Las etiquetas positivas se convierten en profecías autocumplidas

**Cómo atribuir buena reputación efectivamente:**

**Identifica cualidades genuinas:**
Busca evidencia real de las cualidades positivas que quieres reforzar.

**Sé específico en tus atribuciones:**
En lugar de: "Eres una buena persona"
Usa: "Siempre he admirado tu integridad y cómo mantienes tus compromisos"

**Conecta la reputación con comportamientos deseados:**
"Dado tu reputación de ser detallista, sé que vas a asegurar que este proyecto esté perfecto"

**Ejemplos prácticos:**

**Para motivar mejor desempeño:**
"Tienes reputación de ser alguien que siempre encuentra soluciones creativas. Estoy seguro de que vas a encontrar una forma innovadora de abordar este desafío."

**Para fomentar liderazgo:**
"Los miembros del equipo realmente respetan tu opinión y tu capacidad de tomar decisiones justas. Tu liderazgo va a ser clave en este proyecto."

**Para mejorar la puntualidad:**
"Siempre he podido contar contigo para ser confiable. Sé que puedo confiar en que estarás aquí cuando te necesitemos."

**Para desarrollar habilidades:**
"Tienes un talento natural para conectar con las personas. Con un poco más de práctica en presentaciones, vas a ser realmente excepcional."

### Principio 8: Usa el Estímulo. Haz que los Errores Parezcan Fáciles de Corregir

Cuando las personas sienten que pueden mejorar fácilmente, es más probable que hagan el esfuerzo. Si sienten que el cambio es demasiado difícil, pueden rendirse antes de intentarlo.

**Principios del estímulo efectivo:**

**Minimiza la magnitud del problema:**
En lugar de: "Tienes serios problemas de comunicación"
Usa: "Con algunos ajustes menores en tu estilo de comunicación, vas a ser mucho más efectivo"

**Enfócate en una cosa a la vez:**
No abrumes con múltiples áreas de mejora simultáneamente.

**Proporciona pasos específicos y manejables:**
"Si simplemente haces contacto visual con tres personas diferentes durante tu próxima presentación, vas a ver una gran diferencia en la conexión con tu audiencia"

**Usa ejemplos de otros que han mejorado:**
"María tenía el mismo desafío hace seis meses, y mira lo bien que lo está haciendo ahora"

**Técnicas de estímulo:**

**La técnica del "solo necesitas":**
"Solo necesitas practicar esto unas pocas veces más y lo vas a dominar"

**La técnica de la mejora incremental:**
"Si mejoras solo un 1% cada día, en tres meses vas a ser completamente diferente"

**La técnica del progreso ya logrado:**
"Ya has mejorado mucho desde que empezaste. Este siguiente paso va a ser más fácil"

**Ejemplos por situación:**

**Para alguien que lucha con hablar en público:**
"Ya tienes el contenido dominado, y tu conocimiento del tema es excelente. Solo necesitas relajarte un poco más y dejar que tu experiencia brille."

**Para alguien que está aprendiendo una nueva tecnología:**
"La parte más difícil ya la tienes. Estos últimos pasos son mucho más intuitivos."

**Para alguien que necesita ser más asertivo:**
"Ya tienes las ideas correctas. Solo necesitas expresarlas con un poco más de confianza."

### Principio 9: Haz que la Otra Persona se Sienta Satisfecha de Hacer lo que Tú Sugieres

Las personas necesitan sentir que las decisiones y cambios son suyos, no impuestos por otros. Cuando alguien se siente dueño de una decisión, está más comprometido con ejecutarla.

**Técnicas para crear apropiación:**

**Involucra en el proceso de decisión:**
En lugar de: "Necesitas hacer esto"
Usa: "¿Qué piensas sobre intentar este enfoque?"

**Permite personalización:**
"¿Cómo te gustaría implementar esto de una manera que funcione para ti?"

**Reconoce su contribución:**
"Tu idea de combinar esto con tu enfoque actual es brillante"

**Conecta con sus objetivos:**
"Esto va a ayudarte a lograr exactamente lo que me dijiste que querías"

**Estrategias avanzadas:**

**La técnica de la co-creación:**
Desarrolla la solución junto con la persona, incorporando sus ideas.

**La técnica del beneficio personal:**
Ayuda a la persona a ver cómo el cambio la beneficia directamente.

**La técnica de la elección:**
Ofrece opciones para que la persona pueda elegir cómo proceder.

**Ejemplos prácticos:**

**Situación:** Necesitas que alguien mejore su gestión del tiempo
**Enfoque de apropiación:** "Has mencionado que te gustaría tener más tiempo para proyectos estratégicos. ¿Qué piensas sobre explorar algunas técnicas de gestión del tiempo que podrían liberarte unas horas cada semana? ¿Cuáles crees que funcionarían mejor con tu estilo de trabajo?"

**Situación:** Quieres que alguien tome más iniciativa
**Enfoque de apropiación:** "He notado que tienes muchas ideas excelentes en nuestras reuniones. ¿Te interesaría liderar la implementación de una de ellas? Podrías elegir la que más te emocione."

## APLICACIONES MODERNAS DE LOS PRINCIPIOS DE CARNEGIE

### En el Mundo Digital

**Redes Sociales:**
- Aplica la escucha activa leyendo y respondiendo thoughtfully a los comentarios
- Usa nombres en tus respuestas para crear conexión personal
- Comparte contenido que sea relevante para los intereses de tu audiencia
- Reconoce y celebra los logros de otros en tu red

**Comunicación por Email:**
- Personaliza tus emails usando el nombre del destinatario
- Comienza con algo positivo antes de abordar problemas
- Haz preguntas que inviten a la participación
- Termina con aprecio por su tiempo y atención

**Videoconferencias:**
- Sonríe genuinamente, incluso a través de la cámara
- Usa nombres frecuentemente durante las llamadas
- Permite que otros hablen y contribuyan
- Reconoce las contribuciones de cada participante

### En el Liderazgo Moderno

**Liderazgo Remoto:**
- Programa check-ins regulares para mostrar interés genuino en tu equipo
- Reconoce públicamente los logros en canales de equipo
- Usa preguntas para guiar en lugar de dar órdenes directas
- Permite flexibilidad para que las personas trabajen de manera que les funcione

**Gestión de Millennials y Gen Z:**
- Proporciona retroalimentación frecuente y específica
- Conecta el trabajo con propósito y valores más grandes
- Ofrece oportunidades de crecimiento y desarrollo
- Reconoce tanto el esfuerzo como los resultados

**Liderazgo en Crisis:**
- Comienza las comunicaciones reconociendo las dificultades
- Sé transparente sobre los desafíos mientras mantienes esperanza
- Involucra al equipo en la búsqueda de soluciones
- Reconoce los esfuerzos extra durante tiempos difíciles

### En Ventas y Negocios

**Ventas Consultivas:**
- Enfócate en entender las necesidades del cliente antes de presentar soluciones
- Haz preguntas que ayuden al cliente a descubrir sus propios problemas
- Presenta tu producto en términos de los beneficios específicos para el cliente
- Permite que el cliente llegue a sus propias conclusiones sobre la necesidad

**Servicio al Cliente:**
- Comienza cada interacción con empatía y comprensión
- Usa el nombre del cliente frecuentemente
- Enfócate en soluciones, no en políticas de la empresa
- Termina asegurándote de que el cliente se sienta valorado

**Negociación:**
- Busca entender los intereses subyacentes de la otra parte
- Encuentra puntos de acuerdo antes de abordar diferencias
- Presenta propuestas en términos de beneficio mutuo
- Permite que la otra parte contribuya a la solución final

### En Relaciones Personales

**Matrimonio y Parejas:**
- Practica la escucha activa durante las discusiones
- Reconoce y aprecia las contribuciones de tu pareja regularmente
- Evita la crítica y enfócate en solicitudes específicas
- Permite que tu pareja salve las apariencias durante los conflictos

**Crianza de Hijos:**
- Reconoce el esfuerzo, no solo los resultados
- Usa preguntas para guiar el comportamiento en lugar de órdenes constantes
- Permite que los niños contribuyan a las reglas familiares
- Celebra pequeñas mejoras en el comportamiento

**Amistades:**
- Muestra interés genuino en las vidas y pasiones de tus amigos
- Recuerda detalles importantes de conversaciones anteriores
- Sé el primero en reconocer y celebrar sus éxitos
- Ofrece apoyo durante tiempos difíciles sin juzgar

## CONCLUSIÓN: EL PODER DURADERO DE LAS RELACIONES HUMANAS

Los principios de Dale Carnegie han resistido la prueba del tiempo porque se basan en necesidades humanas fundamentales que no cambian: el deseo de ser comprendido, valorado y respetado. En un mundo cada vez más digital y automatizado, estas habilidades humanas se vuelven aún más valiosas.

**Principios Clave para Recordar:**

1. **Las personas son emocionales, no lógicas:** Incluso las decisiones más racionales están influenciadas por emociones.

2. **Todos quieren sentirse importantes:** Esta necesidad fundamental impulsa mucho del comportamiento humano.

3. **La crítica rara vez funciona:** Es más efectivo inspirar que criticar.

4. **Las personas se convencen más por sus propias razones:** Ayuda a otros a llegar a las conclusiones correctas.

5. **Las relaciones son inversiones a largo plazo:** Los pequeños gestos consistentes construyen confianza duradera.

**Implementación Práctica:**

**Comienza pequeño:** Elige uno o dos principios para enfocarte inicialmente.

**Practica conscientemente:** Busca oportunidades diarias para aplicar estos principios en tus interacciones.

**Sé paciente contigo mismo:** Cambiar hábitos de comunicación toma tiempo y práctica.

**Observa los resultados:** Nota cómo las personas responden de manera diferente cuando aplicas estos principios.

**Mantén la autenticidad:** Los principios deben aplicarse con sinceridad genuina, no como técnicas manipulativas.

**El Legado de Carnegie:**

Dale Carnegie entendió que el éxito en la vida no depende tanto de lo que sabes, sino de cómo te relacionas con las personas. Sus principios han ayudado a millones de personas a:

- Construir relaciones más fuertes y significativas
- Avanzar en sus carreras profesionales
- Resolver conflictos de manera constructiva
- Influir positivamente en otros
- Desarrollar confianza en sí mismos
- Crear ambientes de trabajo más positivos

**Reflexión Final:**

En un mundo donde la tecnología puede hacer que las interacciones humanas se sientan menos personales, los principios de Carnegie nos recuerdan la importancia fundamental de tratar a cada persona con dignidad, respeto y comprensión genuina.

El verdadero poder de estos principios no radica en su capacidad de manipular o controlar a otros, sino en su habilidad para crear conexiones auténticas que benefician a todas las partes involucradas. Cuando aplicamos estos principios con integridad y sinceridad, no solo mejoramos nuestras relaciones, sino que también contribuimos a crear un mundo más comprensivo y colaborativo.

Como dijo Carnegie: "Puedes hacer más amigos en dos meses interesándote genuinamente en otras personas que los que puedes hacer en dos años tratando de que otras personas se interesen en ti."

La elección es nuestra: podemos seguir enfocándonos en nosotros mismos y nuestras necesidades, o podemos abrir nuestros corazones y mentes para entender y valorar a quienes nos rodean. Los principios de este libro nos muestran el camino hacia relaciones más ricas, una influencia más positiva y, en última instancia, una vida más plena y satisfactoria.`,
    tags: ["comunicación", "relaciones interpersonales", "liderazgo", "influencia", "habilidades sociales"],
    slug: "como-ganar-amigos-influir-personas",
    read_count: 5234,
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-22T00:00:00Z",
  },
  {
    id: 1,
    title: "Organízate con Eficacia",
    author: "David Allen",
    category: "Productividad",
    content: `# Organízate con Eficacia (Getting Things Done)

Organízate con Eficacia (Getting Things Done) es un sistema revolucionario de gestión del tiempo y la productividad que ha transformado la vida de millones de personas en todo el mundo.

## El Problema Fundamental

Nuestra mente no está diseñada para recordar tareas y compromisos. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés constante y perdemos claridad mental.

## Los Cinco Pasos del Método GTD

### 1. Capturar
- Recopila todo lo que llame tu atención en bandejas de entrada confiables
- Usa herramientas como libretas, aplicaciones o grabadoras de voz
- El objetivo es sacar todo de tu mente y ponerlo en un sistema externo

### 2. Aclarar
- Procesa cada elemento de tus bandejas de entrada
- Pregúntate: "¿Es accionable?"
- Si no es accionable: elimínalo, archívalo o ponlo en "algún día/tal vez"
- Si es accionable: define la siguiente acción específica

### 3. Organizar
- Coloca los elementos accionables en las listas apropiadas
- Usa contextos como @llamadas, @ordenador, @recados
- Mantén un calendario solo para citas y compromisos con fecha específica

### 4. Reflexionar
- Revisa semanalmente todo tu sistema
- Actualiza listas, proyectos y compromisos
- Mantén tu sistema actualizado y confiable

### 5. Comprometerse
- Usa tu sistema para tomar decisiones sobre qué hacer
- Confía en tu sistema para elegir la siguiente acción
- Actúa con confianza sabiendo que no se te olvida nada

## Conceptos Clave

### La Regla de los 2 Minutos
Si una tarea toma menos de 2 minutos, hazla inmediatamente en lugar de organizarla.

### Proyectos vs. Acciones
- Un proyecto es cualquier resultado que requiere más de una acción
- Cada proyecto debe tener definida su siguiente acción específica

### Contextos
Organiza las acciones por el contexto donde puedes realizarlas (@casa, @oficina, @teléfono).

### Niveles de Perspectiva
- Pista de aterrizaje: Acciones actuales
- 10,000 pies: Proyectos actuales  
- 20,000 pies: Áreas de responsabilidad
- 30,000 pies: Objetivos de 1-2 años
- 40,000 pies: Visión de 3-5 años
- 50,000 pies: Propósito y principios de vida

## Beneficios del Sistema
- Mente clara y libre de estrés
- Mayor productividad y eficiencia
- Mejor toma de decisiones
- Sensación de control y confianza
- Más tiempo para lo que realmente importa

## Implementación Práctica

### Paso 1: Configuración Inicial
1. Dedica tiempo inicial para configurar tu sistema
2. Haz una recopilación completa de todos tus compromisos
3. Procesa todo hasta llegar a bandeja de entrada cero
4. Establece el hábito de la revisión semanal
5. Mantén la disciplina de capturar todo inmediatamente

### Paso 2: Herramientas Recomendadas
- **Captura**: Libreta, aplicación móvil, grabadora de voz
- **Procesamiento**: Bandejas de entrada físicas y digitales
- **Organización**: Listas de contextos, calendario, archivo de referencia
- **Revisión**: Agenda semanal, recordatorios diarios

### Paso 3: Mantenimiento del Sistema
- Revisa tu sistema diariamente
- Haz una revisión semanal completa
- Ajusta el sistema según tus necesidades
- Mantén la disciplina de capturar inmediatamente

## Casos de Uso Específicos

### Para Profesionales
- Gestión de proyectos múltiples
- Seguimiento de compromisos con clientes
- Organización de reuniones y presentaciones
- Manejo de correos electrónicos eficiente

### Para Estudiantes
- Organización de tareas y exámenes
- Gestión de proyectos de investigación
- Seguimiento de lecturas y recursos
- Planificación de horarios de estudio

### Para Emprendedores
- Seguimiento de oportunidades de negocio
- Gestión de múltiples proyectos
- Organización de contactos y networking
- Planificación estratégica a largo plazo

## Errores Comunes y Cómo Evitarlos

### Error 1: Sistema Demasiado Complejo
**Problema**: Crear un sistema tan elaborado que sea difícil de mantener.
**Solución**: Comienza simple y añade complejidad gradualmente.

### Error 2: No Hacer Revisiones Regulares
**Problema**: El sistema se vuelve obsoleto sin revisiones.
**Solución**: Programa revisiones semanales no negociables.

### Error 3: No Capturar Todo
**Problema**: Mantener algunas cosas en la mente.
**Solución**: Desarrolla el hábito de capturar inmediatamente.

### Error 4: Procrastinar el Procesamiento
**Problema**: Acumular elementos sin procesar.
**Solución**: Procesa las bandejas de entrada regularmente.

## Integración con Tecnología Moderna

### Aplicaciones Recomendadas
- **Todoist**: Para listas de tareas y proyectos
- **Evernote**: Para archivo de referencia
- **Google Calendar**: Para citas y compromisos
- **Slack/Teams**: Para comunicación organizacional

### Sincronización Multi-Dispositivo
- Usa servicios en la nube para sincronizar
- Mantén una copia de respaldo de tu sistema
- Asegúrate de poder acceder desde cualquier lugar

## Medición del Éxito

### Indicadores de un Sistema Efectivo
- Mente clara y libre de preocupaciones
- Capacidad de enfocarse en la tarea actual
- Confianza en que no se olvida nada importante
- Reducción del estrés relacionado con la organización
- Mayor productividad y satisfacción personal

### Métricas a Seguir
- Tiempo dedicado a procesamiento diario
- Número de elementos en bandejas de entrada
- Frecuencia de revisiones semanales
- Porcentaje de compromisos cumplidos a tiempo

GTD no es solo un sistema de productividad, es una forma de vida que te permite estar presente y enfocado en lo que realmente importa. La clave está en la implementación consistente y la adaptación del sistema a tus necesidades específicas.`,
    tags: ["productividad", "organización", "gestión del tiempo", "gtd", "eficiencia"],
    slug: "organizate-con-eficacia",
    read_count: 2847,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: 2,
    title: "Inteligencia Emocional",
    author: "Daniel Goleman",
    category: "Psicología",
    content: `# Inteligencia Emocional

La Inteligencia Emocional es la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de otros.

## Los Cinco Componentes de la Inteligencia Emocional

### 1. Autoconciencia Emocional
- Reconocer y entender tus propias emociones
- Ser consciente de cómo tus emociones afectan tus pensamientos y comportamiento
- Conocer tus fortalezas y limitaciones emocionales
- Tener confianza en ti mismo basada en el autoconocimiento

### 2. Autorregulación
- Manejar efectivamente las emociones disruptivas e impulsos
- Mantener estándares de honestidad e integridad
- Asumir responsabilidad por tu desempeño personal
- Ser flexible en el manejo del cambio

### 3. Motivación
- Estar impulsado a lograr por el simple placer del logro
- Tener un fuerte impulso para mejorar el desempeño
- Mostrar compromiso con los objetivos del grupo u organización
- Estar listo para actuar en oportunidades y ser optimista incluso frente al fracaso

### 4. Empatía
- Entender las emociones de otros y mostrar interés activo en sus preocupaciones
- Anticipar, reconocer y satisfacer las necesidades de los clientes
- Ayudar a desarrollar las habilidades de otros
- Leer las corrientes políticas y redes sociales de una organización

### 5. Habilidades Sociales
- Ser efectivo en liderar el cambio
- Ser persuasivo y usar habilidades de comunicación efectivas
- Ser experto en construir y liderar equipos
- Manejar disputas y negociar resoluciones

## El Cerebro Emocional vs. El Cerebro Racional

### Sistema Límbico (Cerebro Emocional)
- Procesa emociones rápidamente
- Responde instintivamente
- Almacena memorias emocionales
- Puede "secuestrar" la respuesta racional

### Neocórtex (Cerebro Racional)
- Procesa información lógicamente
- Planifica y analiza
- Controla impulsos
- Permite el pensamiento abstracto

## Aplicaciones Prácticas

### En el Liderazgo
- Los líderes emocionalmente inteligentes crean climas de trabajo positivos
- Inspiran y motivan a sus equipos
- Manejan conflictos de manera constructiva
- Toman mejores decisiones considerando factores emocionales

### En las Relaciones
- Mejora la comunicación y comprensión mutua
- Reduce conflictos y malentendidos
- Fortalece vínculos personales y profesionales
- Facilita la colaboración y trabajo en equipo

### En el Desempeño
- Mejora la capacidad de manejar estrés y presión
- Aumenta la resiliencia ante adversidades
- Facilita la adaptación al cambio
- Mejora la toma de decisiones bajo presión

## Desarrollo de la Inteligencia Emocional

### Técnicas de Autoconciencia
- Práctica de mindfulness y meditación
- Llevar un diario emocional
- Solicitar feedback de otros
- Reflexión regular sobre reacciones emocionales

### Estrategias de Autorregulación
- Técnicas de respiración y relajación
- Pausa antes de reaccionar
- Reencuadre cognitivo de situaciones
- Establecimiento de límites personales

### Mejora de Habilidades Sociales
- Práctica de escucha activa
- Desarrollo de empatía a través de perspectiva
- Comunicación asertiva y clara
- Construcción de redes de relaciones

La inteligencia emocional es más predictiva del éxito en la vida que el CI tradicional, y afortunadamente, puede desarrollarse a cualquier edad con práctica y dedicación.`,
    tags: ["inteligencia emocional", "psicología", "liderazgo", "relaciones", "autoconciencia"],
    slug: "inteligencia-emocional",
    read_count: 3156,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-18T00:00:00Z",
  },
  {
    id: 3,
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    category: "Desarrollo Personal",
    content: `# Los 7 Hábitos de la Gente Altamente Efectiva

Los 7 Hábitos de la Gente Altamente Efectiva presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.

## Paradigmas y Principios
Los paradigmas son mapas mentales que determinan cómo vemos el mundo. Los principios son leyes naturales universales que gobiernan la efectividad humana.

## Los 7 Hábitos

### VICTORIA PRIVADA (Independencia)

#### Hábito 1: Ser Proactivo
- Toma responsabilidad de tu vida y decisiones
- Enfócate en tu Círculo de Influencia, no en tu Círculo de Preocupación
- Usa lenguaje proactivo: "Yo puedo", "Yo elegiré", "Yo prefiero"
- Responde basándote en valores, no en condiciones o sentimientos

#### Hábito 2: Comenzar con el Fin en Mente
- Define claramente tu misión y visión personal
- Crea una declaración de misión personal basada en principios
- Visualiza tu funeral: ¿qué te gustaría que dijeran de ti?
- Todos los logros se crean mentalmente antes que físicamente

#### Hábito 3: Poner Primero lo Primero
- Gestiona tu tiempo basándote en principios, no en prioridades
- Enfócate en actividades del Cuadrante II (importante pero no urgente)
- Aprende a decir "no" a lo bueno para decir "sí" a lo mejor
- Organiza y ejecuta alrededor de prioridades

### VICTORIA PÚBLICA (Interdependencia)

#### Hábito 4: Pensar Ganar-Ganar
- Busca beneficio mutuo en todas las interacciones humanas
- Desarrolla una mentalidad de abundancia, no de escasez
- Considera las alternativas: Ganar-Ganar o No Hay Trato
- Construye relaciones basadas en confianza y respeto mutuo

#### Hábito 5: Buscar Primero Entender, Luego Ser Entendido
- Practica la escucha empática antes de buscar ser escuchado
- Escucha con la intención de entender, no de responder
- Reformula lo que la otra persona dice para confirmar comprensión
- Presenta tus ideas de manera que otros puedan entenderlas

#### Hábito 6: Sinergizar
- Combina las fortalezas de las personas para lograr objetivos que ninguna podría alcanzar sola
- Valora las diferencias mentales, emocionales y psicológicas
- Busca la tercera alternativa que es mejor que cualquier solución individual
- Crea un ambiente donde es seguro hablar sobre diferencias

### RENOVACIÓN CONTINUA

#### Hábito 7: Afilar la Sierra
- Renueva regularmente las cuatro dimensiones de tu naturaleza:
  - **Física**: ejercicio, nutrición, manejo del estrés
  - **Espiritual**: clarificación de valores, compromiso, estudio y meditación
  - **Mental**: lectura, visualización, planificación, escritura
  - **Social/Emocional**: servicio, empatía, sinergia, seguridad intrínseca

## Conceptos Clave

### Cuenta Bancaria Emocional
- Cada interacción hace un depósito o retiro en las relaciones
- Depósitos: cumplir promesas, pequeñas cortesías, clarificar expectativas
- Retiros: romper promesas, pequeñas descortesías, traicionar confianzas

### Círculo de Influencia vs. Círculo de Preocupación
- Enfócate en lo que puedes controlar (Círculo de Influencia)
- No desperdicies energía en lo que no puedes controlar (Círculo de Preocupación)

### Matriz de Gestión del Tiempo
- Cuadrante I: Urgente e Importante (Crisis)
- Cuadrante II: No Urgente pero Importante (Prevención, planificación)
- Cuadrante III: Urgente pero No Importante (Interrupciones)
- Cuadrante IV: No Urgente y No Importante (Pérdidas de tiempo)

## Aplicación Práctica

### En el Liderazgo
- Lidera con el ejemplo y principios
- Desarrolla a otros a través de delegación efectiva
- Crea visión compartida y compromiso

### En las Relaciones
- Construye confianza a través de la integridad
- Busca entender antes de ser entendido
- Encuentra soluciones ganar-ganar

### En el Crecimiento Personal
- Desarrolla proactividad y responsabilidad personal
- Mantén equilibrio en todas las áreas de la vida
- Comprométete con el aprendizaje continuo

Los 7 hábitos no son técnicas de personalidad superficiales, sino principios fundamentales de efectividad humana que, cuando se practican consistentemente, se convierten en la base del carácter.`,
    tags: ["desarrollo personal", "liderazgo", "efectividad", "hábitos", "principios"],
    slug: "7-habitos-gente-altamente-efectiva",
    read_count: 4521,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 5,
    title: "Hábitos Atómicos",
    author: "James Clear",
    category: "Desarrollo Personal",
    content: `# Hábitos Atómicos

Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años. Este es el poder de los hábitos atómicos.

## Las Cuatro Leyes del Cambio de Comportamiento

### 1ª Ley: Hazlo Obvio
- Usa intenciones de implementación: "Haré [COMPORTAMIENTO] a las [TIEMPO] en [LUGAR]"
- Usa el apilamiento de hábitos: "Después de [HÁBITO ACTUAL], haré [NUEVO HÁBITO]"
- Diseña tu ambiente para hacer obvios los buenos hábitos
- Usa señales visuales para activar los comportamientos deseados

### 2ª Ley: Hazlo Atractivo
- Usa el agrupamiento de tentaciones: combina acciones que quieres hacer con acciones que necesitas hacer
- Únete a una cultura donde tu comportamiento deseado sea normal
- Crea un ritual de motivación antes de hábitos difíciles
- Resalta los beneficios de evitar malos hábitos

### 3ª Ley: Hazlo Fácil
- Reduce la fricción para buenos hábitos y aumenta la fricción para malos hábitos
- Usa la Regla de los Dos Minutos: escala los hábitos hasta que tomen menos de dos minutos
- Prepara tu ambiente para hacer más fáciles las acciones futuras
- Usa la tecnología para automatizar buenos hábitos

### 4ª Ley: Hazlo Satisfactorio
- Usa refuerzo: date recompensas inmediatas por buenos hábitos
- Haz que "no hacer nada" sea disfrutable para hábitos que quieres evitar
- Usa un rastreador de hábitos para visualizar tu progreso
- Nunca falles dos veces: regresa rápidamente después de errores

## Conceptos Clave

### Sistemas vs. Objetivos
- Los objetivos son sobre los resultados que quieres lograr
- Los sistemas son sobre los procesos que llevan a esos resultados
- Enfócate en sistemas, no en objetivos, para cambios duraderos

### Hábitos Basados en Identidad
- Cada acción es un voto por el tipo de persona que deseas ser
- Enfócate en quién quieres ser, no en lo que quieres lograr
- Pregúntate: "¿Qué haría una persona saludable?" o "¿Qué haría una persona organizada?"

### La Meseta del Potencial Latente
- Los hábitos a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico
- Los momentos de avance son a menudo el resultado de muchas acciones previas
- Sé paciente con el proceso: los resultados se acumularán con el tiempo

## Aplicaciones Prácticas

### Para Construir Buenos Hábitos
1. Comienza con hábitos tan pequeños que parezcan triviales
2. Apila nuevos hábitos sobre rutinas existentes
3. Diseña tu ambiente para el éxito
4. Rastrea tu progreso visualmente
5. Celebra pequeñas victorias inmediatamente

### Para Romper Malos Hábitos
1. Hazlos invisibles (elimina señales)
2. Hazlos poco atractivos (enfócate en las desventajas)
3. Hazlos difíciles (aumenta la fricción)
4. Hazlos insatisfactorios (crea responsabilidad)

## Tácticas Avanzadas
- Usa el apilamiento de hábitos para construir rutinas
- Crea intenciones de implementación para escenarios específicos
- Aplica la Regla de Goldilocks: trabaja en desafíos de dificultad manejable
- Usa el diseño del ambiente para apoyar comportamientos deseados

## El Proceso de Cuatro Pasos
1. **Señal**: El disparador que inicia el comportamiento
2. **Anhelo**: La fuerza motivacional detrás de cada hábito
3. **Respuesta**: El hábito real que realizas
4. **Recompensa**: El beneficio que obtienes del hábito

## Estrategias de Implementación

### Diseño del Ambiente
- Haz obvias las señales para buenos hábitos
- Reduce la fricción para comportamientos deseados
- Usa el contexto para tu ventaja

### Seguimiento del Progreso
- Usa un rastreador de hábitos simple
- Enfócate en la consistencia, no en la perfección
- Nunca rompas la cadena dos veces seguidas

### Responsabilidad
- Encuentra un compañero de responsabilidad
- Haz públicos tus compromisos
- Crea consecuencias por no cumplir

El secreto para obtener resultados que duren es nunca dejar de hacer mejoras. Es notable lo que puedes construir si simplemente no paras.`,
    tags: ["hábitos", "cambio de comportamiento", "automejora", "sistemas", "identidad"],
    slug: "habitos-atomicos",
    read_count: 6789,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
  },
]

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [notes, setNotes] = useState("")
  const [fontSize, setFontSize] = useState(16)
  const [readingTime, setReadingTime] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Cargar libro
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError(null)
        const slug = params.slug as string

        console.log("Fetching book with slug:", slug)

        // Intentar cargar desde API
        const response = await fetch(`/api/books/${slug}`)

        if (response.ok) {
          const data = await response.json()
          console.log("Book loaded from API:", data)
          setBook(data)
        } else {
          console.log("API failed, using fallback data")
          // Usar datos de respaldo
          const foundBook = fallbackBooks.find(
            (b) =>
              b.slug === slug ||
              b.id.toString() === slug ||
              b.slug.includes(slug) ||
              b.title.toLowerCase().replace(/\s+/g, "-").includes(slug),
          )

          if (foundBook) {
            console.log("Found fallback book:", foundBook.title)
            setBook(foundBook)
          } else {
            console.log("No book found for slug:", slug)
            setError("Libro no encontrado")
          }
        }
      } catch (error) {
        console.error("Error loading book:", error)
        setError("Error al cargar el libro")

        // Intentar con datos de respaldo como último recurso
        const slug = params.slug as string
        const foundBook = fallbackBooks.find(
          (b) =>
            b.slug === slug ||
            b.id.toString() === slug ||
            b.slug.includes(slug) ||
            b.title.toLowerCase().replace(/\s+/g, "-").includes(slug),
        )

        if (foundBook) {
          console.log("Using fallback book after error:", foundBook.title)
          setBook(foundBook)
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [params.slug])

  // Simular páginas dividiendo el contenido
  const wordsPerPage = 300
  const words = book?.content.split(" ") || []
  const totalPages = Math.ceil(words.length / wordsPerPage)

  const getCurrentPageContent = () => {
    const startIndex = (currentPage - 1) * wordsPerPage
    const endIndex = startIndex + wordsPerPage
    return words.slice(startIndex, endIndex).join(" ")
  }

  // Calcular progreso de lectura
  useEffect(() => {
    if (totalPages > 0) {
      const progress = (currentPage / totalPages) * 100
      setReadingProgress(progress)
    }
  }, [currentPage, totalPages])

  // Simular tiempo de lectura
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Debug: Log pagination info
  useEffect(() => {
    if (book) {
      console.log("Book content length:", book.content.length)
      console.log("Total words:", words.length)
      console.log("Words per page:", wordsPerPage)
      console.log("Total pages:", totalPages)
      console.log("Current page:", currentPage)
    }
  }, [book, words.length, totalPages, currentPage])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const getDifficultyColor = (category: string) => {
    switch (category) {
      case "Productividad":
        return "bg-green-100 text-green-800"
      case "Psicología":
        return "bg-blue-100 text-blue-800"
      case "Desarrollo Personal":
        return "bg-purple-100 text-purple-800"
      case "Comunicación":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const estimateReadingTime = (content: string) => {
    if (!content) return 0
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando libro...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <p className="text-gray-600 mb-4">No se pudo encontrar el libro solicitado.</p>
          <Button onClick={() => router.push("/biblioteca")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la biblioteca
          </Button>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Libro no encontrado</h1>
          <Button onClick={() => router.push("/biblioteca")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la biblioteca
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-4 bg-yellow-100 rounded-lg text-sm">
          <strong>Debug Info:</strong> Palabras: {words.length}, Páginas: {totalPages}, Página actual: {currentPage}
        </div>
      )}

      {/* Back Button */}
      <Button variant="outline" onClick={() => router.push("/biblioteca")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la biblioteca
      </Button>

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <Badge className={getDifficultyColor(book.category)}>{book.category}</Badge>
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {book.author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {estimateReadingTime(book.content)} min lectura
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Tiempo: {formatTime(readingTime)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {book.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-blue-600" : ""}
              >
                <Bookmark className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-600" : ""}
              >
                <Heart className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso de lectura</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              {/* Settings Panel */}
              {showSettings && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Configuración de Lectura</h3>
                  <div className="flex items-center gap-4">
                    <label className="text-sm">Tamaño de fuente:</label>
                    <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                      A-
                    </Button>
                    <span className="text-sm">{fontSize}px</span>
                    <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                      A+
                    </Button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                <div className="whitespace-pre-wrap">{getCurrentPageContent()}</div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>

                <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reading Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Progreso</span>
                <span className="text-sm font-medium">{Math.round(readingProgress)}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tiempo leyendo</span>
                <span className="text-sm font-medium">{formatTime(readingTime)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Páginas restantes</span>
                <span className="text-sm font-medium">{totalPages - currentPage}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tiempo estimado</span>
                <span className="text-sm font-medium">
                  {Math.round(estimateReadingTime(book.content) * (1 - readingProgress / 100))} min
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Mis Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escribe tus notas y reflexiones aquí..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <Button className="w-full mt-3" size="sm">
                Guardar Nota
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                Calificar Libro
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Progreso
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                Libros Relacionados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
