-- Insert Cultura General Test

INSERT INTO public.a4_gamified_tests (titulo, descripcion, categoria, nivel, puntos, badge_name, preguntas, tiempo_limite_minutos, is_active)
VALUES 
(
  'Cultura General',
  'Evalúa tu conocimiento sobre historia, ciencia, cultura y actualidad',
  'Cultura General',
  'intermedio',
  25,
  'Polímata',
  '[
    {
      "id": "cg1",
      "pregunta": "¿En qué año se firmó la Declaración Universal de los Derechos Humanos?",
      "opciones": ["1945", "1948", "1950", "1952"],
      "respuesta_correcta": 1,
      "explicacion": "La Declaración Universal de los Derechos Humanos fue adoptada el 10 de diciembre de 1948 por las Naciones Unidas."
    },
    {
      "id": "cg2",
      "pregunta": "¿Cuál es el planeta más grande del sistema solar?",
      "opciones": ["Saturno", "Neptuno", "Júpiter", "Urano"],
      "respuesta_correcta": 2,
      "explicacion": "Júpiter es el planeta más grande del sistema solar, con un diámetro ecuatorial de 142,984 km."
    },
    {
      "id": "cg3",
      "pregunta": "¿Quién escribió 'Don Quijote de la Mancha'?",
      "opciones": ["Federico García Lorca", "Miguel de Cervantes", "Pablo Neruda", "Jorge Luis Borges"],
      "respuesta_correcta": 1,
      "explicacion": "Miguel de Cervantes escribió 'Don Quijote de la Mancha', publicado en 1605, considerada una de las obras maestras de la literatura mundial."
    },
    {
      "id": "cg4",
      "pregunta": "¿En qué año se cayó el Muro de Berlín?",
      "opciones": ["1987", "1988", "1989", "1990"],
      "respuesta_correcta": 2,
      "explicacion": "El Muro de Berlín cayó el 9 de noviembre de 1989, marcando el inicio del fin de la Guerra Fría."
    },
    {
      "id": "cg5",
      "pregunta": "¿Cuál es el río más largo de América del Sur?",
      "opciones": ["Orinoco", "Amazonas", "Paraná", "Magdalena"],
      "respuesta_correcta": 1,
      "explicacion": "El Amazonas es el río más largo de América del Sur (y del mundo), con aproximadamente 6,800 km de largo."
    },
    {
      "id": "cg6",
      "pregunta": "¿Cuántos continentes existen?",
      "opciones": ["5", "6", "7", "8"],
      "respuesta_correcta": 2,
      "explicacion": "Hay 7 continentes: América del Norte, América del Sur, Europa, África, Asia, Oceanía y Antártida."
    },
    {
      "id": "cg7",
      "pregunta": "¿Quién fue el primer presidente de los Estados Unidos?",
      "opciones": ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
      "respuesta_correcta": 1,
      "explicacion": "George Washington fue el primer presidente de los Estados Unidos, sirviendo de 1789 a 1797."
    },
    {
      "id": "cg8",
      "pregunta": "¿En qué año ocurrió la Revolución Francesa?",
      "opciones": ["1776", "1787", "1789", "1791"],
      "respuesta_correcta": 2,
      "explicacion": "La Revolución Francesa comenzó en 1789 con la toma de la Bastilla el 14 de julio."
    },
    {
      "id": "cg9",
      "pregunta": "¿Cuál es el órgano más grande del cuerpo humano?",
      "opciones": ["Corazón", "Cerebro", "Piel", "Pulmones"],
      "respuesta_correcta": 2,
      "explicacion": "La piel es el órgano más grande del cuerpo humano, cubriendo aproximadamente 1.5-2 metros cuadrados."
    },
    {
      "id": "cg10",
      "pregunta": "¿En qué país se encuentra la Torre Eiffel?",
      "opciones": ["Italia", "Alemania", "Francia", "España"],
      "respuesta_correcta": 2,
      "explicacion": "La Torre Eiffel se encuentra en París, Francia, y fue construida para la Exposición Universal de 1889."
    },
    {
      "id": "cg11",
      "pregunta": "¿Cuántos años duró la Guerra de los Treinta Años?",
      "opciones": ["20 años", "30 años", "40 años", "50 años"],
      "respuesta_correcta": 1,
      "explicacion": "La Guerra de los Treinta Años ocurrió de 1618 a 1648 en Europa, durando exactamente 30 años."
    },
    {
      "id": "cg12",
      "pregunta": "¿Cuál es la capital de Australia?",
      "opciones": ["Sídney", "Melbourne", "Canberra", "Brisbane"],
      "respuesta_correcta": 2,
      "explicacion": "Canberra es la capital de Australia, aunque Sydney es la ciudad más grande del país."
    },
    {
      "id": "cg13",
      "pregunta": "¿Quién pintó la Capilla Sixtina?",
      "opciones": ["Leonardo da Vinci", "Donatello", "Miguel Ángel", "Rafael"],
      "respuesta_correcta": 2,
      "explicacion": "Miguel Ángel pintó el famoso techo de la Capilla Sixtina entre 1508 y 1512."
    },
    {
      "id": "cg14",
      "pregunta": "¿En qué año se descubrió América?",
      "opciones": ["1490", "1491", "1492", "1493"],
      "respuesta_correcta": 2,
      "explicacion": "Cristóbal Colón llegó a América el 12 de octubre de 1492, marcando el inicio de la Era de los Descubrimientos."
    },
    {
      "id": "cg15",
      "pregunta": "¿Cuál es el idioma más hablado del mundo?",
      "opciones": ["Inglés", "Español", "Mandarín", "Hindi"],
      "respuesta_correcta": 2,
      "explicacion": "El mandarín es el idioma más hablado del mundo como lengua materna, seguido por el español e inglés."
    }
  ]'::jsonb,
  30,
  TRUE
),
(
  'Actualidad Global 2025',
  'Prueba tu conocimiento sobre eventos recientes y tendencias globales',
  'Actualidad',
  'intermedio',
  20,
  'Ciudadano Global',
  '[
    {
      "id": "ag1",
      "pregunta": "¿Cuál es la principal fuente de energía renovable en Chile?",
      "opciones": ["Solar", "Hidráulica", "Eólica", "Geotérmica"],
      "respuesta_correcta": 1,
      "explicacion": "La energía hidráulica es la principal fuente de energía renovable en Chile, aprovechando los ríos andinos."
    },
    {
      "id": "ag2",
      "pregunta": "¿Cuántas naciones conforman la Unión Europea (2025)?",
      "opciones": ["25", "26", "27", "28"],
      "respuesta_correcta": 2,
      "explicacion": "La Unión Europea tiene 27 estados miembros desde la salida del Reino Unido en 2020."
    },
    {
      "id": "ag3",
      "pregunta": "¿Cuál es el objetivo de la Agenda 2030 de las Naciones Unidas?",
      "opciones": ["Eliminar la pobreza extrema", "Lograr el desarrollo sostenible", "Erradicar enfermedades", "Detener el cambio climático"],
      "respuesta_correcta": 1,
      "explicacion": "La Agenda 2030 busca lograr el desarrollo sostenible mediante 17 Objetivos de Desarrollo Sostenible."
    },
    {
      "id": "ag4",
      "pregunta": "¿En qué año se firmó el Acuerdo de París sobre cambio climático?",
      "opciones": ["2013", "2014", "2015", "2016"],
      "respuesta_correcta": 2,
      "explicacion": "El Acuerdo de París fue firmado en 2015 por 196 partes para limitar el aumento de la temperatura global."
    },
    {
      "id": "ag5",
      "pregunta": "¿Cuál es la economía más grande de América Latina?",
      "opciones": ["México", "Argentina", "Brasil", "Colombia"],
      "respuesta_correcta": 2,
      "explicacion": "Brasil es la economía más grande de América Latina y la séptima más grande del mundo."
    },
    {
      "id": "ag6",
      "pregunta": "¿Cuántas personas usan redes sociales globalmente (aproximado)?",
      "opciones": ["2 billones", "3 billones", "4.5 billones", "5 billones"],
      "respuesta_correcta": 2,
      "explicacion": "Aproximadamente 4.5-5 billones de personas usan redes sociales en 2025, más del 50% de la población mundial."
    },
    {
      "id": "ag7",
      "pregunta": "¿Cuál es el principal desafío económico de las economías desarrolladas?",
      "opciones": ["Inflación", "Desempleo", "Deuda pública", "Crisis bancaria"],
      "respuesta_correcta": 0,
      "explicacion": "La inflación ha sido uno de los principales desafíos económicos en las economías desarrolladas desde 2021."
    },
    {
      "id": "ag8",
      "pregunta": "¿Qué impacto ha tenido la IA en el mercado laboral?",
      "opciones": ["Elimina empleos", "Solo crea empleos", "Transforma roles existentes y crea nuevos", "No tiene impacto"],
      "respuesta_correcta": 2,
      "explicacion": "La IA está transformando empleos existentes mientras crea nuevas oportunidades en diferentes sectores."
    },
    {
      "id": "ag9",
      "pregunta": "¿Cuál es la tendencia del crecimiento demográfico mundial?",
      "opciones": ["Crecimiento acelerado", "Crecimiento lento", "Crecimiento negativo", "Estable"],
      "respuesta_correcta": 1,
      "explicacion": "El crecimiento demográfico mundial se está desacelerando, especialmente en países desarrollados."
    },
    {
      "id": "ag10",
      "pregunta": "¿Cuál es la principal amenaza para la biodiversidad?",
      "opciones": ["Cambio climático", "Contaminación", "Pérdida de hábitat", "Todas las anteriores"],
      "respuesta_correcta": 3,
      "explicacion": "La pérdida de hábitat es la amenaza principal, seguida por el cambio climático y la contaminación."
    }
  ]'::jsonb,
  25,
  TRUE
);

-- Display confirmation message
SELECT 'Culture general tests inserted successfully!' as result;
