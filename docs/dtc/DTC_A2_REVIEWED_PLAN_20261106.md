# DTC — plan revisado y memoria de Tu Ruta

Fecha: 6 de noviembre de 2026, America/Santiago. Hito: **DTC-AG-03**.
Rama de entrega: `uat/dtc-20261106`. Base: `46873761b02595173943dec9a9c37b0a5e1e1889`.
Candidato inicial y gate local anterior: [`bb6523d70a96a1bef15284fd55b656482658c9a6`](https://github.com/jcv86/main/commit/bb6523d70a96a1bef15284fd55b656482658c9a6).
Candidato de aplicación y gate local final: [`b9a017db939d8a060c9696312987a93381132cea`](https://github.com/jcv86/main/commit/b9a017db939d8a060c9696312987a93381132cea).
Candidato de integración vigente, sexto intento: [`f86177717d701de24dea323058c791472fd9d23c`](https://github.com/jcv86/main/commit/f86177717d701de24dea323058c791472fd9d23c), árbol `73c38830c04401590d33912fdbb160e7195a502c`.
Corrida verificada: [42300106261](https://github.com/jcv86/main/actions/runs/42300106261), **`success`**.

**Estado: `verified` en alcance de laboratorio desechable.** La sexta corrida terminó en `success` sobre `f861777`: 22 casos SQL, 17 pasos de navegador, ocho auditorías axe sin violaciones y advisors sin hallazgos. La migración se aplicó dos veces; el preflight y el retorno real a la aplicación registraron transiciones nativas con eventos `isTrusted`. Se verificaron las 14 fuentes copiadas y el digest del artefacto. El gate local final mantiene su atribución a la aplicación de `b9a017d`; este cierre técnico no añade aceptación humana, despliegue remoto ni evaluación con IA real.

La [carpeta de evidencia de AG03](uat/a2-reviewed-plan-20261106/) conserva los cinco intentos fallidos y el [sexto intento verificado](uat/a2-reviewed-plan-20261106/attempt-6/ci-run.json), con su [resumen comprobado](uat/a2-reviewed-plan-20261106/attempt-6/verified-summary.json). Este bloque continúa la [coordinación canónica](DTC_AGENTIC_COORDINATION_20261106.md) y el [enjambre A2](DTC_A2_SWARM_20261106.md). La aceptación del responsable para `7eb0544` y los estados originales de los 54 casos manuales permanecen en [su acta](DTC_UAT_ACCEPTANCE_20261106.md); no se extienden retrospectivamente a este código.

## Resultado para la persona

La página del asistente incorpora «Tu plan revisado». La persona redacta o revisa un propósito, las restricciones que quiere respetar, entre uno y cinco pasos y una fecha de revisión. Sólo una confirmación explícita guarda y activa el plan. Al volver se recupera la revisión confirmada, junto con su estado y la disponibilidad del contexto actual.

El plan puede editarse, pausarse, retomarse, marcarse como realizado, cancelarse o eliminarse. El texto de una respuesta del asistente no ejecuta esas operaciones. La conversación sigue durando sólo mientras está abierta la página; no se persiste como memoria por defecto. El borrador de una edición tampoco se guarda automáticamente: la recuperación entre sesiones corresponde a la versión ya confirmada.

Los pasos `reported_done` y `skipped` son declaraciones de la persona. Completar el plan no completa un día A2, no acredita una competencia, no concede acceso, no modifica desbloqueos ni suma XP. La continuidad usa siempre el siguiente destino calculado por el recorrido canónico, sin un enlace ejecutable almacenado en el plan.

## Contrato revisado

`lib/a2/plan-contract.ts` es compartido por servidor y navegador y no importa clientes de base de datos, `node:crypto` ni otros módulos exclusivos del servidor. Los objetos son estrictos y versionados; los campos adicionales no se convierten en instrucciones o privilegios.

| Campo | Contrato |
|---|---|
| Versión de contenido | `dtc-a2-plan.v1` |
| Propósito | Texto revisado, entre 1 y 500 unidades UTF-16 después de quitar espacios exteriores |
| Restricciones | Texto de hasta 1.000 unidades UTF-16; puede estar vacío |
| Pasos | Entre 1 y 5, con UUIDs únicos que conservan su identidad al editar |
| Título y acción de cada paso | Hasta 120 y 600 unidades UTF-16, respectivamente; ambos obligatorios |
| Estado del paso | `pending`, `reported_done` o `skipped` |
| Nota del paso | Opcional, hasta 300 unidades UTF-16 |
| Fecha de revisión | Fecha de calendario real; al guardar o retomar, desde hoy hasta hoy + 30 días, inclusive, en America/Santiago |
| Tamaño del contenido | Hasta 12.000 bytes de JSON UTF-8 normalizado |
| Texto almacenable | Se rechazan NUL y surrogates UTF-16 sueltos; se aceptan pares Unicode válidos |

El día elegido sigue vigente durante esa fecha; el plan vence cuando la fecha de revisión es anterior a hoy. No se programa una notificación, un trabajo en segundo plano ni una escritura automática al vencer. La vigencia se evalúa al consultar, guardar, retomar o preparar contexto para el asistente.

Un ajuste previo sólo se propone para el día pendiente exacto del recorrido. Si su próxima acción excede los 600 caracteres de un paso, la interfaz muestra el ajuste íntegro como referencia y pide una acción más breve; no recorta silenciosamente la intención guardada.

### Estado del plan y vigencia del contexto

El ciclo de vida y la frescura son dimensiones distintas. Un plan puede conservarse activo y aparecer como vencido o con contexto cambiado; en esas condiciones no entra al modelo como memoria vigente.

| Operación confirmada | Precondición y resultado |
|---|---|
| Guardar | Revisión esperada y hash del contexto coinciden con la lectura del servidor; contenido y fecha válidos. Crea una nueva revisión activa, también después de cancelación, finalización o eliminación. |
| Pausar | Sólo desde activo; conserva contenido y referencias. |
| Retomar | Sólo desde pausa, con contexto actual disponible e idéntico al revisado y fecha vigente. Si cambió, se requiere revisar y guardar una nueva versión. |
| Marcar realizado | Desde activo o pausa; ningún paso pendiente y al menos uno declarado `reported_done`. No infiere resultados canónicos. |
| Cancelar | Desde activo o pausa, incluso si el contexto cambió o la fecha venció. Conserva el contenido para su revisión posterior. |
| Eliminar contenido | Desde cualquier plan existente; purga el contenido y sus revisiones. Conserva únicamente el slot y los recibos necesarios para evitar que un reintento antiguo lo restaure. |

La frescura se expresa como `none`, `current`, `changed`, `unavailable` o `expired`. Una lectura fallida nunca se presenta como `none`. Si existe contenido confirmado pero no puede verificarse el contexto, la interfaz conserva el plan y explica que no está listo para activarse como contexto vigente.

## Fuentes, hash y alcance temporal

La proyección explícita contiene el camino Persona, Profesional o Ambos; el horizonte activo; el `flow.next` completo; días registrados como completados; estado del checkpoint y disponibilidad del radar; el resumen del objetivo confirmado cuando corresponde; el ajuste del día pendiente; procedencia y limitaciones. No incluye conversación, respuestas de evaluación ni puntajes A1.

Las referencias usan los campos existentes del contexto guiado: `recordId` y `recordedAt`. El objetivo se identifica con su ID y `updated_at`; el ajuste, con su ID y `created_at`. El recorrido derivado se identifica mediante el contenido de la proyección, sin inventar un contador de revisión. Persona no consulta ni hereda un objetivo laboral como requisito.

Cada fuente distingue un registro disponible, una ausencia verificada (`missing`) y una lectura indisponible (`unavailable`). Omitir una lectura relevante tampoco equivale a verificar que no hay registro. La función compartida `a2PlanProjectionAvailable` mantiene la misma regla al construir y recuperar snapshots.

El servidor calcula SHA-256 sobre JSON estable de la proyección mínima realmente consumida. Ordena las claves y normaliza fuentes y días; excluye `capturedAt` del hash, de modo que releer lo mismo no invalida por sí solo un plan. El snapshot guarda versión, fecha, hash, disponibilidad y proyección. Al recuperar un registro se valida el contrato y se recalcula el hash antes de usar su contenido.

**El snapshot es una observación fechada, no una transacción global sobre las fuentes.** El recorrido, el objetivo y el ajuste se leen por consultas separadas. No se añadieron triggers, bloqueos ni un mecanismo global que serialice todas sus escrituras. Una fuente puede cambiar entre la lectura y el commit del plan, o después de la última comparación. La relectura antes de guardar, al recuperar y al usar el plan permite detectar diferencias observadas y exigir revisión; no garantiza que las fuentes permanezcan inmutables después de esa lectura. La atomicidad descrita a continuación corresponde al plan, su historial y sus recibos.

## Persistencia, concurrencia y recuperación

La migración `20261106201731_a2_reviewed_plan_atomic.sql` agrega un slot por propietario en `public.a2_reviewed_plans`, historial privado en `dtc_private.a2_plan_revisions` y recibos privados en `dtc_private.a2_plan_receipts`. El historial conserva revisiones confirmadas; eliminar contenido purga esas revisiones. Los recibos contienen metadatos y un hash del comando, sin copia del texto del plan, contexto o conversación.

El propietario autenticado sólo puede leer su fila mediante RLS. Las escrituras pasan por RPC exclusivas del servidor, con `security invoker`, `search_path` vacío y permisos acotados. La API obtiene el actor de la sesión; no acepta un `userId` del cuerpo. Verifica acceso al piloto y A2, origen de la solicitud y propietario esperado. Las respuestas son privadas y sin caché, y la identidad se comprueba de nuevo antes de devolver datos personales.

Cada comando lleva `requestId` y `expectedRevision`. Guardar y retomar llevan también el hash del contexto que la persona revisó. El servidor construye el snapshot; el cliente no lo envía como autoridad. El RPC serializa mutaciones por propietario, verifica admisión, consulta el recibo y aplica CAS sobre la revisión. Plan, historial y recibo se escriben en una única transacción. La fecha efectiva se obtiene después de esperar los bloqueos.

La idempotencia usa el comando estable normalizado, sin incorporar la hora de una nueva lectura del contexto. Un `requestId` ya confirmado con el mismo comando devuelve el recibo; reutilizarlo para otra edición es conflicto. El recibo se consulta antes de las condiciones mutables de revisión, fecha y fuentes. La API también repite esa consulta si un commit concurrente aparece entre el primer lookup y sus precondiciones.

**Una respuesta de replay contiene el recibo anterior y el estado actual del slot.** Nunca restablece el plan de aquella revisión. Si después fue cancelado, editado o eliminado, la respuesta muestra ese estado posterior. La interfaz valida solicitud, revisión y estado del recibo, y aplica la vista actual sin convertir el recibo antiguo en una nueva activación.

| Interrupción o conflicto | Recuperación implementada |
|---|---|
| Se pierde la respuesta después del commit | Mientras la página sigue abierta, conserva el borrador y el comando exacto. Reintentar consulta el recibo sin duplicar la mutación. |
| Se consulta el estado tras una respuesta incierta | GET recupera el slot actual, pero no se presenta como confirmación de aquella solicitud. Sigue disponible el reintento del mismo comando. |
| Otra sesión guardó antes | CAS rechaza la edición antigua y devuelve la vista actual comprobada. El borrador se conserva y requiere revisión explícita antes de intentar una nueva revisión. |
| Cambió el objetivo, ajuste o recorrido | Se conserva la edición; se pide comparar y confirmar el contexto actual. Retomar un plan desactualizado exige una nueva revisión guardada. |
| Cambió o no puede verificarse la cuenta | La interfaz descarta texto personal y respuestas pendientes; no aplica la respuesta de la cuenta anterior. |
| Se cierra o recarga la página | Se recupera el plan confirmado. El chat, el borrador sin guardar y el comando incierto que sólo vivían en memoria no se anuncian como persistidos. |

## Memoria acotada del asistente

El asistente habitual y Sofía/Dani/revisor reciben la misma evidencia opcional de plan. Sólo `active` con frescura `current` y contexto verificado genera `reviewed_plan` disponible. Un plan ausente, inactivo, cambiado, vencido o indisponible aporta únicamente ese estado, con `memory:null`; no aporta el texto de una revisión que ya no debe usarse.

La memoria contiene propósito, restricciones, fecha de revisión, revisión y pasos en orden. Los pasos se identifican por posición. Se omiten los UUIDs estructurales del plan, propietario, pasos y fuentes; el helper sustituye además UUIDs y formas explícitas de enlaces reconocidas en el texto. No es un clasificador general de información personal. La memoria se etiqueta como intención revisada por la persona y `completionMeaning:user_declaration_only`.

El prompt separa ese contenido de sus instrucciones del sistema. Un paso declarado realizado no prueba competencia, ejecución externa ni una finalización canónica. El modelo no dispone de operaciones para editar o guardar el plan, y sus propuestas no se convierten automáticamente en comandos.

Antes de entregar una generación se relee la evidencia del plan. Si al inicio se usó memoria disponible, se releen también el recorrido y el contexto guiado. Una edición, pausa, cancelación, eliminación, vencimiento o cambio de fuentes observado impide servir una respuesta fundada en aquella revisión. La API devuelve `503 assistant_context_changed`, conserva la pregunta en la interfaz y permite volver a enviarla. La comprobación final cabe dentro de los 25 segundos existentes de generación y vuelve a verificar al propietario. Es otra lectura fechada; no añade un bloqueo global de fuentes.

Los límites del enjambre se conservan: hasta tres llamadas iniciadas en doce segundos compartidos y, si corresponde, una recuperación habitual dentro del presupuesto de la API. No se activó el canary. Las trazas siguen separando respuesta generada de respuesta servida y no incorporan texto del plan, conversación ni identificador del actor.

## Evidencia local y revisión visual

El gate final `npm run quality:gate` terminó con **código 0 sobre `b9a017d`**, en Node.js 24.22.1. Incluyó regresiones profesionales, los contratos y rutas nuevas, TypeScript, contratos críticos, reportes y build Next.js, con 354 páginas estáticas generadas. Los 26 hashes de fuentes permanecieron iguales durante la ejecución (`sourcesUnchangedDuringGate:true`). El log tiene SHA-256 `3fa67b03c21b0f622d9efb40b46ef9eb11ad71c68575eeb867bf44bd285d2dbc`. Este es el resultado final sobre las fuentes congeladas; el gate anterior de `bb6523d` y cualquier pasada preliminar conservan su alcance previo.

La aplicación y la migración de `f861777` conservan las fuentes de `b9a017d`. Los commits posteriores `7e0c777`, `b72f7f6` y `f861777` cambian exclusivamente workflow y harness del navegador, incluida la preparación del driver temporal. El gate se sigue atribuyendo a `b9a017d`; no se registra como una nueva ejecución sobre los archivos de prueba modificados ni se afirma que sus 26 hashes completos sigan idénticos en el candidato de integración.

Los resultados locales y el manifiesto se conservan en la [carpeta de evidencia](uat/a2-reviewed-plan-20261106/). Las baterías funcionales se repitieron dentro del gate final. El harness de 80 comprobaciones corresponde a la regresión anterior sobre `bb6523d`; la auditoría visual enfocada tiene evidencia propia de las fuentes corregidas. Los números no representan casos manuales UAT ni una muestra de eficacia del asistente.

| Comprobación | Resultado observado | Alcance real |
|---|---|---|
| Contrato del plan | 56/56 | Contratos, proyección canónica y helpers reales; sin base, Auth remoto ni modelo |
| API, lector y hash del plan | 39/39 | Handlers, hashing y selector Supabase reales; sesión, almacenamiento y transporte sintéticos |
| API del asistente | 95/95 | Ruta y prompt reales, memoria/revalidación y recuperación; lecturas y transporte IA sintéticos |
| Runtime Sofía/Dani/revisor | 81/81 | Coordinador y validación reales, fuentes disponibles, memoria, paralelismo, presupuestos y abort; completions sintéticas |
| Adaptador OpenAI | 42/42 | HTTP sintético, límites, formatos, errores y cancelación |
| Selección y evidencia canary | 56/56; 12 ejecuciones CLI | Fixtures sintéticos; ninguna activación ni telemetría live acreditada |
| Siguiente acción canónica | 16 grupos | Regresión de flujo/coordinador/servicio y SDK con Auth y HTTP sintéticos |
| Harness UI anterior | 80/80 | Sobre `bb6523d`: componentes y CSS reales en Chromium 153, 390×844 y 1440×844; Auth, lecturas y transporte sintéticos |
| Gate y build anteriores | Exit 0 | Sobre `bb6523d`; no representan el gate final de `b9a017d` |
| Auditoría visual enfocada tras las correcciones | 19 auditorías; 0 violaciones | Componentes y CSS reales con Chromium/axe; fuentes de sesión, contexto y HTTP sintéticas |
| Gate completo final de `b9a017d` | **Exit 0** | Node.js 24.22.1; 354 páginas estáticas; 26 hashes sin cambios durante la ejecución |

El harness UI anterior sólo incorpora un GET sintético de plan vacío. Sus 80 comprobaciones cubren la regresión del asistente, panel y recorrido; **no prueban guardar o recuperar un plan en PostgreSQL**. Registró cero errores de ejecución, solicitudes fallidas o solicitudes externas y cero violaciones de axe; conserva 20 resultados incompletos de contraste. Es evidencia de `bb6523d`: el hash de `components/a2-reviewed-plan.tsx` cambió después por el color de confirmación de borrado, por lo que no se afirma que todas las fuentes de ese harness coincidan con `b9a017d`.

La [auditoría visual enfocada](uat/a2-reviewed-plan-20261106/a2-sidebar-accessibility-results.json) conserva una auditoría previa que reproduce los defectos del sidebar y **19 posteriores con cero violaciones**. Se comprobaron nombres y valores ARIA en cuatro escenarios: escritorio con 0%, 50% y 100%, y móvil con 0%. Incluye estados del plan guardado, pausado, realizado, cancelado, confirmación de borrado, hover y contenido eliminado. Registró cero errores JavaScript y 19 resultados incompletos de contraste sobre degradados. Usa componentes y CSS reales, con Auth, contexto y respuestas HTTP sintéticos; no prueba SQL, RLS, el AppShell autenticado completo ni una certificación general de contraste. Esta evidencia tampoco sustituye el navegador real de AG03.

Todas las llamadas IA de estas baterías fueron sintéticas. Ninguna demuestra calidad de respuestas, coste, latencia o utilidad con un proveedor real.

### CI SQL y navegador: resultado verificado

| Identidad o comprobación | Resultado verificado |
|---|---|
| SHA del gate local anterior | `bb6523d70a96a1bef15284fd55b656482658c9a6` |
| SHA de aplicación y gate local final | `b9a017db939d8a060c9696312987a93381132cea` |
| SHA de integración vigente | `f86177717d701de24dea323058c791472fd9d23c`, sexto intento |
| Árbol vigente | `73c38830c04401590d33912fdbb160e7195a502c` |
| Workflow | `.github/workflows/a1-browser-qa.yml` |
| Corrida verificada | [42300106261](https://github.com/jcv86/main/actions/runs/42300106261), sexto intento, **`success`** |
| Versiones del laboratorio | Node.js 22.23.4; Playwright/core 1.56.1; Chromium 141.0.7390.37 |
| Preparación del driver y foco nativo | **PASS**; manifiesto comprobado y transiciones `hidden`→`visible` con foco y eventos `isTrusted` tanto en preflight como en la aplicación |
| Último intento fallido | [42299599120](https://github.com/jcv86/main/actions/runs/42299599120), guard de versión antes de aplicación/SQL |
| Conclusión | **DTC-AG-03 `verified` en laboratorio**; fuentes, resultado y artefacto comprobados |
| SQL y advisors en intentos segundo y tercero | 22/22 SQL en cada corrida; cero hallazgos para los objetos del candidato, sobre `f093497` y `b9a017d` |
| Fuentes copiadas al laboratorio | **14/14** coinciden con el candidato exacto |
| Artefacto | ID `13544122221`; 15.812.617 bytes; vencimiento de la copia de Actions `2026-11-13T22:01:22Z` |
| SHA-256 del artefacto | `b5aa30acd11a14f2e6276b53ee9afe8b43bb119eb9b02aade7114d9158afd3a0`, **verificado** |

El [resumen del sexto intento](uat/a2-reviewed-plan-20261106/attempt-6/verified-summary.json) y los [resultados del navegador](uat/a2-reviewed-plan-20261106/attempt-6/a2-plan-browser-results.json) acreditan este alcance:

| Comprobación | Resultado y alcance |
|---|---|
| Migración, SQL y seguridad | Migración aplicada dos veces; **22/22 casos SQL**; cero hallazgos de advisors tanto del laboratorio completo como de objetos del candidato |
| Escritorio | **10 pasos aprobados**, viewport Chromium **1440×1000**: persistencia/reload, ciclo de vida, CAS, cambios y fallos de fuentes, retorno a la pestaña, recuperación tras pérdida de respuesta y cambio de cuenta |
| Móvil | **6 pasos aprobados**, viewport Chromium **390×844**: editor, límite de cinco pasos y foco, persistencia/reload, ciclo de vida y borrado confirmado. No es una prueba en dispositivo físico, táctil o Safari. |
| Acceso | **1 paso aprobado**: la API rechaza al anónimo y al propietario admitido sin A2 habilitado sin crear un plan |
| Progreso y XP | Comparación de snapshots completos de **siete tablas** antes y después en escritorio y móvil, sin cambios |
| Foco nativo | Preflight y aplicación: `blur`, `visibilitychange` a `hidden`, `visibilitychange` a `visible` y `focus`; los cuatro eventos registrados en cada secuencia tienen `isTrusted:true` |
| Accesibilidad y layout | **8 auditorías axe**, cero violaciones y cero desbordamientos observados; **8 resultados incompletos de `color-contrast`** sobre degradados, sin certificación integral WCAG |
| Ejecución y red | Cero errores JavaScript y cero solicitudes externas. El registro HTTP conserva solicitudes abortadas y el reset inducido del POST para probar la pérdida de confirmación. |
| Regresiones con transporte sintético | Contrato 56/56; API plan 39/39; API asistente 95/95; runtime 81/81; provider 42/42; canary 56/56, repetidas en CI |

**Alcance preciso del cambio de cuenta.** El navegador retiene una respuesta POST después de comprobar su commit real, inicia sesión con otro actor y libera la respuesta. Se verificaron la desaparición de la UI personal y la ausencia de escrituras en el segundo propietario. El transporte tolera que Auth cancele la solicitud antes de entregarla; esta ejecución no distingue esa rama del rechazo de una respuesta tardía entregada, ni acredita ambas por separado. Las pruebas unitarias cubren la validación del actor después de recibir una respuesta. La conversación y el borrador no se anuncian como persistidos.

La [revisión visual de ocho capturas](uat/a2-reviewed-plan-20261106/attempt-6/visual-review.json) no observó un defecto bloqueante nuevo. El [registro del libro UAT v5](uat/a2-reviewed-plan-20261106/uat-workbook.json) conserva cuatro hojas y 1.957 celdas originales idénticas, con cero diferencias: los **54 casos siguen `NO EJECUTADO`** y la aceptación anterior corresponde a `7eb0544`. El nuevo apéndice registra este cierre técnico sin convertir las pruebas automatizadas en ejecución manual.

### Historial de integración conservado

El primer intento, [42290241847](https://github.com/jcv86/main/actions/runs/42290241847) sobre `bb6523d`, terminó en `failure`. La migración se aplicó dos veces y pasaron 16 casos SQL antes de fallar la preparación del caso 17: una consulta que retrocedía la fecha del fixture usaba `$2` como `date` y como `text`, y PostgreSQL rechazó la vinculación antes de ejecutar la aserción de reanudación vencida. La limpieza de los 20 propietarios sintéticos pasó. La fase de navegador de AG03 no llegó a ejecutarse. El [registro del intento y su artefacto](uat/a2-reviewed-plan-20261106/attempt-1/ci-run.json) conserva ese resultado verificable; no se convierte en aceptación parcial del flujo completo.

La corrección en [`f09349751a3cb0ca898de6481f000c6eee272d03`](https://github.com/jcv86/main/commit/f09349751a3cb0ca898de6481f000c6eee272d03) usa `$2::date` en ambos lugares y `to_char` con formato ISO para el valor JSON. Sólo cambió `scripts/test-a2-plan-sql.mjs`; no se alteraron la migración, la aplicación ni la UI para sortear la prueba.

El segundo intento, [42291669836](https://github.com/jcv86/main/actions/runs/42291669836) sobre `f093497`, aprobó **22/22 casos SQL** y los advisors con **cero hallazgos para los objetos del candidato**. El navegador aprobó la entrada y lectura inicial del propietario, abrió el editor y se detuvo en su primer control de accesibilidad: dos reglas con impacto `serious`, correspondientes a cuatro barras de progreso sin nombre y al CTA del sidebar con contraste **4,24:1**. El resto del flujo CRUD y recuperación no llegó a completarse. Los [JSON del segundo intento](uat/a2-reviewed-plan-20261106/attempt-2/ci-run.json) conservan la conclusión `failure`, la evidencia parcial y el artefacto; aprobar SQL no cambia el resultado del job completo.

El tercer candidato modifica cuatro archivos. `components/a2-progress-sidebar.tsx` da nombre a las barras y cambia el CTA a colores emerald legibles; `components/ui/progress.tsx` transmite el valor al componente Radix para exponer el progreso real. `components/a2-reviewed-plan.tsx` usa blanco sobre `#b91c1c`, con hover `#991b1b`, en la confirmación de eliminación después de que la revisión enfocada detectara **3,3:1** en ese estado. `scripts/a1-browser-qa/a2-plan-browser.mjs` limita el locator de continuación a la tarjeta canónica, porque el sidebar también muestra «Continuar día 1»; conserva la comparación exacta de destino. No se retiró ninguna aserción de accesibilidad ni se hizo pasar un resultado simulado por persistencia.

La tercera [corrida 42294482643](https://github.com/jcv86/main/actions/runs/42294482643), sobre `b9a017d`, volvió a aprobar **SQL 22/22**, limpieza de fixtures y advisors sin hallazgos del candidato. El navegador registró **seis pasos aprobados** y después agotó la espera de 30 segundos por el GET del plan al regresar a la pestaña. No completó las fases posteriores de recuperación y cambio de cuenta. El [registro del tercer intento](uat/a2-reviewed-plan-20261106/attempt-3/ci-run.json) conserva el resultado fallido, la evidencia parcial y el digest verificado de su artefacto.

El cuarto candidato, [`7e0c77725b9bc5d4b4c3a431e769a069b91261a3`](https://github.com/jcv86/main/commit/7e0c77725b9bc5d4b4c3a431e769a069b91261a3), añadió un preflight previo a Supabase y Chromium con interfaz bajo Xvfb. La [corrida 42297804670](https://github.com/jcv86/main/actions/runs/42297804670) falló en ese preflight: ambas pestañas seguían `visible` y con foco después de enviar `false` a una sesión CDP adicional. El [registro del cuarto intento](uat/a2-reviewed-plan-20261106/attempt-4/ci-run.json) y su [observación de foco](uat/a2-reviewed-plan-20261106/attempt-4/focus-visibility-preflight.json) acreditan Playwright 1.56.1, Chromium 141.0.7390.37 y Node.js 22.23.4, sin iniciar la aplicación ni usar la base de datos; el laboratorio no llegó a prepararse. Se conservó la exigencia de transiciones nativas.

### Driver y pruebas de foco: alcance de la integración vigente

La [inicialización de Chromium en Playwright 1.56.1](https://github.com/microsoft/playwright/blob/v1.56.1/packages/playwright-core/src/server/chromium/crPage.ts) activa la emulación de foco en su sesión original. En Chromium 141, [cada sesión crea su propio handler](https://github.com/chromium/chromium/blob/141.0.7390.37/content/browser/devtools/render_frame_devtools_agent_host.cc); el [estado y el recurso que mantiene visible la página pertenecen a ese handler](https://github.com/chromium/chromium/blob/141.0.7390.37/content/browser/devtools/protocol/emulation_handler.cc). Por eso desactivar una sesión nueva no retira el override de la original. El cambio de `b72f7f6` actúa sobre aquella inicialización del driver temporal, sin modificar propiedades DOM ni despachar eventos fabricados.

`prepare-native-tab-focus.mjs` exige herramientas reales dentro de `RUNNER_TEMP`, Playwright y su core 1.56.1, integridad npm y SHA-256 del archivo original publicado. Condiciona una sola expresión y comprueba que revertirla recupera exactamente el original. Registra hashes original/modificado y `replacements:1` en `native-tab-focus-adapter.json`. El comportamiento predeterminado se conserva para los demás procesos; `DTC_NATIVE_TAB_FOCUS=yes` se limita a los comandos de preflight y navegador A2. El preflight verifica el manifiesto antes de lanzar Chromium y escribe su evidencia en el directorio hermano `dtc-a2-swarm-evidence`, sin crear `A1_LAB_ROOT` antes de su guard de preparación.

El helper sólo observa dos pestañas reales: exige salida a `hidden`, regreso a `visible`, foco y eventos `isTrusted`. Las activaciones del harness tienen barreras para terminar lecturas automáticas antes de acciones normales y conservar los comandos retenidos que prueban conflictos. La corrección no cambia CAS, recibos, aislamiento del propietario ni aserciones de persistencia. Las comprobaciones locales de sintaxis y de rechazo sin `DISPLAY` o sin la bandera verifican los guards; las transiciones nativas se acreditan por el [preflight ejecutado en CI6](uat/a2-reviewed-plan-20261106/attempt-6/focus-visibility-preflight.json) y por el retorno registrado en la aplicación.

La quinta [corrida 42299599120](https://github.com/jcv86/main/actions/runs/42299599120), sobre `b72f7f6`, árbol `d0a6b5dbc3f024a25979e052eac4c3379bdf3729`, se detuvo durante la preparación de herramientas: la resolución desde la raíz encontró `playwright-core` 1.65.0, mientras `playwright` seguía fijado en 1.56.1. El guard rechazó la discrepancia antes de modificar el driver o iniciar aplicación/SQL. El [registro del quinto intento](uat/a2-reviewed-plan-20261106/attempt-5/ci-run.json) conserva ese fallo de integración.

La corrección [`f861777`](https://github.com/jcv86/main/commit/f86177717d701de24dea323058c791472fd9d23c) sólo cambia la resolución del adapter: carga el core desde la dependencia efectiva de `playwright` mediante `createRequire`, manteniendo versión, integridad y hashes exactos. La reproducción aislada con ambas dependencias pasó y dejó intacto el árbol del core 1.65.0; también pasó el layout plano de 1.56.1. Esa reproducción valida el preparador, sin ejecutar el navegador. Por separado, la sexta [corrida 42300106261](https://github.com/jcv86/main/actions/runs/42300106261) completó el laboratorio. Su [manifiesto del driver](uat/a2-reviewed-plan-20261106/attempt-6/native-tab-focus-adapter.json) registra una sustitución, SHA-256 original `79a25e4eac0d0fa97dcc6eae4edce83436bcdb4bb1322731f65610adaa8e150f` y modificado `9e0e8ffdbe9c9ae3322a3e5ea9e62968dceb161af3861c87d49e716713521d8d`.

El workflow ejecutó preparación y migración selectiva en Supabase local desechable, cuentas sintéticas, `test-a2-plan-sql.mjs`, advisors y `a2-plan-browser.mjs`. La evidencia acredita persistencia real, permisos de propietario, concurrencia, rollback, recibos, recuperación y los escenarios de escritorio/viewport móvil descritos arriba. Los límites de cambio de cuenta y accesibilidad forman parte del resultado, junto con los cinco intentos fallidos conservados.

## Cierre de laboratorio y condiciones de publicación

DTC-AG-03 queda **`verified` en alcance de laboratorio** sobre `f861777`, con corrida y artefacto exactos comprobados. La verificación cubre la implementación y las cuentas sintéticas del laboratorio. La aceptación del responsable para `7eb0544` y los 54 casos manuales mantienen sus registros originales; las llamadas IA verificadas aquí usan transporte sintético.

Antes de una publicación en un destino autorizado deben aplicarse y verificarse la migración y sus permisos, desplegar el candidato correspondiente y observar el smoke del despliegue exacto. Sin la tabla o RPC, el plan falla como indisponible y no se presenta como guardado. Una reversión de aplicación debe conservar los registros y recibos confirmados; borrar contenido o retirar el esquema requiere una decisión explícita, no una compensación automática de una respuesta incierta.

Esta entrega no aplica SQL remoto, fusiona `main`, despliega producción, habilita un entorno hosted ni activa tráfico de IA. No ejecuta los 54 casos manuales de la matriz. DTC-AG-04 continúa abierto para herramientas específicas que propongan acciones y confirmen sus efectos; disponer de recibos para el formulario del plan no constituye esa capa de herramientas. DTC-AG-05 conserva su alcance de adaptación y evidencia a través de A3/A4. La comparación de utilidad del enjambre y su activación gradual siguen en DTC-AG-07.
