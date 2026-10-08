# A4 — orientación personal con evidencia

Fecha de definición: 2026-10-08 UTC / 2026-10-07 Chile.

## Resultado acordado

El usuario confirmó que cada orientación del Radar debe relacionar el análisis y el trabajo realizado en DTC, el CV y las preferencias actuales con la información que efectivamente publica la oferta. Debe explicar por qué puede servir, qué lo respalda, qué falta confirmar y cuál es el siguiente paso.

La coincidencia con un título o filtro sigue siendo una explicación de búsqueda. La orientación personal adicional necesita evidencia pertinente de ambos lados. La ausencia de evidencia no demuestra ausencia de capacidad.

Hito: **DTC-A4-P01**. Estado: **in_progress** hasta publicación en producción y aceptación del recorrido real.

## Identidad y dependencia

- Repositorio: `jcv86/main`.
- Base de esta entrega: PR #241, commit `f6259b72cdba808d5004c335895fd02855c995d7`, árbol `d07436567787cab31fdd6be7fdbe50d8bb467991`.
- Rama independiente: `codex/a4-personal-orientation-20261008`; la PR debe declarar la dependencia de #241.
- Main comprobado al inicio: `8b776e9c171ec0c755fd3829b19bca804e8e74f8`.
- Producción comprobada al inicio: `dpl_957qm7APiGXMd1MguMWSZxoZSn14`, READY, con ese SHA y el dominio `www.despegatucarrera.com`.
- Equipo Vercel `team_VvIPBATpeoA0eQw8fIx4rhan`; proyecto `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`.
- Supabase: DTCFINAL `dcfrbwxbejtbcouionna` exclusivamente.

Preparar esta entrega no implica fusionar otra PR ni desplegar código en producción.

## Contrato de las fuentes

| Fuente | Uso permitido | Límite de la interpretación |
|---|---|---|
| CV estructurado de A3 | Habilidades declaradas, cargo de experiencia y logros pertinentes, con referencia y fecha | La revisión del documento no certifica externamente experiencia, dominio ni años de práctica. Cargo objetivo y palabras clave aspiracionales no son experiencia. |
| Objetivo profesional DTC | Explicar la relación entre el objetivo declarado y el cargo publicado | Un objetivo previo no reemplaza silenciosamente los filtros actuales ni acredita requisitos. |
| Respuestas canónicas de A1 | Preferencias situacionales respaldadas por las respuestas, para orientar la preparación | No producen habilidades, seniority, probabilidad de contratación ni un filtro psicológico de ofertas. |
| Evidencia de A2 | Texto pertinente documentado en una misión con validación registrada y referencia verificable | La finalización o puntuación global no acredita una habilidad. |
| Entregable de A3 | Experiencias pasadas declaradas en `projectValue` y `criticalValue` del Value Mining Lab, citadas como experiencia declarada | Escribir sobre una experiencia no la convierte en una práctica observada ni certificada. Completar módulos no acredita preparación laboral. |
| Preferencias actuales | Cargo, amplitud, región y modalidad elegidos o guardados explícitamente | Conservan el control de inclusión de resultados. Las condiciones todavía no capturadas no se presentan como comprobadas. |
| Oferta verificada | Título, requisitos, habilidades y fragmentos de la fuente | Una mención compartida no demuestra que se cumpla el nivel, los años o una certificación exigida. |

El lector utiliza las tablas existentes y selecciona solo los campos pertinentes, incluidos los campos JSON específicos del CV y los entregables. No incorpora nombres, contactos, el CV completo, respuestas completas al navegador ni `source_payload` de ofertas.

Se revisaron por SQL de solo lectura las columnas, RLS, políticas de propietario y permisos SELECT de `career_identities`, `a1_cerebral_assessment`, `career_evidence` y `a3_module_completion`. Las cuatro tienen RLS habilitado, SELECT para authenticated y condiciones de propietario. La zona de la base es UTC; `a3_module_completion.completed_at` es timestamp sin zona con default `now()`, por lo que se interpreta explícitamente como UTC.

Estas comprobaciones son de esquema y permisos. No verifican que un usuario concreto tenga un CV o evidencias disponibles. No se recuperaron perfiles, evaluaciones ni datos personales mediante SQL.

## Límite del servidor

`personal-context.ts` autentica al usuario con el cliente de sesión y exige que la identidad coincida antes de consultar. Todas las lecturas se filtran por ese propietario. Cada fuente puede estar disponible, vacía, parcial o no disponible; un error de contexto mantiene el catálogo utilizable y se comunica con precisión.

La lectura no inicializa identidades, actualiza perfiles, registra puntuaciones, realiza RPC ni escribe en Supabase. No activa los extractores heredados que convierten DISC, etiquetas de ruta o progreso en competencias.

Las referencias personales conservan origen, naturaleza, fecha y vigencia cuando existe. Los valores inválidos, futuros, vencidos o excesivos no se convierten en respaldo; los textos excesivos se rechazan completos para conservar el significado de negaciones y condiciones.

La revisión del contexto es un hash estable de su contenido pertinente y estados. No depende de la hora de consulta. El snapshot de paginación se vincula al usuario, esa revisión, los filtros y el resultado ordenado. Un cambio de CV, evidencia o disponibilidad exige comenzar de nuevo la paginación. Las respuestas son privadas y no se almacenan en cachés compartidas.

## Orientación y orden

El motor puro cruza frases completas y términos reconocibles, respeta negaciones y aspiraciones, y conserva el extracto personal y el de la oferta. Limita los motivos visibles, los aspectos por confirmar y los respaldos.

El criterio principal de orden sigue siendo la relación con la búsqueda: título, equivalencia revisada, cargo relacionado o área. Dentro de una misma relación, los temas pertinentes con respaldo personal visible pueden desempatar. Un tema repetido en varios registros no aumenta artificialmente el orden. Las preferencias de A1 y el objetivo por sí solos no aportan ese desempate.

No se produce un porcentaje de afinidad, empleabilidad ni contratación. El orden no elimina ofertas por falta de evidencia personal. Una exigencia de nivel avanzado, años, licencia o certificación permanece por confirmar aunque aparezca la misma herramienta o tema en el CV.

## Experiencia

Cada oferta puede mostrar:

1. **Tu orientación para esta oferta:** motivos emitidos por el servidor.
2. **Por confirmar:** requisitos sobre los que falta información suficiente o precisión.
3. **Tu siguiente paso:** una acción concreta vinculada con los respaldos y los requisitos.
4. **Ver en qué nos basamos:** origen, naturaleza, fecha y extractos pertinentes de ambos lados.

La explicación de búsqueda y el detalle de la publicación continúan disponibles. Los enlaces de evidencia y preparación se restringen a rutas existentes de DTC. No incorporan datos personales en la URL ni conceden acceso a módulos protegidos.

La disponibilidad de las fuentes se presenta una sola vez sobre los resultados. Se puede volver a consultar el contexto con una lectura del catálogo; esa acción no ejecuta la ingesta ni guarda una búsqueda.

## Criterios de aceptación

- La misma oferta y filtros con dos perfiles producen orientación distinta cuando cambia evidencia pertinente.
- Un cambio de CV o evidencia DTC actualiza los motivos y evita agregar páginas de una revisión anterior.
- El objetivo anterior, la psicometría y el avance de módulos no reemplazan preferencias explícitas ni acreditan habilidades.
- Cada motivo personal identifica respaldo de la persona y de la oferta; el cliente no fabrica razones.
- Se diferencian experiencia declarada, preferencia autodeclarada y ejercicio documentado.
- Las aspiraciones, negaciones y requisitos de nivel se manejan sin fabricar cumplimiento o carencias.
- La sesión ausente o diferente no lee fuentes personales. No se exponen registros ajenos ni el contexto completo.
- El catálogo continúa funcionando con fuentes vacías o no disponibles.
- El detalle y los respaldos abiertos se conservan al cargar más ofertas; controles de teclado y pantalla móvil 390×844 funcionan.

## Verificación de la entrega

**542 regresiones focalizadas aprobadas**, con datos y límites de acceso sintéticos:

| Grupo | Casos aprobados |
|---|---:|
| Proveedores, matching, candidatos de mantenimiento y refresco | 138 |
| Empleadores, índice y refresco por fuente | 88 |
| Get on Board y rutas | 41 |
| Calidad del contenido, diagnósticos y detalle completo | 61 |
| Contexto del recorrido, búsquedas y API paginada | 79 |
| Acceso temporal A4 | 25 |
| Disponibilidad del perfil | 14 |
| Lector privado del contexto personal | 38 |
| Motor de orientación personal | 42 |
| Interfaz del respaldo personal | 16 |
| **Total** | **542** |

Las pruebas de lectura comprueban filtros por propietario y proyecciones JSON usando el SDK PostgREST real con transporte sintético. Las integraciones lector→motor de A1 y A3 usan el contrato canónico. Las pruebas de la API verifican dos CV ante los mismos filtros, precedencia de la búsqueda, lectura única del contexto, proyección mínima e invalidación de paginación por propietario o revisión. Las respuestas 401/403 detienen la lectura personal.

La revisión independiente emitió **GO** dentro de su alcance tras corregir y repetir los casos `No domino SQL\nPython`, `No manejo SQL. Python tampoco.`, `I lack experience with SQL.` y `Mi compañero tiene experiencia con SQL.`. Ninguno de ellos acredita esas habilidades. También se conserva la condición de nivel de un requisito aunque la fuente publique aparte el nombre corto de la herramienta. A3 conserva su naturaleza de experiencia declarada; A2 no recupera una versión vieja de un registro inválido en el caso defensivo sintético.

El código final pasó **`quality:gate`** completo: TypeScript, contratos críticos, contratos de informes y compilación de producción. También pasaron los dos contratos de fuente A4, ESLint focalizado y `git diff --check`. La compilación conserva los avisos existentes de importación Supabase en Edge y Browserslist desactualizado; no se modificaron dependencias o variables para ocultarlos.

La última pasada visual aislada emitió **GO** en 390×844 y 1440×1000 con la página, componentes, shell, estilos, fuentes y motor reales. Comprobó orientación distinta para dos perfiles, naturalezas CV/A1/A2/A3 correctas, seis respaldos pertinentes, paginación 18→36→40 sin duplicados, desplegables conservados, teclado, foco, controles de 44px y texto largo sin desbordamiento. Los estados parcial, vacío, no disponible y la recuperación 503/409/401 pasaron. No hubo peticiones externas ni errores de página. Axe detectó cero infracciones; las comprobaciones incompletas de atributos ARIA y contraste se registran aparte y no equivalen a una certificación integral.

La PR conserva la identidad exacta del commit/árbol y la comprobación remota de CI y preview. Depende de #241 mientras esa PR siga abierta. No se solicita ni ejecuta un merge en esta preparación.

La publicación en producción, el recorrido autenticado con esta versión y su aceptación permanecen como comprobaciones posteriores. La verificación del esquema no confirma la disponibilidad del CV de una cuenta. Esta primera versión usa el CV estructurado guardado por A3; no procesa automáticamente otros PDF o documentos subidos. El vocabulario y las equivalencias son explícitos y conservadores: un tema no reconocido queda pendiente de revisión, sin una inferencia de competencia. Los resultados del scraper y el estado de otros hitos A4 mantienen sus evidencias independientes.
