// Comprehensive book content for the reader
export interface BookChapter {
  id: string
  title: string
  content: string
  pageStart: number
  pageEnd: number
}

export interface BookContent {
  bookId: string
  chapters: BookChapter[]
  totalPages: number
}

export const bookContents: { [key: string]: BookContent } = {
  "550e8400-e29b-41d4-a716-446655440001": {
    // Atomic Habits
    bookId: "550e8400-e29b-41d4-a716-446655440001",
    totalPages: 320,
    chapters: [
      {
        id: "intro",
        title: "Introducción: El Poder de los Pequeños Cambios",
        pageStart: 1,
        pageEnd: 15,
        content: `
        <h1>Hábitos Atómicos</h1>
        <h2>Una Guía Práctica para Formar Buenos Hábitos y Romper los Malos</h2>
        
        <h3>Introducción: El Poder de los Pequeños Cambios</h3>
        <p>Los pequeños cambios pueden generar resultados extraordinarios. Esta es la premisa fundamental de los hábitos atómicos: cambios diminutos que, acumulados a lo largo del tiempo, producen transformaciones significativas en nuestras vidas.</p>
        
        <p>Imagina que mejoras solo un 1% cada día durante un año. Al final de ese período, habrás mejorado 37 veces. Por el contrario, si empeoras un 1% cada día, al final del año habrás descendido casi a cero.</p>
        
        <h3>¿Qué Son los Hábitos Atómicos?</h3>
        <p>Los hábitos atómicos son pequeñas rutinas o comportamientos que:</p>
        <ul>
          <li>Son fáciles de implementar</li>
          <li>Se realizan de manera consistente</li>
          <li>Se acumulan para crear cambios significativos</li>
          <li>Forman parte de un sistema más grande</li>
        </ul>
        
        <p>La clave no está en hacer cambios dramáticos, sino en ser consistente con pequeñas mejoras que se componen a lo largo del tiempo.</p>
        
        <h3>El Problema con los Objetivos</h3>
        <p>Muchas personas se enfocan únicamente en los objetivos, pero los objetivos son solo el resultado que queremos lograr. Los sistemas son los procesos que nos llevan a esos resultados.</p>
        
        <p>Si quieres mejores resultados, olvídate de establecer objetivos. Enfócate en tu sistema.</p>
      `,
      },
      {
        id: "chapter1",
        title: "Capítulo 1: Los Fundamentos del Cambio",
        pageStart: 16,
        pageEnd: 35,
        content: `
        <h2>Capítulo 1: Los Fundamentos del Cambio</h2>
        
        <p>El cambio real ocurre en tres niveles diferentes, como las capas de una cebolla:</p>
        
        <h3>Los Tres Niveles del Cambio</h3>
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <ol>
            <li><strong>Cambio de Resultados:</strong> Lo que obtienes (perder peso, ganar dinero)</li>
            <li><strong>Cambio de Proceso:</strong> Lo que haces (implementar rutinas, desarrollar sistemas)</li>
            <li><strong>Cambio de Identidad:</strong> En quién te conviertes (tus creencias sobre ti mismo)</li>
          </ol>
        </div>
        
        <p>La mayoría de las personas comienzan con los resultados que quieren lograr. Pero el cambio duradero comienza con la identidad.</p>
        
        <h3>El Cambio Basado en la Identidad</h3>
        <p>Cada acción que realizas es un voto por el tipo de persona que quieres ser. Ninguna acción individual cambiará tus creencias, pero a medida que los votos se acumulan, también lo hace la evidencia de tu nueva identidad.</p>
        
        <p>En lugar de decir "Quiero leer más", di "Soy una persona que lee". En lugar de "Quiero hacer ejercicio", di "Soy una persona activa".</p>
        
        <h3>El Proceso de Dos Pasos</h3>
        <p>Para cambiar tu identidad:</p>
        <ol>
          <li>Decide qué tipo de persona quieres ser</li>
          <li>Demuéstratelo con pequeñas victorias</li>
        </ol>
        
        <p>Tus hábitos moldean tu identidad, y tu identidad moldea tus hábitos. Es un ciclo de retroalimentación continuo.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">💡 Reflexión Personal</h4>
          <p style="margin-bottom: 0;">¿Qué tipo de persona quieres ser? ¿Qué pequeñas acciones puedes tomar hoy para votar por esa identidad?</p>
        </div>
      `,
      },
      {
        id: "chapter2",
        title: "Capítulo 2: El Sistema de Cuatro Pasos",
        pageStart: 36,
        pageEnd: 55,
        content: `
        <h2>Capítulo 2: El Sistema de Cuatro Pasos para Formar Hábitos</h2>
        
        <p>Todos los hábitos siguen el mismo patrón básico: un ciclo de cuatro pasos que se repite automáticamente.</p>
        
        <h3>El Ciclo del Hábito</h3>
        <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <ol>
            <li><strong>🔔 Señal:</strong> Un disparador que inicia el comportamiento</li>
            <li><strong>💭 Deseo:</strong> La motivación detrás del hábito</li>
            <li><strong>⚡ Respuesta:</strong> El hábito que realizas</li>
            <li><strong>🎁 Recompensa:</strong> El beneficio que obtienes del hábito</li>
          </ol>
        </div>
        
        <p>Si cualquiera de estos cuatro pasos falla, el hábito no se formará. Sin señal, el hábito nunca comienza. Sin deseo, no hay motivación para actuar. Sin respuesta, no hay hábito. Sin recompensa, no hay razón para repetirlo.</p>
        
        <h3>Las Cuatro Leyes del Cambio de Comportamiento</h3>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✅ Para Crear Buenos Hábitos:</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>1ª Ley:</strong> Hazlo Obvio (Señal)</li>
            <li><strong>2ª Ley:</strong> Hazlo Atractivo (Deseo)</li>
            <li><strong>3ª Ley:</strong> Hazlo Fácil (Respuesta)</li>
            <li><strong>4ª Ley:</strong> Hazlo Satisfactorio (Recompensa)</li>
          </ul>
        </div>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Para Romper Malos Hábitos:</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>1ª Ley Invertida:</strong> Hazlo Invisible</li>
            <li><strong>2ª Ley Invertida:</strong> Hazlo Poco Atractivo</li>
            <li><strong>3ª Ley Invertida:</strong> Hazlo Difícil</li>
            <li><strong>4ª Ley Invertida:</strong> Hazlo Insatisfactorio</li>
          </ul>
        </div>
        
        <h3>Ejemplo Práctico: Hábito de Lectura</h3>
        <p>Supongamos que quieres desarrollar el hábito de leer más:</p>
        
        <ul>
          <li><strong>Hazlo Obvio:</strong> Coloca un libro en tu mesita de noche</li>
          <li><strong>Hazlo Atractivo:</strong> Elige libros sobre temas que te apasionen</li>
          <li><strong>Hazlo Fácil:</strong> Comienza con solo 2 páginas por día</li>
          <li><strong>Hazlo Satisfactorio:</strong> Marca cada día que lees en un calendario</li>
        </ul>
        
        <p>En los próximos capítulos, exploraremos cada una de estas leyes en detalle y aprenderás técnicas específicas para aplicarlas en tu vida.</p>
      `,
      },
    ],
  },
  "550e8400-e29b-41d4-a716-446655440003": {
    // Lean In
    bookId: "550e8400-e29b-41d4-a716-446655440003",
    totalPages: 368,
    chapters: [
      {
        id: "intro",
        title: "Introducción",
        pageStart: 1,
        pageEnd: 20,
        content: `
          <h1>Lean In</h1>
          <h2>Las Mujeres, el Trabajo y la Voluntad de Liderar</h2>
          <p><strong>Por Sheryl Sandberg</strong></p>
          
          <h3>Introducción</h3>
          <p>Treinta años después de que las mujeres se convirtieran en el 50 por ciento de la fuerza laboral universitaria, los hombres aún ocupan la gran mayoría de los puestos de liderazgo en el gobierno y la industria.</p>
          
          <p>Esto significa que las decisiones que más afectan nuestras vidas son tomadas predominantemente por hombres. Hasta que las mujeres tengan el mismo poder para dirigir las decisiones que afectan a todos, nuestras instituciones seguirán fallando a las mujeres y a las familias que dependen de ellas.</p>
          
          <p>El progreso hacia la verdadera igualdad se ha estancado. Esto es especialmente cierto en el contexto del mercado laboral chileno, donde las brechas de género en posiciones de liderazgo siguen siendo significativas.</p>
          
          <h3>Mi Historia</h3>
          <p>Dieciocho meses antes de escribir este libro, di una charla TED titulada "Por qué tenemos tan pocas líderes mujeres". Hablé sobre cómo las mujeres se sabotean involuntariamente al carecer de confianza en sí mismas, al no levantar la mano y al retroceder cuando deberían inclinarse hacia adelante.</p>
          
          <p>También hablé sobre cómo los hombres y las mujeres deben trabajar juntos para corregir las desigualdades. Para mi sorpresa, la charla se volvió viral.</p>
          
          <p>Después de la charla, las mujeres se me acercaron para contarme sus historias. Historias sobre trabajar duro y ser pasadas por alto. Historias sobre ser las únicas mujeres en reuniones de la junta directiva. Historias sobre equilibrar las responsabilidades del hogar y el trabajo.</p>
        `,
      },
      {
        id: "chapter1",
        title: "Capítulo 1: La Revolución Inacabada",
        pageStart: 21,
        pageEnd: 45,
        content: `
          <h2>Capítulo 1: La Revolución Inacabada</h2>
          
          <p>Una verdadera igualdad de oportunidades requeriría una revolución masiva en la forma en que criamos a nuestros hijos, estructuramos nuestros trabajos, dirigimos nuestras relaciones y definimos el éxito.</p>
          
          <p>Pero también requiere que las mujeres continúen luchando por un asiento en la mesa.</p>
          
          <p>Necesitamos más mujeres no solo participando en la economía, sino liderándola. En Chile, como en muchos países de América Latina, esta necesidad es particularmente urgente dado el potencial económico que representa la plena participación femenina en el liderazgo empresarial.</p>
          
          <h3>Los Números Cuentan la Historia</h3>
          <p>Las mujeres representan más de la mitad de la población mundial, pero ocupan solo el 20 por ciento de los asientos en los parlamentos a nivel mundial. En el sector privado, las cifras son igualmente desalentadoras.</p>
          
          <p>En Estados Unidos, las mujeres ocupan solo el 14 por ciento de los puestos ejecutivos, el 17 por ciento de los asientos en las juntas directivas y el 18 por ciento de los puestos de gobierno a nivel federal. En Chile, estos números son aún más bajos en muchos sectores.</p>
          
          <p>Esta falta de liderazgo femenino priva a nuestras familias, comunidades y empresas de una perspectiva crítica que las mujeres aportan a la mesa.</p>
          
          <h3>¿Qué Está Frenando a las Mujeres?</h3>
          <p>Hay muchas causas. Las barreras estructurales e institucionales ciertamente juegan un papel importante. Pero también hay barreras que existen dentro de nosotras mismas.</p>
          
          <p>Las mujeres sistemáticamente subestiman sus propias habilidades. Múltiples estudios en múltiples industrias muestran que las mujeres a menudo juzgan su propio rendimiento como peor de lo que realmente es, mientras que los hombres juzgan su propio rendimiento como mejor de lo que realmente es.</p>
        `,
      },
      {
        id: "chapter2",
        title: "Capítulo 2: Siéntate a la Mesa",
        pageStart: 46,
        pageEnd: 70,
        content: `
          <h2>Capítulo 2: Siéntate a la Mesa</h2>
          
          <p>Hace varios años, fui invitada a dar una charla en una universidad. Después de mi presentación, una estudiante se me acercó y me dijo que había aprendido algo importante. Le pregunté qué era.</p>
          
          <p>"Aprendí a sentarme a la mesa", me dijo.</p>
          
          <p>Me explicó que durante mi charla, había notado que todas las estudiantes mujeres se sentaron en las filas de atrás, mientras que los estudiantes hombres llenaron las filas del frente. Sin que nadie se lo dijera, las mujeres se habían relegado a sí mismas a la parte de atrás.</p>
          
          <h3>El Síndrome del Impostor</h3>
          <p>Las mujeres sistemáticamente subestiman sus propias habilidades. Si bien los hombres tienden a sobreestimar sus habilidades y rendimiento, y las mujeres tienden a subestimarlas.</p>
          
          <p>Múltiples estudios en múltiples industrias muestran que las mujeres a menudo juzgan su propio rendimiento como peor de lo que realmente es, mientras que los hombres juzgan su propio rendimiento como mejor de lo que realmente es.</p>
          
          <p>Esta diferencia en la autopercepción tiene consecuencias profundas. En el contexto profesional chileno, esto se traduce en que las mujeres son menos propensas a postularse para promociones, negociar salarios o tomar riesgos profesionales calculados.</p>
          
          <h3>La Confianza Importa</h3>
          <p>El éxito y la simpatía están positivamente correlacionados para los hombres y negativamente correlacionados para las mujeres. Cuando un hombre es exitoso, tanto hombres como mujeres lo ven como más simpático. Cuando una mujer es exitosa, tanto hombres como mujeres la ven como menos simpática.</p>
          
          <p>Esta realidad pone a las mujeres en una posición imposible. Si son competentes, no son queridas. Si son queridas, se considera que no son competentes.</p>
          
          <p>Dado este dilema, no es sorprendente que las mujeres eviten tomar medidas que las hagan parecer demasiado ambiciosas.</p>
        `,
      },
    ],
  },
  "550e8400-e29b-41d4-a716-446655440004": {
    // Deep Work
    bookId: "550e8400-e29b-41d4-a716-446655440004",
    totalPages: 304,
    chapters: [
      {
        id: "intro",
        title: "Introducción",
        pageStart: 1,
        pageEnd: 15,
        content: `
          <h1>Deep Work</h1>
          <h2>Reglas para el Éxito Enfocado en un Mundo Distraído</h2>
          <p><strong>Por Cal Newport</strong></p>
          
          <h3>Introducción</h3>
          <p>En enero de 2014, el autor y periodista Michael Lewis publicó un artículo en Vanity Fair describiendo la rutina diaria del presidente Barack Obama. La pieza reveló que el presidente intentaba reducir las decisiones triviales en su vida diaria.</p>
          
          <p>"Verás que solo uso trajes grises o azules", le dijo Obama a Lewis. "Estoy tratando de reducir las decisiones. No quiero tomar decisiones sobre lo que voy a comer o usar. Porque tengo demasiadas otras decisiones que tomar."</p>
          
          <p>Obama estaba siguiendo una estrategia bien conocida para preservar la energía mental: la automatización de decisiones de bajo nivel para que pueda concentrar su atención limitada en las decisiones de alto nivel que realmente importan.</p>
          
          <h3>¿Qué es el Trabajo Profundo?</h3>
          <p><strong>Trabajo Profundo:</strong> Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad y son difíciles de replicar.</p>
          
          <p><strong>Trabajo Superficial:</strong> Tareas de estilo logístico, a menudo realizadas mientras se está distraído, que no crean mucho valor nuevo en el mundo y son fáciles de replicar.</p>
          
          <p>El trabajo profundo es la habilidad de concentrarse sin distracción en una tarea cognitivamente demandante. Es una habilidad que te permite dominar rápidamente información complicada y producir mejores resultados en menos tiempo.</p>
        `,
      },
      {
        id: "chapter1",
        title: "Capítulo 1: El Trabajo Profundo es Valioso",
        pageStart: 16,
        pageEnd: 45,
        content: `
          <h2>Capítulo 1: El Trabajo Profundo es Valioso</h2>
          
          <p>En la nueva economía, tres grupos tendrán una ventaja particular: aquellos que pueden trabajar bien y rápidamente con máquinas inteligentes, aquellos que son los mejores en lo que hacen, y aquellos con acceso a capital.</p>
          
          <p>Para unirse a los dos primeros grupos (los únicos relevantes para la mayoría de los trabajadores del conocimiento), debes dominar el arte de aprender rápidamente cosas complicadas.</p>
          
          <p>Esta tarea requiere trabajo profundo. Si no cultivas esta habilidad, es probable que te quedes atrás a medida que la tecnología avanza.</p>
          
          <h3>Los Superstars de la Nueva Economía</h3>
          <p>Para entender el papel del trabajo profundo en esta nueva economía, consideremos a los ganadores. Comencemos con aquellos que pueden trabajar productivamente con máquinas inteligentes.</p>
          
          <p>Tyler Cowen, economista de George Mason, resume esta realidad de manera más sucinta: "Las máquinas inteligentes no están tomando todos los trabajos, pero están tomando más trabajos de los que están creando, y están contribuyendo a la estagnación de los ingresos medios."</p>
          
          <p>En este nuevo mundo económico, aquellos que pueden trabajar creativamente con máquinas inteligentes prosperarán. Aquellos que no pueden, no lo harán.</p>
          
          <h3>Cómo Convertirse en un Superstar</h3>
          <p>Ahora que hemos identificado quién tiene ventaja en la nueva economía, la siguiente pregunta es cómo unirse a sus filas. Creo que la respuesta es doble: debes dominar rápidamente cosas difíciles y debes producir a un nivel de élite, tanto en términos de calidad como de velocidad.</p>
          
          <p>Si no puedes aprender, no puedes prosperar. Si no puedes producir, no prosperarás sin importar tu talento o entrenamiento.</p>
          
          <p>Las dos habilidades centrales de esta nueva economía dependen de tu capacidad para realizar trabajo profundo.</p>
        `,
      },
    ],
  },
}

export function getBookContentForPage(bookId: string, page: number): string {
  const book = bookContents[bookId]
  if (!book) {
    return `
      <h2>Contenido del Libro - Página ${page}</h2>
      <p>Este es el contenido de muestra para la página ${page} del libro.</p>
      <p>En una implementación real, este contenido vendría de una base de datos o sistema de gestión de contenido.</p>
      <p>El contenido estaría estructurado por capítulos y páginas, permitiendo una navegación fluida a través del libro.</p>
      <p>Cada página contendría texto formateado, posibles imágenes, y elementos interactivos según el tipo de libro.</p>
    `
  }

  // Find the chapter that contains this page
  const chapter = book.chapters.find((ch) => page >= ch.pageStart && page <= ch.pageEnd)

  if (!chapter) {
    return `
      <h2>Página ${page}</h2>
      <p>Contenido no disponible para esta página.</p>
    `
  }

  // Calculate position within chapter for content variation
  const pageInChapter = page - chapter.pageStart + 1
  const totalPagesInChapter = chapter.pageEnd - chapter.pageStart + 1
  const progressInChapter = pageInChapter / totalPagesInChapter

  // Return different parts of the chapter content based on page position
  if (progressInChapter <= 0.3) {
    return chapter.content
  } else if (progressInChapter <= 0.6) {
    return `
      <div class="chapter-continuation">
        <h3>Continuación - ${chapter.title}</h3>
        <p><em>Página ${page} de ${book.totalPages}</em></p>
        
        <p>Este contenido continúa desarrollando los conceptos introducidos al inicio del capítulo. En una implementación completa, aquí se presentarían ejemplos específicos, casos de estudio y aplicaciones prácticas de los principios discutidos.</p>
        
        <p>Los conceptos se profundizan con ejemplos relevantes para el contexto profesional chileno, incluyendo casos de empresas locales y situaciones específicas del mercado laboral nacional.</p>
        
        <blockquote>
          <p>"El conocimiento sin acción es inútil, pero la acción sin conocimiento es peligrosa." - Proverbio aplicable al desarrollo profesional.</p>
        </blockquote>
        
        <p>A medida que avanzamos en este capítulo, exploraremos cómo aplicar estos principios en situaciones reales del mundo laboral chileno.</p>
      </div>
    `
  } else {
    return `
      <div class="chapter-conclusion">
        <h3>Conclusión - ${chapter.title}</h3>
        <p><em>Página ${page} de ${book.totalPages}</em></p>
        
        <p>En esta sección final del capítulo, consolidamos los aprendizajes clave y proporcionamos un marco práctico para la implementación.</p>
        
        <h4>Puntos Clave para Recordar:</h4>
        <ul>
          <li>La aplicación consistente de estos principios genera resultados compuestos a largo plazo</li>
          <li>El contexto cultural y profesional chileno requiere adaptaciones específicas</li>
          <li>La medición del progreso es esencial para mantener la motivación</li>
          <li>Los pequeños cambios sostenidos superan a los grandes cambios esporádicos</li>
        </ul>
        
        <h4>Ejercicio Práctico:</h4>
        <p>Antes de continuar al siguiente capítulo, tómate unos minutos para reflexionar sobre cómo puedes aplicar estos conceptos en tu situación profesional actual. Considera escribir tus ideas en las notas de este libro.</p>
        
        <p><strong>Próximo capítulo:</strong> Continuaremos explorando cómo profundizar en estos conceptos y aplicarlos de manera más específica a tu desarrollo profesional.</p>
      </div>
    `
  }
}
