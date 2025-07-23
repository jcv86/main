"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, BookOpen, Clock, Star, Bookmark, Menu, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  getBookById,
  getBookChapters,
  updateUserBookProgress,
  mockBooks,
  type Book,
  type BookChapter,
  type UserBookProgress,
} from "@/lib/supabase-library"

const mockChapters: { [key: string]: BookChapter[] } = {
  "1": [
    {
      id: "ch-1-1",
      book_id: "1",
      chapter_number: 1,
      title: "Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia",
      content: `
        <div class="chapter-content">
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
        </div>
      `,
      estimated_reading_minutes: 35,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-2",
      book_id: "1",
      chapter_number: 2,
      title: "Cómo Funcionan Tus Hábitos",
      content: `
        <div class="chapter-content">
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
        </div>
      `,
      estimated_reading_minutes: 30,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-3",
      book_id: "1",
      chapter_number: 3,
      title: "La Primera Ley: Hazlo Obvio",
      content: `
        <div class="chapter-content">
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
        </div>
      `,
      estimated_reading_minutes: 32,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-4",
      book_id: "1",
      chapter_number: 4,
      title: "La Segunda Ley: Hazlo Atractivo",
      content: `
    <div class="chapter-content">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 4: La Segunda Ley - Hazlo Atractivo</h1>
      <p class="text-lg mb-6 text-gray-700">Los hábitos son un bucle de retroalimentación impulsado por la dopamina. Cuando la dopamina aumenta, también lo hace nuestra motivación para actuar.</p>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🧠 El Papel de la Dopamina</h2>
      <p class="mb-4 text-gray-700">La dopamina no solo se libera cuando experimentas placer, sino también cuando lo <strong>anticipas</strong>. Es la anticipación de una recompensa, no su cumplimiento, lo que nos pone en acción.</p>
      
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-purple-900 mb-4">🎯 Estrategias de Agrupación de Tentaciones</h3>
        <p class="text-purple-800 mb-3">Combina una acción que <em>necesitas</em> hacer con una acción que <em>quieres</em> hacer:</p>
        <ul class="list-disc list-inside text-purple-800 space-y-2">
          <li><strong>Ejercicio + Netflix:</strong> Solo puedes ver tu serie favorita mientras haces cardio</li>
          <li><strong>Llamadas + Caminar:</strong> Solo puedes hacer llamadas personales mientras caminas</li>
          <li><strong>Manicura + Finanzas:</strong> Solo puedes hacerte la manicura mientras revisas tus finanzas</li>
        </ul>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">👥 El Poder del Entorno Social</h2>
      <p class="mb-4 text-gray-700">Imitamos los hábitos de tres grupos en particular:</p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-semibold text-blue-900 mb-2">👨‍👩‍👧‍👦 Los Cercanos</h4>
          <p class="text-blue-800 text-sm">Familia, amigos y colegas</p>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="font-semibold text-green-900 mb-2">👑 Los Poderosos</h4>
          <p class="text-green-800 text-sm">Personas con estatus y prestigio</p>
        </div>
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 class="font-semibold text-orange-900 mb-2">🌍 Los Muchos</h4>
          <p class="text-orange-800 text-sm">La tribu, la mayoría</p>
        </div>
      </div>
      
      <blockquote class="border-l-4 border-purple-500 pl-6 py-4 my-6 bg-purple-50 rounded-r-lg italic text-lg text-purple-900">
        "Únete a una cultura donde tu comportamiento deseado es el comportamiento normal."
      </blockquote>
    </div>
  `,
      estimated_reading_minutes: 28,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-5",
      book_id: "1",
      chapter_number: 5,
      title: "La Tercera Ley: Hazlo Fácil",
      content: `
    <div class="chapter-content">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 5: La Tercera Ley - Hazlo Fácil</h1>
      <p class="text-lg mb-6 text-gray-700">Los hábitos humanos siguen la Ley del Menor Esfuerzo. Naturalmente gravitamos hacia la opción que requiere la menor cantidad de trabajo.</p>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">⚡ La Regla de los Dos Minutos</h2>
      <p class="mb-4 text-gray-700">Cuando empiezas un nuevo hábito, debería tomar menos de dos minutos hacer.</p>
      
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-green-900 mb-4">🎯 Ejemplos de la Regla de los 2 Minutos</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-green-800">"Leer antes de dormir"</span>
            <span class="text-green-600">→</span>
            <span class="text-green-800 font-medium">"Leer una página"</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-green-800">"Hacer ejercicio 30 minutos"</span>
            <span class="text-green-600">→</span>
            <span class="text-green-800 font-medium">"Ponerme los zapatos deportivos"</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-green-800">"Estudiar para la clase"</span>
            <span class="text-green-600">→</span>
            <span class="text-green-800 font-medium">"Abrir mis apuntes"</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-green-800">"Meditar 10 minutos"</span>
            <span class="text-green-600">→</span>
            <span class="text-green-800 font-medium">"Respirar profundo 3 veces"</span>
          </div>
        </div>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🏗️ Preparación del Entorno</h2>
      <p class="mb-4 text-gray-700">Puedes romper un mal hábito, pero es poco probable que lo olvides. Una vez que se forma el surco mental de un hábito, está prácticamente ahí para siempre.</p>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-red-900 mb-4">🚫 Cómo Romper un Mal Hábito</h3>
        <ul class="list-disc list-inside text-red-800 space-y-2">
          <li><strong>Aumenta la fricción:</strong> Haz que sea más difícil hacer el mal hábito</li>
          <li><strong>Usa un dispositivo de compromiso:</strong> Una elección que controla tus acciones futuras</li>
          <li><strong>Cambia el entorno:</strong> Elimina las señales que desencadenan el mal hábito</li>
          <li><strong>Encuentra un compañero de responsabilidad:</strong> Alguien que te mantenga en el camino</li>
        </ul>
      </div>
      
      <blockquote class="border-l-4 border-green-500 pl-6 py-4 my-6 bg-green-50 rounded-r-lg italic text-lg text-green-900">
        "La diferencia entre un buen día y un mal día a menudo es unas pocas decisiones productivas y enfocadas."
      </blockquote>
    </div>
  `,
      estimated_reading_minutes: 26,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-6",
      book_id: "1",
      chapter_number: 6,
      title: "La Cuarta Ley: Hazlo Satisfactorio",
      content: `
    <div class="chapter-content">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 6: La Cuarta Ley - Hazlo Satisfactorio</h1>
      <p class="text-lg mb-6 text-gray-700">Estamos más propensos a repetir un comportamiento cuando la experiencia es satisfactoria. El placer enseña a tu cerebro que vale la pena recordar y repetir una acción.</p>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎁 La Importancia de la Recompensa Inmediata</h2>
      <p class="mb-4 text-gray-700">El cerebro humano evolucionó para priorizar las recompensas inmediatas sobre las recompensas retrasadas. Esta tendencia se llama <strong>descuento temporal</strong>.</p>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">💡 Estrategias de Recompensa Inmediata</h3>
        <ul class="list-disc list-inside text-blue-800 space-y-2">
          <li><strong>Cuenta de ahorros para vacaciones:</strong> Transfiere $50 cada vez que no compres comida para llevar</li>
          <li><strong>Ritual de celebración:</strong> Haz una pequeña celebración después de completar un hábito</li>
          <li><strong>Seguimiento visual:</strong> Marca un calendario cada día que completes tu hábito</li>
          <li><strong>Recompensa social:</strong> Comparte tu progreso con amigos o en redes sociales</li>
        </ul>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">📊 El Poder del Seguimiento de Hábitos</h2>
      <p class="mb-4 text-gray-700">El seguimiento de hábitos es poderoso porque aprovecha múltiples leyes del cambio de comportamiento. Es obvio, atractivo y satisfactorio.</p>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-yellow-900 mb-4">📈 Beneficios del Seguimiento</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium text-yellow-800 mb-2">✅ Crea conciencia</h4>
            <p class="text-yellow-700 text-sm">Te ayuda a darte cuenta de lo que realmente estás haciendo</p>
          </div>
          <div>
            <h4 class="font-medium text-yellow-800 mb-2">🎯 Proporciona motivación</h4>
            <p class="text-yellow-700 text-sm">Es satisfactorio ver tu progreso visual</p>
          </div>
          <div>
            <h4 class="font-medium text-yellow-800 mb-2">📋 Forma el hábito en sí</h4>
            <p class="text-yellow-700 text-sm">El acto de seguimiento se convierte en su propio hábito</p>
          </div>
          <div>
            <h4 class="font-medium text-yellow-800 mb-2">🔄 Crea un bucle de retroalimentación</h4>
            <p class="text-yellow-700 text-sm">Te permite ajustar y mejorar continuamente</p>
          </div>
        </div>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🚨 Nunca Falles Dos Veces</h2>
      <p class="mb-4 text-gray-700">La primera falla es un accidente. La segunda falla es el comienzo de un nuevo patrón.</p>
      
      <blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-lg text-blue-900">
        "No rompas la cadena" es una poderosa regla mental, pero "nunca falles dos veces" es aún mejor.
      </blockquote>
    </div>
  `,
      estimated_reading_minutes: 30,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-7",
      book_id: "1",
      chapter_number: 7,
      title: "Tácticas Avanzadas: Cómo Pasar de Ser Bueno a Ser Genial",
      content: `
    <div class="chapter-content">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 7: Tácticas Avanzadas</h1>
      <p class="text-lg mb-6 text-gray-700">Una vez que has construido los hábitos fundamentales, puedes combinarlos en rutinas más complejas para desbloquear niveles más altos de rendimiento.</p>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎯 La Regla de Goldilocks</h2>
      <p class="mb-4 text-gray-700">Los humanos experimentan máxima motivación cuando trabajan en tareas que están justo en el borde de sus habilidades actuales. No demasiado difícil. No demasiado fácil. Justo bien.</p>
      
      <div class="bg-gradient-to-r from-red-50 to-yellow-50 to-green-50 border border-yellow-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">⚖️ La Zona de Dificultad Óptima</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 bg-red-400 rounded-full"></div>
            <span class="text-red-700"><strong>Demasiado Difícil:</strong> Ansiedad y frustración</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 bg-green-400 rounded-full"></div>
            <span class="text-green-700"><strong>Justo Bien:</strong> Flujo y compromiso máximo</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 bg-blue-400 rounded-full"></div>
            <span class="text-blue-700"><strong>Demasiado Fácil:</strong> Aburrimiento y desinterés</span>
          </div>
        </div>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔄 La Importancia de la Reflexión y Revisión</h2>
      <p class="mb-4 text-gray-700">La reflexión y revisión es un proceso para permanecer consciente de tu rendimiento a lo largo del tiempo.</p>
      
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-purple-900 mb-4">📝 Preguntas de Reflexión Anual</h3>
        <ul class="list-disc list-inside text-purple-800 space-y-2">
          <li>¿Qué salió bien este año?</li>
          <li>¿Qué no salió tan bien?</li>
          <li>¿Qué aprendí?</li>
          <li>¿Cómo puedo mejorar estos hábitos el próximo año?</li>
          <li>¿Qué quiero lograr en los próximos 12 meses?</li>
        </ul>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🏆 Cómo Mantener la Motivación a Largo Plazo</h2>
      <p class="mb-4 text-gray-700">Los profesionales se adhieren al horario; los aficionados dejan que la vida se interponga en el camino.</p>
      
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">💪 Estrategias para la Consistencia</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium text-gray-800 mb-2">🎭 Cambia la historia que te cuentas</h4>
            <p class="text-gray-600 text-sm">En lugar de "tengo que", di "llego a"</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-800 mb-2">🔄 Abraza el aburrimiento</h4>
            <p class="text-gray-600 text-sm">La maestría requiere práctica incluso cuando no tienes ganas</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-800 mb-2">📊 Enfócate en el proceso</h4>
            <p class="text-gray-600 text-sm">Los resultados son un indicador rezagado del proceso</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-800 mb-2">🎯 Mantén la identidad</h4>
            <p class="text-gray-600 text-sm">Pregúntate: "¿Qué haría una persona como yo?"</p>
          </div>
        </div>
      </div>
      
      <blockquote class="border-l-4 border-purple-500 pl-6 py-4 my-6 bg-purple-50 rounded-r-lg italic text-lg text-purple-900">
        "El secreto para obtener resultados que duren es nunca dejar de hacer mejoras."
      </blockquote>
    </div>
  `,
      estimated_reading_minutes: 33,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-1-8",
      book_id: "1",
      chapter_number: 8,
      title: "Conclusión: El Secreto de los Resultados que Duran",
      content: `
    <div class="chapter-content">
      <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 8: El Secreto de los Resultados que Duran</h1>
      <p class="text-lg mb-6 text-gray-700">El cambio verdadero viene de cientos de pequeñas decisiones: hacer dos flexiones al día, despertar cinco minutos antes, o mantener una conversación corta.</p>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🌟 Los Hábitos y la Identidad</h2>
      <p class="mb-4 text-gray-700">En última instancia, tus hábitos importan porque te ayudan a convertirte en el tipo de persona que deseas ser. Son el canal a través del cual desarrollas tus creencias más profundas sobre ti mismo.</p>
      
      <div class="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">🔄 El Ciclo de Identidad y Hábitos</h3>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 class="font-medium text-blue-800">Decide el tipo de persona que quieres ser</h4>
              <p class="text-blue-600 text-sm">¿Qué tipo de persona podría obtener el resultado que quiero?</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 class="font-medium text-purple-800">Demuéstratelo con pequeñas victorias</h4>
              <p class="text-purple-600 text-sm">¿Qué haría esa persona todos los días?</p>
            </div>
          </div>
        </div>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">📋 Resumen de las Cuatro Leyes</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-green-900 mb-4">✅ Crear un Buen Hábito</h3>
          <ul class="space-y-2 text-green-800">
            <li><strong>1ª Ley:</strong> Hazlo obvio</li>
            <li><strong>2ª Ley:</strong> Hazlo atractivo</li>
            <li><strong>3ª Ley:</strong> Hazlo fácil</li>
            <li><strong>4ª Ley:</strong> Hazlo satisfactorio</li>
          </ul>
        </div>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-red-900 mb-4">❌ Romper un Mal Hábito</h3>
          <ul class="space-y-2 text-red-800">
            <li><strong>Inversión de la 1ª:</strong> Hazlo invisible</li>
            <li><strong>Inversión de la 2ª:</strong> Hazlo poco atractivo</li>
            <li><strong>Inversión de la 3ª:</strong> Hazlo difícil</li>
            <li><strong>Inversión de la 4ª:</strong> Hazlo insatisfactorio</li>
          </ul>
        </div>
      </div>
      
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🚀 Tu Plan de Acción</h2>
      <p class="mb-4 text-gray-700">Ahora que conoces las cuatro leyes, es hora de ponerlas en práctica. Aquí tienes un plan de acción simple:</p>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
        <h3 class="text-lg font-semibold text-yellow-900 mb-4">📝 Pasos Siguientes</h3>
        <ol class="list-decimal list-inside text-yellow-800 space-y-3">
          <li><strong>Elige un hábito:</strong> Empieza con algo pequeño y específico</li>
          <li><strong>Aplica las cuatro leyes:</strong> Hazlo obvio, atractivo, fácil y satisfactorio</li>
          <li><strong>Sigue tu progreso:</strong> Usa un rastreador de hábitos simple</li>
          <li><strong>Sé paciente:</strong> Los cambios toman tiempo, pero son compuestos</li>
          <li><strong>Celebra las pequeñas victorias:</strong> Reconoce cada paso hacia adelante</li>
        </ol>
      </div>
      
      <div class="bg-gray-900 text-white rounded-lg p-8 my-8 text-center">
        <h3 class="text-2xl font-bold mb-4">🎯 Recuerda</h3>
        <p class="text-lg mb-4">Los hábitos no restringen la libertad. La crean.</p>
        <p class="text-gray-300">Sin buenos hábitos, siempre estarás luchando por encontrar tiempo para las cosas que importan.</p>
      </div>
      
      <blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-xl text-blue-900 text-center">
        "Cada acción que tomas es un voto por el tipo de persona que deseas convertirte."
      </blockquote>
      
      <div class="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 class="text-xl font-bold text-gray-900 mb-2">¡Felicitaciones!</h3>
        <p class="text-gray-700">Has completado "Hábitos Atómicos". Ahora es momento de poner en práctica lo aprendido.</p>
      </div>
    </div>
  `,
      estimated_reading_minutes: 25,
      created_at: new Date().toISOString(),
    },
  ],
  "2": [
    {
      id: "ch-2-1",
      book_id: "2",
      chapter_number: 1,
      title: "Trabajo Profundo: Una Habilidad Valiosa",
      content: `
      <div class="chapter-content">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Trabajo Profundo - Una Habilidad Valiosa</h1>
        <p class="text-lg mb-6 text-gray-700">El trabajo profundo es la habilidad de enfocarse sin distracción en una tarea cognitivamente demandante. Es una habilidad que permite dominar rápidamente información complicada y producir mejores resultados en menos tiempo.</p>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎯 Definiciones Fundamentales</h2>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">📚 Conceptos Clave</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-blue-800 mb-2">Trabajo Profundo</h4>
              <p class="text-blue-700 text-sm">Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite.</p>
            </div>
            <div>
              <h4 class="font-medium text-blue-800 mb-2">Trabajo Superficial</h4>
              <p class="text-blue-700 text-sm">Tareas de estilo logístico, a menudo realizadas mientras se está distraído. Estas tareas no crean mucho valor nuevo y son fáciles de replicar.</p>
            </div>
          </div>
        </div>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">💡 La Hipótesis del Trabajo Profundo</h2>
        <p class="mb-4 text-gray-700">La capacidad de realizar trabajo profundo se está volviendo cada vez más rara al mismo tiempo que se vuelve cada vez más valiosa en nuestra economía.</p>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-yellow-900 mb-4">⚡ Por qué el Trabajo Profundo es Valioso</h3>
          <ul class="list-disc list-inside text-yellow-800 space-y-2">
            <li><strong>Aprendizaje rápido:</strong> Dominar rápidamente cosas difíciles</li>
            <li><strong>Producción de élite:</strong> Producir a un nivel de élite, tanto en calidad como en velocidad</li>
            <li><strong>Ventaja competitiva:</strong> Diferenciarse en un mercado saturado</li>
            <li><strong>Satisfacción personal:</strong> Encontrar significado y propósito en el trabajo</li>
          </ul>
        </div>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🌊 El Gran Reordenamiento</h2>
        <p class="mb-4 text-gray-700">Nuestra economía se está moviendo rápidamente hacia la automatización y la globalización. En este nuevo panorama, tres grupos tendrán una ventaja particular:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="font-semibold text-green-900 mb-2">🤖 Los que trabajan bien con máquinas inteligentes</h4>
            <p class="text-green-800 text-sm">Aquellos que pueden trabajar creativamente con tecnología avanzada</p>
          </div>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 class="font-semibold text-purple-900 mb-2">⭐ Los mejores en lo que hacen</h4>
            <p class="text-purple-800 text-sm">Los superstars en sus campos específicos</p>
          </div>
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 class="font-semibold text-orange-900 mb-2">💰 Los que tienen acceso al capital</h4>
            <p class="text-orange-800 text-sm">Aquellos que pueden invertir en las nuevas tecnologías</p>
          </div>
        </div>
        
        <blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-lg text-blue-900">
          "Para tener éxito debes producir lo mejor que puedas producir, un objetivo que requiere trabajo profundo."
        </blockquote>
      </div>
    `,
      estimated_reading_minutes: 31,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-2-2",
      book_id: "2",
      chapter_number: 2,
      title: "El Trabajo Profundo es Raro",
      content: `
      <div class="chapter-content">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 2: El Trabajo Profundo es Raro</h1>
        <p class="text-lg mb-6 text-gray-700">A pesar de la creciente evidencia de que el trabajo profundo es valioso, muchas organizaciones están adoptando prácticas que lo destruyen sistemáticamente.</p>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">📧 La Tiranía del Email</h2>
        <p class="mb-4 text-gray-700">El trabajador promedio revisa el email cada 6 minutos. Esta fragmentación constante de la atención hace que el trabajo profundo sea prácticamente imposible.</p>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-red-900 mb-4">⚠️ Los Destructores del Trabajo Profundo</h3>
          <ul class="list-disc list-inside text-red-800 space-y-2">
            <li><strong>Oficinas abiertas:</strong> Interrupciones constantes y ruido de fondo</li>
            <li><strong>Mensajería instantánea:</strong> Expectativa de respuesta inmediata</li>
            <li><strong>Reuniones excesivas:</strong> Fragmentación del tiempo disponible</li>
            <li><strong>Redes sociales:</strong> Distracción constante y cambio de contexto</li>
            <li><strong>Multitarea:</strong> Ilusión de productividad que reduce la calidad</li>
          </ul>
        </div>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🏢 El Principio del Menor Denominador Común</h2>
        <p class="mb-4 text-gray-700">En ausencia de indicadores claros de lo que significa ser productivo y valioso en el trabajo, muchos trabajadores recurren a un indicador industrial: hacer muchas cosas de manera visible.</p>
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-yellow-900 mb-4">🎭 El Teatro de la Productividad</h3>
          <p class="text-yellow-800 mb-3">Comportamientos que parecen productivos pero que en realidad no lo son:</p>
          <ul class="list-disc list-inside text-yellow-800 space-y-2">
            <li>Responder emails inmediatamente</li>
            <li>Estar siempre disponible en chat</li>
            <li>Asistir a todas las reuniones</li>
            <li>Trabajar largas horas visiblemente</li>
            <li>Estar constantemente "ocupado"</li>
          </ul>
        </div>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🧠 El Costo del Cambio de Contexto</h2>
        <p class="mb-4 text-gray-700">Cuando cambias de una tarea A a una tarea B, tu atención no sigue inmediatamente. Un residuo de tu atención permanece atascado pensando en la tarea original.</p>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-purple-900 mb-4">⏱️ Residuo de Atención</h3>
          <p class="text-purple-800 mb-3">Sophie Leroy descubrió que cuando cambias de tarea:</p>
          <ul class="list-disc list-inside text-purple-800 space-y-2">
            <li>Parte de tu atención permanece en la tarea anterior</li>
            <li>Este residuo se intensifica si la tarea anterior no estaba completa</li>
            <li>Puede tomar hasta 23 minutos recuperar la concentración completa</li>
            <li>El rendimiento en la nueva tarea se ve significativamente reducido</li>
          </ul>
        </div>
        
        <blockquote class="border-l-4 border-red-500 pl-6 py-4 my-6 bg-red-50 rounded-r-lg italic text-lg text-red-900">
          "La claridad sobre lo que importa proporciona claridad sobre lo que no importa."
        </blockquote>
      </div>
    `,
      estimated_reading_minutes: 30,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-2-3",
      book_id: "2",
      chapter_number: 3,
      title: "El Trabajo Profundo es Significativo",
      content: `
      <div class="chapter-content">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 3: El Trabajo Profundo es Significativo</h1>
        <p class="text-lg mb-6 text-gray-700">El trabajo profundo no es solo económicamente valioso, sino que también puede ser una fuente de gran satisfacción personal y significado en nuestras vidas.</p>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🧘 La Perspectiva Neurológica</h2>
        <p class="mb-4 text-gray-700">Los neurocientíficos han descubierto que el estado de concentración profunda activa los mismos circuitos cerebrales asociados con la felicidad y el bienestar.</p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">🧠 Beneficios Neurológicos del Trabajo Profundo</h3>
          <ul class="list-disc list-inside text-blue-800 space-y-2">
            <li><strong>Liberación de dopamina:</strong> Sensación natural de recompensa y satisfacción</li>
            <li><strong>Reducción del cortisol:</strong> Menor estrés y ansiedad</li>
            <li><strong>Fortalecimiento de la mielina:</strong> Mejora de las conexiones neuronales</li>
            <li><strong>Neuroplasticidad:</strong> Mayor capacidad de aprendizaje y adaptación</li>
          </ul>
        </div>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎨 La Perspectiva Psicológica</h2>
        <p class="mb-4 text-gray-700">Mihaly Csikszentmihalyi descubrió que las personas son más felices cuando están en un estado de "flujo" - completamente absortas en una actividad desafiante.</p>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-green-900 mb-4">🌊 Características del Estado de Flujo</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-green-800 mb-2">🎯 Concentración total</h4>
              <p class="text-green-700 text-sm">Atención completamente enfocada en la tarea</p>
            </div>
            <div>
              <h4 class="font-medium text-green-800 mb-2">⚖️ Equilibrio desafío-habilidad</h4>
              <p class="text-green-700 text-sm">La tarea es desafiante pero alcanzable</p>
            </div>
            <div>
              <h4 class="font-medium text-green-800 mb-2">🎭 Pérdida de autoconciencia</h4>
              <p class="text-green-700 text-sm">Desaparece la preocupación por uno mismo</p>
            </div>
            <div>
              <h4 class="font-medium text-green-800 mb-2">⏰ Distorsión del tiempo</h4>
              <p class="text-green-700 text-sm">El tiempo pasa sin que te des cuenta</p>
            </div>
          </div>
        </div>
        
        <blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-lg text-blue-900">
          "Una vida profunda es una vida buena, en cualquier sentido que importe."
        </blockquote>
      </div>
    `,
      estimated_reading_minutes: 28,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-2-4",
      book_id: "2",
      chapter_number: 4,
      title: "Regla #1: Trabaja Profundamente",
      content: `
      <div class="chapter-content">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 4: Regla #1 - Trabaja Profundamente</h1>
        <p class="text-lg mb-6 text-gray-700">Desarrollar una práctica de trabajo profundo requiere más que buenas intenciones. Necesitas estrategias específicas y sistemáticas para transformar el trabajo profundo de una aspiración a una realidad regular en tu vida profesional.</p>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🏗️ Filosofías de Trabajo Profundo</h2>
        <p class="mb-4 text-gray-700">No existe un enfoque único para integrar el trabajo profundo en tu vida. Debes encontrar una filosofía que se ajuste a tus circunstancias específicas.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">🏔️ Filosofía Monástica</h3>
            <p class="text-blue-800 mb-3">Eliminar o minimizar radicalmente las obligaciones superficiales.</p>
            <ul class="list-disc list-inside text-blue-700 text-sm space-y-1">
              <li>Aislamiento total de distracciones</li>
              <li>Enfoque en una sola actividad de alto valor</li>
              <li>Ejemplo: Donald Knuth (no usa email)</li>
            </ul>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-green-900 mb-4">🔄 Filosofía Bimodal</h3>
            <p class="text-green-800 mb-3">Dividir el tiempo entre períodos de trabajo profundo y todo lo demás.</p>
            <ul class="list-disc list-inside text-green-700 text-sm space-y-1">
              <li>Bloques de tiempo dedicados exclusivamente</li>
              <li>Mínimo de un día completo por sesión</li>
              <li>Ejemplo: Carl Jung (mañanas en torre, tardes con pacientes)</li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-yellow-900 mb-4">⏰ Filosofía Rítmica</h3>
            <p class="text-yellow-800 mb-3">Establecer un ritmo regular para el trabajo profundo.</p>
            <ul class="list-disc list-inside text-yellow-700 text-sm space-y-1">
              <li>Misma hora todos los días</li>
              <li>Crear una cadena de hábitos</li>
              <li>Ejemplo: Jerry Seinfeld (escribir chistes diariamente)</li>
            </ul>
          </div>
          
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-purple-900 mb-4">🎯 Filosofía Periodística</h3>
            <p class="text-purple-800 mb-3">Cambiar al modo de trabajo profundo cuando sea posible.</p>
            <ul class="list-disc list-inside text-purple-700 text-sm space-y-1">
              <li>Flexibilidad total en el horario</li>
              <li>Requiere práctica para cambiar rápidamente</li>
              <li>Ejemplo: Walter Isaacson (escribir entre reuniones)</li>
            </ul>
          </div>
        </div>
        
        <blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-lg text-blue-900">
          "El trabajo profundo no es un hábito como revisar el email - es una habilidad que debe ser entrenada."
        </blockquote>
      </div>
    `,
      estimated_reading_minutes: 32,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-2-5",
      book_id: "2",
      chapter_number: 5,
      title: "Regla #2: Abraza el Aburrimiento",
      content: `
      <div class="chapter-content">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 5: Regla #2 - Abraza el Aburrimiento</h1>
        <p class="text-lg mb-6 text-gray-700">La capacidad de concentrarse intensamente es una habilidad que debe ser entrenada. No puedes esperar poder concentrarte profundamente si pasas el resto de tu tiempo huyendo de la menor insinuación de aburrimiento.</p>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🧠 El Músculo de la Concentración</h2>
        <p class="mb-4 text-gray-700">Tu capacidad de concentración es como un músculo: se fortalece con el uso regular y se debilita con la negligencia.</p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">💪 Entrenamiento de la Atención</h3>
          <p class="text-blue-800 mb-3">Así como no puedes esperar correr un maratón sin entrenamiento, no puedes esperar concentrarte profundamente sin práctica:</p>
          <ul class="list-disc list-inside text-blue-700 space-y-2">
            <li><strong>Consistencia:</strong> Practica la concentración regularmente</li>
            <li><strong>Progresión:</strong> Aumenta gradualmente la duración e intensidad</li>
            <li><strong>Resistencia:</strong> Aprende a resistir las distracciones</li>
            <li><strong>Recuperación:</strong> Permite períodos de descanso mental</li>
          </ul>
        </div>
        
        <blockquote class="border-l-4 border-purple-500 pl-6 py-4 my-6 bg-purple-50 rounded-r-lg italic text-lg text-purple-900">
          "El aburrimiento es el espacio donde nace la creatividad."
        </blockquote>
      </div>
    `,
      estimated_reading_minutes: 29,
      created_at: new Date().toISOString(),
    },
    {
      id: "ch-2-6",
      book_id: "2",
      chapter_number: 6,
      title: "Regla #3: Abandona las Redes Sociales",
      content: `
      <div class="chapter-content">
        <h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 6: Regla #3 - Abandona las Redes Sociales</h1>
        <p class="text-lg mb-6 text-gray-700">Las redes sociales están diseñadas para ser adictivas. Para trabajar profundamente, debes ser más selectivo sobre las herramientas tecnológicas que permites en tu vida profesional y personal.</p>
        
        <h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🎣 La Economía de la Atención</h2>
        <p class="mb-4 text-gray-700">Las empresas de redes sociales están en el negocio de capturar y vender tu atención. Utilizan las técnicas más sofisticadas de la psicología conductual para mantenerte enganchado.</p>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
          <h3 class="text-lg font-semibold text-red-900 mb-4">🧠 Técnicas de Manipulación Psicológica</h3>
          <ul class="list-disc list-inside text-red-800 space-y-2">
            <li><strong>Refuerzo intermitente:</strong> Recompensas impredecibles que crean adicción</li>
            <li><strong>FOMO (Fear of Missing Out):</strong> Miedo a perderse algo importante</li>
            <li><strong>Validación social:</strong> Likes y comentarios como dopamina instantánea</li>
            <li><strong>Scroll infinito:</strong> Nunca hay un punto natural de parada</li>
            <li><strong>Notificaciones push:</strong> Interrupciones constantes para traerte de vuelta</li>
          </ul>
        </div>
        
        <blockquote class="border-l-4 border-red-500 pl-6 py-4 my-6 bg-red-50 rounded-r-lg italic text-lg text-red-900">
          "Las herramientas son solo herramientas. Depende de ti decidir si te sirven o si tú les sirves a ellas."
        </blockquote>
      </div>
    `,
      estimated_reading_minutes: 25,
      created_at: new Date().toISOString(),
    },
  ],
}

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<BookChapter[]>([])
  const [currentChapter, setCurrentChapter] = useState<BookChapter | null>(null)
  const [userProgress, setUserProgress] = useState<UserBookProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (bookId) {
      loadBookData()
    }
  }, [bookId])

  const loadBookData = async () => {
    try {
      setLoading(true)

      // Try to find book in mock data first (for development)
      let bookData = mockBooks.find((b) => b.id === bookId)
      let chaptersData = mockChapters[bookId] || []

      if (!bookData) {
        // Try to load from Supabase
        const { data: supabaseBook, error: bookError } = await getBookById(bookId)
        if (!bookError && supabaseBook) {
          bookData = supabaseBook
        }
      }

      if (!bookData) {
        console.error("Book not found for ID:", bookId)
        setLoading(false)
        return
      }

      setBook(bookData)

      // Load chapters
      if (chaptersData.length === 0) {
        const { data: supabaseChapters, error: chaptersError } = await getBookChapters(bookId)
        if (!chaptersError && supabaseChapters) {
          chaptersData = supabaseChapters
        }
      }

      if (chaptersData.length === 0) {
        // Create a default chapter if none exist
        chaptersData = [
          {
            id: `default-${bookId}`,
            book_id: bookId,
            chapter_number: 1,
            title: "Introducción",
            content: `
              <div class="chapter-content">
                <h1 class="text-3xl font-bold mb-6 text-gray-900">Introducción</h1>
                <p class="text-lg mb-6 text-gray-700">Bienvenido a "${bookData.title}" por ${bookData.author}.</p>
                <p class="mb-4 text-gray-700">${bookData.description}</p>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                  <h3 class="text-lg font-semibold text-blue-900 mb-4">📚 Sobre este libro</h3>
                  <ul class="list-disc list-inside text-blue-800 space-y-2">
                    <li><strong>Categoría:</strong> ${bookData.category}</li>
                    <li><strong>Dificultad:</strong> ${bookData.difficulty}</li>
                    <li><strong>Tiempo de lectura:</strong> ${bookData.reading_time}</li>
                    <li><strong>Año de publicación:</strong> ${bookData.published_year}</li>
                  </ul>
                </div>
              </div>
            `,
            estimated_reading_minutes: 15,
            created_at: new Date().toISOString(),
          },
        ]
      }

      setChapters(chaptersData)
      setCurrentChapter(chaptersData[0])

      // Load user progress (mock for now)
      const mockProgress: UserBookProgress = {
        id: "1",
        user_id: "demo-user",
        book_id: bookId,
        progress_percentage: Math.round((1 / chaptersData.length) * 100),
        current_chapter: 1,
        total_chapters: chaptersData.length,
        reading_time_minutes: 45,
        started_at: new Date().toISOString(),
        last_read_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setUserProgress(mockProgress)
    } catch (error) {
      console.error("Error loading book data:", error)
    } finally {
      setLoading(false)
    }
  }

  const navigateToChapter = (chapterNumber: number) => {
    const chapter = chapters.find((c) => c.chapter_number === chapterNumber)
    if (chapter) {
      setCurrentChapter(chapter)
      setSidebarOpen(false)

      // Update progress
      if (userProgress) {
        const newProgress = {
          ...userProgress,
          current_chapter: chapterNumber,
          progress_percentage: Math.round((chapterNumber / chapters.length) * 100),
          last_read_at: new Date().toISOString(),
        }
        setUserProgress(newProgress)

        // Update in database (would work with real auth)
        updateUserBookProgress("demo-user", bookId, {
          current_chapter: chapterNumber,
          progress_percentage: newProgress.progress_percentage,
        })
      }
    }
  }

  const goToPreviousChapter = () => {
    if (currentChapter && currentChapter.chapter_number > 1) {
      navigateToChapter(currentChapter.chapter_number - 1)
    }
  }

  const goToNextChapter = () => {
    if (currentChapter && currentChapter.chapter_number < chapters.length) {
      navigateToChapter(currentChapter.chapter_number + 1)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "Avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Productividad":
        return "bg-blue-100 text-blue-800"
      case "Liderazgo":
        return "bg-purple-100 text-purple-800"
      case "Habilidades Blandas":
        return "bg-green-100 text-green-800"
      case "Desarrollo Personal":
        return "bg-pink-100 text-pink-800"
      case "Negocios":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-12 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book || !currentChapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Libro no encontrado</h3>
          <p class="text-gray-600 mb-4">El libro que buscas no existe o no está disponible</p>
          <Link href="/library">
            <Button>Volver a la biblioteca</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Biblioteca
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="hidden md:block">
                <h1 className="font-semibold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {userProgress && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-gray-600">Progreso:</span>
                  <Progress value={userProgress.progress_percentage} className="w-24" />
                  <span className="text-sm font-medium">{userProgress.progress_percentage}%</span>
                </div>
              )}

              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Tabla de Contenidos</SheetTitle>
                    <SheetDescription>Navega por los capítulos del libro</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <TableOfContents
                      chapters={chapters}
                      currentChapter={currentChapter}
                      onChapterSelect={navigateToChapter}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={book.cover_url || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoryColor(book.category)}>{book.category}</Badge>
                    <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {book.reading_time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {book.rating}
                    </div>
                  </div>

                  {userProgress && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>{userProgress.progress_percentage}%</span>
                      </div>
                      <Progress value={userProgress.progress_percentage} />
                    </div>
                  )}

                  <Separator />

                  <TableOfContents
                    chapters={chapters}
                    currentChapter={currentChapter}
                    onChapterSelect={navigateToChapter}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Capítulo {currentChapter.chapter_number}: {currentChapter.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      {currentChapter.estimated_reading_minutes} min de lectura
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t">
                  <Button
                    variant="outline"
                    onClick={goToPreviousChapter}
                    disabled={currentChapter.chapter_number === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  <span className="text-sm text-gray-600">
                    {currentChapter.chapter_number} de {chapters.length}
                  </span>

                  <Button onClick={goToNextChapter} disabled={currentChapter.chapter_number === chapters.length}>
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableOfContents({
  chapters,
  currentChapter,
  onChapterSelect,
}: {
  chapters: BookChapter[]
  currentChapter: BookChapter
  onChapterSelect: (chapterNumber: number) => void
}) {
  return (
    <div>
      <h4 className="font-medium text-sm text-gray-900 mb-3">Tabla de Contenidos</h4>
      <div className="space-y-1">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter.chapter_number)}
            className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
              currentChapter.id === chapter.id
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-400 mt-0.5 flex-shrink-0">{chapter.chapter_number}</span>
              <span className="line-clamp-2">{chapter.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
