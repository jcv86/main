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

// Mock data
const mockBooks: Book[] = [
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
    title: "Lean In",
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
    title: "Emotional Intelligence 2.0",
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
    title: "The Lean Startup",
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
    title: "Mindset",
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
    title: "Good to Great",
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
    id: "8",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    description:
      "Lecciones poderosas de cambio personal. Los principios fundamentales para el éxito personal y profesional que han transformado millones de vidas.",
    category: "Desarrollo Personal",
    rating: 4.8,
    reading_time: "5h 45min",
    difficulty: "Intermedio",
    publication_year: 1989,
    total_pages: 432,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    title: "The Power of Now",
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
    title: "The 4-Hour Workweek",
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
    title: "Crucial Conversations",
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
    title: "Zero to One",
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

// Mock book content with rich, detailed content for Atomic Habits
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
        
        <p>Después de repetir este experimento muchas veces, los gatos aprendieron a presionar la palanca inmediatamente. Thorndike describió este como la <strong>Ley del Efecto</strong>: "Los comportamientos seguidos de consecuencias satisfactorias tienden a repetirse."</p>
        
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
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🎯 Qué significa inclinarse hacia adelante</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Buscar desafíos</strong> en lugar de evitarlos</li>
            <li><strong>Tomar riesgos calculados</strong> para crecer profesionalmente</li>
            <li><strong>Perseguir metas ambiciosas</strong> con determinación</li>
            <li><strong>Participar activamente</strong> en conversaciones importantes</li>
            <li><strong>Asumir responsabilidades</strong> de liderazgo cuando sea posible</li>
          </ul>
        </div>
        
        <h3>🌍 Los obstáculos externos</h3>
        <p>Las barreras externas para las mujeres son reales. Incluyen sexismo, discriminación y acoso. También incluyen la falta de políticas familiares amigables y estructuras de apoyo inadecuadas.</p>
        
        <p>Estas barreras externas son importantes y deben abordarse. Pero también debemos reconocer que existen <strong>barreras internas</strong> que son igualmente importantes de abordar.</p>
        
        <h3>🧠 Las barreras internas</h3>
        <p>Las barreras internas son las que llevamos dentro de nosotras mismas. Son los miedos que tenemos sobre nuestras propias capacidades. Son las voces en nuestras cabezas que nos dicen que no somos lo suficientemente buenas, inteligentes o capaces.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">⚠️ Barreras internas comunes</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Síndrome del impostor:</strong> Sentir que no merecemos nuestro éxito</li>
            <li><strong>Falta de confianza:</strong> Dudar de nuestras propias habilidades</li>
            <li><strong>Miedo al fracaso:</strong> Evitar riesgos por temor a fallar</li>
            <li><strong>Perfeccionismo:</strong> Esperar ser perfectas antes de actuar</li>
            <li><strong>Comparación constante:</strong> Medirnos contra estándares irreales</li>
          </ul>
        </div>
        
        <h3>🤝 La importancia de los mentores y patrocinadores</h3>
        <p>Los mentores pueden ser invaluables, y creo que todos deberían tener al menos uno. Pero además de los mentores, todos necesitamos personas que crean en nosotros cuando no creemos en nosotros mismos.</p>
        
        <p>Un <strong>patrocinador</strong> es diferente de un mentor. Un mentor te habla. Un patrocinador habla sobre ti cuando no estás en la habitación.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔄 Mentor vs. Patrocinador</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Mentor:</strong> Te da consejos y orientación directamente</li>
            <li><strong>Patrocinador:</strong> Aboga por ti en conversaciones donde no estás presente</li>
            <li><strong>Mentor:</strong> Te ayuda a desarrollar habilidades</li>
            <li><strong>Patrocinador:</strong> Te ayuda a obtener oportunidades</li>
          </ul>
        </div>
        
        <h3>💼 El mito de "tenerlo todo"</h3>
        <p>La frase "tenerlo todo" debe ser eliminada de nuestro vocabulario. Es una frase imposible y contraproducente. En su lugar, deberíamos hablar de "hacer que todo funcione".</p>
        
        <p>Hacer que todo funcione significa hacer concesiones conscientes y estar en paz con esas decisiones. Significa reconocer que no podemos ser perfectas en todo al mismo tiempo.</p>
        
        <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
          "La perfecta es el enemigo de lo bueno. El miedo a no hacer algo perfectamente puede impedirnos hacer algo bien."
        </blockquote>
        
        <p>Este libro es sobre lo que las mujeres pueden hacer internamente para ponerse en el camino hacia el liderazgo. No es sobre lo que deberíamos hacer o lo que la sociedad debería hacer, aunque esas conversaciones también son importantes.</p>
        
        <p>Es sobre lo que podemos hacer ahora mismo, hoy, para empezar a inclinarnos hacia adelante.</p>
      `,
      page_number: 1,
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
      title: "Los Principios Lean Startup",
      content: `
      <h2>Capítulo 1: Los Principios Lean Startup</h2>
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
      
      <h3>🔍 Los Hallazgos Sorprendentes</h3>
      <p>Contrario a lo que esperábamos, las empresas grandiosas no tenían:</p>
      
      <ul>
        <li><strong>CEOs carismáticos:</strong> Los líderes eran modestos y determinados</li>
        <li><strong>Estrategias revolucionarias:</strong> Los cambios fueron evolutivos, no revolucionarios</li>
        <li><strong>Culturas de celebridades:</strong> Se enfocaron en resultados, no en publicidad</li>
        <li><strong>Compensación ejecutiva alta:</strong> Los líderes no estaban motivados principalmente por dinero</li>
      </ul>
      
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
      <p>Un paradigma es la forma en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación.</p>
      
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
      
      <h3>🔄 El Continuum de la Madurez</h3>
      <p>Los 7 hábitos siguen un continuum natural que lleva de la dependencia a la independencia y finalmente a la interdependencia:</p>
      
      <ul>
        <li><strong>Dependencia:</strong> "Tú" - Necesitas que otros te cuiden</li>
        <li><strong>Independencia:</strong> "Yo" - Puedes cuidarte a ti mismo</li>
        <li><strong>Interdependencia:</strong> "Nosotros" - Podemos lograr más juntos</li>
      </ul>
      
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
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🎯 Círculo de Influencia</h4>
        <p>Incluye cosas como:</p>
        <ul style="margin-bottom: 0;">
          <li>Tu actitud y comportamiento</li>
          <li>Tus habilidades y conocimientos</li>
          <li>Tus relaciones personales</li>
          <li>Tu salud y bienestar</li>
          <li>Tus decisiones diarias</li>
        </ul>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Círculo de Preocupación</h4>
        <p>Incluye cosas como:</p>
        <ul style="margin-bottom: 0;">
          <li>El clima</li>
          <li>La economía nacional</li>
          <li>El comportamiento de otros</li>
          <li>El pasado</li>
          <li>Eventos mundiales</li>
        </ul>
      </div>
      
      <h3>💪 El Poder de la Elección</h3>
      <p>Entre el estímulo y la respuesta, el ser humano tiene la libertad de elegir. En esa elección reside nuestro crecimiento y nuestra felicidad.</p>
      
      <p>Viktor Frankl, sobreviviente del holocausto, descubrió que incluso en las condiciones más extremas, los seres humanos tienen la libertad fundamental de elegir su actitud en cualquier conjunto de circunstancias.</p>
      
      <h3>🗣️ Lenguaje Proactivo vs. Reactivo</h3>
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #374151; margin-top: 0;">🔄 Transformaciones de Lenguaje</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Reactivo:</strong> "No hay nada que pueda hacer" → <strong>Proactivo:</strong> "Veamos las alternativas"</li>
          <li><strong>Reactivo:</strong> "Así soy yo" → <strong>Proactivo:</strong> "Puedo elegir un enfoque diferente"</li>
          <li><strong>Reactivo:</strong> "Me vuelve loco" → <strong>Proactivo:</strong> "Controlo mis emociones"</li>
          <li><strong>Reactivo:</strong> "No me permiten" → <strong>Proactivo:</strong> "Puedo crear un enfoque efectivo"</li>
        </ul>
      </div>
      
      <h3>🎯 Compromisos y Promesas</h3>
      <p>La forma más efectiva de desarrollar la proactividad es hacer y cumplir promesas a nosotros mismos y a otros. Cada vez que cumples un compromiso contigo mismo, aumentas tu integridad personal.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "No es lo que nos sucede, sino nuestra respuesta a lo que nos sucede lo que nos lastima."
      </blockquote>
      
      <h3>📝 Ejercicio Práctico</h3>
      <p>Durante 30 días, trabaja solo en tu Círculo de Influencia. Haz pequeños compromisos y cúmplelos. Sé una luz, no un juez. Sé un modelo, no un crítico.</p>
    `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-8-3",
      book_id: "8",
      chapter_number: 3,
      title: "Hábito 2: Comenzar con el Fin en Mente",
      content: `
      <h2>Hábito 2: Comenzar con el Fin en Mente</h2>
      <p>Comenzar con el fin en mente significa empezar con una clara comprensión de tu destino. Significa saber a dónde vas para que puedas entender mejor dónde estás ahora.</p>
      
      <h3>🎯 El Poder de la Visión</h3>
      <p>Todas las cosas se crean dos veces. Hay una creación mental (primera) y una creación física (segunda). La creación mental precede a la creación física.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🏗️ Las Dos Creaciones</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Primera Creación (Mental):</strong> El diseño, la planificación, la visión</li>
          <li><strong>Segunda Creación (Física):</strong> La construcción, la implementación, la realidad</li>
        </ul>
      </div>
      
      <p>Si no desarrollas tu propia autoconciencia, empoderarás a otras personas y circunstancias para que den forma a tu vida por defecto.</p>
      
      <h3>📜 Desarrollando una Declaración de Misión Personal</h3>
      <p>Una declaración de misión personal es tu constitución, la expresión sólida de tu visión y valores. Se convierte en el criterio por el cual mides todo lo demás en tu vida.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">✨ Elementos de una Misión Personal</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Carácter:</strong> ¿Qué tipo de persona quieres ser?</li>
          <li><strong>Contribución:</strong> ¿Qué quieres hacer o lograr?</li>
          <li><strong>Valores:</strong> ¿Cuáles son tus principios fundamentales?</li>
          <li><strong>Propósito:</strong> ¿Por qué existes?</li>
        </ul>
      </div>
      
      <h3>🎭 Roles y Metas</h3>
      <p>Una forma efectiva de desarrollar tu misión personal es pensar en los diferentes roles que desempeñas en la vida y las metas que quieres lograr en cada rol.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">👥 Ejemplos de Roles</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Personal:</strong> Individuo, crecimiento personal</li>
          <li><strong>Familiar:</strong> Esposo/a, padre/madre, hijo/a</li>
          <li><strong>Profesional:</strong> Gerente, colega, mentor</li>
          <li><strong>Comunitario:</strong> Ciudadano, voluntario, líder</li>
        </ul>
      </div>
      
      <h3>🧭 El Centro de Tu Vida</h3>
      <p>Todos tenemos un centro, un núcleo fundamental, un foco desde el cual vemos la vida. Sea lo que sea que esté en el centro de nuestra vida será la fuente de nuestra seguridad, guía, sabiduría y poder.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Centros Alternativos Comunes</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Centrado en el cónyuge:</strong> Tu sentido de valor viene de tu pareja</li>
          <li><strong>Centrado en la familia:</strong> Tu identidad está en tu familia</li>
          <li><strong>Centrado en el dinero:</strong> Tu seguridad viene de la riqueza</li>
          <li><strong>Centrado en el trabajo:</strong> Tu identidad está en tu carrera</li>
          <li><strong>Centrado en las posesiones:</strong> Tu estatus viene de lo que tienes</li>
        </ul>
      </div>
      
      <h3>🌟 Centro Basado en Principios</h3>
      <p>El centro más efectivo y estable es estar centrado en principios universales. Los principios no reaccionan a nada. No se enojan ni se tratan mal. No se divorcian de ti ni huyen en la noche.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">💎 Beneficios del Centro Basado en Principios</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Seguridad:</strong> Viene de saber que los principios no cambian</li>
          <li><strong>Guía:</strong> Viene de una brújula interna confiable</li>
          <li><strong>Sabiduría:</strong> Viene de un mapa preciso de la vida</li>
          <li><strong>Poder:</strong> Viene de una fuente ilimitada</li>
        </ul>
      </div>
      
      <h3>🏠 Visualización y Afirmación</h3>
      <p>La visualización y la afirmación son formas poderosas de reprogramar tu mente subconsciente. Cuando visualizas vívidamente tus metas, tu mente subconsciente trabajará para hacerlas realidad.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "La administración es eficiencia en subir la escalera del éxito; el liderazgo determina si la escalera está apoyada en la pared correcta."
      </blockquote>
      
      <h3>📝 Ejercicio: Tu Funeral</h3>
      <p>Imagina que estás asistiendo a tu propio funeral tres años en el futuro. ¿Qué te gustaría que dijera cada orador sobre tu vida y tu carácter? ¿Qué tipo de esposo, esposa, padre, madre o amigo te gustaría que recordaran?</p>
      
      <p>Este ejercicio te conecta con tus valores más profundos y te ayuda a ver tu vida desde una perspectiva más amplia.</p>
    `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-8-4",
      book_id: "8",
      chapter_number: 4,
      title: "Hábito 3: Poner Primero lo Primero",
      content: `
      <h2>Hábito 3: Poner Primero lo Primero</h2>
      <p>Poner primero lo primero es la disciplina de llevar a cabo. Es la segunda creación física, la realización, la actualización, la aparición natural de los Hábitos 1 y 2.</p>
      
      <h3>⚖️ La Matriz de Administración del Tiempo</h3>
      <p>Todas las actividades se pueden categorizar en una matriz de cuatro cuadrantes basada en dos factores: urgencia e importancia.</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #374151; margin-top: 0;">📊 Los Cuatro Cuadrantes</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
          <div style="background-color: #fef2f2; border: 1px solid #ef4444; padding: 16px; border-radius: 8px;">
            <h5 style="color: #dc2626; margin: 0 0 8px 0;">🚨 Cuadrante I: Urgente e Importante</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Crisis</li>
              <li>Problemas urgentes</li>
              <li>Proyectos con fecha límite</li>
            </ul>
          </div>
          <div style="background-color: #f0fdf4; border: 1px solid #22c55e; padding: 16px; border-radius: 8px;">
            <h5 style="color: #15803d; margin: 0 0 8px 0;">🎯 Cuadrante II: No Urgente pero Importante</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Prevención</li>
              <li>Planificación</li>
              <li>Desarrollo personal</li>
            </ul>
          </div>
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px;">
            <h5 style="color: #d97706; margin: 0 0 8px 0;">📞 Cuadrante III: Urgente pero No Importante</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Interrupciones</li>
              <li>Algunas llamadas</li>
              <li>Algunos emails</li>
            </ul>
          </div>
          <div style="background-color: #f1f5f9; border: 1px solid #64748b; padding: 16px; border-radius: 8px;">
            <h5 style="color: #475569; margin: 0 0 8px 0;">📺 Cuadrante IV: No Urgente y No Importante</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Trivialidades</li>
              <li>Pérdida de tiempo</li>
              <li>Actividades de escape</li>
            </ul>
          </div>
        </div>
      </div>
      
      <h3>🎯 El Poder del Cuadrante II</h3>
      <p>Las personas efectivas permanecen fuera de los Cuadrantes III y IV porque, urgentes o no, no son importantes. También reducen el Cuadrante I invirtiendo más tiempo en el Cuadrante II.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">✨ Actividades del Cuadrante II</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Construcción de relaciones:</strong> Tiempo de calidad con familia y amigos</li>
          <li><strong>Planificación a largo plazo:</strong> Establecer metas y estrategias</li>
          <li><strong>Preparación y prevención:</strong> Mantenimiento y mejora continua</li>
          <li><strong>Desarrollo personal:</strong> Educación, ejercicio, meditación</li>
          <li><strong>Identificación de oportunidades:</strong> Innovación y mejora</li>
        </ul>
      </div>
      
      <h3>📅 Organización Semanal</h3>
      <p>La clave para la administración efectiva del tiempo es organizar tu vida semanalmente, no diariamente. Una semana es lo suficientemente larga para incluir todos tus roles y lo suficientemente corta para mantener la perspectiva.</p>
      
      <h3>🎭 Planificación Basada en Roles</h3>
      <p>En lugar de hacer listas de tareas, organiza tu semana alrededor de tus roles clave y las metas que quieres lograr en cada rol.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">📋 Proceso de Planificación Semanal</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>Conecta con tu misión:</strong> Revisa tu declaración de misión personal</li>
          <li><strong>Piensa en tus roles:</strong> Identifica los roles clave para esta semana</li>
          <li><strong>Selecciona metas:</strong> 1-2 resultados importantes por rol</li>
          <li><strong>Programa las actividades:</strong> Asigna tiempo específico para cada meta</li>
          <li><strong>Adapta diariamente:</strong> Mantén la flexibilidad para ajustar</li>
        </ol>
      </div>
      
      <h3>🚫 El Arte de Decir No</h3>
      <p>Recuerda que es más fácil decir no cuando tienes un sí más profundo ardiendo en tu interior. Cuando tienes una clara comprensión de tus prioridades, es más fácil decir no a las cosas que no son importantes.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">💡 Formas Efectivas de Decir No</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>No con alternativa:</strong> "No puedo hacer esto, pero puedo hacer aquello"</li>
          <li><strong>No con explicación:</strong> "No puedo porque tengo otros compromisos"</li>
          <li><strong>No con sugerencia:</strong> "No puedo, pero María podría ayudarte"</li>
          <li><strong>No con tiempo:</strong> "No puedo ahora, pero podría en dos semanas"</li>
        </ul>
      </div>
      
      <h3>⚖️ Delegación Efectiva</h3>
      <p>La delegación efectiva es quizás la actividad más poderosa de alto apalancamiento que existe. Te permite multiplicar tu efectividad a través de otros.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🎯 Delegación de Administración vs. Liderazgo</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Delegación de Administración:</strong> "Ve y haz esto, así, y repórtame"</li>
          <li><strong>Delegación de Liderazgo:</strong> "Aquí está el resultado que necesito, tú decides cómo"</li>
        </ul>
      </div>
      
      <h3>🏆 La Disciplina Personal</h3>
      <p>La integridad personal es la base de la efectividad. Incluye hacer y cumplir compromisos contigo mismo y con otros.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Las cosas que importan más nunca deben estar a merced de las cosas que importan menos."
      </blockquote>
      
      <h3>📝 Ejercicio Práctico</h3>
      <p>Durante una semana, lleva un registro de cómo pasas tu tiempo. Categoriza cada actividad en uno de los cuatro cuadrantes. Al final de la semana, analiza cuánto tiempo pasaste en cada cuadrante y cómo puedes aumentar tu tiempo en el Cuadrante II.</p>
    `,
      page_number: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-8-5",
      book_id: "8",
      chapter_number: 5,
      title: "Hábito 4: Pensar Ganar-Ganar",
      content: `
      <h2>Hábito 4: Pensar Ganar-Ganar</h2>
      <p>Ganar-Ganar es un marco mental y corazón que constantemente busca el beneficio mutuo en todas las interacciones humanas. Ganar-Ganar significa que los acuerdos o soluciones son mutuamente beneficiosos y satisfactorios.</p>
      
      <h3>🎯 Las Seis Paradigmas de Interacción Humana</h3>
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <ol style="margin-bottom: 0;">
          <li><strong>🏆 Ganar-Ganar:</strong> Ambas partes se benefician</li>
          <li><strong>💪 Ganar-Perder:</strong> Yo gano, tú pierdes (mentalidad autoritaria)</li>
          <li><strong>😔 Perder-Ganar:</strong> Yo pierdo, tú ganas (mentalidad de víctima)</li>
          <li><strong>💥 Perder-Perder:</strong> Ambos perdemos (mentalidad vengativa)</li>
          <li><strong>🎯 Ganar:</strong> Solo me importa que yo gane</li>
          <li><strong>🚶 Ganar-Ganar o No Hay Trato:</strong> Si no podemos ganar ambos, no hay acuerdo</li>
        </ol>
      </div>
      
      <h3>🏛️ Los Cinco Pilares de Ganar-Ganar</h3>
      <p>Para que Ganar-Ganar sea efectivo, debe estar respaldado por cinco dimensiones interdependientes:</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🏗️ Los Cinco Pilares</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>🧠 Carácter:</strong> Integridad, madurez y mentalidad de abundancia</li>
          <li><strong>🤝 Relaciones:</strong> Confianza mutua y respeto</li>
          <li><strong>📋 Acuerdos:</strong> Expectativas claras y compromisos mutuos</li>
          <li><strong>🏢 Sistemas:</strong> Estructuras que apoyan Ganar-Ganar</li>
          <li><strong>⚖️ Procesos:</strong> Métodos para resolver diferencias</li>
        </ol>
      </div>
      
      <h3>💎 Carácter: La Base de Ganar-Ganar</h3>
      <p>El carácter es la base de Ganar-Ganar, y todo lo demás se construye sobre esa base. Hay tres rasgos de carácter esenciales:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🌟 Tres Rasgos Esenciales</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🎯 Integridad:</strong> Valor de hacer y cumplir compromisos contigo mismo</li>
          <li><strong>🧘 Madurez:</strong> Balance entre coraje y consideración</li>
          <li><strong>🌊 Mentalidad de Abundancia:</strong> Creencia de que hay suficiente para todos</li>
        </ul>
      </div>
      
      <h3>🌊 Mentalidad de Abundancia vs. Escasez</h3>
      <p>La mayoría de las personas han sido programadas con una mentalidad de escasez. Ven la vida como si solo hubiera un pastel, y si alguien obtiene una rebanada grande, hay menos para todos los demás.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">❌ Mentalidad de Escasez</h4>
        <ul style="margin-bottom: 0;">
          <li>Dificultad para compartir reconocimiento y crédito</li>
          <li>Dificultad para ser genuinamente feliz por el éxito de otros</li>
          <li>Tendencia a ver las diferencias como deslealtad</li>
          <li>Necesidad de ser el centro de atención</li>
        </ul>
      </div>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">✅ Mentalidad de Abundancia</h4>
        <ul style="margin-bottom: 0;">
          <li>Reconoce que hay suficiente para todos</li>
          <li>Comparte poder, ganancias, reconocimiento</li>
          <li>Ve las diferencias como fortalezas</li>
          <li>Busca alternativas creativas</li>
        </ul>
      </div>
      
      <h3>🤝 Construyendo Relaciones de Confianza</h3>
      <p>Las relaciones son la base de Ganar-Ganar. Sin confianza, lo mejor que puedes obtener es un compromiso defensivo.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">💰 La Cuenta Bancaria Emocional</h4>
        <p>Cada relación tiene una "cuenta bancaria emocional". Los depósitos construyen confianza:</p>
        <ul style="margin-bottom: 0;">
          <li><strong>Entender a la persona:</strong> Lo que es importante para ellos</li>
          <li><strong>Atender las pequeñas cosas:</strong> Los detalles importan</li>
          <li><strong>Cumplir compromisos:</strong> Hacer lo que dices que harás</li>
          <li><strong>Aclarar expectativas:</strong> Prevenir malentendidos</li>
          <li><strong>Mostrar integridad personal:</strong> Ser congruente</li>
          <li><strong>Disculparse sinceramente:</strong> Cuando cometes errores</li>
        </ul>
      </div>
      
      <h3>📋 Acuerdos Ganar-Ganar</h3>
      <p>Los acuerdos Ganar-Ganar cubren cinco elementos básicos que dan estructura y dirección a los resultados Ganar-Ganar:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #374151; margin-top: 0;">📝 Elementos de un Acuerdo</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>🎯 Resultados Deseados:</strong> Qué se va a lograr y cuándo</li>
          <li><strong>📏 Directrices:</strong> Parámetros dentro de los cuales se lograrán los resultados</li>
          <li><strong>🛠️ Recursos:</strong> Apoyo humano, financiero, técnico u organizacional</li>
          <li><strong>📊 Rendición de Cuentas:</strong> Estándares de rendimiento y tiempos de evaluación</li>
          <li><strong>🏆 Consecuencias:</strong> Lo que sucede como resultado de la evaluación</li>
        </ol>
      </div>
      
      <h3>🏢 Sistemas que Apoyan Ganar-Ganar</h3>
      <p>Si quieres lograr los fines de Ganar-Ganar, debes usar medios Ganar-Ganar. No puedes decir que quieres Ganar-Ganar y luego usar sistemas que recompensan Ganar-Perder.</p>
      
      <h3>⚖️ Procesos de Cuatro Pasos</h3>
      <p>Cuando surgen problemas, usa este proceso de cuatro pasos:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <ol style="margin-bottom: 0;">
          <li><strong>👁️ Ver el problema desde el otro punto de vista:</strong> Busca realmente entender</li>
          <li><strong>🎯 Identifica los asuntos y preocupaciones clave:</strong> No las posiciones</li>
          <li><strong>💡 Determina qué resultados constituirían una solución aceptable:</strong> Para ambas partes</li>
          <li><strong>🛤️ Identifica nuevas opciones para lograr esos resultados:</strong> Sé creativo</li>
        </ol>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Ganar-Ganar no es una técnica; es una filosofía total de la interacción humana."
      </blockquote>
      
      <h3>📝 Ejercicio Práctico</h3>
      <p>Piensa en una relación donde te gustaría desarrollar un acuerdo Ganar-Ganar. Trata de ponerte en el lugar de la otra persona y escribe cómo ven la situación. Luego identifica qué resultados constituirían una victoria para ambos.</p>
    `,
      page_number: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-8-6",
      book_id: "8",
      chapter_number: 6,
      title: "Hábito 5: Buscar Primero Entender, Luego Ser Entendido",
      content: `
      <h2>Hábito 5: Buscar Primero Entender, Luego Ser Entendido</h2>
      <p>Si tuviera que resumir en una sola frase el principio más importante que he aprendido en el campo de las relaciones interpersonales, sería este: Busca primero entender, luego ser entendido.</p>
      
      <h3>👂 El Problema de la Comunicación</h3>
      <p>La mayoría de las personas no escuchan con la intención de entender; escuchan con la intención de responder. Están hablando o preparándose para hablar.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Respuestas Autobiográficas Típicas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🔍 Evaluar:</strong> Estar de acuerdo o en desacuerdo</li>
          <li><strong>🔎 Sondear:</strong> Hacer preguntas desde tu propio marco de referencia</li>
          <li><strong>💡 Aconsejar:</strong> Dar consejos basados en tu experiencia</li>
          <li><strong>🔄 Interpretar:</strong> Explicar los motivos y comportamientos de las personas</li>
        </ul>
      </div>
      
      <h3>👁️ Escuchar con los Ojos, Oídos y Corazón</h3>
      <p>La comunicación es mucho más que las palabras que decimos. Los estudios indican que solo el 10% de nuestra comunicación se representa con palabras, el 30% con sonidos, y el 60% con lenguaje corporal.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">📊 Los Componentes de la Comunicación</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>10% Palabras:</strong> El contenido verbal</li>
          <li><strong>30% Sonidos:</strong> Tono, inflexión, velocidad</li>
          <li><strong>60% Lenguaje Corporal:</strong> Gestos, expresiones, postura</li>
        </ul>
      </div>
      
      <h3>🎯 Los Cinco Niveles de Escuchar</h3>
      <p>Hay diferentes niveles de escuchar, desde ignorar completamente hasta la escucha empática:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <ol style="margin-bottom: 0;">
          <li><strong>🙉 Ignorar:</strong> No escuchar en absoluto</li>
          <li><strong>👂 Fingir:</strong> "Sí, ajá, correcto"</li>
          <li><strong>🎧 Escuchar Selectivamente:</strong> Solo partes de la conversación</li>
          <li><strong>🔍 Escuchar Atentamente:</strong> Prestar atención y enfocar energía</li>
          <li><strong>❤️ Escuchar Empáticamente:</strong> Escuchar con intención de entender</li>
        </ol>
      </div>
      
      <h3>❤️ La Escucha Empática</h3>
      <p>La escucha empática es escuchar con la intención de entender. Significa ponerte en el lugar de la otra persona y ver el mundo a través de su paradigma.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🎯 Cuatro Etapas de la Escucha Empática</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>🔄 Repetir el contenido:</strong> "Lo que escucho que dices es..."</li>
          <li><strong>🔄 Reformular el contenido:</strong> "Lo que pareces estar diciendo es..."</li>
          <li><strong>💭 Reflejar sentimientos:</strong> "Sientes que..."</li>
          <li><strong>🔄 Reformular contenido y reflejar sentimientos:</strong> "Sientes que... porque..."</li>
        </ol>
      </div>
      
      <h3>🧠 Entender vs. Estar de Acuerdo</h3>
      <p>Buscar entender requiere consideración; buscar ser entendido requiere coraje. La efectividad reside en el balance de ambos.</p>
      
      <p>Es importante entender que entender no significa estar de acuerdo. Puedes entender completamente el punto de vista de alguien y aún así no estar de acuerdo con él.</p>
      
      <h3>🎭 Diagnóstico Antes de Prescribir</h3>
      <p>Es un principio correcto y universal que el diagnóstico debe preceder a la prescripción. Un médico competente no prescribe anteojos sin examinar primero los ojos.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🏥 Analogía Médica</h4>
        <p>Imagina ir al médico y que te diga:</p>
        <p><em>"Toma estos anteojos, me han funcionado muy bien durante 10 años."</em></p>
        <p>Sin siquiera examinar tus ojos. ¿Confiarías en ese diagnóstico?</p>
        <p>Sin embargo, eso es exactamente lo que hacemos en la comunicación cuando prescribimos soluciones antes de diagnosticar el problema.</p>
      </div>
      
      <h3>🗣️ Luego Buscar Ser Entendido</h3>
      <p>Una vez que entiendes profundamente, entonces puedes buscar ser entendido. La secuencia es importante.</p>
      
      <p>Cuando realmente entiendes, tu paradigma cambia. Ya no estás pensando en tu respuesta; estás enfocado en recibir la comunicación profunda de otra alma humana.</p>
      
      <h3>🎯 Presentación Empática</h3>
      <p>Al buscar ser entendido, describe tu punto de vista en términos del paradigma de la otra persona:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">📝 Estructura de Presentación Empática</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>🤝 Ethos (credibilidad personal):</strong> Tu carácter e integridad</li>
          <li><strong>💭 Pathos (alineación empática):</strong> Estar en sintonía emocionalmente</li>
          <li><strong>🧠 Logos (lógica):</strong> El razonamiento de tu presentación</li>
        </ol>
      </div>
      
      <h3>🔄 El Proceso de Entendimiento Mutuo</h3>
      <p>El entendimiento mutuo es la clave para la comunicación efectiva. Cuando ambas partes se sienten entendidas, pueden trabajar juntas para encontrar soluciones sinérgicas.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">🔄 Pasos para el Entendimiento Mutuo</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>Escucha empáticamente</strong> hasta que la otra persona se sienta entendida</li>
          <li><strong>Expresa tu punto de vista</strong> con coraje y consideración</li>
          <li><strong>Busca soluciones</strong> que honren las necesidades de ambos</li>
        </ol>
      </div>
      
      <h3>💡 Beneficios de la Escucha Empática</h3>
      <ul>
        <li><strong>Información precisa:</strong> Obtienes datos reales, no filtrados</li>
        <li><strong>Terapéutico:</strong> Las personas se sienten valoradas y comprendidas</li>
        <li><strong>Influencia:</strong> Cuando las personas se sienten entendidas, son más abiertas</li>
        <li><strong>Relaciones más profundas:</strong> Se construye confianza y respeto mutuo</li>
      </ul>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "La necesidad psicológica más profunda del ser humano es ser entendido."
      </blockquote>
      
      <h3>📝 Ejercicio Práctico</h3>
      <p>La próxima vez que tengas una oportunidad de observar a otros comunicándose, cubre tus oídos por unos minutos y solo observa. ¿Qué emociones se están comunicando que tal vez no se expresen con palabras? ¿Los movimientos corporales y las expresiones faciales coinciden con las palabras habladas?</p>
      
      <p>Luego, en tu próxima conversación importante, practica la escucha empática. Resiste la tentación de responder inmediatamente. En su lugar, busca realmente entender el punto de vista de la otra persona antes de expresar el tuyo.</p>
    `,
      page_number: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-8-7",
      book_id: "8",
      chapter_number: 7,
      title: "Hábito 6: Sinergizar",
      content: `
      <h2>Hábito 6: Sinergizar</h2>
      <p>Sinergizar es la actividad de más alta forma de vida: la verdadera prueba y manifestación de todos los otros hábitos puestos juntos. La sinergia significa que el todo es mayor que la suma de sus partes.</p>
      
      <h3>🌟 ¿Qué es la Sinergia?</h3>
      <p>La sinergia es la esencia del liderazgo centrado en principios. Es la esencia de la paternidad centrada en principios. Cataliza, unifica y libera las más grandes energías dentro de las personas.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">✨ Características de la Sinergia</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🎯 Creatividad:</strong> Genera nuevas alternativas y opciones</li>
          <li><strong>🤝 Colaboración:</strong> Combina fortalezas y compensa debilidades</li>
          <li><strong>🚀 Innovación:</strong> Produce resultados que ninguna persona podría lograr sola</li>
          <li><strong>💡 Soluciones de tercera alternativa:</strong> Va más allá de "mi manera" o "tu manera"</li>
        </ul>
      </div>
      
      <h3>🔄 La Tercera Alternativa</h3>
      <p>Cuando las personas realmente entienden el paradigma de la otra persona, a menudo descubren que la diferencia aparente no es un "o esto o aquello" sino un "esto y aquello".</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🛤️ Niveles de Comunicación</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>🥊 Nivel Bajo (Ganar-Perder):</strong> Comunicación defensiva y protectora</li>
          <li><strong>🤝 Nivel Medio (Compromiso):</strong> Comunicación respetuosa pero no creativa</li>
          <li><strong>🚀 Nivel Alto (Sinergia):</strong> Comunicación sinérgica que crea nuevas alternativas</li>
        </ol>
      </div>
      
      <h3>🌈 Valorar las Diferencias</h3>
      <p>La clave para la sinergia interpersonal es valorar las diferencias mentales, emocionales y psicológicas entre las personas.</p>
      
      <p>Las diferencias no son solo toleradas, sino celebradas como la clave para la creatividad y el crecimiento.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🎭 Tipos de Diferencias Valiosas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🧠 Mentales:</strong> Diferentes formas de pensar y procesar información</li>
          <li><strong>❤️ Emocionales:</strong> Diferentes formas de sentir y expresar emociones</li>
          <li><strong>🎯 Psicológicas:</strong> Diferentes personalidades y temperamentos</li>
          <li><strong>🌍 Culturales:</strong> Diferentes antecedentes y experiencias</li>
          <li><strong>🛠️ Funcionales:</strong> Diferentes habilidades y expertise</li>
        </ul>
      </div>
      
      <h3>🧠 Cerebro Derecho vs. Cerebro Izquierdo</h3>
      <p>Una forma útil de entender las diferencias es considerar las funciones del cerebro derecho e izquierdo:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <h5 style="color: #374151; margin: 0 0 8px 0;">🧮 Cerebro Izquierdo</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Lógico</li>
              <li>Secuencial</li>
              <li>Analítico</li>
              <li>Verbal</li>
              <li>Realista</li>
            </ul>
          </div>
          <div>
            <h5 style="color: #374151; margin: 0 0 8px 0;">🎨 Cerebro Derecho</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Intuitivo</li>
              <li>Creativo</li>
              <li>Visual</li>
              <li>Artístico</li>
              <li>Conceptual</li>
            </ul>
          </div>
        </div>
      </div>
      
      <h3>🏢 Sinergia en el Trabajo</h3>
      <p>En el ambiente de trabajo, la sinergia se manifiesta cuando los equipos crean soluciones que ningún miembro individual podría haber desarrollado solo.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🏆 Condiciones para la Sinergia Organizacional</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🎯 Visión compartida:</strong> Todos entienden y se comprometen con el objetivo</li>
          <li><strong>🤝 Confianza mutua:</strong> Las personas se sienten seguras para ser vulnerables</li>
          <li><strong>🌈 Diversidad valorada:</strong> Las diferencias se ven como fortalezas</li>
          <li><strong>💬 Comunicación abierta:</strong> Las ideas fluyen libremente</li>
          <li><strong>🚀 Mentalidad de abundancia:</strong> Creencia de que hay suficiente éxito para todos</li>
        </ul>
      </div>
      
      <h3>👨‍👩‍👧‍👦 Sinergia en la Familia</h3>
      <p>En las familias, la sinergia se crea cuando cada miembro se siente valorado por sus contribuciones únicas y cuando las decisiones familiares incorporan las perspectivas de todos.</p>
      
      <h3>🚧 Obstáculos para la Sinergia</h3>
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Barreras Comunes</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🛡️ Defensividad:</strong> Proteger el ego en lugar de buscar entendimiento</li>
          <li><strong>🎭 Juegos de poder:</strong> Buscar ganar en lugar de encontrar la mejor solución</li>
          <li><strong>😨 Miedo al cambio:</strong> Preferir lo conocido aunque no sea óptimo</li>
          <li><strong>🏃 Prisa:</strong> No tomar tiempo para explorar alternativas</li>
          <li><strong>🧠 Pensamiento de suma cero:</strong> Creer que si tú ganas, yo pierdo</li>
        </ul>
      </div>
      
      <h3>🔧 Herramientas para Crear Sinergia</h3>
      <p>Hay varias herramientas y técnicas que pueden facilitar la sinergia:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🛠️ Herramientas para la Sinergia</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🧠 Lluvia de ideas:</strong> Generar múltiples opciones sin juzgar</li>
          <li><strong>🗺️ Mapas mentales:</strong> Visualizar conexiones entre ideas</li>
          <li><strong>🎭 Juego de roles:</strong> Ver situaciones desde diferentes perspectivas</li>
          <li><strong>❓ Preguntas poderosas:</strong> "¿Qué pasaría si...?" "¿Cómo podríamos...?"</li>
          <li><strong>🔄 Síntesis:</strong> Combinar elementos de diferentes ideas</li>
        </ul>
      </div>
      
      <h3>🌱 El Proceso de la Sinergia</h3>
      <p>La sinergia no sucede automáticamente. Requiere un proceso deliberado:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #374151; margin-top: 0;">🔄 Pasos para Crear Sinergia</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>🎯 Define el problema o oportunidad</strong> claramente</li>
          <li><strong>👂 Escucha todas las perspectivas</strong> con mente abierta</li>
          <li><strong>🌈 Valora las diferencias</strong> como recursos valiosos</li>
          <li><strong>💡 Genera múltiples alternativas</strong> creativamente</li>
          <li><strong>🔍 Evalúa opciones</strong> basándose en principios compartidos</li>
          <li><strong>✅ Selecciona la mejor solución</strong> que honre todas las perspectivas</li>
        </ol>
      </div>
      
      <h3>🎯 Sinergia vs. Compromiso</h3>
      <p>Es importante distinguir entre sinergia y compromiso:</p>
      
      <ul>
        <li><strong>🤝 Compromiso:</strong> 1 + 1 = 1.5 (Ambas partes ceden algo)</li>
        <li><strong>🚀 Sinergia:</strong> 1 + 1 = 3 o más (Se crea algo completamente nuevo)</li>
      </ul>
      
      <p>En el compromiso, ambas partes dan y reciben. En la sinergia, ambas partes ganan más de lo que podrían haber logrado individualmente.</p>
      
      <h3>🌍 Sinergia y Diversidad</h3>
      <p>La diversidad bien gestionada es una fuente tremenda de sinergia. Cuando las personas de diferentes antecedentes, culturas y perspectivas trabajan juntas efectivamente, pueden crear soluciones innovadoras.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "La fuerza reside en las diferencias, no en las similitudes."
      </blockquote>
      
      <h3>💫 La Magia de la Sinergia</h3>
      <p>Cuando la sinergia realmente sucede, es casi mágica. Las personas se sienten energizadas, creativas y conectadas. Las soluciones emergen que nadie había considerado antes.</p>
      
      <p>La sinergia es aventura. Es emocionante. Abre nuevas posibilidades, nuevas alternativas, nuevas opciones.</p>
      
      <h3>📝 Ejercicio Práctico</h3>
      <p>Identifica una situación en tu vida donde hay diferencias de opinión o conflicto. En lugar de buscar un compromiso, explora cómo podrías crear sinergia:</p>
      
      <ol>
        <li>Define claramente el problema desde múltiples perspectivas</li>
        <li>Identifica qué es valioso en cada punto de vista</li>
        <li>Pregúntate: "¿Hay una tercera alternativa que honre lo mejor de ambas perspectivas?"</li>
        <li>Mantente abierto a soluciones que inicialmente parezcan imposibles</li>
      </ol>
      
      <p>Recuerda: la sinergia requiere vulnerabilidad, apertura mental y la creencia de que juntos podemos crear algo mejor de lo que cualquiera de nosotros podría crear solo.</p>
    `,
      page_number: 7,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-8-8",
      book_id: "8",
      chapter_number: 8,
      title: "Hábito 7: Afilar la Sierra",
      content: `
      <h2>Hábito 7: Afilar la Sierra</h2>
      <p>Afilar la Sierra significa preservar y realzar el mayor bien que tienes: tú mismo. Significa tener un programa balanceado y sistemático para la auto-renovación en las cuatro áreas de tu vida.</p>
      
      <h3>🪚 La Historia de la Sierra</h3>
      <p>Imagina que te encuentras con alguien en el bosque trabajando febrilmente para derribar un árbol.</p>
      
      <p>"¿Qué estás haciendo?" preguntas.</p>
      <p>"¿No lo ves?" viene la respuesta impaciente. "Estoy cortando este árbol."</p>
      <p>"Te ves exhausto. ¿Cuánto tiempo llevas trabajando?"</p>
      <p>"Más de cinco horas, y estoy agotado. ¡Es un trabajo duro!"</p>
      <p>"¿Por qué no tomas un descanso y afilas la sierra? Estoy seguro de que cortaría mucho más rápido."</p>
      <p>"No tengo tiempo para afilar la sierra. ¡Estoy demasiado ocupado cortando!"</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">💡 La Lección</h4>
        <p style="margin-bottom: 0;">Afilar la sierra es invertir tiempo en actividades que aumentan tu capacidad de producir. Es la actividad de Cuadrante II por excelencia que renueva las cuatro dimensiones de tu naturaleza.</p>
      </div>
      
      <h3>🌟 Las Cuatro Dimensiones de la Renovación</h3>
      <p>La renovación debe ser balanceada en las cuatro dimensiones de tu naturaleza:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background-color: #fef2f2; border: 1px solid #ef4444; padding: 16px; border-radius: 8px;">
            <h5 style="color: #dc2626; margin: 0 0 8px 0;">💪 Dimensión Física</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Ejercicio</li>
              <li>Nutrición</li>
              <li>Descanso</li>
              <li>Manejo del estrés</li>
            </ul>
          </div>
          <div style="background-color: #f0fdf4; border: 1px solid #22c55e; padding: 16px; border-radius: 8px;">
            <h5 style="color: #15803d; margin: 0 0 8px 0;">🧠 Dimensión Mental</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Lectura</li>
              <li>Escritura</li>
              <li>Planificación</li>
              <li>Aprendizaje continuo</li>
            </ul>
          </div>
          <div style="background-color: #fdf2f8; border: 1px solid #ec4899; padding: 16px; border-radius: 8px;">
            <h5 style="color: #be185d; margin: 0 0 8px 0;">❤️ Dimensión Social/Emocional</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Relaciones</li>
              <li>Servicio</li>
              <li>Empatía</li>
              <li>Sinergia</li>
            </ul>
          </div>
          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; padding: 16px; border-radius: 8px;">
            <h5 style="color: #0369a1; margin: 0 0 8px 0;">🙏 Dimensión Espiritual</h5>
            <ul style="margin: 0; font-size: 14px;">
              <li>Meditación</li>
              <li>Oración</li>
              <li>Estudio de escrituras</li>
              <li>Conexión con la naturaleza</li>
            </ul>
          </div>
        </div>
      </div>
      
      <h3>💪 La Dimensión Física</h3>
      <p>La dimensión física involucra cuidar efectivamente tu cuerpo físico: comer el tipo correcto de alimentos, descansar lo suficiente y hacer ejercicio regularmente.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">🏃 Elementos del Ejercicio Efectivo</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>💨 Resistencia:</strong> Ejercicio cardiovascular (correr, nadar, ciclismo)</li>
          <li><strong>💪 Flexibilidad:</strong> Estiramiento, yoga, tai chi</li>
          <li><strong>🏋️ Fuerza:</strong> Ejercicios de resistencia, pesas</li>
        </ul>
      </div>
      
      <p>La buena noticia es que no necesitas pasar horas en el gimnasio. Un programa de ejercicio de 30 minutos, tres o cuatro veces por semana, puede tener un impacto tremendo en tu capacidad física.</p>
      
      <h3>🧠 La Dimensión Mental</h3>
      <p>La mayoría de nuestro desarrollo mental y disciplina de estudio viene a través de la educación formal. Pero tan pronto como dejamos la disciplina externa de la escuela, muchos de nosotros dejamos que nuestras mentes se atrofien.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">📚 Actividades de Renovación Mental</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>📖 Lectura:</strong> Buenos libros, especialmente literatura clásica</li>
          <li><strong>✍️ Escritura:</strong> Llevar un diario, escribir cartas reflexivas</li>
          <li><strong>📋 Planificación:</strong> Pensar, planificar, visualizar</li>
          <li><strong>🎓 Educación continua:</strong> Cursos, seminarios, talleres</li>
        </ul>
      </div>
      
      <p>La educación formal te dará una vida; la auto-educación te dará una fortuna.</p>
      
      <h3>❤️ La Dimensión Social/Emocional</h3>
      <p>Las dimensiones social y emocional están relacionadas porque tu vida emocional se desarrolla principalmente, pero no exclusivamente, fuera de tus relaciones con otros.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🤝 Renovación Social/Emocional</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🎯 Seguridad intrínseca:</strong> No depender de otros para tu autoestima</li>
          <li><strong>🤝 Servicio:</strong> Contribuir significativamente a otros</li>
          <li><strong>👂 Escucha empática:</strong> Buscar realmente entender a otros</li>
          <li><strong>🌟 Afirmación:</strong> Reconocer y apreciar a otros</li>
        </ul>
      </div>
      
      <p>Renovar nuestra dimensión social/emocional no toma tiempo de la misma manera que renovar las otras dimensiones. Podemos hacerlo en nuestras interacciones normales y diarias con otras personas.</p>
      
      <h3>🙏 La Dimensión Espiritual</h3>
      <p>La dimensión espiritual es tu núcleo, tu centro, tu compromiso con tu sistema de valores. Es un área muy privada de la vida y una supremamente importante.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🌟 Fuentes de Renovación Espiritual</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>📜 Estudio de escrituras:</strong> Textos sagrados y literatura inspiradora</li>
          <li><strong>🧘 Meditación:</strong> Reflexión silenciosa y contemplación</li>
          <li><strong>🙏 Oración:</strong> Comunicación con lo divino</li>
          <li><strong>🌿 Naturaleza:</strong> Tiempo en ambientes naturales</li>
          <li><strong>🎵 Música y arte:</strong> Experiencias que eleven el espíritu</li>
        </ul>
      </div>
      
      <p>Cuando tomas tiempo para nutrir tu dimensión espiritual, estás renovando tu compromiso con tus valores más profundos.</p>
      
      <h3>⚖️ Renovación Balanceada</h3>
      <p>La renovación óptima requiere atención a las cuatro dimensiones. Descuidar cualquier área afecta negativamente a las demás.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Consecuencias del Desequilibrio</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Solo física:</strong> Te conviertes en un "animal saludable"</li>
          <li><strong>Solo mental:</strong> Te vuelves un "cerebro andante"</li>
          <li><strong>Solo social:</strong> Te conviertes en un "espejo social"</li>
          <li><strong>Solo espiritual:</strong> Te vuelves un "fanático religioso"</li>
        </ul>
      </div>
      
      <h3>🔄 La Espiral Ascendente</h3>
      <p>La renovación es un proceso. Es una espiral ascendente de crecimiento que te lleva a niveles más altos de entendimiento y vivir cada uno de los hábitos.</p>
      
      <p>Cada vez que afilas la sierra en cualquiera de las cuatro dimensiones, aumentas tu capacidad para vivir al menos uno de los siete hábitos.</p>
      
      <h3>🎯 Compromiso Personal</h3>
      <p>Afilar la sierra es una expresión del Hábito 1, porque es algo que solo tú puedes hacer por ti mismo. Debes tomar la iniciativa para hacerlo.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">📅 Plan de Renovación Semanal</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>💪 Física:</strong> 3-4 sesiones de ejercicio de 30 minutos</li>
          <li><strong>🧠 Mental:</strong> 1 hora diaria de lectura o aprendizaje</li>
          <li><strong>❤️ Social/Emocional:</strong> Tiempo de calidad con seres queridos</li>
          <li><strong>🙏 Espiritual:</strong> 15-30 minutos diarios de meditación/oración</li>
        </ul>
      </div>
      
      <h3>🌱 Crecimiento Continuo</h3>
      <p>El proceso de crecimiento es gradual, secuencial y requiere paciencia contigo mismo. No hay atajos para ningún lugar que valga la pena ir.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Lo que hacemos de forma consistente en una base pequeña no es una gran cosa en sí misma. Pero las cosas pequeñas y consistentes, hechas en una gran manera, logran grandes cosas."
      </blockquote>
      
      <h3>🏆 El Impacto en Otros</h3>
      <p>Cuando te renuevas regularmente en las cuatro dimensiones, creas un crecimiento y cambio positivo en todas las áreas de tu vida. Te conviertes en una persona más efectiva y también inspiras a otros a hacer lo mismo.</p>
      
      <h3>📝 Ejercicio Práctico</h3>
      <p>Diseña tu propio programa de renovación:</p>
      
      <ol>
        <li><strong>Evalúa tu estado actual</strong> en cada una de las cuatro dimensiones</li>
        <li><strong>Identifica actividades específicas</strong> que te renovarían en cada área</li>
        <li><strong>Programa tiempo regular</strong> para estas actividades en tu calendario</li>
        <li><strong>Comienza pequeño</strong> pero sé consistente</li>
        <li><strong>Evalúa y ajusta</strong> tu programa regularmente</li>
      </ol>
      
      <p>Recuerda: afilar la sierra es la inversión más importante que puedes hacer. Es la actividad que hace posible todas las demás actividades.</p>
      
      <h3>🎊 Conclusión: Convirtiéndote en una Persona de Transición</h3>
      <p>Los 7 hábitos te permiten convertirte en una persona de transición: alguien que rompe los patrones negativos del pasado y crea patrones positivos para el futuro.</p>
      
      <p>Cuando vives estos hábitos, te conviertes en un agente de cambio positivo en tu familia, organización y comunidad. Tu ejemplo inspira a otros a vivir de manera más efectiva.</p>
      
      <p>El cambio real, duradero, viene de adentro hacia afuera. Comienza contigo.</p>
    `,
      page_number: 8,
      created_at: new Date().toISOString(),
    },
  ],
  "9": [
    {
      id: "content-9-1",
      book_id: "9",
      chapter_number: 1,
      title: "El Origen de Este Libro",
      content: `
      <h2>Capítulo 1: El Origen de Este Libro</h2>
      <p>Este libro surgió de la necesidad de encontrar una respuesta a la pregunta más importante de la vida: ¿Cómo podemos vivir una vida plena y significativa en un mundo lleno de distracciones y sufrimiento?</p>
      
      <h3>🌅 El Despertar Espiritual</h3>
      <p>Durante años, viví en un estado de ansiedad casi constante. Tenía todo lo que se suponía que me haría feliz, pero por dentro me sentía vacío e inquieto. Fue entonces cuando comenzó mi despertar espiritual.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ El Problema del Tiempo Psicológico</h4>
        <p>La mayoría de las personas viven atrapadas entre:</p>
        <ul style="margin-bottom: 0;">
          <li><strong>El pasado:</strong> Lamentándose por errores o glorificando "los buenos tiempos"</li>
          <li><strong>El futuro:</strong> Preocupándose por lo que podría pasar o esperando que la felicidad llegue "cuando..."</li>
        </ul>
      </div>
      
      <h3>🎯 El Poder del Ahora</h3>
      <p>El momento presente es lo único que tienes. Es lo único que has tenido alguna vez. Es lo único que tendrás jamás.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">✨ Beneficios de Vivir en el Presente</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Paz interior:</strong> Desaparece la ansiedad sobre el futuro</li>
          <li><strong>Claridad mental:</strong> La mente se calma y se enfoca</li>
          <li><strong>Creatividad:</strong> Surgen soluciones e insights espontáneos</li>
          <li><strong>Conexión auténtica:</strong> Las relaciones se vuelven más profundas</li>
        </ul>
      </div>
      
      <h3>🧠 La Mente y el Ser</h3>
      <p>Uno de los descubrimientos más liberadores es darse cuenta de que <strong>tú no eres tu mente</strong>. Puedes observar tus pensamientos sin identificarte con ellos.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "El momento presente es el único tiempo sobre el que tenemos dominio."
      </blockquote>
      
      <p>Este libro te guiará hacia el reconocimiento de tu verdadera naturaleza como conciencia pura, más allá de la mente pensante.</p>
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
      title: "Definición: Los Nuevos Ricos",
      content: `
      <h2>Capítulo 1: Definición - Los Nuevos Ricos</h2>
      <p>¿Quiénes son los Nuevos Ricos? Son aquellos que han abandonado el plan de vida diferida y han creado estilos de vida de lujo en el presente usando las monedas de los Nuevos Ricos: tiempo y movilidad.</p>
      
      <h3>💰 Viejos Ricos vs. Nuevos Ricos</h3>
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">👔 Los Diferidores (Viejos Ricos)</h4>
        <ul style="margin-bottom: 0;">
          <li>Trabajan por trabajar</li>
          <li>Posponen la vida hasta la jubilación</li>
          <li>Compran todas las cosas que quieren</li>
          <li>Son los jefes o empleados</li>
          <li>Quieren poseer un avión privado</li>
        </ul>
      </div>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🌟 Los Nuevos Ricos</h4>
        <ul style="margin-bottom: 0;">
          <li>Trabajan para no trabajar</li>
          <li>Toman mini-jubilaciones a lo largo de la vida</li>
          <li>Hacen todas las cosas que quieren</li>
          <li>Son los dueños o no están en la oficina</li>
          <li>Quieren usar un avión privado</li>
        </ul>
      </div>
      
      <h3>🎯 El Método DEAL</h3>
      <p>Para unirse a los Nuevos Ricos, debes dominar cuatro habilidades en este orden específico:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <ol style="margin-bottom: 0;">
          <li><strong>📋 D - Definición:</strong> Reemplaza las metas con sueños y la ambición con misión</li>
          <li><strong>❌ E - Eliminación:</strong> Olvida la gestión del tiempo, aprende a ignorar lo no esencial</li>
          <li><strong>🤖 A - Automatización:</strong> Genera ingresos sin gestión usando otros</li>
          <li><strong>🌍 L - Liberación:</strong> Libérate de las limitaciones geográficas</li>
        </ol>
      </div>
      
      <h3>⏰ El Nuevo Concepto de Riqueza</h3>
      <p>La riqueza no se mide solo en dinero. La fórmula de los Nuevos Ricos es:</p>
      
      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
        <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">
          Riqueza = Lo que posees + Lo que ganas + Lo que otros hacen por ti
        </p>
      </div>
      
      <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
        "La pregunta que debes hacerte no es '¿Qué quiero?' o '¿Cuáles son mis metas?' sino '¿Qué me emocionaría?'"
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
      <h2>Capítulo 1: ¿Qué es una Conversación Crucial?</h2>
      <p>Una conversación crucial es un diálogo entre dos o más personas donde las opiniones varían, las emociones son fuertes y las consecuencias son significativas.</p>
      
      <h3>🎯 Las Tres Características</h3>
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <ol style="margin-bottom: 0;">
          <li><strong>📊 Opiniones varían:</strong> Las personas tienen puntos de vista diferentes</li>
          <li><strong>💥 Emociones fuertes:</strong> Las personas se preocupan profundamente por el tema</li>
          <li><strong>⚡ Consecuencias significativas:</strong> Los resultados podrían impactar el futuro</li>
        </ol>
      </div>
      
      <h3>🚨 Ejemplos de Conversaciones Cruciales</h3>
      <ul>
        <li><strong>En el trabajo:</strong> Dar feedback a un colega sobre su rendimiento</li>
        <li><strong>En casa:</strong> Hablar con tu pareja sobre finanzas</li>
        <li><strong>Con amigos:</strong> Confrontar a alguien sobre un comportamiento problemático</li>
        <li><strong>Con el jefe:</strong> Discutir una promoción o aumento de sueldo</li>
      </ul>
      
      <h3>⚖️ Las Dos Opciones Pobres</h3>
      <p>Cuando nos enfrentamos a conversaciones cruciales, típicamente elegimos entre dos opciones pobres:</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">❌ Opciones Inefectivas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>🤐 Evitar la conversación:</strong> Guardamos silencio y sufrimos en silencio</li>
          <li><strong>💥 Enfrentar mal:</strong> Hablamos pero de manera destructiva</li>
        </ul>
      </div>
      
      <h3>🌟 La Tercera Opción: Diálogo</h3>
      <p>El diálogo es el libre flujo de significado entre dos o más personas. Cuando las personas pueden hablar abierta y honestamente sobre lo que realmente importa, se crean resultados extraordinarios.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">✅ Beneficios del Diálogo Efectivo</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Mejores decisiones:</strong> Más información lleva a mejores elecciones</li>
          <li><strong>Relaciones más fuertes:</strong> La confianza y el respeto crecen</li>
          <li><strong>Resultados superiores:</strong> Los equipos rinden mejor</li>
          <li><strong>Menos estrés:</strong> Los problemas se resuelven antes de escalar</li>
        </ul>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "La calidad de tu vida surge de la calidad de las relaciones que tienes con las personas en tu vida."
      </blockquote>
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
      <h2>Capítulo 1: El Desafío del Futuro</h2>
      <p>¿Qué empresa valiosa no está siendo construida hoy? Esta pregunta es más difícil de lo que parece, porque tu empresa podría crear mucho valor sin volverse muy valiosa para ti como fundador.</p>
      
      <h3>🔢 De Cero a Uno vs. De Uno a N</h3>
      <p>Cada momento en los negocios sucede solo una vez. La próxima Bill Gates no construirá un sistema operativo. Los próximos Larry Page y Sergey Brin no harán un motor de búsqueda.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🎯 Dos Tipos de Progreso</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>📈 Progreso Horizontal (1 a n):</strong> Copiar cosas que funcionan, globalización</li>
          <li><strong>🚀 Progreso Vertical (0 a 1):</strong> Hacer cosas nuevas, tecnología</li>
        </ul>
      </div>
      
      <h3>🏭 Globalización vs. Tecnología</h3>
      <p>La globalización significa tomar cosas que funcionan en un lugar y hacerlas funcionar en todas partes. La tecnología significa cualquier forma nueva y mejor de hacer las cosas.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ El Problema de la Competencia</h4>
        <p>En un mundo de competencia perfecta, ninguna empresa obtiene ganancias económicas. La competencia perfecta es el estado ideal de la economía neoclásica, pero es lo opuesto a la creación de valor empresarial.</p>
      </div>
      
      <h3>🎯 El Monopolio Creativo</h3>
      <p>Los monopolios creativos dan a los clientes más opciones al agregar categorías completamente nuevas de abundancia al mundo. Los monopolios impulsan el progreso porque la promesa de años o incluso décadas de ganancias monopolísticas proporciona un poderoso incentivo para innovar.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">💡 Características de un Monopolio Exitoso</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Tecnología propietaria:</strong> 10x mejor que la alternativa más cercana</li>
          <li><strong>Efectos de red:</strong> Más valioso cuantos más usuarios tenga</li>
          <li><strong>Economías de escala:</strong> Más fuerte a medida que crece</li>
          <li><strong>Ventaja de marca:</strong> Difícil de replicar</li>
        </ul>
      </div>
      
      <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f0f9ff; padding: 20px; border-radius: 8px;">
        "Toda empresa exitosa hace algo que otros no pueden hacer. El monopolio es la condición de todo negocio exitoso."
      </blockquote>
      
      <p>El futuro será diferente, pero debe ser construido. No sucederá por sí solo. El futuro es fundamentalmente incierto, y es exactamente lo que hace que sea tan importante que lo construyamos.</p>
    `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
  ],
}

// Mock reading progress and bookmarks
const mockReadingProgress: { [key: string]: ReadingProgress } = {
  "demo-user-id-1": {
    id: "progress-1",
    user_id: "demo-user-id",
    book_id: "1",
    progress_percentage: 33,
    current_page: 1,
    last_read_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
}

const mockBookmarks: { [key: string]: Bookmark[] } = {
  "demo-user-id-1": [
    {
      id: "bookmark-1",
      user_id: "demo-user-id",
      book_id: "1",
      page_number: 1,
      note: "Concepto importante sobre el 1%",
      created_at: new Date().toISOString(),
    },
  ],
}

const mockReadingStats: ReadingStats = {
  books_read: 3,
  total_reading_time: 12,
  average_progress: 45,
  reading_streak: 7,
}

// API Functions
export async function getAllBooks(): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBooks
}

export async function getBookById(bookId: string): Promise<Book | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockBooks.find((book) => book.id === bookId) || null
}

export async function getBookContent(bookId: string): Promise<BookContent[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockBookContent[bookId] || []
}

export async function getRecommendedBooks(userId: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  // Return first 6 books as recommended
  return mockBooks.slice(0, 6)
}

export async function getUserReadingStats(userId: string): Promise<ReadingStats> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockReadingStats
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  progressPercentage: number,
  currentPage: number,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const key = `${userId}-${bookId}`
  mockReadingProgress[key] = {
    id: `progress-${Date.now()}`,
    user_id: userId,
    book_id: bookId,
    progress_percentage: progressPercentage,
    current_page: currentPage,
    last_read_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
}

export async function getUserBookmarks(userId: string, bookId: string): Promise<Bookmark[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const key = `${userId}-${bookId}`
  return mockBookmarks[key] || []
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
    note,
    created_at: new Date().toISOString(),
  }

  const key = `${userId}-${bookId}`
  if (!mockBookmarks[key]) {
    mockBookmarks[key] = []
  }
  mockBookmarks[key].push(newBookmark)

  return newBookmark
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  // Find and remove bookmark from mock data
  Object.keys(mockBookmarks).forEach((key) => {
    mockBookmarks[key] = mockBookmarks[key].filter((bookmark) => bookmark.id !== bookmarkId)
  })
}
