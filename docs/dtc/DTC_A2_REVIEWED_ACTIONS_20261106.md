# DTC — ajustes de práctica revisados y recibos del asistente A2

Fecha: 6 de noviembre de 2026, America/Santiago. Hito: **DTC-AG-04**.
Rama de entrega: `uat/dtc-20261106`. Base de preparación: `fcf50161f016d1a387f7106a9875458800945d2d`.
Candidato inicial: [`0fd98c7db202af6e369173374261b589fda0cc0f`](https://github.com/jcv86/main/commit/0fd98c7db202af6e369173374261b589fda0cc0f).
Candidato corregido: [`0e879b161e27eda3e3e85104f47544408c3aba0e`](https://github.com/jcv86/main/commit/0e879b161e27eda3e3e85104f47544408c3aba0e).
Segunda corrida de integración: [42307458060](https://github.com/jcv86/main/actions/runs/42307458060), **success**, finalizada y verificada. El primer [intento fallido](uat/a2-reviewed-actions-20261106/attempt-1/ci-run.json) conserva su resultado.
Árbol corregido: `b6a12f30e0e42e312702dd543347df6407a66f31`. Artefacto `13546709691`, SHA-256 `dda2e7f13adf9339b061bcd05c3798f914293e870168d1223bd90654a9066d3d`, con tamaño y digest comprobados contra los metadatos oficiales.

**Estado: AG04 verificado en laboratorio.** La integración aprobó **20 casos SQL**, **13 recorridos de navegador**, migración aplicada dos veces y advisors sin hallazgos. Las **23 fuentes** copiadas se cotejaron con el candidato y el checkout. Las ocho auditorías axe registraron cero violaciones y conservaron siete resultados incompletos de contraste. El gate completo final aprobó sobre las 30 fuentes congeladas de `0e879b1`, verificadas contra su objeto Git exacto. El gate del candidato inicial conserva su atribución a `0fd98c7`. El [índice de evidencia](uat/a2-reviewed-actions-20261106/README.md) distingue ejecución local, integración, revisión visual y límites.

Este trabajo continúa el [enjambre A2](DTC_A2_SWARM_20261106.md) y el [plan revisado de AG03](DTC_A2_REVIEWED_PLAN_20261106.md). La aceptación de negocio registrada para `7eb0544de496e10a2b1be1b482cdafec1d96dc3d` permanece en [su acta](DTC_UAT_ACCEPTANCE_20261106.md). Los **54 casos manuales** conservan sus registros **NO EJECUTADO**; la nueva automatización no modifica esos registros ni amplía la aceptación previa a este candidato.

## Resultado para la persona

El asistente puede proponer un ajuste concreto para el próximo día de práctica pendiente. La persona revisa qué quiere conservar, qué intentará, la dificultad encontrada y una fecha elegida por ella. Al confirmar, la aplicación guarda ese ajuste y comprueba qué quedó efectivamente disponible para su cuenta. La tarjeta «Ajusta tu próximo intento» hace visible la diferencia entre una propuesta, una edición pendiente y un resultado confirmado.

La tarjeta se ofrece cuando la variante de enjambre entrega una propuesta estructurada aceptada por su revisor. Una respuesta habitual sin esa propuesta no crea una tarjeta de acción. El canary sigue desactivado por defecto; este cambio de código no acredita su activación ni tráfico real.

Guardar un ajuste conserva intención y trabajo declarado por la persona. No registra la práctica como completada, no suma XP, no acredita competencia y no desbloquea etapas. La siguiente acción continúa determinada por el recorrido canónico. El plan revisado de AG03 puede detectar después que su contexto cambió; el ajuste no reescribe ni reactiva automáticamente aquel plan.

## De la propuesta al resultado comprobado

1. **La persona expresa una necesidad.** Sofía y Dani trabajan sobre el contexto del servidor y la consulta. Dani puede formular un borrador de ajuste cuando corresponde a la práctica pendiente exacta.
2. **El revisor evalúa la propuesta.** Sólo una decisión `accept` que conserve exactamente el objeto de Dani permite ofrecerlo. Una aclaración, rechazo o modificación no se convierte en una acción aceptada. El servidor incorpora el día y el hash del contexto; el modelo no elige identificadores, fecha de revisión ni ejecuta la escritura.
3. **La persona abre «Revisar ajuste».** La interfaz obtiene el día, la guía y el contexto actuales mediante GET. Puede editar todos los campos, añadir el trabajo conservado y escoger una fecha. Abrir, revisar, cambiar el texto o descartar esta edición no guarda el documento.
4. **La persona confirma «Confirmar y guardar ajuste».** El navegador crea un comando tipado con un UUID de solicitud, el día pendiente y el hash revisado. La API vuelve a comprobar cuenta, acceso, contexto, día y fecha antes de invocar la transacción de guardado.
5. **La aplicación recupera el efecto actual.** Tras recibir el recibo, lee el documento con la sesión del propietario y comprueba su contenido y metadatos. La interfaz valida que el resultado corresponde al comando enviado y comunica si sigue presente, cambió o dejó de encontrarse.

La [interfaz de revisión](../../components/a2-assistant-action.tsx) conserva la edición mientras la página permanece abierta. Si llega otra respuesta del asistente o cambia el contexto, pide «Comprobar contexto actual» y una confirmación explícita de que la persona lo revisó antes de conservar su edición sobre ese contexto. La fecha no se completa silenciosamente desde el modelo.

Ante una respuesta incierta se retiene el comando exacto en memoria, se inmoviliza su edición y se ofrece «Reintentar la misma solicitud». Una recarga no se presenta como recuperación de ese comando local. El ajuste ya confirmado sí persiste y puede alimentar la guía siguiente mediante su lector existente; ni el chat ni el borrador se convierten en memoria persistente por defecto.

## Contratos compartidos

El [contrato de acciones](../../lib/a2/assistant-action-contract.ts) se utiliza en servidor y navegador. Sus objetos son estrictos y versionados; campos adicionales, campos de propietario en el cuerpo o herramientas genéricas se rechazan. El actor proviene de la sesión; un mismo UUID de solicitud puede existir para propietarios distintos sin compartir su contenido o efecto. La única operación de esta ampliación es `save_practice_adjustment`.

| Objeto | Versión y contenido relevante |
|---|---|
| Propuesta | `dtc-a2-action-proposal.v1`: herramienta, día, `expectedContextHash` y borrador editable. No incluye fecha ni `requestId`. |
| Comando confirmado | `dtc-a2-action-command.v1`: herramienta, `requestId`, día, hash esperado y ajuste completo. Los UUIDs se normalizan a minúsculas. |
| Vista actual | `dtc-a2-action-view.v1`: día pendiente o `null`, snapshot de contexto y guía. GET devuelve directamente esta vista. |
| Recibo | `dtc-a2-action-receipt.v1`: `requestId`, `documentId`, día, `committedAt` y `replayed`. Describe el commit original. |
| Resultado | `dtc-a2-action-result.v1`: recibo, efecto actual y ajuste o `null`. POST devuelve directamente este resultado. |
| Error | `{code, error, view?}`: mensaje público acotado y, cuando puede comprobarse, una vista actual para revisar el conflicto. |

| Campo del ajuste | Regla |
|---|---|
| Resultado | `could_not` o `change`. |
| Barrera | `time`, `unclear`, `resources`, `energy`, `goal_changed` u `other`. |
| Trabajo conservado | Hasta 4.000 unidades UTF-16; puede quedar vacío en una propuesta, pero es obligatorio al confirmar. |
| Próxima acción | Entre 1 y 2.000 unidades UTF-16. |
| Fecha de revisión | Fecha de calendario real; al guardar, desde hoy hasta hoy + 30 días inclusive en America/Santiago. |
| Día | Entero de 1 a 90 y coincidencia con la práctica pendiente exacta observada por el servidor. |
| Texto y cuerpo | Se quitan espacios exteriores y se rechazan NUL y surrogates sueltos. El cuerpo JSON tiene límite de 16.000 bytes y lectura cancelable con presupuesto de cinco segundos. |

La comprobación de fecha se repite dentro de la transacción con el reloj efectivo obtenido después de esperar los bloqueos. El día máximo del esquema no concede acceso a ese día: se verifican el destino canónico, el horizonte habilitado y que el día no esté completado.

## Identidad, admisión y lectura sin inicialización

La [ruta de acciones](../../app/api/a2/assistant-actions/route.ts) obtiene el actor de la sesión, comprueba la pertenencia al piloto y el acceso A2. Ambos endpoints requieren el propietario esperado mediante `X-DTC-Expected-Action-Actor`; el cuerpo no decide quién escribe. POST comprueba además origen y `Sec-Fetch-Site`. Las respuestas personales tienen caché privada y `no-store`, y sólo atribuyen `X-DTC-Action-Actor` a una identidad verificada.

La consulta de journey usa `getJourneyForCurrentUser('read-only')` en el [servicio canónico](../../lib/journey/service.ts). Ese modo evita `ensure_despega_journey_state`: la autorización de una lectura o un intento de guardar no materializa una fila canónica ausente. Journey ausente o A2 bloqueado devuelven `403 journey_access_required`; un propietario diferente devuelve `409 session_changed`. El modo predeterminado de los demás consumidores conserva su comportamiento existente.

Los [handlers](../../lib/a2/assistant-action-api.ts) vuelven a verificar la identidad antes de escribir y antes de entregar contexto, recibo o efecto. Si cambia la sesión, la interfaz descarta el texto privado y no aplica una respuesta tardía de la cuenta anterior. La existencia de un recibo no evita las comprobaciones de acceso vigentes.

## Persistencia compatible con los ajustes existentes

La [migración de AG04](../../supabase/migrations/20261106221437_a2_assistant_action_receipts.sql), creada con Supabase CLI, depende del helper de admisión de AG03 y de la tabla existente `dtc_documents` con RLS habilitado. No define una nueva tabla pública de documentos ni reconstruye su esquema de producción ausente del historial disponible.

El guardado inserta en `dtc_documents` un documento `a2_practice_adjustment`, módulo `a2`, día relacionado, título de ajuste, `source:user` y `status:draft`. El contenido conserva el envelope existente de versión `1`: día, resultado, barrera, trabajo conservado, próxima acción, fecha y sugerencia de barrera. La sugerencia la deriva el servidor desde [las barreras existentes](../../lib/a2/practice-adjustment.ts); el modelo no la impone. `source:user` describe la confirmación de la persona y evita inventar una procedencia IA almacenada que el contrato anterior no contiene.

El [lector del siguiente paso](../../lib/journey/next-action-service.ts) sigue consumiendo ese mismo envelope. La selección del último ajuste usa `created_at DESC, id DESC`, tanto en el lector como en la comparación SQL. Cada confirmación nueva inserta un documento; no sobrescribe ajustes previos.

La tabla privada `dtc_private.a2_assistant_action_receipts` conserva propietario, UUID de solicitud, hash del comando, UUID del documento, día e instante de commit. Tiene RLS habilitado y forzado y permisos acotados de lectura/inserción para el rol de servicio. No guarda una copia del contenido, contexto o conversación. No depende de una FK al documento: eliminarlo no elimina el recibo que impide restaurarlo mediante un reintento antiguo.

Las RPC `read_a2_assistant_action_receipt` y `confirm_a2_assistant_action` son exclusivas del servicio, `security invoker`, con `search_path` vacío y límite de espera de bloqueo. La mutación inserta documento y recibo en una única transacción y valida los campos retornados por el INSERT. Un fallo en cualquiera de las escrituras debe revertir ambas. No modifica completions, perfiles, acceso, saldos ni XP.

## Recibo, reintento y efecto actual

El recibo prueba que el comando quedó confirmado en el pasado. El [servicio de readback](../../lib/a2/assistant-action-service.ts) realiza por separado un SELECT con el cliente de sesión y RLS del propietario para observar qué existe ahora. Compara ID, propietario, título, tipo, módulo, día, fuente, estado, instante y JSON completo del envelope. No acepta un documento malformado como evidencia del ajuste enviado.

La igualdad de instantes conserva los microsegundos de PostgreSQL. Normaliza la zona horaria a segundos enteros y compara aparte la fracción decimal, quitando únicamente ceros finales. Así admite el mismo instante expresado con `Z`, otro offset o distinta longitud de fracción, y detecta una diferencia de un microsegundo que `Date.parse` por sí solo truncaría.

| Efecto | Lo observado y lo que puede mostrar la interfaz |
|---|---|
| `present` | La lectura actual coincide exactamente con el documento confirmado. Incluye el ajuste comprobado; permite refrescar el panel del plan. |
| `changed` | El documento sigue legible pero cambió su contenido o metadatos, o el contenido no cumple la comparación. Conserva el recibo y devuelve `adjustment:null`. |
| `removed` | La lectura permitida al propietario no encuentra el documento. Conserva el recibo y devuelve `adjustment:null`. |
| Error de lectura | La operación queda sin resultado verificable; devuelve error recuperable y no atribuye al documento el texto solicitado. |

Un reintento idéntico consulta el recibo antes de reevaluar condiciones mutables de día, fecha y contexto. Reutilizar el mismo `requestId` con otro comando es `409 action_request_conflict`. La API repite la consulta del recibo cuando una precondición falla, para recuperar un commit idéntico que haya ocurrido después del primer lookup.

Si el documento fue cambiado o eliminado, el reintento informa su efecto actual y no lo recrea. La UI compara el recibo con el UUID/día del comando y, para `present`, compara también el ajuste completo. Una respuesta malformada o ajena al envío no se anuncia como guardado.

| Situación | Recuperación |
|---|---|
| Respuesta perdida después del commit | Conserva el comando exacto y recupera su recibo con el mismo UUID. |
| Error de transporte, cancelación o resultado no verificable | Mantiene el envío pendiente y permite reintentarlo; no convierte la incertidumbre en fracaso definitivo ni en éxito. |
| Conflicto de contexto o día comprobado | Muestra la vista actual cuando está disponible, conserva la edición y requiere revisión explícita antes de una nueva confirmación. |
| Guardado confirmado y GET posterior fallido | Conserva el recibo confirmado y explica que falló la actualización del contexto; no vuelve a tratar el guardado como incierto. |
| Cambio de cuenta | Purga la edición y los resultados privados, cancela esperas y descarta entregas tardías. |

## Fuentes fechadas y límite de concurrencia

La API reutiliza `guidedPracticeDay`, `readGuidedNextAction` y [el snapshot de AG03](../../lib/a2/plan-context.ts). Su proyección contiene el recorrido y destino exactos, camino Persona/Profesional/Ambos, horizonte activo, días completados, checkpoint/radar, objetivo cuando corresponde y ajuste del día pendiente. Cada fuente distingue `available`, `missing` y `unavailable`. Persona conserva su regla de objetivo propia; una lectura indisponible no se trata como una ausencia verificada.

Objetivo y ajuste llevan sus referencias existentes `recordId`/`recordedAt`; el objetivo usa su fecha de actualización y el ajuste su fecha de creación. El recorrido derivado queda representado por la proyección, sin inventar una revisión global. El servidor calcula SHA-256 sobre JSON estable de esa proyección y valida su contrato e integridad. `capturedAt` fecha la lectura y queda fuera del hash, para que releer el mismo estado no cambie por sí solo su identidad.

El comando incluye sólo el hash que la persona revisó. El snapshot que llega a la RPC lo construye el servidor; un contexto enviado en el cuerpo del cliente no se acepta como autoridad. La RPC comprueba el snapshot disponible, hash, destino/horizonte/día y captura reciente: hasta cinco minutos de antigüedad y como máximo un minuto en el futuro.

Las acciones usan un bloqueo transaccional por propietario. Dentro de él, el SQL compara el último ajuste actual de ese propietario y día con la referencia y los campos consumidos por el snapshot. Dos confirmaciones distintas sobre el mismo ajuste previo no pueden avanzar consecutivamente como si siguiera vigente: después de la primera, la siguiente debe revisar el nuevo contexto. Las confirmaciones idénticas recuperan el recibo en ese mismo orden serializado. El guard de piloto bloquea además la admisión para evitar confirmar aprovechando una pertenencia revocada observada por esa transacción.

**La atomicidad cubre documento y recibo, y el bloqueo serializa estas acciones por propietario. El contexto completo sigue siendo una observación fechada.** No existe un bloqueo global que abarque recorrido, objetivo, plan y todos los escritores de ajustes. Una fuente independiente puede cambiar entre su lectura y el commit. Los escritores heredados de ajustes tampoco comparten necesariamente el bloqueo nuevo: se detectan las escrituras previas que la comparación observe, sin prometer serialización de las que lleguen después. La relectura de la generación, la revisión explícita y las comprobaciones al confirmar reducen estados obsoletos observables; no convierten las fuentes en una única transacción.

## Propuesta del modelo y límites de ejecución

El [runtime del enjambre](../../lib/a2/swarm/runtime.ts) exige que el trabajo conservado no vacío sea una subcadena exacta de una declaración de la persona en el mensaje actual, mensajes previos del usuario o trabajo conservado ya guardado. Si no puede justificarlo con ese control, la propuesta se rechaza; Dani puede dejarlo vacío para que la persona lo complete. Esta comprobación conservadora de procedencia no demuestra que una propuesta sea útil ni que toda afirmación de lenguaje natural sea verdadera.

La [API del asistente](../../app/api/despega/a2-coach/route.ts) sólo adjunta la propuesta después de la aceptación del revisor y con día/hash derivados del contexto canónico. Antes de entregar una generación que consume esa propuesta o memoria de plan vuelve a leer la evidencia relevante. Un cambio observado impide servirla y devuelve `503 assistant_context_changed`, conservando la pregunta para repetirla con el estado actual.

El modelo no llama a la API de confirmación. Guardar no añade una llamada de modelo ni un trabajo en segundo plano. Se conservan los presupuestos anteriores del enjambre, la recuperación acotada y `store:false`; calidad, coste y latencia reales requieren una evaluación separada. AG05 y la medición/activación de AG07 mantienen su alcance pendiente.

## Evidencia local e integración

Las cifras siguientes distinguen las suites locales con puertos sintéticos de la integración real en el stack local desechable. El [resumen verificado](uat/a2-reviewed-actions-20261106/attempt-2/verified-summary.json), los [metadatos de CI](uat/a2-reviewed-actions-20261106/attempt-2/ci-run.json) y la [atribución de archivos](uat/a2-reviewed-actions-20261106/attempt-2/source-attribution.json) fijan candidato, árbol, corrida y artefacto. Las ocho suites de contrato/API/enjambre/plan se repitieron en CI con los mismos totales.

| Comprobación | Resultado observado | Alcance |
|---|---|---|
| [API, ruta y readback](../../scripts/test-a2-action-api.mjs) | **69/69 PASS** después de las correcciones de precisión y lectura sin inicialización. | Ruta/handlers, hash y SELECT builder reales; sesión, puertos journey/RPC y documentos sintéticos. 52 operaciones HTTP sintéticas, cero llamadas de red externas; no SQL/RLS real. |
| [Contrato de acciones](../../scripts/test-a2-action-contract.mjs) | **28/28 PASS** en la preparación local. | Esquemas, normalización, envelope y correspondencia entre comando y resultado; sin almacenamiento real. |
| API del asistente y enjambre | **103/103** de API, **94/94** de runtime, **42/42** de proveedor y **56/56** de canary en la preparación local. | Módulos reales con fuentes y transporte IA sintéticos; no acreditan respuestas de un modelo real ni activación. |
| Regresión de plan AG03 | Contrato **56/56**, API **39/39** en la preparación local. | Contratos/handlers y hashing reales con sesión y almacenamiento sintéticos; conserva el alcance propio del SQL/navegador histórico de AG03. |
| Servicio journey y acceso A4 | **39/39 PASS** en la preparación local. | Incluye el servicio real con modo read-only y compatibilidad del modo predeterminado; dependencias de Auth/base sustituidas. |
| TypeScript completo | **Exit 0** con `--noEmit --pretty false --incremental false`. | Incluye el modo read-only del servicio journey y las fuentes AG04 presentes durante la ejecución. |
| Revisión de whitespace | `git diff --check`, **exit 0**. | Consistencia del diff; no ejecución funcional. |
| [Harness de UI local](../../scripts/test-a2-assistant-action-ui.mjs) | [Snapshot local v3](uat/a2-reviewed-actions-20261106/local-a2-assistant-action-ui.json): **49 comprobaciones aprobadas**; ocho auditorías axe sin violaciones, ocho resultados incompletos de contraste. | Componentes/CSS reales en Chromium 153.0.8010.0, 390×844 y 1440×844; Auth y HTTP sintéticos. Cero errores de ejecución y solicitudes externas. Manifiesto propio con fuentes sin cambios durante esa corrida. |
| [Gate local final](uat/a2-reviewed-actions-20261106/local-quality.json) | **PASS**, exit 0; Node.js 24.22.1, TypeScript y build de **354 páginas**. | Las 30 fuentes de `0e879b1` no cambiaron durante el gate. Log SHA-256 `79d7409762f60b6b6f067f57de7c738792c9fc52c0da2f4ce612cf3641e5c682`. Entorno sintético, separado de SQL/Auth/navegador reales; el primer gate queda archivado en su intento. |
| [Migración y pruebas SQL](uat/a2-reviewed-actions-20261106/attempt-2/a2-action-sql.json) | **20/20 PASS**; migración aplicada dos veces. | PostgreSQL local real: atomicidad, grants/RLS, concurrencia, admisión, fechas, replay, cambios/eliminación e invariancia canónica. Los 16 propietarios propios del test fueron eliminados y los cuatro del navegador preservados. |
| [Navegador integrado](uat/a2-reviewed-actions-20261106/attempt-2/a2-action-browser-results.json) | **13/13 PASS**: seis pasos desktop, cuatro mobile y tres de acceso. **8 axe**, **0 violaciones**, **7 incompletos de contraste**. | Auth/cookies, API de acciones, RPC, PostgreSQL, RLS y readback reales. Seis respuestas de generación sintética y tres fallos controlados. Cero errores JavaScript y solicitudes externas; no se afirma cero requests abortados. |
| [Advisors](uat/a2-reviewed-actions-20261106/attempt-2/a2-action-advisors.json) | **PASS: 0 hallazgos del candidato y 0 totales en el laboratorio.** | Revisión de los objetos AG04 y fixture de documentos heredado, mediante Supabase CLI 2.117.0. Sin inferir el estado del esquema alojado. |
| Regresión integrada AG03 | **22 SQL**, **17 pasos de navegador**, **19 fuentes** verificadas; **8 axe**, **0 violaciones**, **7 incompletos de contraste**. | Nueva ejecución sobre `0e879b1`, con Auth/API/RLS/PostgreSQL reales. Mantiene separada la evidencia histórica de AG03, cuyo manifiesto tenía 14 fuentes y ocho auditorías incompletas. |
| [Inspección visual integrada](uat/a2-reviewed-actions-20261106/attempt-2/visual-review.json) | Ocho capturas revisadas, **sin defectos visuales bloqueantes nuevos**. | Header opaco, edición, conflicto y recibos legibles en desktop y 390 px. Un detalle cosmético abierto de separación entre aviso y enlace al cambiar de cuenta. No convierte los incompletos de axe en PASS. |
| IA real, participantes y destino remoto | **No acreditados.** | Sin inferencia de utilidad, eficacia, gasto, tráfico canary, despliegue ni aceptación manual nueva. |

El [workflow](../../.github/workflows/a1-browser-qa.yml) prepara AG04 después de que termine la fase AG03 del laboratorio. La [preparación](../../scripts/a1-browser-qa/a2-action-prepare.mjs) copia y verifica 23 fuentes reales, incluido AppShell. El [seed](../../scripts/a1-browser-qa/a2-action-seed.ts) añade cuatro propietarios sintéticos separados: escritorio, móvil, A2 bloqueado y piloto posteriormente revocado. El test SQL usa propietarios propios, comprueba que preservó las fixtures del navegador y limpia sus usuarios y filas antes de terminar.

La integración hereda de AG03 un esquema mínimo explícito de `dtc_documents`, porque su migración de creación de producción no está en el repositorio. Sólo se sustituye la respuesta HTTP de generación del asistente por una propuesta revisada sintética con el día/hash obtenido de la API real; no se fabrica una respuesta exitosa de guardar. Los cambios de fuente, eliminación de documentos y pérdida/demora de respuestas son estímulos declarados del laboratorio.

La comprobación de journey ausente eliminó como setup únicamente la fila canónica del propietario bloqueado tras autenticarlo. Sus GET y POST fueron denegados sin recrear esa fila y sin cambiar las siete tablas canónicas observadas, documentos ni recibos respecto del baseline tomado después de ese setup. Las comparaciones de navegador usaron filas completas de las siete tablas, no sólo contadores de XP o de completions.

El viewport móvil acredita layout Chromium de 390×844; no representa hardware táctil ni Safari. Los ocho incompletos de contraste del harness local y los siete de la integración permanecen visibles por separado en la evidencia. Las capturas y resultados usan datos sintéticos; no se publican cookies, credenciales, storageState, HAR ni logs privados del servidor.

## Contraste corregido tras la primera integración

La primera corrida completó los **20 casos SQL de AG04** y los advisors sin hallazgos candidatos. El navegador registró tres pasos aprobados y se detuvo en la auditoría `desktop/replay-after-deletion`: una violación seria de contraste afectó los textos de nivel y racha del encabezado. Los pasos restantes y el viewport móvil de ese intento no se consideran ejecutados.

La clase `bg-background/88` del encabezado no producía una regla con la configuración real de Tailwind. Al desplazarse sobre el botón verde, el fondo quedaba transparente. La [prueba enfocada con componentes y CSS reales](uat/a2-reviewed-actions-20261106/appshell-contrast-probe.json) reprodujo los mismos targets con contraste **2,23:1**. El fondo sólido `bg-background` mantuvo la misma geometría y elevó ese contraste a **8,06:1**, con cero violaciones e incompletos en la auditoría enfocada del encabezado. Esto no sustituye las auditorías completas ni elimina sus siete resultados incompletos de contraste; el JSON integrado no diagnostica la causa de cada incompleto.

La corrección cambia sólo el fondo efectivo del encabezado y agrega AppShell al manifiesto AG04, que pasa de 22 a 23 fuentes. No cambia el scroll, el scanner, las reglas ni los umbrales. El [primer intento](uat/a2-reviewed-actions-20261106/attempt-1/) permanece `FAIL`, con su ZIP de 17.784.418 bytes y SHA-256 verificado `d31b34cd95666b7705f302c279b6fb2c27e7339845b3beb872189cdffee53dde`.

## Cierre y límites de aceptación

El [ledger](DTC_CLOSURE_LEDGER.md) y la [coordinación](DTC_AGENTIC_COORDINATION_20261106.md) registran AG04 como verificado con alcance de laboratorio. Gate, migración doble, SQL, navegador, advisors, revisión visual y hashes quedan asociados a `0e879b1`. La planilla conserva su identidad y sus cuatro hojas; añade este hito en Protocolo y una referencia en Control. Sus casos, hallazgos, estilos, fórmulas, apéndices anteriores y aceptación se contrastan con la versión precedente antes de guardar la actualización. El [registro de la planilla](uat/a2-reviewed-actions-20261106/uat-workbook.json) conserva ese resultado y su procedencia.

El verificador de artefactos coteja los anchos de PNG con `layout.document`, conservando el control de desbordamiento. AG03 utiliza un documento de 1432/382 px dentro de viewports 1440/390 por la barra de desplazamiento; AG04 tiene 1440/390 px en ambos. Se corrigió una suposición inicial del verificador que comparaba ambos anchos como iguales. La corrección no modificó aplicación, pruebas ni evidencia bruta y no altera la conclusión `success` de CI.

Permanece abierto el hallazgo cosmético `ag04-visual-account-alert-spacing`: falta separación entre «correcto.» y «Volver a abrir el asistente» al cambiar de cuenta. No impide distinguir el enlace ni la instrucción y no afecta la purga de información de la cuenta anterior; se conserva documentado sin cambiar las fuentes después de la corrida aprobada.

El artefacto de CI expira el 13 de noviembre de 2026; el repositorio conserva los JSON seleccionados, hashes de capturas y metadatos de procedencia. El cierre de laboratorio queda separado de la aceptación del candidato de negocio, los **54 casos manuales NO EJECUTADO**, la evaluación con un modelo real y las tareas de migración/despliegue/smoke/reversión en el destino autorizado. El canary continúa apagado por defecto, y AG05/AG07 mantienen su trabajo pendiente.

## Seguimiento 2026-11-06 — separación del aviso de cambio de cuenta

El estado abierto de `ag04-visual-account-alert-spacing` registrado arriba corresponde al cierre histórico de `0e879b1`. El hallazgo cosmético se **cierra en la captura revisada del candidato `22d533d6e42f3663d2a46b9ca48116bf138c23f7`**, árbol `7b1c57f9f7fce14b439650865ebbdacef15b1725`, tras introducir el espacio explícito en el aviso. La nueva evidencia no reescribe el primer fallo de contraste, la corrida aprobada anterior ni sus observaciones originales.

La corrida [42313235840](https://github.com/jcv86/main/actions/runs/42313235840) terminó `success`, con 30 pasos del job aprobados. El [resumen verificado](uat/a2-review-evidence-20261106/attempt-1/verified-ag05-summary.json) atribuye la regresión AG04 al nuevo candidato: **31 fuentes copiadas y verificadas, 20 casos SQL, 13 pasos de navegador, 8 auditorías axe, 0 violaciones y 7 resultados incompletos de contraste**. El artefacto `13548784558` tiene 21.825.666 bytes, SHA-256 `6f83ca7bfb984cd65e2bc50d3798dc42506da4c1eed879c791a12ef7928da1bc` y 137 archivos extraídos verificados.

La [revisión visual final](uat/a2-review-evidence-20261106/attempt-1/visual-review.json), fechada el 6 de noviembre de 2026 a las 23:56 UTC, inspeccionó nueve PNG: ocho de AG05 y el nuevo `a2-action-desktop-account-change.png` de AG04. La captura de cambio de cuenta pesa **124.937 bytes**, mide **1440×1092 px** como imagen full-page de un viewport 1440×844 y tiene SHA-256 **`fc6031775cadebbb1e58225c89b1ede1f74386a59d65af96a8758d1bccfa7fdf`**. Su hash coincide con el manifiesto del ZIP.

La frase terminada en «correcto.» y el enlace subrayado «Volver a abrir el asistente» muestran ahora separación visible. No se observaron nuevos defectos visuales accionables en las nueve capturas. El registro visual denomina este hallazgo `account-alert-spacing`; corresponde al identificador histórico `ag04-visual-account-alert-spacing` de este documento. Su cierre se limita al detalle cosmético observado: no añade una certificación nueva de Auth, no ejecuta casos manuales y no cierra los incompletos de contraste de AG04 o AG05. El [checkpoint AG05](DTC_A2_REVIEW_EVIDENCE_20261106.md) conserva su estado `in_progress` y sus límites de evaluación de utilidad y modelo real.
