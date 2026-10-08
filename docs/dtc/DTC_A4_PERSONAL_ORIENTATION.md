# A4 — orientación personal con evidencia

Fecha de definición: 2026-10-08 UTC / 2026-10-07 Chile.

## Resultado acordado

El usuario confirmó que cada orientación del Radar debe relacionar el análisis y el trabajo realizado en DTC, el CV y las preferencias actuales con la información que efectivamente publica la oferta. Debe explicar por qué puede servir, qué lo respalda, qué falta confirmar y cuál es el siguiente paso.

La coincidencia con un título o filtro sigue siendo una explicación de búsqueda. La orientación personal adicional necesita evidencia pertinente de ambos lados. La ausencia de evidencia no demuestra ausencia de capacidad.

Hito: **DTC-A4-P01**. Estado: **in_progress**. La versión está publicada y el recorrido sin contexto personal está observado; falta un cruce positivo real entre CV estructurado, evidencia DTC y oferta. **DTC-A4-Q01 está verified** dentro del alcance de contenido, motivos de búsqueda, detalle y paginación observado a las 03:41:53 UTC. Las secciones fechadas conservan el estado histórico; la última sección contiene la aceptación actual.

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

## Verificación de la entrega — evidencia previa a publicación

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

En ese corte previo, la publicación en producción, el recorrido autenticado con esta versión y su aceptación permanecían como comprobaciones posteriores; sus observaciones finales se registran más abajo. La verificación del esquema no confirma la disponibilidad del CV de una cuenta. Esta primera versión usa el CV estructurado guardado por A3; no procesa automáticamente otros PDF o documentos subidos. El vocabulario y las equivalencias son explícitos y conservadores: un tema no reconocido queda pendiente de revisión, sin una inferencia de competencia. Los resultados del scraper y el estado de otros hitos A4 mantienen sus evidencias independientes.


## Baseline de ingesta y límite de aceptación — 2026-10-08, 03:22 UTC

La lectura agregada de DTCFINAL a **2026-10-08 03:22:24.699865 UTC / 00:22:24.699865 Chile** confirmó **153 ofertas guardadas: 152 activas y 1 stale**, con **93 verificadas dentro de 24 horas**. El slot nativo `165873` finalizó `success/ok` a las **03:15:05.576 UTC**, con **34 upserts confirmados y 1 invalidación**: Chiletrabajos-Antofagasta 11 upserts, Fintual 12 y Cabify 11. La diferencia frente a 121 filas guardadas es **32 filas netas nuevas**, no 34 inserciones. La evidencia completa de fuentes, fechas y límites está en [DTC_MULTISOURCE_OPPORTUNITY_COLLECTOR.md](DTC_MULTISOURCE_OPPORTUNITY_COLLECTOR.md#native-ingestion-baseline-before-pr-241242-publication--2026-10-08-0322-utc).

Esta ejecución corresponde al baseline de aplicación `8b776e9c171ec0c755fd3829b19bca804e8e74f8` y ocurrió antes de la publicación de las PR #241/#242. No acredita que la nueva orientación personal se haya publicado, que una cuenta tenga un CV o respaldo DTC pertinente, ni que las 93 ofertas se hayan mostrado con los filtros de esa cuenta. Tampoco vuelve a medir la presencia de requisitos, habilidades o modalidad: esos agregados conservan su corte anterior. **DTC-A4-P01 y DTC-A4-Q01 estaban `in_progress` en ese corte de ingesta**; su estado posterior se decide con las observaciones de publicación y aceptación de la sección final.

En la aceptación de los enlaces **Revisar mi CV** y **Preparar mi postulación**, comprobar el `href` demuestra el destino ofrecido, no su ejecución. La revisión de los destinos A3 identificó que una navegación GET puede activar `repairLegacyC2Completion` o `markA3JourneyVisited`; por tanto, no se considera que toda navegación GET sea de solo lectura. Este registro no atribuye una apertura de esos destinos ni cambios de progreso. La inspección de enlaces, la disponibilidad real del contexto personal y la ejecución de un recorrido con respaldo pertinente se documentarán con su alcance concreto al concluir la aceptación.


## Identidades de integración — registro intermedio de publicación

**Estado histórico intermedio:** las observaciones finales de READY y navegador que siguen sustituyen el estado BUILDING y los pendientes de publicación de esta sección.

La comprobación activa de publicación confirmó las identidades posteriores al baseline anterior:

- **PR #241:** merge `a1f6e03243fc2d6f614796f8d17c6fddfee58dda`, árbol `d07436567787cab31fdd6be7fdbe50d8bb467991`. Producción `dpl_Cr59jPuVQwdm2GWTYzJuQP8CcBuA` quedó READY a `2026-10-08T03:29:26.573Z`. Pasaron 9/9 comprobaciones anónimas y la sesión autorizada mostró las primeras 18 de 54 ofertas de Metropolitana en esa versión; no se afirma haber renderizado las 54 ni haber comprobado todavía la orientación de #242.
- **PR #242:** el head sincronizado `8e7f50814980f0db1dd44e4a7e08fcd2e6602f51` conservó el árbol revisado `1e5a41e906216e33a121c89f0cf62cf2d2d6b086` y pasó 10/10 ejecuciones CI tras ajustar su base. Se fusionó a main `172a09b94e266084c9d79be235053893db5ef549`, con ese mismo árbol.
- **Despliegue final de #242:** `dpl_JDvrrvfSwMdmghUionzASdAsEyDU`, observado en `BUILDING` al preparar este registro. La confirmación de READY, dominio canónico, ventana de errores y recorrido autenticado de esta versión queda pendiente de incorporar por la verificación activa.

Estas identidades, por sí solas, no cerraban **P01** ni **Q01**, que estaban `in_progress` en ese corte intermedio. El slot 165873 anterior y la publicación READY de #241 no prueban la orientación con respaldo personal en #242. Los resultados de la aceptación se agregarán con sus límites concretos, sin incluir datos privados ni presentar la inspección de un `href` como una visita al destino.

La observación provisional de #241 encontró una oferta real con descripción completa útil y con requisitos/habilidades explícitamente no identificados. Su ingesta precede al nuevo normalizador; la publicación no vuelve a estructurar automáticamente esa fila ni demuestra un nuevo cron. Q01 necesita comprobar contenido, motivo correcto, detalle accesible y paginación en la versión final. P01 debe continuar abierto si solo se observa contexto vacío, orientación de búsqueda u objetivo: falta entonces un cruce positivo real entre CV, evidencia DTC y oferta. Los destinos de preparación A3 no se abren en esta aceptación.


## Publicación final y aceptación de A4 — 2026-10-08, 03:41:53 UTC

La PR #242 quedó publicada, incorporando la PR #241, en main **`172a09b94e266084c9d79be235053893db5ef549`**, árbol revisado y desplegado **`1e5a41e906216e33a121c89f0cf62cf2d2d6b086`**. El head sincronizado `8e7f50814980f0db1dd44e4a7e08fcd2e6602f51` conservó el árbol del candidato original `e7da081347237e1b3fa393fcf3dca6c6bbe95c52` y pasó **10/10 ejecuciones CI**. Producción **`dpl_JDvrrvfSwMdmghUionzASdAsEyDU`** quedó **READY a `2026-10-08T03:35:24.835Z` / 00:35:24.835 Chile**. Las **10/10 comprobaciones anónimas** terminaron a **03:37:04.913 UTC**. La aceptación autenticada en `https://www.despegatucarrera.com/despega/a4/job-matching` se observó a **03:41:53 UTC / 00:41:53 Chile**. Este resultado sustituye el estado BUILDING del registro intermedio.

La sesión ya autorizada exploró Metropolitana y pasó de **18 a 36 de 54** ofertas, con 36 URL originales distintas. Una búsqueda controlada por cargo exacto, región y modalidad híbrida devolvió **1** oferta con motivos de búsqueda correctos. El registro público omite el texto de los filtros individuales. La exploración de todas las regiones completó **18 → 36 → 54 → 72 → 90 → 93 de 93** tarjetas, con **93 URL originales distintas: 47 Chiletrabajos, 26 Greenhouse y 20 Lever**. Al llegar al final desapareció la acción de cargar más.

Los detalles reales de empleador y Chiletrabajos mostraron descripciones disponibles útiles; los textos de detalle inspeccionados tenían **4.459 y 1.758 caracteres**, respectivamente. Se abrió con Enter el desplegable **Qué datos usamos**. Los detalles de las ofertas se abrieron con clic y se conservaron al paginar; su interacción con teclado conserva el alcance de la prueba aislada/sintética anterior. Se mantuvo la separación entre filtros borrador y aplicados, y la búsqueda guardada conservó su estado previo sin resultados. No se guardaron preferencias. No se publican fragmentos de ofertas ni evidencias personales en este registro.

Algunas filas antiguas conservan contenido de una sola línea y requisitos/habilidades explícitamente no identificados. Una descripción útil no acredita que se hayan extraído todos sus campos estructurados. La publicación no vuelve a ingerir esas filas ni demuestra estructuración retroactiva, histogramas nativos nuevos o cambios de fecha de verificación.

Las cinco fuentes personales — **CV, objetivo, A1, A2 y A3** — aparecieron **vacías**, sin fechas. Hubo **0 desplegables de respaldo personal** y una explicación **search_only** fiel a la búsqueda. No se fabricaron competencias, fragmentos, fechas ni un cruce positivo ante esa ausencia. La acción **Revisar mi CV** tenía el `href` comprobado **`/despega/a3/cv-builder-studio`**, pero **no se siguió el enlace** ni se abrió otro destino A3. La inspección del vínculo no es aceptación del recorrido de preparación, y una navegación GET de A3 puede activar escrituras de continuidad ya descritas.

| Hito | Estado actual | Alcance y pendiente |
|---|---|---|
| DTC-A4-Q01 | **`verified`** | Versión publicada, contenido real útil, motivo de búsqueda correcto, detalle accesible y paginación completa. No incluye histogramas de diagnóstico en un nuevo cron, estructuración retroactiva ni nueva ingesta |
| DTC-A4-P01 | **`in_progress`** | Publicación y recorrido vacío/search_only comprobados. Falta observar un cruce positivo real con un CV estructurado legítimo de A3, evidencia DTC pertinente y respaldo de la oferta visible. Las pruebas positivas sintéticas no sustituyen ese caso |
| DTC-A4-S01 | **`in_progress`** | Seis empleadores con visita nativa y 93 ofertas reales renderizadas; Coderio parcial y visita primaria natural de Get on Board pendiente al corte |
| DTC-A4-S02 | **`in_progress`** | Mantenimiento 3/3, persistencia e invalidación observados antes de esta publicación; activación/recuperación real de cooldown y rotación de un tablero grande aún pendientes |

No se guardó la búsqueda real ni se forzaron fallas o caducidad de sesión; tampoco se navegaron destinos A3. Los controles de recuperación y la orientación distinta entre perfiles mantienen el alcance aislado/sintético documentado. No se insertan evidencias ficticias para cerrar P01 ni se modifica el progreso para fabricar un caso positivo. Esta primera versión sigue leyendo el CV estructurado guardado por A3; no interpreta automáticamente otros PDF o documentos subidos.

Los **153 registros guardados / 93 frescos, 34 upserts y 32 filas netas nuevas** corresponden al baseline nativo anterior, slot 165873, observado a las 03:22 UTC. Las 93 tarjetas del navegador no prueban una nueva ingesta causada por esta publicación. La verificación de Supabase fue de solo lectura en DTCFINAL, sin cron manual, reintentos ni manipulación de leases. No hubo cambios de cuenta, evaluaciones, progreso, esquema, RLS, variables ni credenciales; la publicación no requirió migraciones ni variables nuevas. La ventana final de errores de ejecución se delimita en la sección siguiente; no es una afirmación de ausencia permanente de errores. Los nombres, correos, identificadores de cuenta, valores privados y fragmentos personales se omiten del registro público.


### Ventana final de ejecución y dictamen — 2026-10-08, 03:42:20 UTC

Se reconfirmaron el dominio canónico, main `172a09b94e266084c9d79be235053893db5ef549` y producción `dpl_JDvrrvfSwMdmghUionzASdAsEyDU` sin cambios. El agregado de errores del proyecto Vercel devolvió **0 grupos** desde READY, **03:35:24.835 UTC**, hasta **03:42:20 UTC**, e incluye el recorrido autenticado de A4. Es una ventana concreta del agregado del proyecto; no demuestra ausencia perpetua de errores ni exhaustividad de todos los logs de un despliegue.

La revisión de consola abarcó **38 registros capturados**, todos correspondientes a fallas de envío de metadatos de una extensión, con origen en su content script `chrome-extension`; el último mensaje observado fue a las **03:41:17.550 UTC**. En ese conjunto se observaron **0 errores de la aplicación DTC**. No se afirma que la consola tuviera cero errores: los 38 mensajes de extensión se mantienen separados de los hallazgos de DTC.

El dictamen independiente de esta publicación es **CONDITIONAL_GO**, con **Q01 verified y P01/S01/S02 in_progress** por las comprobaciones concretas pendientes ya descritas. La captura de producción se conserva de forma privada y no se incorpora al repositorio público.
