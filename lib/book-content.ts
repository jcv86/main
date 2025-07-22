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
        title: "Introducción",
        pageStart: 1,
        pageEnd: 15,
        content: `
          <h1>Atomic Habits</h1>
          <h2>Un Método Fácil y Comprobado para Crear Buenos Hábitos y Eliminar los Malos</h2>
          <p><strong>Por James Clear</strong></p>
          
          <h3>Introducción: Mi Historia</h3>
          <p>En el segundo año de la escuela secundaria, un bate de béisbol me golpeó en la cara.</p>
          
          <p>Mientras esperaba mi turno al bate durante el entrenamiento de béisbol, un compañero de equipo hizo un swing de práctica con dos bates para calentar. El problema era que yo estaba parado detrás de él.</p>
          
          <p>Sus bates se deslizaron de sus manos y uno de ellos me golpeó directamente entre los ojos. Perdí el conocimiento instantáneamente.</p>
          
          <p>Cuando desperté, estaba en el hospital. Tenía una fractura masiva en el centro de mi cara. Mi nariz estaba aplastada. Al menos media docena de huesos faciales estaban rotos. Mi ojo izquierdo estaba hinchado y cerrado. Tenía una conmoción cerebral severa.</p>
          
          <h3>El Poder de los Pequeños Cambios</h3>
          <p>Los pequeños cambios pueden marcar una gran diferencia. Cuando finalmente decides ponerte en forma, perder peso, dejar de fumar, escribir un libro o aprender una nueva habilidad, es fácil sentirse abrumado por la magnitud del cambio que quieres hacer.</p>
          
          <p>Pero aquí está el secreto: no necesitas hacer cambios drásticos para obtener resultados extraordinarios.</p>
          
          <p>Los hábitos son el interés compuesto de la superación personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>
        `,
      },
      {
        id: "chapter1",
        title: "Capítulo 1: El Poder Sorprendente de los Hábitos Atómicos",
        pageStart: 16,
        pageEnd: 35,
        content: `
          <h2>Capítulo 1: El Poder Sorprendente de los Hábitos Atómicos</h2>
          
          <p>En 2003, el equipo de ciclismo de Gran Bretaña enfrentaba una situación desalentadora. En más de cien años, los ciclistas británicos habían ganado solo una medalla de oro olímpica y nunca habían ganado el Tour de Francia.</p>
          
          <p>Todo eso cambió cuando Dave Brailsford se convirtió en el nuevo director de rendimiento del equipo británico de ciclismo en 2003.</p>
          
          <p>Brailsford creía en un concepto que él llamaba "la agregación de ganancias marginales". Su filosofía era simple: si puedes mejorar cada área relacionada con el ciclismo en solo un 1%, entonces esas pequeñas ganancias se sumarían para lograr una mejora notable.</p>
          
          <h3>¿Por qué los Pequeños Cambios Marcan una Gran Diferencia?</h3>
          <p>Es muy fácil sobreestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente.</p>
          
          <p>Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva. Ya sea perdiendo peso, construyendo un negocio, escribiendo un libro, ganando un campeonato o logrando cualquier otro objetivo, nos presionamos para hacer alguna mejora que capture la atención de todos.</p>
          
          <p>Mientras tanto, mejorar en un 1% no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo.</p>
          
          <h3>¿Qué es un Hábito Atómico?</h3>
          <p>Los hábitos atómicos son pequeños hábitos que forman parte de un sistema más grande. Así como los átomos son los bloques de construcción de las moléculas, los hábitos atómicos son los bloques de construcción de resultados notables.</p>
        `,
      },
      {
        id: "chapter2",
        title: "Capítulo 2: Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)",
        pageStart: 36,
        pageEnd: 55,
        content: `
          <h2>Capítulo 2: Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)</h2>
          
          <p>¿Por qué es tan fácil repetir los malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo, es probable que este tiempo el próximo año estarás haciendo las mismas cosas que estás haciendo hoy.</p>
          
          <p>¿Por qué es tan difícil el cambio?</p>
          
          <h3>Los Tres Niveles de Cambio</h3>
          <p>Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las capas de una cebolla.</p>
          
          <p><strong>El primer nivel es cambiar tus resultados.</strong> Este nivel se trata de cambiar lo que obtienes. La mayoría de las metas que te fijas están en este nivel. Quiero perder peso, quiero publicar un libro, quiero ganar un campeonato.</p>
          
          <p><strong>El segundo nivel es cambiar tu proceso.</strong> Este nivel se trata de cambiar tus hábitos y sistemas. La mayoría de los hábitos que construyes están en este nivel. Implemento una nueva rutina para ir al gimnasio, ordeno mi escritorio para un mejor flujo de trabajo, desarrollo una práctica de meditación.</p>
          
          <p><strong>El tercer y más profundo nivel es cambiar tu identidad.</strong> Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están en este nivel.</p>
          
          <h3>El Proceso de Dos Pasos para Cambiar Tu Identidad</h3>
          <p>Tu identidad emerge de tus hábitos. No naces con creencias preestablecidas. Cada creencia, incluidas las que tienes sobre ti mismo, se aprende y se condiciona a través de la experiencia.</p>
          
          <p>Más precisamente, tus hábitos son cómo encarnas tu identidad. Cuando haces tu cama cada mañana, encarnas la identidad de una persona organizada. Cuando escribes cada día, encarnas la identidad de una persona creativa.</p>
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
