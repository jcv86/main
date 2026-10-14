# Tu objetivo laboral — especificación y punto de continuidad

Fecha: 14 de octubre de 2026.
Estado: **diseño preparado; implementación y pruebas pendientes**.
Repositorio: `jcv86/main`.
Base de código revisada: `172a09b94e266084c9d79be235053893db5ef549`.
Rama documental: `codex/a4-labor-objective-20261014`.

Este documento no es una entrega de funcionalidad. No cambia la aplicación, los permisos, las cuentas, los datos ni el esquema. No certifica un despliegue o recorrido de usuario nuevo.

## 1. Encargo confirmado

Separar el trabajo que busca la persona del área funcional y del rubro de la empresa. Recuperar preferencias ya confirmadas, evitar preguntas repetidas y eliminar Metropolitana como preferencia implícita. Ofrecer los caminos «Sé qué trabajo busco» y «Todavía estoy explorando».

El objetivo debe poder recogerse al comienzo del recorrido, confirmarse al entrar al Radar A4 y editarse después. El CV y la evidencia DTC ayudan a explicar y preparar oportunidades; no reemplazan la intención expresada por la persona ni demuestran por sí solos el cumplimiento de requisitos.

## 2. Hallazgos de código, no suposiciones sobre datos personales

Los siguientes archivos se inspeccionaron en la base indicada:

| Archivo | Hecho observado | Consecuencia |
|---|---|---|
| `app/despega/a4/job-matching/opportunity-search-experience.tsx` | El estado inicial usa `locations: ['Metropolitana']` y mezcla cargos/áreas en `targetRoles`. | Se necesita un inicio neutral y recuperación explícita de preferencias. |
| `app/despega/a4/job-matching/search-intent-form.tsx` | Formulario con cargos o áreas, región, modalidad y amplitud; no hay selector independiente de rubro. | No basta con cambiar una etiqueta. |
| `lib/opportunities/search-intent.ts` y `search-query.ts` | El contrato transporta cargos, amplitud, regiones y modalidades. | Áreas y rubros deben conservarse por separado durante exploración, guardado y paginación. |
| `app/api/a4/search-intents/route.ts` | El servicio admite `industries` y `excluded_industries` al guardar y conserva preferencias avanzadas omitidas. | Hay que preservar datos anteriores, no borrarlos al guardar el nuevo formulario. |
| `app/api/a4/opportunities/for-me/route.ts` | La búsqueda guardada selecciona solo `target_roles,breadth,locations,work_modes`. | Un rubro almacenado no se está usando en este recorrido de resultados. |
| `lib/opportunities/matching.ts` | El evaluador usa cargos/áreas heredadas, regiones y modalidades; no aplica industrias. | El filtrado y sus explicaciones requieren el mismo contrato actualizado. |
| `lib/opportunities/verified-index.ts` | La proyección pública inspeccionada no incluye una clasificación del rubro empresarial con evidencia. | No presentar un filtro sectorial como comprobado sin resolver su fuente. |
| `lib/opportunities/taxonomy.ts` | La categorización escoge la primera categoría que coincide con el título; Dirección precede a Finanzas. | Revisar el caso de un gerente financiero: jerarquía y función no son lo mismo. |
| `supabase/migrations/20260920173000_career_search_intents.sql` | La migración versionada exige al menos un elemento en `target_roles`. | Guardar una exploración sin cargo puede requerir adaptar el esquema. Su estado real debe comprobarse antes de migrar. |
| `app/despega/career-identity/page.tsx` | La entrada de identidad tiene guardas de sesión y acceso piloto propias. | Integrar el objetivo temprano no autoriza abrir A4 ni debilitar sus guardas. |

Fuentes: archivos de este repositorio en la base indicada. Esta revisión no comprueba el contenido del CV, el perfil o las preferencias de una cuenta concreta.

## 3. Experiencia propuesta

### Entrada y continuidad

Reutilizar un bloque «Tu objetivo laboral». Antes de presentarlo en el comienzo del recorrido, confirmar cuál es la entrada canónica vigente; no insertar formularios en todas las rutas antiguas.

Si hay una preferencia guardada y confirmada, mostrar un resumen editable: «Esta es tu búsqueda actual. ¿Sigue representando lo que buscas?». Si solo hay un cargo objetivo anterior o una sugerencia DTC, identificar su origen y ofrecer «Usar como punto de partida»; no aplicarlo ni guardarlo silenciosamente.

Una lectura fallida no es una búsqueda vacía. Mostrar error con recuperación y no sustituirla por preferencias nuevas. Una respuesta tardía tampoco debe sobrescribir un borrador que la persona ya empezó a editar.

### Preguntas y ejemplos ilustrativos

| Pregunta visible | Respuesta esperada | Ejemplo, no dato de un usuario |
|---|---|---|
| ¿Tienes claro qué trabajo estás buscando? | Camino específico o exploratorio. | «Todavía estoy explorando». |
| ¿Qué cargo te gustaría conseguir? | Uno o varios cargos, opcionales en exploración. | «Analista financiero». |
| ¿En qué área quieres trabajar? | Función que realizaría la persona; selección independiente del cargo. | «Finanzas y Contabilidad». |
| ¿En qué rubros te interesa trabajar? | Actividad de la empresa, con opción sin preferencia. | «Minería» o «Salud». |
| ¿Hay rubros que prefieres evitar? | Exclusiones opcionales, distintas de las preferencias. | «No tengo exclusiones». |
| ¿Dónde y en qué modalidad? | Regiones y modalidad elegidas o recuperadas. | «Biobío; híbrido o presencial». |

Mostrar primero lo esencial y dejar exclusiones dentro de opciones adicionales. Un área puede tener varias ofertas y un cargo puede existir en distintos rubros. «Finanzas en minería» no significa «trabajar en un banco».

La amplitud «cargo exacto / relacionados / áreas cercanas» es distinta de la etapa «sé lo que busco / estoy explorando». Cambiar de etapa no borra cargos, regiones o modalidades ya seleccionados sin una acción explícita.

### Acciones

- «Ver ofertas»: aplica el borrador a la exploración; no escribe preferencias.
- «Guardar mi objetivo»: guarda una búsqueda confirmada y presenta su resumen.
- «Mi búsqueda guardada» y «Editar mi objetivo»: recuperan exactamente la misma preferencia.
- «Explorar sin definir un objetivo»: permite revisar el catálogo sin inventar un cargo ni un rubro.

Cambiar un formulario no cambia las tarjetas hasta aplicar los cambios. Deben seguir visibles la búsqueda aplicada, los cambios pendientes y los estados sin coincidencias, sin inventario, sin sesión y de error.

## 4. Contrato propuesto y compatibilidad

Conservar `target_roles`, `breadth`, `locations`, `work_modes`, `industries` y `excluded_industries`. Proponer campos independientes para áreas funcionales y etapa de definición. La política de rubro desconocido debe ser explícita. Los nombres y la migración definitiva se decidirán después de comprobar el esquema, las restricciones y el modelo de escritura existentes.

No introducir valores ficticios como «cualquier cargo» en `target_roles` para sortear una restricción. No rellenar Metropolitana cuando no hay una preferencia. Distinguir visualmente «sin definir» de «todas las regiones» confirmado, aunque ambos permitan inicialmente una exploración amplia.

Las búsquedas antiguas no se reescriben de forma masiva. Presentar su contenido para confirmación. Separar automáticamente únicamente etiquetas de áreas inequívocas y conservando su origen; un texto ambiguo permanece pendiente de confirmar. Las preferencias avanzadas no incluidas en una edición deben conservarse, incluido salario, idiomas, seniority y tipo de empleo.

El contrato debe mantenerse idéntico entre formulario, parámetros, validador, almacenamiento, lectura de búsqueda principal, catálogo, resultados, resumen y revisión de paginación. Ningún parámetro desconocido o inválido debe ampliar la búsqueda silenciosamente.

## 5. Reglas de selección y respaldo

### Cargo y área

Dentro de una lista se permiten alternativas. Cargo, área, región, modalidad y rubro son dimensiones separadas. Cuando se eligen cargo y área, no ampliar silenciosamente a cualquier ocupación del área: respetar la combinación mostrada al usuario. Una propuesta de ampliación requiere elección explícita.

Conservar la prioridad de cargo exacto sobre equivalencias revisadas y cargos relacionados. Resolver jerarquía y función por separado: un gerente de finanzas no debe desaparecer de Finanzas solo por estar clasificado como Dirección. Ninguna coincidencia de área acredita habilidades, seniority o empleabilidad.

### Rubro empresarial

No inferir el rubro a partir del cargo, del portal de empleo o de una palabra aislada en la descripción. No confundir una empresa de selección o consultoría con el rubro de su cliente final. Una clasificación debe tener una fuente pertinente, fecha, alcance y un estado de disponibilidad verificable.

Sin evidencia suficiente, mostrar «Rubro por confirmar». No inventar porcentajes de cobertura ni clasificar empresas reales en este documento.

El filtro debe distinguir:

1. Rubro conocido y admitido.
2. Rubro conocido y excluido.
3. Rubro desconocido: inclusión o exclusión según una elección explícita, siempre mostrando su incertidumbre.

La preferencia puede guardarse aunque falte cobertura, pero no presentarse como satisfecha. El catálogo debe comunicar cuántas ofertas tienen rubro comprobable dentro del universo consultado. Una coincidencia de cargo con rubro desconocido no se anuncia como coincidencia sectorial.

### Personalización

El CV y el trabajo en DTC aportan evidencia para explicar y preparar; no cambian los filtros explícitos. Las sugerencias deben permitir aceptar, editar o descartar. Sin evidencia pertinente, permitir explorar y explicar qué falta sin fabricar motivos personales.

## 6. Secuencia de implementación pendiente

1. Confirmar entrada canónica, esquema real y guardas. Diseñar el lector/escritor compartido de objetivo sin abrir el acceso al catálogo A4 a quien no lo tenga.
2. Incorporar contrato y compatibilidad, migración pequeña cuando corresponda, validación y pruebas de propiedad/aislamiento. Mantenerla separada de producción hasta verificarla.
3. Implementar formulario reutilizable y recuperación de preferencias; inicio neutral, alternativas específica/exploratoria y resumen editable.
4. Conectar consulta y evaluador con área y rubro respaldado, incluyendo incertidumbre, cobertura y explicaciones. Conservar filtros en todas las páginas.
5. Integrar el bloque al comienzo del recorrido y su confirmación en A4 sin repetir información ya confirmada.
6. Ejecutar regresiones, revisión visual y accesibilidad en un entorno aislado permitido; publicar un candidato de revisión. No fusionar ni anunciar producción antes de su validación.

Los archivos existentes de A4 citados en la sección 2 son los puntos de integración inspeccionados. Los archivos nuevos y el nombre final de la migración siguen pendientes; no se han creado scripts ejecutables ni cambios de esquema en esta rama.

## 7. Criterios de aceptación pendientes

| Caso | Resultado exigido |
|---|---|
| Primera visita sin preferencias | Ningún cargo, área, rubro o región se atribuye al usuario por defecto. |
| Preferencia confirmada existente | Se recupera fielmente, sin repetir todo el cuestionario ni escribir al leer. |
| Error al recuperar | Se distingue de ausencia; no aparece una confirmación ficticia. |
| Respuesta tardía | No reemplaza el borrador editado por el usuario. |
| Exploración sin cargo | Funciona sin registros ficticios; el guardado respeta el contrato de etapa. |
| Cargo y área diferentes | Se aplica la combinación comunicada; no una ampliación implícita. |
| Finanzas en una empresa minera | La función y el rubro se evalúan por separado. |
| Gerente financiero | Se mantiene la función financiera, además de la jerarquía. |
| Rubro desconocido | Se etiqueta y se trata según la política elegida; nunca se afirma coincidencia. |
| Rubro excluido | Se excluye cuando se conoce; lo desconocido se comunica con precisión. |
| Empresa intermediaria | No se atribuye automáticamente su actividad al cliente final. |
| Lista mal formada o exceso de límites | Error visible; no se recorta silenciosamente ni amplía resultados. |
| Guardado fallido o concurrente | Se conserva el borrador y no se anuncia éxito. |
| Cambios de vista | Se conservan los cambios pendientes sin aplicarlos a las tarjetas. |
| Más páginas | No hay duplicados ni mezcla entre filtros, propietario o revisión distintos. |
| CV o preferencia anterior | No impone un cargo o región ni reemplaza lo elegido ahora. |
| Usuario sin sesión o sin acceso A4 | No lee datos ajenos ni obtiene acceso nuevo al Radar. |
| Edición desde etapa inicial | Permisos apropiados al objetivo, sin relajar las guardas del catálogo. |
| Pantalla móvil y teclado | Etiquetas, foco, errores, estado y acciones comprensibles; sin desbordamiento. |
| Compatibilidad | No se borran salarios, idiomas u otras preferencias omitidas. |

Pruebas existentes relevantes: `test:a4-closure`, `test:a4-opportunities`, `test:a4-catalog-quality`, `test:a4-personal-orientation`, `test:a4-qa-access` y `quality:gate`. Enumerarlas no significa que se hayan ejecutado en esta sesión.

## 8. Trabajo realizado y bloqueo concreto

Se inspeccionaron la rama principal y los archivos descritos. Se creó un entorno temporal aislado, se confirmó su SHA y se instalaron las dependencias del lockfile con scripts de instalación deshabilitados. Dos llamadas posteriores de ejecución fueron bloqueadas por el control de seguridad de la herramienta. El mensaje fue: «OpenAI bloqueó esta llamada a la herramienta al no poder determinar el estado de seguridad de la solicitud».

La herramienta no entregó una causa técnica más específica. No se afirma que sea una falla de Vercel, un error del código o un permiso del usuario. No se ejecutaron esas mismas acciones por otro mecanismo. La detención del entorno temporal quedó confirmada y su persistencia estaba deshabilitada.

**No hay implementación, migración aplicada, pruebas nuevas aprobadas ni despliegue funcional de este objetivo.** El resultado de esta etapa es este diseño y su registro de continuidad, en una rama documental independiente. El código de aplicación de la rama sigue siendo el de la base inspeccionada. La PR #237 de evidencia operativa permanece fuera de este cambio.
