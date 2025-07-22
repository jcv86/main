// Mock data and functions for the library system
export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating: number
  reading_time: string
  difficulty: string
  publication_year: number
  cover_image?: string
  total_pages: number
  created_at: string
  is_free?: boolean
}

export interface BookContent {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  page_number: number
  created_at: string
}

export interface ReadingProgress {
  id: string
  user_id: string
  book_id: string
  progress_percentage: number
  current_page: number
  last_read_at: string
  created_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  book_id: string
  page_number: number
  note?: string
  created_at: string
}

export interface ReadingStats {
  books_read: number
  total_reading_time: number
  average_progress: number
  reading_streak: number
}

// Mock data - All titles in Spanish
const mockBooks: Book[] = [
  {
    id: "8",
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    description:
      "Lecciones poderosas de cambio personal. Los principios fundamentales para el éxito personal y profesional que han transformado millones de vidas. ¡LIBRO COMPLETO GRATIS!",
    category: "Desarrollo Personal",
    rating: 4.8,
    reading_time: "5h 45min",
    difficulty: "Intermedio",
    publication_year: 1989,
    total_pages: 432,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "1",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description:
      "Una guía práctica para formar buenos hábitos y romper los malos. Aprende cómo pequeños cambios pueden generar resultados extraordinarios a través de técnicas probadas de formación de hábitos.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    difficulty: "Intermedio",
    publication_year: 2018,
    total_pages: 320,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Trabajo Profundo",
    author: "Cal Newport",
    description:
      "Reglas para el éxito enfocado en un mundo distraído. Aprende a desarrollar la habilidad más valiosa del siglo XXI: la capacidad de concentrarse sin distracciones en tareas cognitivamente demandantes.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "4h 45min",
    difficulty: "Intermedio",
    publication_year: 2016,
    total_pages: 296,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Vayamos Adelante",
    author: "Sheryl Sandberg",
    description:
      "Las mujeres, el trabajo y la voluntad de liderar. Un libro inspirador sobre liderazgo femenino y cómo superar los obstáculos en el mundo profesional.",
    category: "Liderazgo",
    rating: 4.5,
    reading_time: "3h 20min",
    difficulty: "Fácil",
    publication_year: 2013,
    total_pages: 240,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Inteligencia Emocional 2.0",
    author: "Travis Bradberry",
    description:
      "Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales. Descubre cómo la inteligencia emocional puede transformar tu carrera.",
    category: "Habilidades Blandas",
    rating: 4.4,
    reading_time: "3h 50min",
    difficulty: "Fácil",
    publication_year: 2009,
    total_pages: 280,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "El Método Lean Startup",
    author: "Eric Ries",
    description:
      "Cómo los emprendedores de hoy utilizan la innovación continua para crear negocios radicalmente exitosos. Metodología esencial para startups.",
    category: "Negocios",
    rating: 4.6,
    reading_time: "5h 10min",
    difficulty: "Intermedio",
    publication_year: 2011,
    total_pages: 336,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Mentalidad",
    author: "Carol S. Dweck",
    description:
      "La nueva psicología del éxito. Descubre cómo una mentalidad de crecimiento puede transformar tu vida personal y profesional.",
    category: "Desarrollo Personal",
    rating: 4.5,
    reading_time: "4h 15min",
    difficulty: "Fácil",
    publication_year: 2006,
    total_pages: 276,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Empresas que Sobresalen",
    author: "Jim Collins",
    description:
      "Por qué algunas empresas dan el salto... y otras no. Análisis profundo de las características que distinguen a las empresas excepcionales.",
    category: "Liderazgo",
    rating: 4.7,
    reading_time: "6h 30min",
    difficulty: "Avanzado",
    publication_year: 2001,
    total_pages: 400,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    title: "El Poder del Ahora",
    author: "Eckhart Tolle",
    description:
      "Una guía hacia la iluminación espiritual. Aprende a vivir en el presente y libérate del dolor emocional del pasado y la ansiedad del futuro.",
    category: "Desarrollo Personal",
    rating: 4.3,
    reading_time: "3h 40min",
    difficulty: "Intermedio",
    publication_year: 1997,
    total_pages: 236,
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    title: "La Semana Laboral de 4 Horas",
    author: "Timothy Ferriss",
    description:
      "Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos. Estrategias para automatizar tu vida y trabajar menos.",
    category: "Productividad",
    rating: 4.2,
    reading_time: "4h 20min",
    difficulty: "Intermedio",
    publication_year: 2007,
    total_pages: 308,
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    title: "Conversaciones Cruciales",
    author: "Kerry Patterson",
    description:
      "Herramientas para hablar cuando las apuestas son altas. Aprende a manejar conversaciones difíciles con confianza y obtener resultados positivos.",
    category: "Habilidades Blandas",
    rating: 4.6,
    reading_time: "4h 10min",
    difficulty: "Intermedio",
    publication_year: 2002,
    total_pages: 288,
    created_at: new Date().toISOString(),
  },
  {
    id: "12",
    title: "De Cero a Uno",
    author: "Peter Thiel",
    description:
      "Notas sobre startups, o cómo construir el futuro. Perspectivas únicas sobre innovación y creación de valor en el mundo empresarial.",
    category: "Negocios",
    rating: 4.4,
    reading_time: "3h 30min",
    difficulty: "Avanzado",
    publication_year: 2014,
    total_pages: 224,
    created_at: new Date().toISOString(),
  },
]

// Mock book content with rich, detailed content for all books
const mockBookContent: { [key: string]: BookContent[] } = {
  "1": [
    {
      id: "content-1-1",
      book_id: "1",
      chapter_number: 1,
      title: "Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia",
      content: `
        <h2>Capítulo 1: Los Fundamentos</h2>
        <p><strong>Los hábitos son el interés compuesto de la superación personal.</strong> De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>
        
        <p>Parecen marcar poca diferencia en un día cualquiera y, sin embargo, el impacto que generan a lo largo de los meses y años puede ser enorme. Solo cuando miramos hacia atrás —dos, cinco o quizás diez años después— el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente evidente.</p>
        
        <h3>🚀 El poder de los pequeños cambios</h3>
        <p>Si puedes mejorar tan solo un <strong>1% cada día</strong> durante un año, terminarás siendo treinta y siete veces mejor al final del período. Por el contrario, si empeoras un 1% cada día durante un año, descenderás casi hasta cero.</p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <h4 style="color: #1e40af; margin-top: 0;">📊 La matemática del 1%</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>1% mejor cada día:</strong> 1.01^365 = 37.78</li>
            <li><strong>1% peor cada día:</strong> 0.99^365 = 0.03</li>
          </ul>
        </div>
        
        <p>Los pequeños cambios a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier proceso de cambio compuesto se retrasan. <em>Necesitas ser paciente.</em></p>
        
        <h3>🧊 ¿Qué es realmente el progreso?</h3>
        <p>Imagina que tienes un cubo de hielo sentado sobre la mesa frente a ti. La habitación está fría y puedes ver tu aliento. Es de 25 grados Fahrenheit. Nada sucede. 26 grados. 27. 28. El hielo sigue sólido. 29. 30. 31. Aún nada ha sucedido.</p>
        
        <p><strong>Entonces, a los 32 grados, el hielo comienza a derretirse.</strong> Un cambio de un grado, aparentemente no diferente de los cambios de temperatura que lo precedieron, desató una transformación enorme.</p>
        
        <p>Los momentos decisivos son frecuentemente el resultado de muchas acciones previas, que construyen el potencial requerido para desatar un cambio mayor.</p>
        
        <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          "El éxito es el producto de hábitos diarios, no de transformaciones de una sola vez."
        </blockquote>
        
        <h3>😔 El valle de la desilusión</h3>
        <p>Es natural sentirse desanimado cuando no ves resultados inmediatos. Esto es lo que llamo el <strong>"Valle de la Desilusión"</strong>. Es el período entre el inicio de un nuevo hábito y el momento en que empiezas a ver resultados tangibles.</p>
        
        <p>La mayoría de las personas abandonan sus hábitos en este valle. Pero si puedes perseverar a través de este período, eventualmente alcanzarás lo que llamo el <strong>"Plateau del Potencial Latente"</strong>, donde los resultados se vuelven visibles.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">⚠️ Punto clave para recordar</h4>
          <p style="margin-bottom: 0;">Los hábitos necesitan tiempo para mostrar resultados. No te rindas en el Valle de la Desilusión. La perseverancia es la clave para alcanzar el punto de inflexión donde los cambios se vuelven evidentes.</p>
        </div>
        
        <h3>🎯 Enfócate en los sistemas, no en las metas</h3>
        <p>Las metas son los resultados que quieres lograr. Los sistemas son los procesos que sigues para lograr esos resultados.</p>
        
        <ul>
          <li><strong>Meta:</strong> Perder 10 kilos</li>
          <li><strong>Sistema:</strong> Comer saludablemente y hacer ejercicio regularmente</li>
        </ul>
        
        <p>Si ignoras las metas y te enfocas solo en el sistema, ¿aún tendrías éxito? Creo que sí. Los sistemas son lo que importa. Las metas son útiles para establecer una dirección, pero los sistemas son mejores para hacer progreso real.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-2",
      book_id: "1",
      chapter_number: 2,
      title: "Cómo tus hábitos moldean tu identidad (y viceversa)",
      content: `
        <h2>Capítulo 2: Cómo tus hábitos moldean tu identidad</h2>
        <p>Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las <strong>capas de una cebolla</strong>.</p>
        
        <h3>🧅 Los tres niveles del cambio</h3>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>🎯 Cambiar tus resultados:</strong> Este nivel se refiere a cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato.</li>
            <li><strong>⚙️ Cambiar tu proceso:</strong> Este nivel se refiere a cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación.</li>
            <li><strong>🧠 Cambiar tu identidad:</strong> Este nivel se refiere a cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y sobre otros.</li>
          </ol>
        </div>
        
        <p>La mayoría de las personas comienzan con los resultados que quieren lograr. Esto puede funcionar por un tiempo, pero la razón por la que la mayoría de las personas no logra mantener la motivación para cambiar durante mucho tiempo es que <strong>nunca cambian las creencias que subyacen a su comportamiento</strong>.</p>
        
        <h3>🎭 El verdadero cambio de comportamiento es cambio de identidad</h3>
        <p>Tienes una nueva meta y un nuevo plan, pero no has cambiado quién eres. Cuando tu comportamiento y tu identidad están completamente alineados, ya no estás persiguiendo el cambio de comportamiento. <em>Simplemente estás actuando como el tipo de persona que ya eres.</em></p>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #be185d; margin-top: 0;">💡 Cambio de perspectiva</h4>
          <ul style="margin-bottom: 0;">
            <li>La meta no es <strong>leer un libro</strong>, la meta es <strong>convertirse en lector</strong></li>
            <li>La meta no es <strong>correr un maratón</strong>, la meta es <strong>convertirse en corredor</strong></li>
            <li>La meta no es <strong>aprender un instrumento</strong>, la meta es <strong>convertirse en músico</strong></li>
          </ul>
        </div>
        
        <h3>🗳️ El proceso de dos pasos para cambiar tu identidad</h3>
        <ol>
          <li><strong>Decide el tipo de persona que quieres ser.</strong></li>
          <li><strong>Demuéstratelo a ti mismo con pequeñas victorias.</strong></li>
        </ol>
        
        <p><strong>Cada acción que realizas es un voto por el tipo de persona que deseas convertirte.</strong> Ninguna instancia individual transformará tus creencias, pero a medida que los votos se acumulan, también lo hace la evidencia de tu nueva identidad.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Cada hábito no solo obtiene resultados, sino que también te enseña algo mucho más importante: a confiar en ti mismo."
        </blockquote>
        
        <h3>🔄 Ejemplos prácticos de cambio de identidad</h3>
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔄 Transformaciones de mentalidad</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>En lugar de:</strong> "Quiero perder peso" → <strong>Di:</strong> "Soy una persona saludable"</li>
            <li><strong>En lugar de:</strong> "Quiero escribir un libro" → <strong>Di:</strong> "Soy un escritor"</li>
            <li><strong>En lugar de:</strong> "Quiero ser más organizado" → <strong>Di:</strong> "Soy una persona organizada"</li>
            <li><strong>En lugar de:</strong> "Quiero aprender español" → <strong>Di:</strong> "Soy alguien que habla español"</li>
          </ul>
        </div>
        
        <p>Cuando cambias tu identidad, tus hábitos se vuelven naturales. No tienes que motivarte para actuar como el tipo de persona que ya eres.</p>
        
        <h3>🏆 El ciclo de retroalimentación de la identidad</h3>
        <p>Tus hábitos moldean tu identidad, y tu identidad moldea tus hábitos. Es un ciclo de dos vías. La formación de todos los hábitos es un ciclo de retroalimentación, pero es importante que permitas que tus valores, principios y identidad impulsen el ciclo.</p>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">
            Hábitos → Identidad → Hábitos → Identidad...
          </p>
        </div>
        
        <p>Este es el motivo por el cual el cambio significativo no requiere cambios radicales. Los pequeños hábitos pueden marcar una diferencia significativa al proporcionar evidencia de un nuevo tipo de identidad.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-3",
      book_id: "1",
      chapter_number: 3,
      title: "Cómo construir mejores hábitos en 4 simples pasos",
      content: `
        <h2>Capítulo 3: Cómo construir mejores hábitos en 4 simples pasos</h2>
        <p>En 1898, un psicólogo llamado <strong>Edward Thorndike</strong> realizó un experimento que cambiaría la forma en que pensamos sobre la formación de hábitos.</p>
        
        <p>Thorndike puso gatos en una caja negra con una palanca que abriría la puerta. Al principio, los gatos corrían frenéticamente, arañando y mordiendo para escapar. Eventualmente, golpeaban accidentalmente la palanca y la puerta se abría.</p>
        
        <p>Después de repetir este experimento muchas veces, los gatos aprendieron a presionar la palanca inmediatamente. Thorndike describió esto como la <strong>Ley del Efecto</strong>: "Los comportamientos seguidos de consecuencias satisfactorias tienden a repetirse."</p>
        
        <h3>🔄 El bucle del hábito</h3>
        <p>Un hábito es un comportamiento que se ha repetido lo suficiente como para volverse automático. El proceso de construcción de un hábito se puede dividir en <strong>cuatro pasos simples</strong>:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>🔔 Señal:</strong> La señal desencadena tu cerebro para iniciar un comportamiento. Es un poco de información que predice una recompensa.</li>
            <li><strong>💭 Anhelo:</strong> Los anhelos son la fuerza motivacional detrás de cada hábito. Sin algún nivel de motivación o deseo, no tenemos razón para actuar.</li>
            <li><strong>⚡ Respuesta:</strong> La respuesta es el hábito real que realizas, que puede tomar la forma de un pensamiento o una acción.</li>
            <li><strong>🎁 Recompensa:</strong> Las recompensas son el objetivo final de cada hábito. Satisfacen tu anhelo y te enseñan qué acciones vale la pena recordar en el futuro.</li>
          </ol>
        </div>
        
        <p>Si un comportamiento es insuficiente en cualquiera de las cuatro etapas, no se convertirá en un hábito. Elimina la señal y tu hábito nunca comenzará. Reduce el anhelo y no tendrás suficiente motivación para actuar.</p>
        
        <h3>⚖️ Las cuatro leyes del cambio de comportamiento</h3>
        <p>Podemos transformar estas cuatro etapas en un conjunto práctico de reglas que podemos usar para diseñar buenos hábitos y eliminar los malos.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✅ Cómo crear un buen hábito:</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>1ª Ley (Señal):</strong> 👁️ Hazlo obvio</li>
            <li><strong>2ª Ley (Anhelo):</strong> 😍 Hazlo atractivo</li>
            <li><strong>3ª Ley (Respuesta):</strong> ⚡ Hazlo fácil</li>
            <li><strong>4ª Ley (Recompensa):</strong> 😊 Hazlo satisfactorio</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #d97706; margin-top: 0;">❌ Cómo romper un mal hábito:</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Inversión de la 1ª Ley:</strong> 🙈 Hazlo invisible</li>
            <li><strong>Inversión de la 2ª Ley:</strong> 😒 Hazlo poco atractivo</li>
            <li><strong>Inversión de la 3ª Ley:</strong> 🚧 Hazlo difícil</li>
            <li><strong>Inversión de la 4ª Ley:</strong> 😞 Hazlo insatisfactorio</li>
          </ul>
        </div>
        
        <p>Siempre que quieras cambiar tu comportamiento, puedes simplemente preguntarte:</p>
        <ul>
          <li>¿Cómo puedo hacerlo <strong>obvio</strong>?</li>
          <li>¿Cómo puedo hacerlo <strong>atractivo</strong>?</li>
          <li>¿Cómo puedo hacerlo <strong>fácil</strong>?</li>
          <li>¿Cómo puedo hacerlo <strong>satisfactorio</strong>?</li>
        </ul>
        
        <h3>📚 Ejemplo práctico: Crear el hábito de leer</h3>
        <p>Supongamos que quieres crear el hábito de leer más libros. Así es como aplicarías las cuatro leyes:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">📖 Plan de acción para leer más</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>👁️ Hazlo obvio:</strong> Coloca un libro en tu mesita de noche donde puedas verlo cada mañana.</li>
            <li><strong>😍 Hazlo atractivo:</strong> Únete a un club de lectura o encuentra libros sobre temas que realmente te interesen.</li>
            <li><strong>⚡ Hazlo fácil:</strong> Comienza con solo 2 páginas por día. Reduce la fricción.</li>
            <li><strong>😊 Hazlo satisfactorio:</strong> Lleva un registro de los libros que has leído y celebra cada libro completado.</li>
          </ul>
        </div>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "No te elevas al nivel de tus metas. Caes al nivel de tus sistemas."
        </blockquote>
        
        <p>Los hábitos no se tratan de tener suficiente disciplina para cambiar tu vida. Se tratan de crear sistemas que hagan que el cambio sea inevitable.</p>
        
        <h3>🧠 El cerebro automático</h3>
        <p>Tu cerebro está constantemente analizando tu entorno interno y externo en busca de pistas sobre dónde están ubicadas las recompensas. La presencia de estas señales hace que surja un anhelo, y un anhelo inicia una respuesta.</p>
        
        <p>Este proceso sucede en una fracción de segundo, y lo usamos todo el tiempo sin darnos cuenta. Ves una señal, categorizas lo que está sucediendo y determinas la respuesta apropiada.</p>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
          <p style="font-size: 16px; font-weight: bold; color: #334155; margin: 0;">
            Señal → Anhelo → Respuesta → Recompensa
          </p>
          <p style="font-size: 14px; color: #64748b; margin: 10px 0 0 0;">
            El bucle fundamental de todos los hábitos
          </p>
        </div>
        
        <p>En los próximos capítulos, exploraremos cada una de estas leyes en detalle y aprenderás cómo aplicarlas para construir mejores hábitos y romper los malos.</p>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
  ],
  "2": [
    {
      id: "content-2-1",
      book_id: "2",
      chapter_number: 1,
      title: "Introducción: El Valor del Trabajo Profundo",
      content: `
        <h2>Introducción: El Valor del Trabajo Profundo</h2>
        <p>En nuestra era de distracción constante, la capacidad de concentrarse profundamente en tareas cognitivamente demandantes se ha vuelto cada vez más rara y, paradójicamente, cada vez más valiosa.</p>
        
        <h3>¿Qué es el Trabajo Profundo?</h3>
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p><strong>Trabajo Profundo:</strong> Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad y son difíciles de replicar.</p>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p><strong>Trabajo Superficial:</strong> Tareas de estilo logístico, a menudo realizadas mientras se está distraído, que no crean mucho valor nuevo en el mundo y son fáciles de replicar.</p>
        </div>
        
        <h3>🎯 Por qué el Trabajo Profundo es Crucial</h3>
        <p>En la economía moderna, el trabajo profundo es valioso por tres razones principales:</p>
        
        <ul>
          <li><strong>Aprendizaje rápido:</strong> La capacidad de dominar rápidamente cosas difíciles</li>
          <li><strong>Producción de élite:</strong> La habilidad de producir a un nivel de élite en términos de calidad y velocidad</li>
          <li><strong>Ventaja competitiva:</strong> Una habilidad cada vez más rara en nuestra economía distraída</li>
        </ul>
        
        <h3>📱 El Problema de la Distracción</h3>
        <p>Vivimos en una época de fragmentación de la atención. El trabajador promedio revisa su correo electrónico cada 6 minutos. Las redes sociales, las notificaciones constantes y la cultura del "siempre conectado" han creado un entorno hostil para el trabajo profundo.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "La capacidad de realizar trabajo profundo se está volviendo cada vez más rara exactamente al mismo tiempo que se está volviendo cada vez más valiosa en nuestra economía."
        </blockquote>
        
        <h3>🚀 La Oportunidad</h3>
        <p>Si desarrollas la habilidad de trabajar profundamente, prosperarás. Esta habilidad te permitirá:</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <ul style="margin-bottom: 0;">
            <li>Aprender habilidades complejas más rápidamente</li>
            <li>Producir trabajo de mayor calidad</li>
            <li>Completar tareas en menos tiempo</li>
            <li>Encontrar más satisfacción en tu trabajo</li>
            <li>Avanzar más rápido en tu carrera</li>
          </ul>
        </div>
        
        <p>El trabajo profundo no es solo una habilidad profesional; es una superpotencia en nuestra economía distraída.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-2",
      book_id: "2",
      chapter_number: 2,
      title: "Capítulo 1: El Trabajo Profundo es Valioso",
      content: `
        <h2>Capítulo 1: El Trabajo Profundo es Valioso</h2>
        <p>Para entender por qué el trabajo profundo es tan valioso, debemos examinar las fuerzas económicas que están remodelando nuestro mundo laboral.</p>
        
        <h3>🌐 La Nueva Economía</h3>
        <p>Tres grupos tienen una ventaja particular en la nueva economía:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>Los que pueden trabajar bien con máquinas inteligentes</strong></li>
            <li><strong>Los que son los mejores en lo que hacen</strong></li>
            <li><strong>Los que tienen acceso a capital</strong></li>
          </ol>
        </div>
        
        <p>Para la mayoría de los trabajadores del conocimiento, los primeros dos grupos son los más relevantes. Y para unirse a cualquiera de estos grupos, necesitas dominar el arte del trabajo profundo.</p>
        
        <h3>🧠 Las Dos Habilidades Fundamentales</h3>
        <p>Para prosperar en la nueva economía, necesitas dominar dos habilidades centrales:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">1. 📚 La capacidad de dominar rápidamente cosas difíciles</h4>
          <p>Las tecnologías cambian rápidamente. Para mantenerte relevante, debes ser capaz de aprender nuevas habilidades complejas de manera continua.</p>
          
          <h4 style="color: #0369a1;">2. ⚡ La capacidad de producir a un nivel de élite</h4>
          <p>No basta con ser competente. Debes ser capaz de producir trabajo de alta calidad a alta velocidad.</p>
        </div>
        
        <p>Ambas habilidades dependen de tu capacidad para realizar trabajo profundo.</p>
        
        <h3>🔬 La Ciencia del Aprendizaje</h3>
        <p>Para aprender algo complejo, necesitas concentración enfocada. Cuando te concentras intensamente en una tarea específica, estás literalmente reconfigurando tu cerebro.</p>
        
        <p>La mielina, una sustancia grasa que envuelve las neuronas, actúa como aislante que permite que las células disparen más rápido y limpio. Cuando practicas una habilidad con concentración profunda, estás forzando circuitos neuronales específicos a disparar una y otra vez, creando más mielina alrededor de esas neuronas.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">⚠️ El Costo de la Distracción</h4>
          <p style="margin-bottom: 0;">Cuando cambias tu atención de una tarea a otra, parte de tu atención permanece atascada en la tarea original. Este residuo de atención reduce tu rendimiento cognitivo.</p>
        </div>
        
        <h3>📈 La Fórmula de la Productividad</h3>
        <p>La productividad de alta calidad se puede expresar con una fórmula simple:</p>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
          <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">
            Trabajo de Alta Calidad = Tiempo Invertido × Intensidad de Concentración
          </p>
        </div>
        
        <p>Si quieres producir los mejores resultados posibles, necesitas trabajar durante períodos extendidos con total concentración en una sola tarea libre de distracciones.</p>
        
        <h3>🎯 Ejemplos de Trabajo Profundo</h3>
        <p>El trabajo profundo puede tomar muchas formas:</p>
        
        <ul>
          <li><strong>Escritura:</strong> Crear contenido original y reflexivo</li>
          <li><strong>Programación:</strong> Desarrollar código complejo y elegante</li>
          <li><strong>Análisis:</strong> Procesar datos complejos para extraer insights</li>
          <li><strong>Estrategia:</strong> Desarrollar planes a largo plazo</li>
          <li><strong>Aprendizaje:</strong> Dominar nuevas habilidades o conocimientos</li>
        </ul>
        
        <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
          "El trabajo profundo es como un superpoder en nuestra economía cada vez más competitiva."
        </blockquote>
        
        <p>En el próximo capítulo, exploraremos por qué el trabajo profundo es tan raro en el mundo moderno y cómo puedes cultivar esta habilidad crucial.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-3",
      book_id: "2",
      chapter_number: 3,
      title: "Capítulo 2: El Trabajo Profundo es Raro",
      content: `
        <h2>Capítulo 2: El Trabajo Profundo es Raro</h2>
        <p>A pesar de su valor, el trabajo profundo es cada vez más raro en el mundo empresarial moderno. Esto crea una paradoja: justo cuando el trabajo profundo se vuelve más valioso, se vuelve más difícil de lograr.</p>
        
        <h3>📧 La Tiranía del Email</h3>
        <p>El correo electrónico se ha convertido en una fuente constante de distracción. El trabajador promedio revisa su email cada 6 minutos durante el día laboral. Esta fragmentación constante de la atención hace que el trabajo profundo sea casi imposible.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">📊 Estadísticas Alarmantes</h4>
          <ul style="margin-bottom: 0;">
            <li>El trabajador promedio revisa email cada <strong>6 minutos</strong></li>
            <li>Se necesitan <strong>23 minutos</strong> para recuperar la concentración completa después de una interrupción</li>
            <li>Los trabajadores del conocimiento pasan <strong>60%</strong> de su tiempo en comunicación electrónica</li>
            <li>Solo <strong>30%</strong> del tiempo se dedica a trabajo reflexivo y estratégico</li>
          </ul>
        </div>
        
        <h3>🏢 La Cultura de la Conectividad</h3>
        <p>Las organizaciones modernas han desarrollado lo que podemos llamar una "cultura de la conectividad": una cultura donde estar conectado es valorado sobre ser productivo.</p>
        
        <p>Esta cultura se manifiesta en:</p>
        <ul>
          <li><strong>Reuniones excesivas:</strong> Calendarios llenos de reuniones improductivas</li>
          <li><strong>Respuesta inmediata:</strong> Expectativa de responder emails instantáneamente</li>
          <li><strong>Multitarea glorificada:</strong> Hacer múltiples cosas a la vez se ve como eficiencia</li>
          <li><strong>Oficinas abiertas:</strong> Espacios diseñados para la colaboración constante</li>
        </ul>
        
        <h3>🧠 El Mito de la Multitarea</h3>
        <p>Contrario a la creencia popular, la multitarea no existe realmente. Lo que llamamos multitarea es en realidad cambio rápido de tareas, y cada cambio tiene un costo cognitivo.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Los Costos de la "Multitarea"</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Residuo de atención:</strong> Parte de tu mente permanece en la tarea anterior</li>
            <li><strong>Tiempo de cambio:</strong> Cada transición requiere tiempo para reorientarse</li>
            <li><strong>Errores aumentados:</strong> Mayor probabilidad de cometer errores</li>
            <li><strong>Fatiga mental:</strong> El cerebro se cansa más rápidamente</li>
          </ul>
        </div>
        
        <h3>📱 La Adicción a la Distracción</h3>
        <p>Las redes sociales y las aplicaciones móviles están diseñadas para ser adictivas. Utilizan técnicas de refuerzo variable que hacen que revisar nuestros dispositivos sea irresistible.</p>
        
        <p>Esta adicción a la distracción tiene consecuencias profundas:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔄 El Ciclo de la Distracción</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>Impulso:</strong> Sientes la necesidad de revisar tu teléfono</li>
            <li><strong>Acción:</strong> Revisas redes sociales, email, o noticias</li>
            <li><strong>Recompensa:</strong> Obtienes una pequeña dosis de dopamina</li>
            <li><strong>Repetición:</strong> El ciclo se refuerza y se repite</li>
          </ol>
        </div>
        
        <h3>💼 Por qué las Empresas Permiten Esto</h3>
        <p>Si el trabajo profundo es tan valioso, ¿por qué las empresas no lo protegen más? Hay varias razones:</p>
        
        <ul>
          <li><strong>Métrica de actividad:</strong> Es más fácil medir la actividad que los resultados</li>
          <li><strong>Ilusión de urgencia:</strong> Todo parece urgente en el momento</li>
          <li><strong>Cultura de disponibilidad:</strong> Estar disponible se confunde con ser productivo</li>
          <li><strong>Falta de claridad:</strong> No está claro qué constituye trabajo valioso</li>
        </ul>
        
        <h3>🎯 La Oportunidad Oculta</h3>
        <p>La rareza del trabajo profundo crea una oportunidad tremenda. Si puedes cultivar esta habilidad mientras otros se distraen, tendrás una ventaja competitiva significativa.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "En un mundo de distracción, la persona que puede concentrarse tiene una superpotencia."
        </blockquote>
        
        <h3>🛡️ Protegiendo Tu Capacidad de Concentración</h3>
        <p>Para desarrollar la capacidad de trabajo profundo, debes:</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <ul style="margin-bottom: 0;">
            <li><strong>Reconocer el problema:</strong> Entender que la distracción es el enemigo</li>
            <li><strong>Crear barreras:</strong> Establecer límites claros para las distracciones</li>
            <li><strong>Entrenar la concentración:</strong> Practicar la atención sostenida</li>
            <li><strong>Valorar la profundidad:</strong> Medir el éxito por la calidad, no la actividad</li>
          </ul>
        </div>
        
        <p>En los próximos capítulos, exploraremos estrategias específicas para cultivar la capacidad de trabajo profundo en tu vida profesional.</p>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
  ],
  "3": [
    {
      id: "content-3-1",
      book_id: "3",
      chapter_number: 1,
      title: "La revolución del liderazgo",
      content: `
        <h2>Capítulo 1: La revolución del liderazgo</h2>
        <p>Hace más de dos años, me senté con mi equipo de Facebook para discutir las mujeres en el liderazgo. Los datos eran desalentadores. En los Estados Unidos, las mujeres han obtenido el <strong>57 por ciento de los títulos universitarios</strong> y el <strong>60 por ciento de los títulos de maestría</strong> durante la última década.</p>
        
        <p>Sin embargo, las mujeres representan solo el <strong>14 por ciento de los puestos ejecutivos</strong>, el <strong>17 por ciento de los miembros de la junta directiva</strong> y el <strong>18 por ciento de los miembros del Congreso</strong>. Esta disparidad entre el logro y el liderazgo persiste en todos los sectores.</p>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #be185d; margin-top: 0;">📊 Datos sobre mujeres en el liderazgo</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>57%</strong> de títulos universitarios obtenidos por mujeres</li>
            <li><strong>60%</strong> de títulos de maestría obtenidos por mujeres</li>
            <li><strong>14%</strong> de puestos ejecutivos ocupados por mujeres</li>
            <li><strong>17%</strong> de miembros de junta directiva son mujeres</li>
            <li><strong>18%</strong> de miembros del Congreso son mujeres</li>
          </ul>
        </div>
        
        <h3>🚀 El momento de actuar es ahora</h3>
        <p>Creo profundamente que la clave para hacer que este cambio suceda más rápido es que <strong>más mujeres se inclinen hacia sus carreras</strong> y que más hombres se inclinen hacia sus familias. Cuando más mujeres se inclinen hacia el liderazgo, cambiarán no solo sus propias vidas, sino también las vidas de todas las mujeres que las siguen.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Un mundo donde la mitad de nuestros países y nuestras empresas fueran dirigidos por mujeres, y la mitad de nuestros hogares fueran dirigidos por hombres, sería un mundo mejor."
        </blockquote>
        
        <h3>💪 Inclinarse hacia adelante</h3>
        <p>La frase "inclinarse hacia adelante" se originó en el mundo de los negocios. Cuando alguien está comprometido, presta atención y participa, se dice que se "inclina hacia adelante". Cuando alguien no está comprometido, se "inclina hacia atrás".</p>
        
        <p>Quiero que las mujeres se inclinen hacia sus carreras. Quiero que busquen desafíos, tomen riesgos y persigan sus metas con gusto y ambición.</p>
        
        <h3>🎯 Los Obstáculos Internos</h3>
        <p>Las barreras externas para las mujeres en el lugar de trabajo son muy reales, pero también existen barreras internas que son igualmente importantes de abordar:</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">🚧 Barreras Internas Comunes</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Falta de confianza:</strong> Dudar de las propias habilidades</li>
            <li><strong>Síndrome del impostor:</strong> Sentir que no mereces el éxito</li>
            <li><strong>Miedo al fracaso:</strong> Evitar riesgos por temor a fallar</li>
            <li><strong>Perfeccionismo:</strong> Esperar ser perfecta antes de actuar</li>
            <li><strong>Comparación constante:</strong> Medirse contra otros en lugar de contra uno mismo</li>
          </ul>
        </div>
        
        <h3>💼 El Costo de No Inclinarse</h3>
        <p>Cuando las mujeres no se inclinan hacia adelante en sus carreras, todos perdemos. Las organizaciones pierden talento, perspectivas diversas y mejores resultados. Las familias pierden modelos a seguir. Y las propias mujeres pierden la oportunidad de alcanzar su potencial completo.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✨ Los Beneficios de Inclinarse Hacia Adelante</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Crecimiento personal:</strong> Desarrollar nuevas habilidades y confianza</li>
            <li><strong>Impacto mayor:</strong> Influir positivamente en más personas</li>
            <li><strong>Satisfacción profesional:</strong> Encontrar más significado en el trabajo</li>
            <li><strong>Modelo a seguir:</strong> Inspirar a otras mujeres</li>
            <li><strong>Cambio sistémico:</strong> Contribuir a un mundo más equitativo</li>
          </ul>
        </div>
        
        <p>Este libro no se trata de tener todo resuelto. Se trata de dar pasos valientes hacia adelante, incluso cuando el camino no está completamente claro.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-2",
      book_id: "3",
      chapter_number: 2,
      title: "Siéntate a la Mesa",
      content: `
        <h2>Capítulo 2: Siéntate a la Mesa</h2>
        <p>Hace varios años, fui invitada a dar una charla en una universidad. Después de mi presentación, una estudiante se me acercó y me dijo que había aprendido algo importante. Le pregunté qué era.</p>
        
        <p>"Aprendí a sentarme a la mesa", me dijo.</p>
        
        <p>Me explicó que durante mi charla, había notado que todas las estudiantes mujeres se sentaron en las filas de atrás, mientras que los estudiantes hombres llenaron las filas del frente. Sin que nadie se lo dijera, las mujeres se habían relegado a sí mismas a la parte de atrás.</p>
        
        <h3>🎭 El Síndrome del Impostor</h3>
        <p>Las mujeres sistemáticamente subestiman sus propias habilidades. Mientras los hombres tienden a sobreestimar sus habilidades y rendimiento, las mujeres tienden a subestimarlas.</p>
        
        <p>Múltiples estudios en múltiples industrias muestran que las mujeres a menudo juzgan su propio rendimiento como peor de lo que realmente es, mientras que los hombres juzgan su propio rendimiento como mejor de lo que realmente es.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🎯 Qué significa sentarse a la mesa</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Ocupar tu lugar:</strong> Tomar el asiento que mereces</li>
            <li><strong>Participar activamente:</strong> Contribuir a las conversaciones importantes</li>
            <li><strong>Hacer que tu voz se escuche:</strong> Compartir tus ideas con confianza</li>
            <li><strong>Asumir responsabilidades:</strong> Tomar roles de liderazgo cuando sea apropiado</li>
            <li><strong>Creer en tu valor:</strong> Reconocer que perteneces ahí</li>
          </ul>
        </div>
        
        <h3>💼 La Confianza Importa</h3>
        <p>El éxito y la simpatía están positivamente correlacionados para los hombres y negativamente correlacionados para las mujeres. Cuando un hombre es exitoso, tanto hombres como mujeres lo ven como más simpático. Cuando una mujer es exitosa, tanto hombres como mujeres la ven como menos simpática.</p>
        
        <p>Esta realidad pone a las mujeres en una posición imposible. Si son competentes, no son queridas. Si son queridas, se considera que no son competentes.</p>
        
        <h3>🗣️ Hablar con Autoridad</h3>
        <p>Las mujeres a menudo hablan de manera diferente a los hombres. Tendemos a:</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">⚠️ Patrones de Comunicación que Debilitan</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Usar calificadores:</strong> "Creo que tal vez..." en lugar de "Creo que..."</li>
            <li><strong>Disculparse innecesariamente:</strong> "Perdón, pero..." antes de cada comentario</li>
            <li><strong>Hacer preguntas en lugar de afirmaciones:</strong> "¿No creen que deberíamos...?"</li>
            <li><strong>Minimizar logros:</strong> "Tuve suerte" en lugar de "Trabajé duro"</li>
            <li><strong>Hablar en voz baja:</strong> No proyectar confianza vocalmente</li>
          </ul>
        </div>
        
        <h3>🎪 El Acto de Equilibrio</h3>
        <p>Las mujeres enfrentan un acto de equilibrio constante entre ser percibidas como competentes y ser percibidas como simpáticas. Este equilibrio requiere:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">⚖️ Estrategias de Equilibrio</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Ser directa pero cálida:</strong> Combinar firmeza con amabilidad</li>
            <li><strong>Dar crédito a otros:</strong> Reconocer contribuciones del equipo</li>
            <li><strong>Usar "nosotros" en lugar de "yo":</strong> Enmarcar el éxito como colectivo</li>
            <li><strong>Sonreír apropiadamente:</strong> Usar expresiones faciales que inviten</li>
            <li><strong>Explicar el "por qué":</strong> Contextualizar las decisiones difíciles</li>
          </ul>
        </div>
        
        <h3>🚀 Tomando Riesgos</h3>
        <p>Las mujeres tienden a ser más cautelosas que los hombres cuando se trata de tomar riesgos profesionales. Pero el crecimiento requiere salir de la zona de confort.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Si no estás cometiendo algunos errores notables, probablemente no estás tomando suficientes riesgos."
        </blockquote>
        
        <h3>💪 Construyendo Confianza</h3>
        <p>La confianza no es algo con lo que naces; es algo que construyes a través de la experiencia y la práctica. Para las mujeres, esto significa:</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🏗️ Pasos para Construir Confianza</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Celebrar pequeñas victorias:</strong> Reconocer y valorar cada logro</li>
            <li><strong>Prepararse exhaustivamente:</strong> La preparación genera confianza</li>
            <li><strong>Practicar hablar en público:</strong> Desarrollar habilidades de comunicación</li>
            <li><strong>Buscar feedback:</strong> Aprender de críticas constructivas</li>
            <li><strong>Rodearse de apoyo:</strong> Construir una red de mentores y aliados</li>
          </ul>
        </div>
        
        <p>Sentarse a la mesa no es solo sobre ocupar un asiento físico. Es sobre reclamar tu lugar en las conversaciones que importan, en las decisiones que dan forma al futuro, y en los roles que pueden crear un impacto duradero.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "4": [
    {
      id: "content-4-1",
      book_id: "4",
      chapter_number: 1,
      title: "Introducción a la Inteligencia Emocional",
      content: `
        <h2>Capítulo 1: Introducción a la Inteligencia Emocional</h2>
        <p>La <strong>inteligencia emocional</strong> es la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de otros.</p>
        
        <h3>🧠 Los Cuatro Dominios de la Inteligencia Emocional</h3>
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>🔍 Autoconciencia:</strong> La capacidad de reconocer y entender tus propias emociones</li>
            <li><strong>⚖️ Autorregulación:</strong> La capacidad de manejar tus emociones de manera efectiva</li>
            <li><strong>👥 Conciencia social:</strong> La capacidad de reconocer y entender las emociones de otros</li>
            <li><strong>🤝 Gestión de relaciones:</strong> La capacidad de influir, entrenar y ser mentor de otros</li>
          </ol>
        </div>
        
        <p>A diferencia del IQ, que es relativamente fijo, la inteligencia emocional es una habilidad flexible que se puede aprender y mejorar con práctica.</p>
        
        <h3>📊 El Impacto en el Éxito</h3>
        <p>Las investigaciones muestran que la inteligencia emocional es responsable del <strong>58% del rendimiento laboral</strong> en todos los tipos de trabajos. Es el predictor más fuerte del rendimiento en el lugar de trabajo.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Las emociones que no se transforman se transmiten."
        </blockquote>
        
        <h3>🎯 Por Qué Importa la Inteligencia Emocional</h3>
        <p>En el mundo laboral moderno, las habilidades técnicas te pueden conseguir el trabajo, pero la inteligencia emocional te ayuda a mantenerlo y prosperar en él.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">💼 Beneficios en el Trabajo</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Mejor liderazgo:</strong> Inspirar y motivar a otros</li>
            <li><strong>Comunicación efectiva:</strong> Transmitir ideas claramente</li>
            <li><strong>Resolución de conflictos:</strong> Manejar desacuerdos constructivamente</li>
            <li><strong>Trabajo en equipo:</strong> Colaborar más efectivamente</li>
            <li><strong>Adaptabilidad:</strong> Manejar el cambio con gracia</li>
          </ul>
        </div>
        
        <p>En este libro, aprenderás estrategias prácticas para desarrollar cada uno de estos cuatro dominios y transformar tu vida personal y profesional.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-4-2",
      book_id: "4",
      chapter_number: 2,
      title: "Desarrollando la Autoconciencia",
      content: `
        <h2>Capítulo 2: Desarrollando la Autoconciencia</h2>
        <p>La autoconciencia es la base de la inteligencia emocional. Sin ella, es imposible manejar efectivamente tus emociones o entender cómo afectas a otros.</p>
        
        <h3>🎯 Qué es la Autoconciencia Emocional</h3>
        <p>La autoconciencia emocional es tu capacidad para reconocer y entender tus emociones conforme ocurren. Incluye:</p>
        
        <ul>
          <li><strong>Reconocimiento emocional:</strong> Identificar qué emociones estás experimentando</li>
          <li><strong>Comprensión de causas:</strong> Entender qué desencadena tus emociones</li>
          <li><strong>Impacto en otros:</strong> Reconocer cómo tus emociones afectan a quienes te rodean</li>
        </ul>
        
        <h3>🔍 Técnicas para Desarrollar Autoconciencia</h3>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">📝 Ejercicios Prácticos</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Diario emocional:</strong> Registra tus emociones 3 veces al día</li>
            <li><strong>Pausa y reflexiona:</strong> Antes de reaccionar, pregúntate "¿Qué estoy sintiendo?"</li>
            <li><strong>Feedback de otros:</strong> Pide retroalimentación honesta sobre tu comportamiento</li>
            <li><strong>Mindfulness:</strong> Practica la atención plena para estar presente con tus emociones</li>
          </ul>
        </div>
        
        <p>La autoconciencia no se trata de juzgar tus emociones como buenas o malas, sino de reconocerlas y entender su mensaje.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "5": [
    {
      id: "content-5-1",
      book_id: "5",
      chapter_number: 1,
      title: "Los Principios del Método Lean Startup",
      content: `
        <h2>Capítulo 1: Los Principios del Método Lean Startup</h2>
        <p>La metodología <strong>Lean Startup</strong> es un enfoque para desarrollar negocios y productos que acorta los ciclos de desarrollo, mide el progreso y obtiene retroalimentación valiosa de los clientes.</p>
        
        <h3>🔄 El Ciclo Construir-Medir-Aprender</h3>
        <p>El corazón de la metodología Lean Startup es el ciclo Construir-Medir-Aprender:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>🔨 Construir:</strong> Crea un Producto Mínimo Viable (MVP) para probar tu hipótesis</li>
            <li><strong>📊 Medir:</strong> Recopila datos sobre cómo los clientes responden a tu producto</li>
            <li><strong>🧠 Aprender:</strong> Usa los datos para validar o refutar tus hipótesis</li>
          </ol>
        </div>
        
        <h3>🎯 El Producto Mínimo Viable (MVP)</h3>
        <p>Un MVP es la versión de un nuevo producto que permite a un equipo recopilar la máxima cantidad de aprendizaje validado sobre los clientes con el menor esfuerzo.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">💡 Características de un Buen MVP</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Funcional:</strong> Resuelve un problema real del cliente</li>
            <li><strong>Mínimo:</strong> Incluye solo las características esenciales</li>
            <li><strong>Medible:</strong> Permite recopilar datos significativos</li>
            <li><strong>Rápido de construir:</strong> Se puede desarrollar en semanas, no meses</li>
          </ul>
        </div>
        
        <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
          "El único propósito de un startup es aprender cómo construir un negocio sostenible."
        </blockquote>
        
        <p>La metodología Lean Startup no se trata solo de ser más eficiente, se trata de eliminar el desperdicio y enfocarse en lo que realmente importa a los clientes.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
  "6": [
    {
      id: "content-6-1",
      book_id: "6",
      chapter_number: 1,
      title: "Las Dos Mentalidades",
      content: `
        <h2>Capítulo 1: Las Dos Mentalidades</h2>
        <p>Durante décadas, mis investigaciones han mostrado que la visión que adoptas de ti mismo afecta profundamente la forma en que vives tu vida. Puede determinar si te conviertes en la persona que quieres ser y si logras las cosas que valoras.</p>
        
        <h3>🧠 Mentalidad Fija vs. Mentalidad de Crecimiento</h3>
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Mentalidad Fija</h4>
          <p>Cree que las cualidades básicas como la inteligencia o el talento son rasgos fijos. Piensa que el talento solo crea el éxito, sin esfuerzo.</p>
          <ul style="margin-bottom: 0;">
            <li>Evita desafíos</li>
            <li>Se rinde fácilmente</li>
            <li>Ve el esfuerzo como signo de baja habilidad</li>
            <li>Ignora críticas útiles</li>
            <li>Se siente amenazado por el éxito de otros</li>
          </ul>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✅ Mentalidad de Crecimiento</h4>
          <p>Cree que las habilidades más básicas se pueden desarrollar a través de dedicación y trabajo duro. El cerebro y el talento son solo el punto de partida.</p>
          <ul style="margin-bottom: 0;">
            <li>Abraza desafíos</li>
            <li>Persiste ante obstáculos</li>
            <li>Ve el esfuerzo como camino al dominio</li>
            <li>Aprende de las críticas</li>
            <li>Se inspira en el éxito de otros</li>
          </ul>
        </div>
        
        <h3>🌱 El Poder del "Aún"</h3>
        <p>Una de las formas más simples de cambiar de mentalidad fija a mentalidad de crecimiento es agregar la palabra "aún" a tus pensamientos:</p>
        
        <ul>
          <li>"No soy bueno en matemáticas" → "No soy bueno en matemáticas <strong>aún</strong>"</li>
          <li>"No puedo hacer esto" → "No puedo hacer esto <strong>aún</strong>"</li>
          <li>"Esto es muy difícil" → "Esto es muy difícil <strong>aún</strong>"</li>
        </ul>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "En una mentalidad de crecimiento, los desafíos son emocionantes en lugar de amenazantes."
        </blockquote>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
  "7": [
    {
      id: "content-7-1",
      book_id: "7",
      chapter_number: 1,
      title: "Bueno es Enemigo de Grandioso",
      content: `
        <h2>Capítulo 1: Bueno es Enemigo de Grandioso</h2>
        <p>Vivimos en un mundo lleno de organizaciones que van desde buenas hasta muy buenas. Pero muy pocas se vuelven grandiosas. ¿Por qué algunas empresas dan el salto de buenas a grandiosas mientras otras no?</p>
        
        <h3>📊 La Investigación</h3>
        <p>Nuestro equipo de investigación identificó 1,435 empresas que aparecieron en la lista Fortune 500 desde 1965 hasta 1995. De estas, solo <strong>11 empresas</strong> lograron la transición de buenas a grandiosas.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🎯 Criterios para "Grandioso"</h4>
          <ul style="margin-bottom: 0;">
            <li>Rendimientos acumulativos de acciones de al menos <strong>3 veces</strong> el mercado general</li>
            <li>Sostenido durante <strong>15 años</strong> después del punto de transición</li>
            <li>Resultados independientes de la industria</li>
          </ul>
        </div>
        
        <h3>🦔 El Concepto del Erizo</h3>
        <p>Las empresas grandiosas operan bajo el "Concepto del Erizo" - una comprensión profunda de tres círculos intersectados:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>🎯 En qué puedes ser el mejor del mundo</strong> (no necesariamente en qué quieres ser el mejor)</li>
            <li><strong>💰 Qué impulsa tu motor económico</strong> (qué denominador único tiene el mayor impacto)</li>
            <li><strong>❤️ Por qué eres profundamente apasionado</strong> (qué te enciende internamente)</li>
          </ol>
        </div>
        
        <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
          "La grandeza no es función de las circunstancias. La grandeza es en gran medida una cuestión de elección consciente y disciplina."
        </blockquote>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
  "8": [
    {
      id: "content-8-1",
      book_id: "8",
      chapter_number: 1,
      title: "Paradigmas y Principios",
      content: `
        <h2>Capítulo 1: Paradigmas y Principios</h2>
        <p>La forma en que vemos el problema es el problema. Este libro presenta un enfoque basado en principios para la efectividad personal e interpersonal.</p>
        
        <h3>🔍 ¿Qué es un Paradigma?</h3>
        <p>Un paradigma es la forma en que "veemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">💡 El Poder de los Cambios de Paradigma</h4>
          <p>Los cambios de paradigma más significativos en la historia han sido:</p>
          <ul style="margin-bottom: 0;">
            <li>De la tierra plana a la tierra redonda</li>
            <li>Del modelo geocéntrico al heliocéntrico</li>
            <li>De la física newtoniana a la relatividad de Einstein</li>
          </ul>
        </div>
        
        <h3>🏛️ Principios vs. Técnicas</h3>
        <p>Los principios son verdades profundas, fundamentales, verdades clásicas, denominadores comunes. Son hebras estrechamente entretejidas que atraviesan con exactitud, consistencia y belleza la tela de la vida.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🌟 Características de los Principios</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Universales:</strong> Se aplican en todas las culturas y sociedades</li>
            <li><strong>Atemporales:</strong> Han sido válidos a lo largo de la historia</li>
            <li><strong>Evidentes por sí mismos:</strong> No necesitan prueba externa</li>
            <li><strong>Prácticos:</strong> Se pueden aplicar en situaciones reales</li>
          </ul>
        </div>
        
        <h3>🎯 Los 7 Hábitos: Un Enfoque Integral</h3>
        <p>Los 7 hábitos representan un enfoque integral, integrado y centrado en principios para resolver problemas personales y profesionales.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #374151; margin-top: 0;">📋 Los 7 Hábitos</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>Ser Proactivo:</strong> Toma responsabilidad de tu vida</li>
            <li><strong>Comenzar con el Fin en Mente:</strong> Define tu misión y visión</li>
            <li><strong>Poner Primero lo Primero:</strong> Prioriza lo importante</li>
            <li><strong>Pensar Ganar-Ganar:</strong> Busca beneficio mutuo</li>
            <li><strong>Buscar Primero Entender:</strong> Escucha empáticamente</li>
            <li><strong>Sinergizar:</strong> Colabora creativamente</li>
            <li><strong>Afilar la Sierra:</strong> Renuévate continuamente</li>
          </ol>
        </div>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Siembra un pensamiento, cosecha una acción; siembra una acción, cosecha un hábito; siembra un hábito, cosecha un carácter; siembra un carácter, cosecha un destino."
        </blockquote>
        
        <p>El cambio real viene de adentro hacia afuera. Si quieres cambiar tu situación, primero debes cambiarte a ti mismo.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-8-2",
      book_id: "8",
      chapter_number: 2,
      title: "Hábito 1: Ser Proactivo",
      content: `
        <h2>Hábito 1: Ser Proactivo</h2>
        <p>Ser proactivo significa tomar responsabilidad de tu propia vida. Significa que tu comportamiento es una función de tus decisiones, no de tus condiciones.</p>
        
        <h3>🎯 Proactividad vs. Reactividad</h3>
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Personas Reactivas</h4>
          <ul style="margin-bottom: 0;">
            <li>Se ven afectadas por el clima físico</li>
            <li>Se ven afectadas por el clima social</li>
            <li>Culpan a las circunstancias externas</li>
            <li>Dicen: "No hay nada que pueda hacer"</li>
            <li>Su lenguaje los absuelve de responsabilidad</li>
          </ul>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✅ Personas Proactivas</h4>
          <ul style="margin-bottom: 0;">
            <li>Llevan su propio clima con ellas</li>
            <li>Se enfocan en su Círculo de Influencia</li>
            <li>Toman responsabilidad de sus respuestas</li>
            <li>Dicen: "Veamos qué opciones tengo"</li>
            <li>Su lenguaje reconoce su capacidad de elección</li>
          </ul>
        </div>
        
        <h3>⭕ Círculo de Preocupación vs. Círculo de Influencia</h3>
        <p>Las personas proactivas enfocan sus esfuerzos en el <strong>Círculo de Influencia</strong>. Trabajan en las cosas que pueden hacer algo al respecto.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "No es lo que nos sucede, sino nuestra respuesta a lo que nos sucede lo que nos lastima."
        </blockquote>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "9": [
    {
      id: "content-9-1",
      book_id: "9",
      chapter_number: 1,
      title: "Introducción: El Origen de Este Libro",
      content: `
        <h2>Introducción: El Origen de Este Libro</h2>
        <p>No soy mi mente. Esta fue la primera comprensión que tuve en mi camino hacia el despertar. Llegó a mí cuando tenía 29 años.</p>
        
        <p>Había vivido en un estado de ansiedad casi continua mezclada con períodos de depresión suicida. Una noche, no mucho después de mi vigésimo noveno cumpleaños, me desperté en las primeras horas de la mañana con una sensación de terror absoluto.</p>
        
        <h3>🌅 El Momento del Despertar</h3>
        <p>Había despertado muchas veces antes con sentimientos de miedo, pero esta vez era más intenso que cualquier cosa que hubiera experimentado antes.</p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p><strong>El pensamiento más frecuente que tenía era:</strong> "No puedo vivir conmigo mismo más tiempo." Y entonces, de repente, me di cuenta de lo peculiar que era ese pensamiento.</p>
          
          <p><em>"¿Soy uno o dos? Si no puedo vivir conmigo mismo, debe haber dos de mí: el 'yo' y el 'yo mismo' con el que 'yo' no puedo vivir."</em></p>
        </div>
        
        <h3>💡 La Gran Revelación</h3>
        <p>Tal vez solo uno de ellos es real, pensé. Me quedé tan atónito por esta extraña comprensión que mi mente se detuvo. Estaba completamente consciente, pero no había más pensamientos.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "La palabra iluminación evoca la idea de algún logro sobrehumano, y el ego le gusta mantenerla así, pero es simplemente tu estado natural de unidad sentida con el Ser."
        </blockquote>
        
        <p>El mayor obstáculo para experimentar esta realidad es la identificación con tu mente, que causa el pensamiento compulsivo. No poder parar de pensar es una aflicción terrible, pero no nos damos cuenta de ello porque casi todos sufren de ella.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
  "10": [
    {
      id: "content-10-1",
      book_id: "10",
      chapter_number: 1,
      title: "Introducción: Una Advertencia y Comparación",
      content: `
        <h2>Introducción: Una Advertencia y Comparación</h2>
        <p>La realidad es negociable. Fuera de la ciencia y la ley, todas las reglas pueden romperse, y es más fácil pedir perdón que permiso.</p>
        
        <h3>🚀 La Nueva Rica (NR)</h3>
        <p>Este libro es sobre un nuevo subgrupo de personas que abandonan el plan diferido de vida y crean estilos de vida de lujo en el presente usando las monedas de la Nueva Rica: tiempo y movilidad.</p>
        
        <h3>⏰ El Mito de las 40 Horas</h3>
        <p>¿Quién decidió que trabajar 9-5 era la forma correcta de vivir? ¿Por qué aceptamos que debemos trabajar 40+ años para disfrutar de 5-10 años de jubilación?</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🎯 Los Principios Fundamentales</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Definición:</strong> Definir objetivos claros y específicos</li>
            <li><strong>Eliminación:</strong> Eliminar lo innecesario usando la Ley de Pareto</li>
            <li><strong>Automatización:</strong> Automatizar flujos de ingresos</li>
            <li><strong>Liberación:</strong> Liberarse de limitaciones geográficas</li>
          </ul>
        </div>
        
        <h3>📊 La Ley de Pareto (80/20)</h3>
        <p>El 80% de los resultados provienen del 20% de las causas y esfuerzos. Esto se aplica a todo:</p>
        
        <ul>
          <li><strong>Negocios:</strong> 80% de las ganancias vienen del 20% de los clientes</li>
          <li><strong>Tiempo:</strong> 80% de la productividad viene del 20% de las actividades</li>
          <li><strong>Problemas:</strong> 80% de los problemas vienen del 20% de las causas</li>
          <li><strong>Felicidad:</strong> 80% de la felicidad viene del 20% de las actividades</li>
        </ul>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "La pregunta que debes hacerte no es '¿Qué quiero?' o '¿Cuáles son mis objetivos?' sino '¿Qué me emocionaría?'"
        </blockquote>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
  "11": [
    {
      id: "content-11-1",
      book_id: "11",
      chapter_number: 1,
      title: "¿Qué es una Conversación Crucial?",
      content: `
        <h2>¿Qué es una Conversación Crucial?</h2>
        <p>Una conversación crucial es una discusión entre dos o más personas donde las opiniones varían, las emociones son fuertes y los resultados importan.</p>
        
        <h3>🎯 Características de las Conversaciones Cruciales</h3>
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔍 Tres Elementos Clave</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>📊 Las opiniones varían:</strong> Las personas tienen puntos de vista diferentes</li>
            <li><strong>💥 Las emociones son fuertes:</strong> Las personas se sienten apasionadas por el tema</li>
            <li><strong>⚡ Los resultados importan:</strong> Las decisiones afectarán significativamente las vidas</li>
          </ol>
        </div>
        
        <h3>💼 Ejemplos de Conversaciones Cruciales</h3>
        <ul>
          <li><strong>En el trabajo:</strong> Dar feedback a un colega sobre su rendimiento</li>
          <li><strong>En casa:</strong> Hablar con tu pareja sobre finanzas</li>
          <li><strong>Con amigos:</strong> Confrontar a alguien sobre un comportamiento problemático</li>
          <li><strong>Con el jefe:</strong> Negociar un aumento o promoción</li>
          <li><strong>En la familia:</strong> Establecer límites con parientes</li>
        </ul>
        
        <h3>🚨 El Costo de Evitar Conversaciones Cruciales</h3>
        <p>Cuando evitamos conversaciones cruciales, pagamos un precio alto:</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">💸 Costos de la Evitación</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Relaciones deterioradas:</strong> Los problemas no resueltos crecen</li>
            <li><strong>Decisiones pobres:</strong> Falta de información completa</li>
            <li><strong>Estrés acumulado:</strong> La tensión no expresada se acumula</li>
            <li><strong>Oportunidades perdidas:</strong> No se abordan temas importantes</li>
            <li><strong>Resentimiento:</strong> Las emociones negativas se intensifican</li>
          </ul>
        </div>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "El diálogo es la libre circulación de significado entre dos o más personas."
        </blockquote>
        
        <p>Las conversaciones cruciales son una habilidad que se puede aprender. Con práctica y las herramientas correctas, puedes transformar tus relaciones más importantes y lograr mejores resultados en todas las áreas de tu vida.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
  "12": [
    {
      id: "content-12-1",
      book_id: "12",
      chapter_number: 1,
      title: "El Desafío del Futuro",
      content: `
        <h2>El Desafío del Futuro</h2>
        <p>¿Qué verdad importante conoces muy pocas personas están de acuerdo contigo?</p>
        
        <p>Esta pregunta suena fácil porque es directa. Pero en realidad es muy difícil de responder. Es intelectualmente difícil porque el conocimiento que todos tienen y están de acuerdo ya no es un secreto.</p>
        
        <h3>🚀 De Cero a Uno vs. De Uno a N</h3>
        <p>Cada momento en los negocios sucede solo una vez. La próxima Bill Gates no construirá un sistema operativo. La próxima Larry Page o Sergey Brin no creará un motor de búsqueda. Y la próxima Mark Zuckerberg no creará una red social.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔢 Dos Tipos de Progreso</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px;">
              <h5 style="color: #d97706; margin: 0 0 8px 0;">📈 De 1 a n (Horizontal)</h5>
              <ul style="margin: 0; font-size: 14px;">
                <li>Copiar cosas que funcionan</li>
                <li>Globalización</li>
                <li>Mejoras incrementales</li>
                <li>Competencia</li>
              </ul>
            </div>
            <div style="background-color: #f0fdf4; border: 1px solid #22c55e; padding: 16px; border-radius: 8px;">
              <h5 style="color: #15803d; margin: 0 0 8px 0;">🚀 De 0 a 1 (Vertical)</h5>
              <ul style="margin: 0; font-size: 14px;">
                <li>Crear algo nuevo</li>
                <li>Tecnología</li>
                <li>Innovación radical</li>
                <li>Monopolio</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3>💡 El Secreto de los Monopolios</h3>
        <p>Los estadounidenses mitifican la competencia y la elección de mercado. Pero la verdad es que la competencia es para perdedores. Si quieres crear y capturar valor duradero, no construyas un negocio indiferenciado.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "La competencia es para perdedores. Si quieres crear y capturar valor duradero, no construyas un negocio indiferenciado."
        </blockquote>
        
        <p>Cada startup exitosa es diferente: cada una gana un monopolio resolviendo un problema único. Todas las empresas fallidas son iguales: no lograron escapar de la competencia.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
}

// Mock reading progress
const mockReadingProgress: ReadingProgress[] = [
  {
    id: "progress-1",
    user_id: "demo-user",
    book_id: "1",
    progress_percentage: 45,
    current_page: 144,
    last_read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "progress-2",
    user_id: "demo-user",
    book_id: "2",
    progress_percentage: 23,
    current_page: 68,
    last_read_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "progress-8",
    user_id: "demo-user",
    book_id: "8",
    progress_percentage: 78,
    current_page: 337,
    last_read_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

// Mock bookmarks
const mockBookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    user_id: "demo-user",
    book_id: "1",
    page_number: 45,
    note: "Importante: Los hábitos son el interés compuesto de la superación personal",
    created_at: new Date().toISOString(),
  },
  {
    id: "bookmark-2",
    user_id: "demo-user",
    book_id: "1",
    page_number: 89,
    note: "El ciclo: Señal → Anhelo → Respuesta → Recompensa",
    created_at: new Date().toISOString(),
  },
]

// API Functions
export async function getBooks(): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBooks
}

export async function getBookById(id: string): Promise<Book | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockBooks.find((book) => book.id === id) || null
}

export async function getAllBooks(): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBooks
}

export async function getBookContent(bookId: string): Promise<BookContent[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockBookContent[bookId] || []
}

export async function getBookChapter(bookId: string, chapterNumber: number): Promise<BookContent | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const content = mockBookContent[bookId] || []
  return content.find((chapter) => chapter.chapter_number === chapterNumber) || null
}

export async function getReadingProgress(userId: string, bookId: string): Promise<ReadingProgress | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockReadingProgress.find((progress) => progress.user_id === userId && progress.book_id === bookId) || null
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  progressPercentage: number,
  currentPage: number,
): Promise<ReadingProgress> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const existingProgress = mockReadingProgress.find(
    (progress) => progress.user_id === userId && progress.book_id === bookId,
  )

  if (existingProgress) {
    existingProgress.progress_percentage = progressPercentage
    existingProgress.current_page = currentPage
    existingProgress.last_read_at = new Date().toISOString()
    return existingProgress
  } else {
    const newProgress: ReadingProgress = {
      id: `progress-${Date.now()}`,
      user_id: userId,
      book_id: bookId,
      progress_percentage: progressPercentage,
      current_page: currentPage,
      last_read_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    mockReadingProgress.push(newProgress)
    return newProgress
  }
}

export async function getUserBookmarks(userId: string, bookId: string): Promise<Bookmark[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockBookmarks.filter((bookmark) => bookmark.user_id === userId && bookmark.book_id === bookId)
}

export async function addBookmark(
  userId: string,
  bookId: string,
  pageNumber: number,
  note?: string,
): Promise<Bookmark> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newBookmark: Bookmark = {
    id: `bookmark-${Date.now()}`,
    user_id: userId,
    book_id: bookId,
    page_number: pageNumber,
    note: note,
    created_at: new Date().toISOString(),
  }

  mockBookmarks.push(newBookmark)
  return newBookmark
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockBookmarks.findIndex((bookmark) => bookmark.id === bookmarkId)
  if (index > -1) {
    mockBookmarks.splice(index, 1)
  }
}

export async function getUserReadingStats(userId: string): Promise<ReadingStats> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const userProgress = mockReadingProgress.filter((progress) => progress.user_id === userId)
  const completedBooks = userProgress.filter((progress) => progress.progress_percentage >= 100).length
  const averageProgress =
    userProgress.length > 0
      ? userProgress.reduce((sum, progress) => sum + progress.progress_percentage, 0) / userProgress.length
      : 0

  return {
    books_read: completedBooks,
    total_reading_time: completedBooks * 240, // Assume 4 hours per book
    average_progress: Math.round(averageProgress),
    reading_streak: 7, // Mock streak
  }
}

// Alias for backward compatibility
export const getReadingStats = getUserReadingStats

export async function searchBooks(query: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const lowercaseQuery = query.toLowerCase()
  return mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.description.toLowerCase().includes(lowercaseQuery) ||
      book.category.toLowerCase().includes(lowercaseQuery),
  )
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockBooks.filter((book) => book.category === category)
}

export async function getRecommendedBooks(userId: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Mock recommendation logic - return highly rated books
  return mockBooks
    .filter((book) => book.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
}
