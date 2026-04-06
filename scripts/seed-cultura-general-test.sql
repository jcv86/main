-- Cultura General con contexto chileno y universal

DELETE FROM public.a4_gamified_tests WHERE titulo IN ('Cultura General', 'Actualidad Global 2025');

INSERT INTO public.a4_gamified_tests (titulo, descripcion, categoria, nivel, puntos, badge_name, preguntas, tiempo_limite_minutos, is_active)
VALUES 
(
  'Cultura General',
  'Evalúa tu conocimiento sobre historia, ciencia y cultura universal',
  'Cultura General',
  'intermedio',
  25,
  'Polímata',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'cg1',
      'pregunta', '¿Cuál es el planeta más grande del sistema solar?',
      'opciones', jsonb_build_array('Saturno', 'Neptuno', 'Júpiter', 'Urano'),
      'respuesta_correcta', 2,
      'explicacion', 'Júpiter es el planeta más grande del sistema solar.'
    ),
    jsonb_build_object(
      'id', 'cg2',
      'pregunta', '¿Quién escribió Don Quijote de la Mancha?',
      'opciones', jsonb_build_array('García Lorca', 'Miguel de Cervantes', 'Pablo Neruda', 'Jorge Luis Borges'),
      'respuesta_correcta', 1,
      'explicacion', 'Miguel de Cervantes escribió Don Quijote de la Mancha, publicado en 1605.'
    ),
    jsonb_build_object(
      'id', 'cg3',
      'pregunta', '¿En qué año ocurrió la Revolución Francesa?',
      'opciones', jsonb_build_array('1776', '1787', '1789', '1791'),
      'respuesta_correcta', 2,
      'explicacion', 'La Revolución Francesa comenzó en 1789 con la toma de la Bastilla.'
    ),
    jsonb_build_object(
      'id', 'cg4',
      'pregunta', '¿Cuál es el órgano más grande del cuerpo humano?',
      'opciones', jsonb_build_array('Corazón', 'Cerebro', 'Piel', 'Pulmones'),
      'respuesta_correcta', 2,
      'explicacion', 'La piel es el órgano más grande del cuerpo humano.'
    ),
    jsonb_build_object(
      'id', 'cg5',
      'pregunta', '¿En qué país se encuentra la Torre Eiffel?',
      'opciones', jsonb_build_array('Italia', 'Alemania', 'Francia', 'España'),
      'respuesta_correcta', 2,
      'explicacion', 'La Torre Eiffel se encuentra en París, Francia.'
    ),
    jsonb_build_object(
      'id', 'cg6',
      'pregunta', '¿Quién pintó la Capilla Sixtina?',
      'opciones', jsonb_build_array('Leonardo da Vinci', 'Donatello', 'Miguel Ángel', 'Rafael'),
      'respuesta_correcta', 2,
      'explicacion', 'Miguel Ángel pintó el famoso techo de la Capilla Sixtina entre 1508 y 1512.'
    ),
    jsonb_build_object(
      'id', 'cg7',
      'pregunta', '¿En qué año se descubrió América?',
      'opciones', jsonb_build_array('1490', '1491', '1492', '1493'),
      'respuesta_correcta', 2,
      'explicacion', 'Cristóbal Colón llegó a América el 12 de octubre de 1492.'
    ),
    jsonb_build_object(
      'id', 'cg8',
      'pregunta', '¿Cuál es el idioma más hablado del mundo?',
      'opciones', jsonb_build_array('Inglés', 'Español', 'Mandarín', 'Hindi'),
      'respuesta_correcta', 2,
      'explicacion', 'El mandarín es el idioma más hablado como lengua materna.'
    ),
    jsonb_build_object(
      'id', 'cg9',
      'pregunta', '¿En qué año cayó el Muro de Berlín?',
      'opciones', jsonb_build_array('1987', '1988', '1989', '1990'),
      'respuesta_correcta', 2,
      'explicacion', 'El Muro de Berlín cayó el 9 de noviembre de 1989.'
    ),
    jsonb_build_object(
      'id', 'cg10',
      'pregunta', '¿Cuál es el río más largo del mundo?',
      'opciones', jsonb_build_array('Nilo', 'Amazonas', 'Yangtze', 'Misisipi'),
      'respuesta_correcta', 0,
      'explicacion', 'El Nilo es el río más largo del mundo con aproximadamente 6,650 km.'
    )
  ),
  25,
  TRUE
),
(
  'Cultura Chilena',
  'Prueba tu conocimiento sobre historia, geografía y cultura de Chile',
  'Chile',
  'intermedio',
  30,
  'Hijo de Chile',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'ch1',
      'pregunta', '¿En qué año Chile declaró su independencia?',
      'opciones', jsonb_build_array('1808', '1810', '1818', '1825'),
      'respuesta_correcta', 2,
      'explicacion', 'Chile declaró su independencia el 18 de septiembre de 1810, fecha que hoy celebramos como Fiestas Patrias.'
    ),
    jsonb_build_object(
      'id', 'ch2',
      'pregunta', '¿Cuál es la montaña más alta de Chile?',
      'opciones', jsonb_build_array('Volcán Villarrica', 'Nevado Ojos del Salado', 'Monte San Valentín', 'Volcán Calbuco'),
      'respuesta_correcta', 1,
      'explicacion', 'El Nevado Ojos del Salado es la montaña más alta de Chile con 6,893 metros.'
    ),
    jsonb_build_object(
      'id', 'ch3',
      'pregunta', '¿Cuántas regiones tiene Chile actualmente?',
      'opciones', jsonb_build_array('13', '15', '16', '17'),
      'respuesta_correcta', 2,
      'explicacion', 'Chile tiene 16 regiones desde la reorganización territorial de 2020.'
    ),
    jsonb_build_object(
      'id', 'ch4',
      'pregunta', '¿Cuál es el poeta chileno ganador del Premio Nobel de Literatura?',
      'opciones', jsonb_build_array('José Donoso', 'Pablo Neruda', 'Vicente Huidobro', 'Gabriela Mistral'),
      'respuesta_correcta', 3,
      'explicacion', 'Gabriela Mistral fue la primera chilena en ganar el Premio Nobel de Literatura en 1945.'
    ),
    jsonb_build_object(
      'id', 'ch5',
      'pregunta', '¿Cuál es el territorio más austral de Chile?',
      'opciones', jsonb_build_array('Tierra del Fuego', 'Isla de Pascua', 'Islas Diego Ramírez', 'Archipiélago de Chonos'),
      'respuesta_correcta', 2,
      'explicacion', 'Las Islas Diego Ramírez son el territorio más austral de Chile.'
    ),
    jsonb_build_object(
      'id', 'ch6',
      'pregunta', '¿En qué año ocurrió el Gran Terremoto de Valdivia?',
      'opciones', jsonb_build_array('1960', '1965', '1970', '1975'),
      'respuesta_correcta', 0,
      'explicacion', 'El terremoto de Valdivia de 1960 fue el más fuerte registrado en la historia, con magnitud 9.5.'
    ),
    jsonb_build_object(
      'id', 'ch7',
      'pregunta', '¿Cuál es el desierto más árido del mundo ubicado en Chile?',
      'opciones', jsonb_build_array('Atacama', 'Gobi', 'Kalahari', 'Sahara'),
      'respuesta_correcta', 0,
      'explicacion', 'El Desierto de Atacama es el desierto más árido del mundo, ubicado en el norte de Chile.'
    ),
    jsonb_build_object(
      'id', 'ch8',
      'pregunta', '¿Quién fue el primer presidente de Chile?',
      'opciones', jsonb_build_array('O''Higgins', 'Arturo Prat', 'José Miguel Carrera', 'Bernardo Riesco'),
      'respuesta_correcta', 0,
      'explicacion', 'Bernardo O''Higgins fue el primer presidente de la República de Chile (1817-1823).'
    ),
    jsonb_build_object(
      'id', 'ch9',
      'pregunta', '¿Cuál es la capital de Chile?',
      'opciones', jsonb_build_array('Valparaíso', 'Concepción', 'Santiago', 'Valdivia'),
      'respuesta_correcta', 2,
      'explicacion', 'Santiago es la capital y la ciudad más grande de Chile.'
    ),
    jsonb_build_object(
      'id', 'ch10',
      'pregunta', '¿Qué mineral es la principal exportación de Chile?',
      'opciones', jsonb_build_array('Oro', 'Plata', 'Cobre', 'Molibdeno'),
      'respuesta_correcta', 2,
      'explicacion', 'El cobre es la principal exportación de Chile, que produce el 25% del cobre mundial.'
    ),
    jsonb_build_object(
      'id', 'ch11',
      'pregunta', '¿En qué región se encuentra el Valle del Elqui?',
      'opciones', jsonb_build_array('Región de Coquimbo', 'Región de Atacama', 'Región de Valparaíso', 'Región del Maule'),
      'respuesta_correcta', 0,
      'explicacion', 'El Valle del Elqui se encuentra en la Región de Coquimbo, famoso por sus observatorios astronómicos.'
    ),
    jsonb_build_object(
      'id', 'ch12',
      'pregunta', '¿Cuál fue el último estadio donde se jugó la final de Libertadores en Chile?',
      'opciones', jsonb_build_array('Estadio Nacional', 'Estadio El Teniente', 'Estadio Azul Azul', 'Monumental'),
      'respuesta_correcta', 0,
      'explicacion', 'El Estadio Nacional de Chile ha albergado importantes encuentros deportivos internacionales.'
    )
  ),
  35,
  TRUE
),
(
  'Actualidad Chile 2026',
  'Prueba tu conocimiento sobre eventos recientes y tendencias en Chile',
  'Actualidad Chile',
  'intermedio',
  25,
  'Chileno Actualizado',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'ac1',
      'pregunta', '¿Cuál es la principal preocupación económica de Chile 2025?',
      'opciones', jsonb_build_array('Inflación', 'Desempleo', 'Pensiones', 'Vivienda'),
      'respuesta_correcta', 3,
      'explicacion', 'La crisis de vivienda ha sido una preocupación prioritaria para el gobierno y ciudadanía chilena.'
    ),
    jsonb_build_object(
      'id', 'ac2',
      'pregunta', '¿Qué empresa minera chilena es líder en cobre?',
      'opciones', jsonb_build_array('CODELCO', 'Escondida', 'Chuquicamata', 'Antamina'),
      'respuesta_correcta', 0,
      'explicacion', 'CODELCO es la empresa estatal chilena productora de cobre más importante del mundo.'
    ),
    jsonb_build_object(
      'id', 'ac3',
      'pregunta', '¿Cuál es la tasa de desocupación aproximada en Chile?',
      'opciones', jsonb_build_array('5%', '7%', '9%', '12%'),
      'respuesta_correcta', 2,
      'explicacion', 'La tasa de desocupación en Chile ha rondado entre 8-9% en 2025.'
    ),
    jsonb_build_object(
      'id', 'ac4',
      'pregunta', '¿Qué es el SPP en Chile?',
      'opciones', jsonb_build_array('Sistema Público de Pensiones', 'Sistema Privado de Pensiones', 'Sistema de Pensiones Popular', 'Sistema de Protección Pensionaria'),
      'respuesta_correcta', 1,
      'explicacion', 'El SPP es el Sistema Privado de Pensiones en Chile, administrado por Administradoras de Fondos de Pensiones.'
    ),
    jsonb_build_object(
      'id', 'ac5',
      'pregunta', '¿Cuántos tratados de libre comercio tiene Chile?',
      'opciones', jsonb_build_array('15', '25', '35', '45'),
      'respuesta_correcta', 2,
      'explicacion', 'Chile es uno de los países con más tratados de libre comercio en el mundo, con aproximadamente 35.'
    ),
    jsonb_build_object(
      'id', 'ac6',
      'pregunta', '¿Cuál es el principal producto de exportación chileno después del cobre?',
      'opciones', jsonb_build_array('Frutas', 'Vino', 'Celulosa', 'Pescado'),
      'respuesta_correcta', 0,
      'explicacion', 'Las frutas son el segundo principal producto de exportación chileno después del cobre.'
    ),
    jsonb_build_object(
      'id', 'ac7',
      'pregunta', '¿Qué universidades chilenas están en los rankings internacionales top 100?',
      'opciones', jsonb_build_array('1-2', '2-3', '3-4', '4-5'),
      'respuesta_correcta', 1,
      'explicacion', 'La Universidad de Chile y Pontificia Universidad Católica están en los rankings internacionales.'
    ),
    jsonb_build_object(
      'id', 'ac8',
      'pregunta', '¿Cuál es el IMC (Índice de Morosidad de Créditos) aproximado en Chile?',
      'opciones', jsonb_build_array('1%', '2.5%', '4%', '6%'),
      'respuesta_correcta', 2,
      'explicacion', 'El índice de morosidad de créditos en Chile ronda aproximadamente 3-4%.'
    ),
    jsonb_build_object(
      'id', 'ac9',
      'pregunta', '¿Cuál es la meta de reducción de emisiones para Chile 2030?',
      'opciones', jsonb_build_array('20%', '30%', '45%', '60%'),
      'respuesta_correcta', 2,
      'explicacion', 'Chile se comprometió a reducir sus emisiones de gases de efecto invernadero en 45% para 2030.'
    ),
    jsonb_build_object(
      'id', 'ac10',
      'pregunta', '¿Qué sector de la economía chilena está en mayor transformación digital?',
      'opciones', jsonb_build_array('Agricultura', 'Fintech', 'Minería', 'Turismo'),
      'respuesta_correcta', 2,
      'explicacion', 'La minería chilena está transformándose digitalmente con automatización y análisis de datos.'
    )
  ),
  25,
  TRUE
);

-- Confirmation message
SELECT 'Tests chilenos insertados exitosamente!' as result;
