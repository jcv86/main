-- Insert Cultura General Test with properly escaped JSON

INSERT INTO public.a4_gamified_tests (titulo, descripcion, categoria, nivel, puntos, badge_name, preguntas, tiempo_limite_minutos, is_active)
VALUES 
(
  'Cultura General',
  'Evalúa tu conocimiento sobre historia, ciencia, cultura y actualidad',
  'Cultura General',
  'intermedio',
  25,
  'Polímata',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'cg1',
      'pregunta', '¿En qué año se firmó la Declaración Universal de los Derechos Humanos?',
      'opciones', jsonb_build_array('1945', '1948', '1950', '1952'),
      'respuesta_correcta', 1,
      'explicacion', 'La Declaración Universal de los Derechos Humanos fue adoptada el 10 de diciembre de 1948.'
    ),
    jsonb_build_object(
      'id', 'cg2',
      'pregunta', '¿Cuál es el planeta más grande del sistema solar?',
      'opciones', jsonb_build_array('Saturno', 'Neptuno', 'Júpiter', 'Urano'),
      'respuesta_correcta', 2,
      'explicacion', 'Júpiter es el planeta más grande del sistema solar, con un diámetro ecuatorial de 142,984 km.'
    ),
    jsonb_build_object(
      'id', 'cg3',
      'pregunta', '¿Quién escribió Don Quijote de la Mancha?',
      'opciones', jsonb_build_array('Federico García Lorca', 'Miguel de Cervantes', 'Pablo Neruda', 'Jorge Luis Borges'),
      'respuesta_correcta', 1,
      'explicacion', 'Miguel de Cervantes escribió Don Quijote de la Mancha, publicado en 1605.'
    ),
    jsonb_build_object(
      'id', 'cg4',
      'pregunta', '¿En qué año se cayó el Muro de Berlín?',
      'opciones', jsonb_build_array('1987', '1988', '1989', '1990'),
      'respuesta_correcta', 2,
      'explicacion', 'El Muro de Berlín cayó el 9 de noviembre de 1989.'
    ),
    jsonb_build_object(
      'id', 'cg5',
      'pregunta', '¿Cuál es el río más largo de América del Sur?',
      'opciones', jsonb_build_array('Orinoco', 'Amazonas', 'Paraná', 'Magdalena'),
      'respuesta_correcta', 1,
      'explicacion', 'El Amazonas es el río más largo de América del Sur con aproximadamente 6,800 km.'
    ),
    jsonb_build_object(
      'id', 'cg6',
      'pregunta', '¿Cuántos continentes existen?',
      'opciones', jsonb_build_array('5', '6', '7', '8'),
      'respuesta_correcta', 2,
      'explicacion', 'Hay 7 continentes: América del Norte, América del Sur, Europa, África, Asia, Oceanía y Antártida.'
    ),
    jsonb_build_object(
      'id', 'cg7',
      'pregunta', '¿Quién fue el primer presidente de los Estados Unidos?',
      'opciones', jsonb_build_array('Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'),
      'respuesta_correcta', 1,
      'explicacion', 'George Washington fue el primer presidente de los Estados Unidos.'
    ),
    jsonb_build_object(
      'id', 'cg8',
      'pregunta', '¿En qué año ocurrió la Revolución Francesa?',
      'opciones', jsonb_build_array('1776', '1787', '1789', '1791'),
      'respuesta_correcta', 2,
      'explicacion', 'La Revolución Francesa comenzó en 1789 con la toma de la Bastilla el 14 de julio.'
    ),
    jsonb_build_object(
      'id', 'cg9',
      'pregunta', '¿Cuál es el órgano más grande del cuerpo humano?',
      'opciones', jsonb_build_array('Corazón', 'Cerebro', 'Piel', 'Pulmones'),
      'respuesta_correcta', 2,
      'explicacion', 'La piel es el órgano más grande del cuerpo humano.'
    ),
    jsonb_build_object(
      'id', 'cg10',
      'pregunta', '¿En qué país se encuentra la Torre Eiffel?',
      'opciones', jsonb_build_array('Italia', 'Alemania', 'Francia', 'España'),
      'respuesta_correcta', 2,
      'explicacion', 'La Torre Eiffel se encuentra en París, Francia.'
    ),
    jsonb_build_object(
      'id', 'cg11',
      'pregunta', '¿Cuántos años duró la Guerra de los Treinta Años?',
      'opciones', jsonb_build_array('20 años', '30 años', '40 años', '50 años'),
      'respuesta_correcta', 1,
      'explicacion', 'La Guerra de los Treinta Años ocurrió de 1618 a 1648, durando exactamente 30 años.'
    ),
    jsonb_build_object(
      'id', 'cg12',
      'pregunta', '¿Cuál es la capital de Australia?',
      'opciones', jsonb_build_array('Sídney', 'Melbourne', 'Canberra', 'Brisbane'),
      'respuesta_correcta', 2,
      'explicacion', 'Canberra es la capital de Australia.'
    ),
    jsonb_build_object(
      'id', 'cg13',
      'pregunta', '¿Quién pintó la Capilla Sixtina?',
      'opciones', jsonb_build_array('Leonardo da Vinci', 'Donatello', 'Miguel Ángel', 'Rafael'),
      'respuesta_correcta', 2,
      'explicacion', 'Miguel Ángel pintó el famoso techo de la Capilla Sixtina entre 1508 y 1512.'
    ),
    jsonb_build_object(
      'id', 'cg14',
      'pregunta', '¿En qué año se descubrió América?',
      'opciones', jsonb_build_array('1490', '1491', '1492', '1493'),
      'respuesta_correcta', 2,
      'explicacion', 'Cristóbal Colón llegó a América el 12 de octubre de 1492.'
    ),
    jsonb_build_object(
      'id', 'cg15',
      'pregunta', '¿Cuál es el idioma más hablado del mundo?',
      'opciones', jsonb_build_array('Inglés', 'Español', 'Mandarín', 'Hindi'),
      'respuesta_correcta', 2,
      'explicacion', 'El mandarín es el idioma más hablado del mundo como lengua materna.'
    )
  ),
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
  jsonb_build_array(
    jsonb_build_object(
      'id', 'ag1',
      'pregunta', '¿Cuál es la principal fuente de energía renovable en Chile?',
      'opciones', jsonb_build_array('Solar', 'Hidráulica', 'Eólica', 'Geotérmica'),
      'respuesta_correcta', 1,
      'explicacion', 'La energía hidráulica es la principal fuente renovable en Chile.'
    ),
    jsonb_build_object(
      'id', 'ag2',
      'pregunta', '¿Cuántas naciones conforman la Unión Europea?',
      'opciones', jsonb_build_array('25', '26', '27', '28'),
      'respuesta_correcta', 2,
      'explicacion', 'La Unión Europea tiene 27 estados miembros desde 2020.'
    ),
    jsonb_build_object(
      'id', 'ag3',
      'pregunta', '¿Cuál es el objetivo de la Agenda 2030 de ONU?',
      'opciones', jsonb_build_array('Eliminar la pobreza', 'Lograr desarrollo sostenible', 'Erradicar enfermedades', 'Detener cambio climático'),
      'respuesta_correcta', 1,
      'explicacion', 'La Agenda 2030 busca lograr el desarrollo sostenible mediante 17 Objetivos.'
    ),
    jsonb_build_object(
      'id', 'ag4',
      'pregunta', '¿En qué año se firmó el Acuerdo de París?',
      'opciones', jsonb_build_array('2013', '2014', '2015', '2016'),
      'respuesta_correcta', 2,
      'explicacion', 'El Acuerdo de París fue firmado en 2015 para limitar el cambio climático.'
    ),
    jsonb_build_object(
      'id', 'ag5',
      'pregunta', '¿Cuál es la economía más grande de América Latina?',
      'opciones', jsonb_build_array('México', 'Argentina', 'Brasil', 'Colombia'),
      'respuesta_correcta', 2,
      'explicacion', 'Brasil es la economía más grande de América Latina.'
    ),
    jsonb_build_object(
      'id', 'ag6',
      'pregunta', '¿Cuántas personas usan redes sociales globalmente?',
      'opciones', jsonb_build_array('2 mil millones', '3 mil millones', '4.5 mil millones', '5 mil millones'),
      'respuesta_correcta', 2,
      'explicacion', 'Aproximadamente 4.5-5 mil millones de personas usan redes sociales en 2025.'
    ),
    jsonb_build_object(
      'id', 'ag7',
      'pregunta', '¿Cuál es el principal desafío económico actual?',
      'opciones', jsonb_build_array('Inflación', 'Desempleo', 'Deuda pública', 'Crisis bancaria'),
      'respuesta_correcta', 0,
      'explicacion', 'La inflación ha sido un desafío económico en economías desarrolladas desde 2021.'
    ),
    jsonb_build_object(
      'id', 'ag8',
      'pregunta', '¿Qué impacto ha tenido la IA en el mercado laboral?',
      'opciones', jsonb_build_array('Elimina empleos', 'Solo crea empleos', 'Transforma roles y crea nuevos', 'Sin impacto'),
      'respuesta_correcta', 2,
      'explicacion', 'La IA transforma empleos existentes mientras crea nuevas oportunidades.'
    ),
    jsonb_build_object(
      'id', 'ag9',
      'pregunta', '¿Cuál es la tendencia demográfica mundial?',
      'opciones', jsonb_build_array('Crecimiento acelerado', 'Crecimiento lento', 'Crecimiento negativo', 'Estable'),
      'respuesta_correcta', 1,
      'explicacion', 'El crecimiento demográfico mundial se está desacelerando.'
    ),
    jsonb_build_object(
      'id', 'ag10',
      'pregunta', '¿Cuál es la principal amenaza para la biodiversidad?',
      'opciones', jsonb_build_array('Cambio climático', 'Contaminación', 'Pérdida de hábitat', 'Todas las anteriores'),
      'respuesta_correcta', 3,
      'explicacion', 'La pérdida de hábitat es la amenaza principal para la biodiversidad.'
    )
  ),
  25,
  TRUE
);

