# Continuidad de A2 con registros de A3 y A4 — 2026-11-06

**AG05 continúa `in_progress`.** Este checkpoint verifica técnicamente la revisión del plan con registros declarados de A3/A4 y conserva confirmación explícita. La utilidad con participantes, la comparación con un baseline simple y el comportamiento de un modelo real todavía requieren evidencia separada.

Candidato publicado en UAT: `22d533d6e42f3663d2a46b9ca48116bf138c23f7`.
Árbol del candidato: `7b1c57f9f7fce14b439650865ebbdacef15b1725`.
Gate local final: **PASS**, sobre **30 fuentes estables**, con build de **354 páginas**.

Integración [42313235840](https://github.com/jcv86/main/actions/runs/42313235840), intento 1: **`success`, con 30 pasos del job en `success`**. El [resumen verificado](uat/a2-review-evidence-20261106/attempt-1/verified-ag05-summary.json) vincula el ZIP y los resultados reales de SQL, Auth, RLS y navegador con el candidato y árbol indicados. AG05 registró **4 casos SQL y 15 pasos de navegador aprobados**, con **8 auditorías axe, 0 violaciones y 8 resultados incompletos de contraste**. La sección 9 conserva la identidad del artefacto, las regresiones y los límites observados; este resultado técnico no cierra AG05.

## 1. Alcance implementado

A2 puede presentar los registros disponibles de Entrenamiento y Radar para que la persona decida qué mantener o revisar en su plan. La propuesta conserva el control en el formulario existente: leer una fuente, abrir sus detalles o pulsar la nueva llamada a revisión no guarda un plan ni modifica una práctica.

El nuevo panel **Antes de seguir** se incluye dentro de **Tu plan revisado** y usa `view.context.projection.reviewEvidence`, recibido mediante el GET existente de `/api/a2/plan`. No introduce otro endpoint, otra consulta desde el componente ni otra suscripción de autenticación. El panel deriva su sugerencia durante el render a partir del contrato compartido y la fecha de Santiago.

La implementación de UI de esta tarea está congelada en estos archivos:

| Archivo | Cambio |
| --- | --- |
| `components/a2-plan-evidence-review.tsx` | Presentación de la sugerencia, estados por fuente, resúmenes, fechas, enlaces y botón de revisión. |
| `components/a2-reviewed-plan.tsx` | Montaje del panel desde la vista existente y devolución del foco al borrador sin reemplazarlo. |
| `components/a2-chat-coach.tsx` | Únicamente el espacio explícito entre la frase de cambio de sesión y el enlace para volver a abrir el asistente. |
| `scripts/test-a2-plan-review-evidence-ui.mjs` | Harness local con componentes, AppShell y CSS reales; Auth y HTTP sintéticos. |

Fuentes: [panel](../../components/a2-plan-evidence-review.tsx), [plan](../../components/a2-reviewed-plan.tsx), [chat](../../components/a2-chat-coach.tsx).

## 2. Experiencia y protección de la edición

El panel muestra una recomendación determinista con título, motivo y, cuando existe, una acción que la persona puede revisar. No predice capacidad, contratación ni impacto de la plataforma. Sus detalles están detrás de **Ver registros usados**, para que la vista normal pueda mantenerse compacta.

| Situación | Comportamiento visible |
| --- | --- |
| No existe plan ni borrador | **Revisar antes de preparar mi plan** abre el editor existente. El nombre evita duplicar el botón anterior **Preparar mi plan**. |
| Existe plan y no hay borrador | **Revisar mi plan** abre una copia editable mediante el comportamiento existente. |
| Existe un borrador | **Volver a mi edición** enfoca su propósito y conserva lo escrito. |
| Cambió una fuente o el contexto | Se muestran los registros actuales; el borrador permanece. La persona debe pulsar **Revisé los cambios y quiero conservar mi borrador** y después confirmar el guardado. |
| Una fuente aplicable no puede verificarse | Se mantiene visible la evidencia parcial disponible, el plan y la edición. La nueva confirmación permanece bloqueada. |
| Hay un envío de resultado incierto | El botón de revisión queda deshabilitado. El reintento mantiene el comando pendiente original. |
| Cambia la cuenta o se invalida la sesión | La frontera de identidad del componente existente retira los datos personales y descarta respuestas tardías de la cuenta anterior. |

La confirmación sigue siendo **Guardar y activar plan**. El panel no rellena una acción profesional ni decide una adaptación por la persona. Si ya hay un borrador, tampoco lo reemplaza por texto procedente del modelo o de A3/A4.

Los estados de fuente tienen significados distintos: `missing` indica una consulta válida sin un registro pertinente; `unavailable` indica que no se pudo verificar; `locked` indica que la fuente no está habilitada; `not_applicable` indica que no corresponde al camino Persona. La UI conserva esas distinciones y no convierte un fallo de lectura en una afirmación de falta de progreso.

Los resúmenes visibles se limitan a 300 caracteres por campo y remiten a rutas internas permitidas. Todos los registros mostrados obtienen su enlace desde `a2ReviewSourceRefs(evidence)`. La lista de referencias priorizadas de una sugerencia no se reutiliza como si contuviera todas las fuentes del panel.

Las fechas de registros se presentan con `America/Santiago`; una fecha elegida sin hora conserva su día calendario. **Fecha elegida para revisar** representa `reviewOn`. **Registro actualizado** representa `updatedAt`; cuando es distinto se muestra además `reviewedAt` como **Revisión registrada**. Esas etiquetas evitan presentar una fecha prevista como el momento real de la revisión.

La revisión de React mantiene un componente de presentación sin estado duplicado, sin efectos de sincronización ni fetch propios. La sugerencia se deriva durante el render; el evento de revisión utiliza el foco y el editor existentes. Se conservaron etiquetas, detalles nativos, foco visible, botones de altura mínima de 44 píxeles y texto que puede envolver en móvil. No se incorporaron dependencias nuevas.

## 3. Qué significan las fuentes

El contrato es `dtc-a2-review-evidence.v1`. Se valida en el límite compartido; la UI utiliza `A2ReviewCapture` de ese contrato, no un tipo legado de captura con supuestos diferentes.

| Fuente | Selección y contenido | Límite de interpretación |
| --- | --- | --- |
| A3 | `dtc_outcome_observations`, instrumento `a3_structured_interview`, versión `2-capture`, última captura `baseline` y última `follow_up`, ordenadas por `observed_at` e identificador. | Son respuestas declaradas. `evaluationStatus` es `not_evaluated` y `comparable` es `false`. Tener dos registros no acredita mejora de capacidad. |
| A4 | Lectura directa de `a4_decision_log`: próxima decisión abierta por fecha de revisión y última revisión cerrada. Conserva decisión, evidencia esperada, resultado declarado, clasificación y fechas. | Una clasificación o un elemento de `externalOutcomes` sigue siendo una declaración de la persona. No prueba un evento externo ni causalidad. |

El lector de A3 exige que los campos de puntuación, escala y confianza sean nulos y que `dimensions` esté vacío. Excluye las observaciones antiguas con puntuaciones. A4 se toma de la bitácora directa; no se usan como medida de capacidad los outcomes antiguos derivados de longitud o clasificación.

El orden temporal de A3 se hace explícito: pareja inicial/seguimiento en orden, sólo inicial, sólo seguimiento, vacía o fuera de orden. Una pareja en orden sólo permite invitar a contrastar respuestas; no produce un delta numérico. Una pareja invertida no se describe como antes y después.

Completar una práctica, declarar un paso como realizado, una evaluación válida y un resultado externo son categorías diferentes. Esta entrega añade continuidad basada en registros declarados. No convierte completions, XP, cantidad de texto ni cantidad de registros en competencia demostrada.

Fuentes: [contrato compartido](../../lib/a2/review-evidence-contract.ts) y [lector de fuentes](../../lib/a2/review-evidence-service.ts).

## 4. Hash del plan y compatibilidad

`reviewEvidence` es opcional dentro de la proyección de contexto v1. Su ausencia en un snapshot guardado anteriormente no inserta un valor por defecto ni reescribe el hash histórico. El lector puede seguir validando los snapshots v1 anteriores tal como fueron guardados.

Las lecturas actuales incorporan la evidencia validada en la proyección. Cambios de contenido, referencias, disponibilidad o fechas pertinentes alteran la huella SHA-256 calculada sobre JSON canónico. Los instantes se normalizan a UTC conservando seis decimales, para no perder una modificación de microsegundos. `capturedAt` y el día usado para mostrar una sugerencia no se agregan a la proyección hasheada. El simple paso del tiempo no cambia artificialmente esa huella.

Un plan antiguo puede, por tanto, seguir siendo legible y aparecer como necesitado de revisión frente al contexto ampliado actual. El mecanismo existente de revisión explícita conserva su contenido y vuelve a confirmar la intención contra el nuevo contexto. No hay migración automática de intención ni guardado por una lectura.

La compatibilidad acreditada corresponde al lector nuevo leyendo snapshots anteriores. Este checkpoint no verifica una reversión a un lector anterior a AG05 después de haber guardado el campo nuevo; esa comprobación pertenece a la preparación del destino de publicación.

La versión y revisión del plan, el hash esperado, los recibos y el reintento exacto siguen usando el protocolo existente. Si un envío ya pudo haberse confirmado, una fuente nueva no permite sustituir ese comando pendiente por otro. Primero se recupera el resultado de la solicitud original; una nueva edición necesita una nueva confirmación.

Una fuente aplicable `unavailable` impide un guardado o una reanudación que necesite contexto nuevo. Una fuente verificada como `missing`, `locked` o `not_applicable` no se confunde con una lectura fallida. El plan y los datos parciales siguen disponibles para revisión cuando la respuesta permite recuperarlos. Las operaciones de estado que no consumen un contexto nuevo, como pausar o cancelar, conservan sus reglas existentes; recuperar un recibo previo tampoco crea otra revisión.

La huella representa una lectura fechada. No es un bloqueo ni una transacción atómica entre todas las fuentes A3/A4 y el plan. Las fuentes pueden modificarse de forma independiente; no debe describirse este cambio como una garantía de aislamiento total entre esas tablas.

Fuentes: [contrato del plan](../../lib/a2/plan-contract.ts), [contexto y hash](../../lib/a2/plan-context.ts) y [ruta del plan](../../app/api/a2/plan/route.ts).

## 5. Persona, acceso e identidad

El lector recibe el actor autenticado, su flujo y los permisos canónicos. Comprueba la identidad antes y después de las lecturas. Ejecuta como máximo cuatro SELECT acotados mediante el cliente del propietario y sus políticas; las lecturas usan una señal de aborto de ocho segundos.

En Persona, A3 y A4 son `not_applicable` y no se consultan esas fuentes profesionales, incluso si existen datos históricos de ellas. En otros caminos, A3 requiere su acceso; A4 requiere su acceso y disponibilidad canónica del Radar. Las fuentes bloqueadas devuelven `locked` sin leer su contenido.

Las rutas actuales de plan y acciones autorizan piloto, actor y acceso a A2. Obtienen el journey con `getJourneyForCurrentUser('read-only')`: una lectura rechazada o sin journey no debe crear la fila canónica. Una falta de journey se trata como falta de acceso; una identidad diferente se trata como cambio de sesión.

La ruta del coach también retira toda orientación parcial cuando falla la carga del contexto antes de la verificación final. Si el lector detecta una identidad distinta devuelve `409 session_changed`; si Auth no se puede comprobar devuelve `503 session_verification_unavailable`. Ambos errores se manejan también en la relectura posterior al modelo y omiten orientación, respuesta y propuesta. Las regresiones comprueban que una verificación posterior aparentemente correcta no permita recuperar contenido de una lectura de identidad fallida.

En el navegador, el nuevo panel queda dentro del ciclo de vida de `A2ReviewedPlan`. No retiene datos por su cuenta ni escapa a su purga por cambio de cuenta. El harness local comprueba retirada del contenido y rechazo de una respuesta tardía bajo Auth sintético; la garantía de Auth/RLS real debe atribuirse a la evidencia de integración correspondiente.

Fuentes: [servicio de evidencia](../../lib/a2/review-evidence-service.ts), [ruta del plan](../../app/api/a2/plan/route.ts), [ruta de acciones](../../app/api/a2/assistant-actions/route.ts), [ruta del coach](../../app/api/despega/a2-coach/route.ts) y [regresiones de assistant](../../scripts/test-a2-assistant.cjs).

## 6. Modelo y confirmación AG04 ampliada

El asistente y el swarm reciben una proyección compartida de tipo `recorded_user_declarations`. Mantiene la disponibilidad de cada fuente, las fechas y los límites semánticos. La proyección elimina identificadores de registro y enlaces de los campos permitidos; no debe presentarse como un filtro general de toda información personal que pueda existir en texto libre.

Las instrucciones incorporan explícitamente que A3 no está evaluado, que A4 no representa verificación independiente ni causalidad y que el plan contiene intenciones revisadas. La respuesta puede proponer contrastar, mantener o revisar; la persona edita y confirma en su formulario. No se fabrica un día A2 pendiente cuando el siguiente paso canónico corresponde a A3 o A4.

La ruta vuelve a leer la evidencia y el plan después de la generación. Si los registros cambiaron durante esa generación, rechaza la respuesta basada en el contexto anterior y conserva la pregunta para volver a enviarla. Esta comprobación sigue siendo una lectura fechada, no un bloqueo sobre las fuentes.

La confirmación AG04 incorpora el mismo snapshot ampliado tanto al proponer un ajuste revisado como al GET/POST de acciones. Una confirmación nueva debe coincidir con el hash y el día canónicos actuales; un cambio de fuente puede exigir revisión aunque el texto del ajuste no haya cambiado. La huella enviada por el navegador no concede autoridad: el servidor construye el snapshot.

Los recibos AG04 ya confirmados se consultan antes de las precondiciones mutables, con una segunda consulta ante una posible carrera. Su replay recupera el efecto actual y no restaura contenido borrado. La ampliación del contexto no habilita otra escritura ni cambia la exigencia de confirmación explícita.

La combinación específica de una confirmación AG04 con cambios de fuentes A3/A4 se cubre mediante pruebas de la ruta real con puertos sintéticos. Se mantiene separada de la regresión AG04 con Auth/SQL/navegador reales y del navegador AG05, que revisa el plan con fuentes reales. Las fixtures de historial completo de AG05 ya no tienen un día A2 pendiente; no se fabricó uno para presentar esa combinación como una prueba integrada.

El swarm sigue deshabilitado por defecto: `DTC_A2_SWARM_MODE` ausente u `off` selecciona baseline. Activar el canary requiere configuración explícita válida, incluido `DTC_A2_SWARM_KILL_SWITCH=false`; una configuración ausente permanece cerrada. Esto no equivale a desactivar toda respuesta baseline ni acredita la calidad de ningún proveedor real. La nueva UI determinista no necesita una llamada de modelo para mostrar las fuentes del plan.

Fuentes: [proyección e instrucciones baseline](../../lib/a2/assistant-contract.ts), [runtime del swarm](../../lib/a2/swarm/runtime.ts), [selección del canary](../../lib/a2/swarm/canary.ts), [ruta del asistente](../../app/api/despega/a2-coach/route.ts), [API de acciones](../../lib/a2/assistant-action-api.ts).

## 7. Evidencia local de UI, separada de integración

La corrida final local v3 pasó **55 comprobaciones**, con **8 auditorías axe, 0 violaciones y 8 resultados `incomplete` de `color-contrast`**. El último número describe ocho auditorías con revisión automática incompleta; no son ocho violaciones ni una certificación de contraste. Los resultados originales conservan sus nodos y el detalle de cada caso.

Se usaron Chromium 153.0.8010.0, viewports de 390×844 y 1440×844 y fuentes de sistema Arial/Georgia. AppShell, chat, plan, panel, contratos y estilos son reales; Auth y HTTP son sintéticos. El harness registra cero errores JavaScript no capturados, cero solicitudes externas y hashes de fuentes iguales al comienzo y al final de la corrida.

La cobertura incluye abrir y enfocar el editor por teclado; ausencia de escritura al leer/preparar; guardado explícito; preservación de borrador ante relectura, conflicto e indisponibilidad; reconocimiento de contexto nuevo; comando incierto y reintento idéntico; purga al cambiar de cuenta; estados missing/locked; Persona sin navegación profesional en el panel; enlaces a todos los registros mostrados; etiquetas de fechas; desbordamiento y el arreglo del espacio en la alerta de cuenta.

Se inspeccionaron las ocho capturas existentes, cuatro estados en ambos tamaños: revisión, cambio de fuente, fuente no disponible y Persona. No se observó un nuevo defecto visual que justificara cambiar fuentes. La inspección no resuelve los resultados incompletos de axe.

Hay límites visibles del harness: las capturas full-page fueron tomadas después de scroll y teclado, de modo que los elementos fijos aparecen a la altura del viewport desplazado; el sidebar desktop usa una fixture de acceso que conserva A4 bloqueado mientras otra fixture proporciona evidencia A4 al panel. Esta evidencia no debe utilizarse para afirmar consistencia de permisos reales. El input nativo de fecha usa la configuración regional del navegador.

Los intentos locales se conservan separados: el primero pasó 51 comprobaciones y ocho auditorías antes de las correcciones de enlaces/etiquetas; v2 completó 32 comprobaciones y cuatro auditorías antes de fallar por una aserción de foco que se adelantó al `requestAnimationFrame` existente. Se corrigió la sincronización del harness, sin cambiar ese comportamiento de foco del producto. v3 es la corrida final de estas fuentes.

Evidencia: [resultados locales v3](uat/a2-review-evidence-20261106/local-ui/a2-plan-review-evidence-ui.json), [revisión visual y hashes de ocho capturas](uat/a2-review-evidence-20261106/local-ui/visual-review.json), [harness](../../scripts/test-a2-plan-review-evidence-ui.mjs).

## 8. Gate local del candidato

El [gate local final](uat/a2-review-evidence-20261106/local-quality.json) terminó **PASS** sobre **30 fuentes que permanecieron estables** durante su ejecución. Incluye TypeScript y build de **354 páginas**. La identidad del candidato y de su árbol aparece al inicio de este documento; los logs y hashes deben conservarse junto a la evidencia del gate.

Las suites finales registradas en ese gate son:

| Suite | Casos aprobados |
| --- | ---: |
| Assistant | 128 |
| Swarm | 108 |
| Provider | 42 |
| Canary | 56 |
| Reader de evidencia A3/A4 | 64 |
| Action API | 76 |
| Action contract | 28 |
| Plan | 56 + 39 |

Estos conteos corresponden a sus suites técnicas. No se suman a las 55 comprobaciones del harness local de UI ni representan ejecuciones de participantes. Las pruebas de provider y canary verifican sus contratos y controles; no acreditan una evaluación de calidad con un proveedor real.

La corrección de privacidad de Auth descrita en la sección 5 está incluida en el candidato y sus regresiones de assistant: una lectura con identidad fallida no puede devolver orientación parcial, respuesta o propuesta aunque una comprobación posterior parezca correcta.

## 9. Integración verificada

### Procedencia y resultados observados

La ejecución [42313235840](https://github.com/jcv86/main/actions/runs/42313235840) terminó `success` en su primer intento; sus 30 pasos del job constan como `success`. Los [metadatos de CI](uat/a2-review-evidence-20261106/attempt-1/ci-run.json), el [resumen verificado](uat/a2-review-evidence-20261106/attempt-1/verified-ag05-summary.json) y el [verificador conservado](uat/a2-review-evidence-20261106/attempt-1/verify-ag05-ci-artifact.py) fijan la siguiente identidad:

| Dato | Valor verificado |
| --- | --- |
| Candidato | `22d533d6e42f3663d2a46b9ca48116bf138c23f7` |
| Árbol | `7b1c57f9f7fce14b439650865ebbdacef15b1725` |
| Rama | `uat/dtc-20261106` |
| Artefacto | `13548784558` — `a1-browser-evidence-22d533d6e42f3663d2a46b9ca48116bf138c23f7` |
| ZIP | **21.825.666 bytes** |
| SHA-256 del ZIP | `6f83ca7bfb984cd65e2bc50d3798dc42506da4c1eed879c791a12ef7928da1bc` |
| Extracción | **137 archivos**, con todos sus bytes cotejados contra el ZIP y sin archivos adicionales |
| Vencimiento del artefacto en CI | `2026-11-13T23:51:08Z`, según los metadatos |

El verificador terminó **PASS**. Cotejó tamaño y digest con los metadatos, CRC y bytes extraídos, identidad de corrida/candidato/árbol y hashes de las fuentes copiadas en cada fase. Las dimensiones y hashes de los PNG se contrastaron con `layout.document` y el manifiesto original; un viewport de 1440 o 390 px no se supuso idéntico al ancho del documento. Esta verificación atribuye y comprueba los registros producidos por CI; no vuelve a ejecutar SQL o el navegador ni sustituye la inspección visual.

Los conteos siguientes proceden de casos y pasos efectivamente registrados, todos aprobados. Las regresiones se ejecutaron sobre el nuevo candidato; no reemplazan los cierres históricos de AG03 y AG04.

| Fase | Fuentes de aplicación copiadas y verificadas | Casos SQL | Pasos de navegador | Auditorías axe | Violaciones | Resultados `incomplete` |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Regresión AG03 | 27 | 22 | 17 | 8 | 0 | 7 |
| Regresión AG04 | 31 | 20 | 13 | 8 | 0 | 7 |
| AG05 | 41 | 4 | 15 | 8 | 0 | 8 |

Los advisors de las tres fases registraron **0 hallazgos del candidato y 0 hallazgos totales del laboratorio**, con Supabase CLI 2.117.0. Los 15 pasos AG05 se distribuyen en ocho desktop, cinco mobile y dos de acceso. Las fuentes y sus hashes constan en el [scope AG05](uat/a2-review-evidence-20261106/attempt-1/a2-review-evidence-scope.json) y el resumen verificado; los resultados originales de [SQL](uat/a2-review-evidence-20261106/attempt-1/a2-review-evidence-sql.json), [navegador](uat/a2-review-evidence-20261106/attempt-1/a2-review-evidence-browser-results.json) y [advisors](uat/a2-review-evidence-20261106/attempt-1/a2-review-evidence-advisors.json) conservan el detalle.

### Preparación, persistencia y límites de acceso reales

La fase AG05 usa Auth, sesiones, rutas de aplicación, PostgreSQL y RLS reales en el stack local desechable. El [seed](uat/a2-review-evidence-20261106/attempt-1/a2-review-evidence-seed.json) crea cuatro propietarios sintéticos: dos profesionales habilitados, uno Persona con datos profesionales históricos y uno con A2 habilitado pero A3/A4 bloqueados. Tres reciben 90 días A2, diez módulos A3 y cierre de ruta como preparación del acceso canónico. Son fixtures de acceso, sin QA entitlements; no representan completions de participantes ni resultados de capacidad.

Cada propietario recibe dos capturas A3 sin puntuación de versión `2-capture`, una observación numérica v1 más reciente que debe ignorarse, una señal A4 y dos decisiones A4, abierta y cerrada. Se verificaron las migraciones existentes aplicadas dos veces; AG05 no añade esquema ni migración. Las políticas actuales permiten SELECT del propietario sobre las fuentes y mantienen las escrituras directas denegadas al cliente autenticado. Los cambios de A3 y la revisión de A4 usados por el navegador pasan por sus APIs autorizadas de servidor.

Los cuatro casos SQL acreditan RLS y grants de sólo lectura, aislamiento entre propietarios, ausencia de divulgación al rol anónimo y denegación de INSERT/UPDATE/DELETE directos incluso para el propietario. Esta suite no crea más usuarios. Conserva las filas existentes y comprueba los **17 propietarios previos** del laboratorio. Las suites SQL heredadas AG03/AG04 limpiaron sus propietarios auxiliares y preservaron las fixtures del navegador.

Las comparaciones de invariancia toman el baseline después del setup y cotejan filas completas de siete tablas: `despega_user_profiles`, `despega_journey_state`, `a2_user_task_completions`, `a3_user_progress`, `a3_route_progression`, `user_gamification_profile` y `user_dtc_balance`. La revisión y persistencia del plan en desktop y mobile conservaron esas siete tablas. Los resultados registran las aserciones y el alcance; no exportan snapshots privados de filas.

### Revisión del plan observada en navegador

| Escenario | Efecto comprobado |
| --- | --- |
| Lectura inicial y actualización de vista | Selecciona capturas v2 del propietario y decisiones A4 fechadas; excluye la observación numérica v1 más reciente y no guarda por leer o refrescar. |
| Confirmación explícita | Guarda la evidencia revisada mediante el CAS, historial y recibo existentes del plan. |
| Nueva respuesta A3 mediante su API real | El hash anterior recibe 409; conserva la edición y exige revisión explícita antes de guardar el snapshot actual. |
| Revisión A4 mediante su API real | Cambia el contexto de declaraciones fechado y actualiza el snapshot guardado sólo después de revisar y confirmar el plan. La clasificación `decision_changed` y `no_external_change` no se traducen en una mejora acreditada. |
| SELECT de A4 revocado como fallo controlado | Devuelve `unavailable`, no `missing`; rechaza un nuevo guardado con 503, preserva el plan y recupera la lectura al restituir el permiso. |
| Captura v2 más reciente con puntuación, introducida como fallo controlado | Declara la fuente `unavailable`; no rescata una captura anterior válida para ocultar el dato inválido. |
| Eliminación local declarada de decisiones A4 en móvil | Devuelve `missing`, cambia el hash y ofrece revisar las respuestas A3 sin puntuación; sólo la confirmación actualiza el snapshot. |
| Replay exacto y recarga | Recupera el recibo anterior junto al plan actual y vuelve a leer su snapshot sin crear otra revisión. |
| Persona, acceso bloqueado e identidad | Omite ambas lecturas profesionales aun con datos presentes y permisos SELECT revocados; rechaza acceso anónimo, actor esperado diferente y piloto revocado sin efectos laterales. |

El navegador AG05 registró **0 solicitudes de modelo y 0 respuestas de generación sustituidas**. Su panel es determinista; sus fuentes sintéticas se almacenan y consultan en tablas reales. Las regresiones heredadas mantienen sus estímulos de generación y fallos declarados. No se suman a este alcance las pruebas locales de Auth/modelo con puertos sintéticos ni la combinación AG04+A3/A4 descrita en la sección 6.

### Accesibilidad, solicitudes abortadas y revisión visual

AG05 conservó **8 resultados `incomplete` de `color-contrast`**, uno en cada auditoría; son ocho resultados de regla/auditoría, no ocho violaciones ni necesariamente ocho elementos distintos. Permanecen abiertos. Las cifras de AG03 y AG04 también conservan sus siete incompletos por fase.

El navegador AG05 registró **14 abortos auxiliares `net::ERR_ABORTED`**: siete GET de `/api/banco-central-data` y siete de `/api/a4-strategic-score`. No registró fallos de transporte en los endpoints de plan, captura o decisiones ejercitados por AG05. Hubo **0 errores JavaScript y 0 hosts externos bloqueados**, sin desbordamiento horizontal observado. Estos resultados no deben resumirse como cero fallos de red; el JSON conserva cada aborto.

La [revisión visual final](uat/a2-review-evidence-20261106/attempt-1/visual-review.json) inspeccionó **nueve PNG**: ocho estados AG05 y la captura AG04 de cambio de cuenta. No observó nuevos defectos visuales accionables y confirmó la separación visible del aviso y su enlace. El [seguimiento AG04](DTC_A2_REVIEWED_ACTIONS_20261106.md#seguimiento-2026-11-06--separación-del-aviso-de-cambio-de-cuenta) cierra ese detalle cosmético con la captura nueva y conserva el fallo y cierre históricos. Esta revisión visual no cierra los incompletos de axe ni equivale a UAT con participantes.

La evidencia corresponde a Chromium con viewports de 1440×844 y 390×844; las capturas full-page tienen alturas mayores. No acredita hardware táctil ni Safari, consistencia de un esquema alojado o comportamiento de un proveedor de modelo real. Los archivos se conservan bajo `uat/a2-review-evidence-20261106/attempt-1/`.

La [planilla UAT, versión 7](uat/a2-review-evidence-20261106/uat-workbook.json), conserva la identidad del mismo archivo. Añade `Protocolo!A139:C164` y la referencia `Control!B53:F53`. La comparación nativa conserva **2.126 celdas previas**, sus valores, fórmulas, estilos, tablas y validaciones, con cero diferencias; el escaneo de fórmulas no detectó errores. Se exportó, reabrió y revisó en cinco capturas antes de guardar. El archivo final pesa **48.335 bytes** y tiene SHA-256 `49ebf57d371bc0a606b3d7541cb748807bf7e08e175e0ab496832f418bf645bc`.

## 10. Límites del checkpoint

Este documento acredita el checkpoint técnico local y la integración descrita en la sección 9 con sus artefactos verificados. No representa una nueva ejecución de los **54 casos manuales NO EJECUTADO** ni cambia la aceptación previa del propietario.

No se midió con participantes si la recomendación es útil, comprensible o suficiente para decidir un próximo paso, ni se realizó la comparación de utilidad con un baseline simple. No se evaluó un modelo real ni una mejora de capacidad, contratación u otro resultado externo. Las sugerencias compartidas son reglas deterministas que necesitan evaluación de utilidad además de pruebas técnicas.

AG05 permanece `in_progress`. La versión 7 de la planilla registra este avance técnico y conserva los casos manuales y la aceptación original. El candidato publicado en UAT no implica una activación del swarm, un despliegue de producción ni una aceptación nueva del propietario. La evaluación de utilidad, el modelo real y la preparación de migración/despliegue/smoke/reversión en el destino autorizado siguen pendientes en sus ámbitos respectivos.
