-- Seed the library with professional development books
-- Insert books
INSERT INTO books (id, title, author, description, category, rating, reading_time, pages, published_year, cover_url, tags, difficulty, key_topics, is_recommended, is_free) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hábitos Atómicos', 'James Clear', 'Una guía práctica para formar buenos hábitos y romper los malos. Aprende cómo pequeños cambios pueden generar resultados extraordinarios en tu vida personal y profesional.', 'Productividad', 4.8, '4h 30min', 8, 2018, '/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white', ARRAY['Hábitos', 'Productividad', 'Autoayuda', 'Comportamiento'], 'Intermedio', ARRAY['Formación de hábitos', 'Productividad personal', 'Cambio de comportamiento', 'Sistemas vs objetivos'], true, true),

('550e8400-e29b-41d4-a716-446655440002', 'Trabajo Profundo', 'Cal Newport', 'Reglas para el éxito enfocado en un mundo distraído. Desarrolla la habilidad más valiosa del siglo XXI: la capacidad de concentrarse sin distracciones.', 'Productividad', 4.7, '4h 45min', 6, 2016, '/placeholder.svg?height=400&width=300&text=Trabajo%20Profundo&bg=1f2937&color=white', ARRAY['Concentración', 'Productividad', 'Trabajo', 'Enfoque'], 'Intermedio', ARRAY['Trabajo profundo', 'Concentración', 'Productividad cognitiva', 'Distracción digital'], true, true),

('550e8400-e29b-41d4-a716-446655440003', 'La Semana Laboral de 4 Horas', 'Timothy Ferriss', 'Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos. Una guía para automatizar tu vida y crear libertad financiera.', 'Productividad', 4.2, '4h 20min', 5, 2007, '/placeholder.svg?height=400&width=300&text=4%20Horas&bg=f59e0b&color=white', ARRAY['Productividad', 'Libertad', 'Emprendimiento', 'Automatización'], 'Intermedio', ARRAY['Automatización', 'Outsourcing', 'Libertad financiera', 'Estilo de vida'], false, true),

('550e8400-e29b-41d4-a716-446655440004', 'Vayamos Adelante', 'Sheryl Sandberg', 'Las mujeres, el trabajo y la voluntad de liderar. Un libro inspirador sobre liderazgo femenino y cómo superar las barreras en el mundo profesional.', 'Liderazgo', 4.5, '3h 20min', 6, 2013, '/placeholder.svg?height=400&width=300&text=Vayamos%20Adelante&bg=ec4899&color=white', ARRAY['Liderazgo', 'Carrera', 'Género', 'Empoderamiento'], 'Fácil', ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género', 'Ambición'], true, true),

('550e8400-e29b-41d4-a716-446655440005', 'Los 7 Hábitos de la Gente Altamente Efectiva', 'Stephen R. Covey', 'Lecciones poderosas de cambio personal. Los principios fundamentales para el éxito personal y profesional basados en principios universales.', 'Liderazgo', 4.8, '5h 45min', 7, 1989, '/placeholder.svg?height=400&width=300&text=7%20Hábitos&bg=8b5cf6&color=white', ARRAY['Liderazgo', 'Efectividad', 'Desarrollo Personal', 'Principios'], 'Intermedio', ARRAY['Liderazgo personal', 'Efectividad', 'Principios de vida', 'Interdependencia'], true, true),

('550e8400-e29b-41d4-a716-446655440006', 'Inteligencia Emocional 2.0', 'Travis Bradberry', 'Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales. Incluye un código de acceso para evaluar tu inteligencia emocional.', 'Habilidades Blandas', 4.4, '3h 50min', 6, 2009, '/placeholder.svg?height=400&width=300&text=Inteligencia%20Emocional&bg=10b981&color=white', ARRAY['Inteligencia Emocional', 'Habilidades Blandas', 'Comunicación', 'Autoconciencia'], 'Fácil', ARRAY['Inteligencia emocional', 'Autoconciencia', 'Habilidades sociales', 'Autorregulación'], true, true),

('550e8400-e29b-41d4-a716-446655440007', 'Conversaciones Cruciales', 'Kerry Patterson', 'Herramientas para hablar cuando las apuestas son altas. Aprende a manejar conversaciones difíciles con confianza y habilidad.', 'Habilidades Blandas', 4.6, '4h 10min', 5, 2002, '/placeholder.svg?height=400&width=300&text=Conversaciones%20Cruciales&bg=059669&color=white', ARRAY['Comunicación', 'Conversaciones', 'Habilidades Blandas', 'Conflictos'], 'Intermedio', ARRAY['Comunicación efectiva', 'Resolución de conflictos', 'Diálogo', 'Negociación'], true, true),

('550e8400-e29b-41d4-a716-446655440008', 'Mentalidad', 'Carol S. Dweck', 'La nueva psicología del éxito. Descubre cómo una mentalidad de crecimiento puede transformar tu vida personal y profesional.', 'Desarrollo Personal', 4.5, '4h 15min', 6, 2006, '/placeholder.svg?height=400&width=300&text=Mentalidad&bg=7c3aed&color=white', ARRAY['Mentalidad', 'Crecimiento', 'Psicología', 'Motivación'], 'Fácil', ARRAY['Mentalidad de crecimiento', 'Resiliencia', 'Aprendizaje', 'Motivación intrínseca'], true, true),

('550e8400-e29b-41d4-a716-446655440009', 'La Startup Lean', 'Eric Ries', 'Cómo los emprendedores usan la innovación continua para crear negocios exitosos. La metodología que ha revolucionado el mundo de las startups.', 'Negocios', 4.3, '4h 10min', 6, 2011, '/placeholder.svg?height=400&width=300&text=Startup%20Lean&bg=0ea5e9&color=white', ARRAY['Emprendimiento', 'Startup', 'Innovación', 'Metodología'], 'Intermedio', ARRAY['Metodología lean', 'Validación de productos', 'Innovación', 'MVP'], false, true),

('550e8400-e29b-41d4-a716-446655440010', 'De Cero a Uno', 'Peter Thiel', 'Notas sobre startups, o cómo construir el futuro. Perspectivas únicas sobre innovación y creación de valor en el mundo empresarial.', 'Negocios', 4.4, '3h 30min', 5, 2014, '/placeholder.svg?height=400&width=300&text=De%20Cero%20a%20Uno&bg=dc2626&color=white', ARRAY['Emprendimiento', 'Startup', 'Innovación', 'Tecnología'], 'Avanzado', ARRAY['Innovación', 'Monopolios', 'Tecnología', 'Venture Capital'], true, true);

-- Insert chapters for "Hábitos Atómicos" (Book ID: 550e8400-e29b-41d4-a716-446655440001)
INSERT INTO book_chapters (book_id, chapter_number, title, content, estimated_reading_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia', 
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Los Fundamentos</h1>
<p class="text-lg mb-6 text-gray-700"><strong>Los hábitos son el interés compuesto de la superación personal.</strong> De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🚀 El poder de los pequeños cambios</h2>
<p class="mb-4 text-gray-700">Si puedes mejorar tan solo un <strong>1% cada día</strong> durante un año, terminarás siendo treinta y siete veces mejor al final del período.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
<h3 class="text-lg font-semibold text-blue-900 mb-3">📊 La matemática del 1%</h3>
<ul class="list-disc list-inside text-blue-800 space-y-2">
<li><strong>1% mejor cada día:</strong> 1.01^365 = 37.78</li>
<li><strong>1% peor cada día:</strong> 0.99^365 = 0.03</li>
</ul>
</div>

<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-gray-50 rounded-r-lg italic text-lg text-gray-800">
"El éxito es el producto de hábitos diarios, no de transformaciones de una sola vez."
</blockquote>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎯 El Valle de la Desilusión</h2>
<p class="mb-4 text-gray-700">Los hábitos a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico y desbloqueas un nuevo nivel de rendimiento.</p>
<p class="mb-4 text-gray-700">Esto es una de las razones principales por las que es tan difícil construir hábitos que perduren. Las personas hacen algunos pequeños cambios, no ven resultados tangibles, y deciden parar.</p>
</div>', 35),

('550e8400-e29b-41d4-a716-446655440001', 2, 'Cómo Funcionan Tus Hábitos',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 2: Cómo Funcionan Tus Hábitos</h1>
<p class="text-lg mb-6 text-gray-700">Un hábito es una rutina o comportamiento que se realiza regularmente y, en muchos casos, automáticamente.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔄 El Bucle del Hábito</h2>
<p class="mb-4 text-gray-700">Todos los hábitos siguen el mismo patrón de cuatro pasos:</p>

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-4">🎯 Los 4 Pasos del Hábito</h3>
<ol class="list-decimal list-inside text-blue-800 space-y-2">
<li><strong>Señal:</strong> El desencadenante que inicia el comportamiento</li>
<li><strong>Anhelo:</strong> La fuerza motivacional detrás de cada hábito</li>
<li><strong>Respuesta:</strong> El hábito real que realizas</li>
<li><strong>Recompensa:</strong> El beneficio que obtienes del hábito</li>
</ol>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔧 Las Cuatro Leyes del Cambio de Comportamiento</h2>

<div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-green-900 mb-4">✅ Cómo Crear un Buen Hábito</h3>
<ul class="list-disc list-inside text-green-800 space-y-2">
<li><strong>1ª Ley (Señal):</strong> Hazlo obvio</li>
<li><strong>2ª Ley (Anhelo):</strong> Hazlo atractivo</li>
<li><strong>3ª Ley (Respuesta):</strong> Hazlo fácil</li>
<li><strong>4ª Ley (Recompensa):</strong> Hazlo satisfactorio</li>
</ul>
</div>
</div>', 30),

('550e8400-e29b-41d4-a716-446655440001', 3, 'La Primera Ley: Hazlo Obvio',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 3: La Primera Ley - Hazlo Obvio</h1>
<p class="text-lg mb-6 text-gray-700">El proceso de cambio de comportamiento siempre comienza con la conciencia. Necesitas ser consciente de tus hábitos antes de poder cambiarlos.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">👁️ El Poder de la Conciencia</h2>
<p class="mb-4 text-gray-700">Muchos de nuestros hábitos diarios se realizan de forma automática. Hasta que no hagas lo inconsciente consciente, dirigirá tu vida.</p>

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-4">📝 Ejercicio: El Registro de Hábitos</h3>
<p class="text-blue-800 mb-3">Haz una lista de tus hábitos diarios. Para cada hábito, clasifícalo como:</p>
<ul class="list-disc list-inside text-blue-800 space-y-2">
<li><strong>Positivo (+):</strong> Un buen hábito</li>
<li><strong>Negativo (-):</strong> Un mal hábito</li>
<li><strong>Neutral (=):</strong> Un hábito neutro</li>
</ul>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔗 Apilamiento de Hábitos</h2>
<p class="mb-4 text-gray-700">La fórmula del apilamiento de hábitos es:</p>

<blockquote class="border-l-4 border-purple-500 pl-6 py-4 my-6 bg-purple-50 rounded-r-lg text-center text-lg font-semibold text-purple-900">
"Después de [HÁBITO ACTUAL], yo haré [NUEVO HÁBITO]."
</blockquote>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🏠 Diseño del Entorno</h2>
<p class="mb-4 text-gray-700">El entorno es la mano invisible que da forma al comportamiento humano.</p>

<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-yellow-900 mb-4">💡 Ejemplos de "Hazlo Obvio"</h3>
<ul class="list-disc list-inside text-yellow-800 space-y-2">
<li><strong>Leer más:</strong> Coloca un libro en tu almohada cada mañana</li>
<li><strong>Hacer ejercicio:</strong> Prepara tu ropa de gimnasio la noche anterior</li>
<li><strong>Comer saludable:</strong> Coloca frutas en un lugar visible</li>
<li><strong>Beber más agua:</strong> Llena una botella de agua y ponla en tu escritorio</li>
</ul>
</div>
</div>', 32),

('550e8400-e29b-41d4-a716-446655440001', 4, 'La Segunda Ley: Hazlo Atractivo',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 4: La Segunda Ley - Hazlo Atractivo</h1>
<p class="text-lg mb-6 text-gray-700">Los hábitos son un bucle de retroalimentación impulsado por la dopamina. Cuando la dopamina aumenta, también lo hace nuestra motivación para actuar.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🧠 La Ciencia de la Dopamina</h2>
<p class="mb-4 text-gray-700">La dopamina no solo se libera cuando experimentamos placer, sino también cuando lo <em>anticipamos</em>. Esta anticipación es lo que nos motiva a actuar.</p>

<div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-green-900 mb-4">🎯 Estrategias para Hacer Hábitos Atractivos</h3>
<ul class="list-disc list-inside text-green-800 space-y-2">
<li><strong>Agrupa tentaciones:</strong> Combina una acción que necesitas hacer con una que quieres hacer</li>
<li><strong>Únete a una cultura:</strong> Rodéate de personas que tienen los hábitos que deseas</li>
<li><strong>Crea un ritual motivacional:</strong> Haz algo que disfrutes inmediatamente antes de un hábito difícil</li>
</ul>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">👥 El Papel de la Familia y Amigos</h2>
<p class="mb-4 text-gray-700">Imitamos los hábitos de tres grupos en particular:</p>
<ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
<li>Los cercanos (familia y amigos)</li>
<li>Los muchos (la tribu)</li>
<li>Los poderosos (aquellos con estatus y prestigio)</li>
</ul>
</div>', 28),

('550e8400-e29b-41d4-a716-446655440001', 5, 'La Tercera Ley: Hazlo Fácil',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 5: La Tercera Ley - Hazlo Fácil</h1>
<p class="text-lg mb-6 text-gray-700">Los humanos siguen la Ley del Menor Esfuerzo. Naturalmente gravitamos hacia la opción que requiere la menor cantidad de trabajo.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">⚡ La Regla de los Dos Minutos</h2>
<p class="mb-4 text-gray-700">Cuando empiezas un nuevo hábito, debe tomar menos de dos minutos hacer.</p>

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-4">⏱️ Ejemplos de la Regla de los Dos Minutos</h3>
<ul class="list-disc list-inside text-blue-800 space-y-2">
<li><strong>"Leer antes de dormir"</strong> se convierte en "Leer una página"</li>
<li><strong>"Hacer yoga"</strong> se convierte en "Sacar mi esterilla de yoga"</li>
<li><strong>"Estudiar para la clase"</strong> se convierte en "Abrir mis apuntes"</li>
<li><strong>"Correr tres millas"</strong> se convierte en "Atarme los zapatos para correr"</li>
</ul>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🏗️ Preparar el Entorno para el Éxito</h2>
<p class="mb-4 text-gray-700">Reduce la fricción asociada con los buenos comportamientos. Cuando la fricción es baja, los hábitos son fáciles.</p>

<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-yellow-900 mb-4">🛠️ Cómo Reducir la Fricción</h3>
<ul class="list-disc list-inside text-yellow-800 space-y-2">
<li>Prepara tu entorno para hacer el siguiente hábito lo más fácil posible</li>
<li>Reduce los pasos entre tú y tus buenos hábitos</li>
<li>Prepara tu entorno para hacer los malos hábitos más difíciles</li>
</ul>
</div>
</div>', 25),

('550e8400-e29b-41d4-a716-446655440001', 6, 'La Cuarta Ley: Hazlo Satisfactorio',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 6: La Cuarta Ley - Hazlo Satisfactorio</h1>
<p class="text-lg mb-6 text-gray-700">Estamos más propensos a repetir un comportamiento cuando la experiencia es satisfactoria. El placer enseña al cerebro que vale la pena recordar y repetir una acción.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎁 La Importancia de la Recompensa Inmediata</h2>
<p class="mb-4 text-gray-700">El cerebro humano evolucionó para priorizar las recompensas inmediatas sobre las recompensas retrasadas.</p>

<div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-green-900 mb-4">✅ Estrategias para Hacer Hábitos Satisfactorios</h3>
<ul class="list-disc list-inside text-green-800 space-y-2">
<li><strong>Usa refuerzo positivo:</strong> Date una recompensa inmediata cuando completes tu hábito</li>
<li><strong>Haz visible el progreso:</strong> Usa un rastreador de hábitos para ver tu progreso</li>
<li><strong>Nunca falles dos veces:</strong> Si fallas un día, asegúrate de volver al camino al día siguiente</li>
</ul>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">📊 El Poder del Seguimiento de Hábitos</h2>
<p class="mb-4 text-gray-700">El seguimiento de hábitos es poderoso porque aprovecha múltiples Leyes del Cambio de Comportamiento. Es obvio, atractivo y satisfactorio.</p>

<blockquote class="border-l-4 border-green-500 pl-6 py-4 my-6 bg-green-50 rounded-r-lg italic text-lg text-green-900">
"No rompas la cadena" es una poderosa regla mental que ayuda a mantener la consistencia.
</blockquote>
</div>', 30),

('550e8400-e29b-41d4-a716-446655440001', 7, 'Tácticas Avanzadas: Cómo Pasar de Ser Bueno a Ser Grandioso',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 7: Tácticas Avanzadas</h1>
<p class="text-lg mb-6 text-gray-700">Los hábitos son el camino hacia el dominio. Pero para alcanzar tu máximo potencial, necesitas más que solo hábitos.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎯 La Regla de Goldilocks</h2>
<p class="mb-4 text-gray-700">Los humanos experimentan máxima motivación cuando trabajan en tareas que están justo en el borde de sus habilidades actuales.</p>

<div class="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-purple-900 mb-4">⚖️ Encontrar el Equilibrio Perfecto</h3>
<ul class="list-disc list-inside text-purple-800 space-y-2">
<li><strong>Demasiado fácil:</strong> Aburrimiento</li>
<li><strong>Demasiado difícil:</strong> Ansiedad</li>
<li><strong>Justo en el punto:</strong> Flujo y motivación máxima</li>
</ul>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔄 La Importancia de la Revisión y Reflexión</h2>
<p class="mb-4 text-gray-700">La reflexión y revisión es un proceso que te permite permanecer consciente de tu rendimiento a lo largo del tiempo.</p>

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-4">📝 Preguntas para la Revisión Anual</h3>
<ul class="list-disc list-inside text-blue-800 space-y-2">
<li>¿Qué salió bien este año?</li>
<li>¿Qué no salió tan bien?</li>
<li>¿Qué aprendí?</li>
<li>¿Cómo puedo mejorar estos hábitos el próximo año?</li>
</ul>
</div>
</div>', 27),

('550e8400-e29b-41d4-a716-446655440001', 8, 'La Verdad Secreta de los Hábitos',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 8: La Verdad Secreta de los Hábitos</h1>
<p class="text-lg mb-6 text-gray-700">Un hábito no puede transformar tu vida, pero el sistema correcto de hábitos sí puede. Ese es el poder de los pequeños cambios.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🌟 El Poder de la Identidad</h2>
<p class="mb-4 text-gray-700">El objetivo final no es leer un libro, el objetivo es convertirse en lector. No es correr un maratón, es convertirse en corredor.</p>

<div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-4">🎭 Cambio Basado en Identidad vs. Cambio Basado en Resultados</h3>
<div class="grid md:grid-cols-2 gap-4">
<div class="bg-white p-4 rounded border">
<h4 class="font-semibold text-blue-800 mb-2">Basado en Resultados</h4>
<p class="text-sm text-blue-700">"Quiero perder peso"</p>
</div>
<div class="bg-white p-4 rounded border">
<h4 class="font-semibold text-purple-800 mb-2">Basado en Identidad</h4>
<p class="text-sm text-purple-700">"Quiero ser una persona saludable"</p>
</div>
</div>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔄 El Proceso de Dos Pasos</h2>
<ol class="list-decimal list-inside text-gray-700 space-y-3 mb-6">
<li><strong>Decide qué tipo de persona quieres ser.</strong></li>
<li><strong>Demuéstratelo a ti mismo con pequeñas victorias.</strong></li>
</ol>

<div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-green-900 mb-4">🏆 Recordatorios Finales</h3>
<ul class="list-disc list-inside text-green-800 space-y-2">
<li>Los hábitos son el interés compuesto de la superación personal</li>
<li>Si quieres mejores resultados, olvídate de establecer objetivos. Enfócate en tu sistema</li>
<li>No te elevas al nivel de tus objetivos. Caes al nivel de tus sistemas</li>
<li>El cambio más poderoso es el cambio de identidad</li>
</ul>
</div>

<blockquote class="border-l-4 border-green-500 pl-6 py-4 my-6 bg-green-50 rounded-r-lg italic text-xl text-green-900 text-center">
"Cada acción que tomas es un voto por el tipo de persona que deseas convertirte."
</blockquote>
</div>', 33);

-- Insert some sample chapters for other books (shorter content)
INSERT INTO book_chapters (book_id, chapter_number, title, content, estimated_reading_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440002', 1, 'Introducción al Trabajo Profundo', 
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Introducción al Trabajo Profundo</h1>
<p class="text-lg mb-6 text-gray-700">El trabajo profundo es la habilidad de enfocarse sin distracción en una tarea cognitivamente demandante.</p>
<p class="mb-4 text-gray-700">En nuestra economía actual, esta habilidad se está volviendo cada vez más valiosa y cada vez más rara.</p>
</div>', 25),

('550e8400-e29b-41d4-a716-446655440003', 1, 'Definición de la Nueva Rica', 
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Definición de la Nueva Rica</h1>
<p class="text-lg mb-6 text-gray-700">Los Nuevos Ricos (NR) son aquellos que abandonan el plan diferido de vida.</p>
<p class="mb-4 text-gray-700">En lugar de trabajar durante 40 años para disfrutar después, crean sistemas que les permiten vivir como millonarios sin tener millones.</p>
</div>', 20);

-- Verify the data was inserted correctly
SELECT 'Books inserted:' as info, COUNT(*) as count FROM books
UNION ALL
SELECT 'Chapters inserted:' as info, COUNT(*) as count FROM book_chapters;
