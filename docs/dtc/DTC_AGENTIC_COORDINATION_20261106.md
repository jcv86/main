# DTC — coordinación del asistente y siguiente acción

Fecha: 6 de noviembre de 2026. Rama: `uat/dtc-20261106`.
Base auditada: `79e038ba72fe7bac44e575b488c648789c91ad12`.
Candidato del primer bloque: [`e88058211a14bc10a670cd009c30a1d9d692de46`](https://github.com/jcv86/main/commit/e88058211a14bc10a670cd009c30a1d9d692de46).

**Continuación vigente: AG05 `in_progress`.** La [revisión del plan con registros A3/A4](DTC_A2_REVIEW_EVIDENCE_20261106.md) está implementada y comprobada en laboratorio sobre `22d533d6e42f3663d2a46b9ca48116bf138c23f7`, árbol `7b1c57f9f7fce14b439650865ebbdacef15b1725`. La [corrida 42313235840](https://github.com/jcv86/main/actions/runs/42313235840) terminó `success` en sus 30 pasos: AG05 aprobó cuatro comprobaciones SQL, 15 pasos de navegador y 41 fuentes; ocho auditorías axe tuvieron cero violaciones y ocho resultados incompletos de contraste. El gate final pasó con 30 fuentes estables y 354 páginas. **AG05 no queda cerrado:** siguen pendientes utilidad con participantes, comparación con el flujo simple y comportamiento del modelo real.

**Cierre histórico de AG04: `verified` en laboratorio.** Los [ajustes revisados del asistente](DTC_A2_REVIEWED_ACTIONS_20261106.md) quedaron verificados en `0e879b161e27eda3e3e85104f47544408c3aba0e`, árbol `b6a12f30e0e42e312702dd543347df6407a66f31`, con segunda [corrida 42307458060](https://github.com/jcv86/main/actions/runs/42307458060) `success`. El cierre conserva 20 casos SQL, 13 pasos de navegador, 23 fuentes y ocho auditorías axe sin violaciones, con siete resultados incompletos. Su gate final pasó sobre 30 fuentes y generó 354 páginas. La evidencia y el primer intento fallido mantienen esa atribución; las regresiones nuevas de AG03/AG04 se registran por separado en la continuación AG05.

**Cierre histórico de AG03: `verified` en laboratorio.** El [plan revisado y su memoria acotada](DTC_A2_REVIEWED_PLAN_20261106.md) quedó verificado en [`f861777`](https://github.com/jcv86/main/commit/f86177717d701de24dea323058c791472fd9d23c), con sexta [corrida 42300106261](https://github.com/jcv86/main/actions/runs/42300106261) `success` y artefacto comprobado: 22 casos SQL, 17 pasos de navegador, ocho auditorías axe sin violaciones y advisors sin hallazgos. Conserva ocho comprobaciones incompletas de contraste y los límites documentados de viewport móvil y cambio de cuenta. La aplicación y el gate local de aquel cierre siguen atribuidos a `b9a017d`; sólo workflow y harness cambiaron entre ese candidato y `f861777`. Las cifras del primer bloque mantienen su candidato histórico, y la aceptación humana de `7eb0544` y los 54 registros manuales no cambian.

## Decisión y alcance

La aceptación del UAT anterior corresponde al código `7eb0544` y sigue documentada en [su acta](DTC_UAT_ACCEPTANCE_20261106.md). Cerró el bloque de autenticación/C1 y la aceptación del responsable sobre ese candidato. No acreditaba una capa autónoma de agentes completa.

La revisión del código confirma una brecha útil: el producto tiene recorrido, objetivo laboral, ajustes de práctica y asistentes, pero el asistente de Tu Ruta no compartía la decisión canónica del siguiente paso. El modo llamado `agentic` de Vera obtiene contexto y genera texto; no ejecuta un plan persistente de acciones.

Este bloque agrega **coordinación asistida sobre registros existentes** y repara el chat A2. Su resultado observable es que una persona vuelve, reconoce la dirección y el ajuste que guardó, entiende por qué corresponde ese paso y puede continuarlo desde el destino correcto. No cambia reglas de desbloqueo, no crea un sistema de tareas en segundo plano ni instala otro framework.

## Qué encontramos en la base auditada

| Capacidad | Evidencia en el repositorio | Lectura correcta |
|---|---|---|
| Siguiente paso A1–A4 | `lib/journey/flow.ts`, `flow-service.ts` | Ya existe un selector basado en accesos, finalizaciones, checkpoints y mediciones. Se reutiliza íntegro. |
| Objetivo laboral | `app/api/career/objective/route.ts`, `lib/opportunities/labor-objective.ts` | El objetivo confirmado ya tiene contrato, propietario y revisión. Se utiliza su fuente actual. |
| Ajustes NO PUDE/CAMBIAR | `app/api/a2/practice-adjustments/route.ts` | Conservan barrera, trabajo, próxima acción y fecha; no completan días ni suman XP. |
| Vera A4 | `app/api/despega/a4-coach/route.ts`, `lib/vera/tool-catalog.ts` | Hay routing, una herramienta de contexto y una llamada a modelo. No equivale a ejecución autónoma. |
| Chat A2 | `components/a2-chat-coach.tsx`, `app/api/despega/a2-coach/route.ts` en la base | La UI enviaba `context` objeto y la API intentaba `.map()`. La página dependía de `a1_test_id` y `unified_test_results`, distintos de la fuente A1 canónica. |
| AgentOS histórico | `lib/dtc-agentos/commands/execute-command.ts`, adapters y APIs retiradas | Algunos handlers devolvían `generated`, `started` o `created` sin realizar la operación. Los endpoints genéricos están retirados con 410; no se reactivan. |
| Memoria y evaluación | `lib/career/agent-contract.ts`, `lib/outcomes`, prácticas A3 | Existen contratos y registros útiles. No prueban una memoria transversal operativa ni una mejora de capacidad por completar tareas. |

Las rutas del legado sin callers encontrados no se cuentan como funcionalidades activas. Los hallazgos se basan en código, no en una nueva inspección de datos de participantes o en una sesión con el proveedor IA.

## Implementación del primer bloque

### Una misma decisión para panel, recorrido y asistente

`lib/journey/next-action.ts` produce `GuidedNextAction` versión `dtc-guided-next-action.v1`. Conserva exactamente `flow.next`: href, etiqueta, título y descripción. Añade razón, fuentes, limitaciones y dos contextos opcionales:

- Objetivo laboral primario, activo y confirmado por la persona. Se valida con el contrato existente. El camino Persona no consulta ese objetivo laboral.
- Último ajuste del día pendiente exacto que seleccionó el flujo. Se ordena por fecha e ID, se verifica su contenido y no se usa un ajuste de otro día, uno completado o una revisión antigua para reemplazar una más reciente inválida.

La procedencia incluye ID y fecha de cada registro válido. La UI muestra nombres y fechas comprensibles, sin exponer nombres de tablas. Cada fuente distingue disponible, sin registro e imposible de verificar en ese momento. El error de una fuente adicional conserva la navegación canónica y ofrece relectura.

`next-action-service.ts` vuelve a verificar el propietario con `getUser()` y usa el cliente de sesión con SELECT y columnas explícitas. No introduce escrituras, RPC ni service role. La resolución general del recorrido mantiene su inicializador canónico preexistente; no debe describirse toda la página como una operación estrictamente sin efectos.

### Asistente de Tu Ruta

La página usa `requireJourneyModule('A2')`, `loadJourneyFlow` y el mismo contexto guiado. Ya no exige el resultado A1 histórico para mostrar el chat.

La API valida sesión, precondición de propietario, origen, acceso piloto, acceso A2, JSON de hasta 64.000 bytes, mensaje y roles del historial. El objeto `context` del cliente se admite por compatibilidad pero se ignora como fuente de autoridad. El siguiente paso y el contexto A1 se obtienen en el servidor.

A1 se lee mediante `loadA1AgentContext`, con su revisión, limitaciones, aclaraciones y grado de reconocimiento. El objetivo y desafío declarados en C1/C2 se incluyen de forma acotada, también para Persona. Una preferencia no se transforma en competencia, diagnóstico o predicción de empleo. Un desacuerdo del usuario con la lectura permanece visible para el asistente.

La generación conserva el proveedor/modelo ya utilizado por esta ruta, una sola llamada, salida limitada, timeout y `store:false`. El endpoint se integra al limitador IA existente, sin alterar sus umbrales. Este limitador conserva su alcance actual por instancia/IP; no es un presupuesto global distribuido ni un límite monetario por usuario.

La conversación se mantiene en memoria de la página y la UI lo dice. Con una sesión vigente, la pregunta sólo se borra tras una respuesta válida. Fallos de red/proveedor permiten reintentar; la guía fresca del mismo propietario se conserva aunque la generación falle. Una cuenta distinta o una sesión ausente limpian la pregunta, el contexto y la conversación e invalidan respuestas pendientes. Los mensajes se renderizan como texto. El modelo no dispone de herramientas de escritura; los guardados y finalizaciones siguen en sus formularios canónicos.

## Criterios de aceptación de este bloque

1. Panel, recorrido y asistente presentan el mismo destino permitido por `flow.next`.
2. Un ajuste válido vuelve a aparecer únicamente cuando ese día continúa pendiente.
3. Completar el día o llegar a un checkpoint hace desaparecer el ajuste anterior de la propuesta actual.
4. Una fuente fallida se distingue de una vacía; ninguna habilita acceso ni convierte progreso en cero.
5. Persona mantiene su propio camino y no recibe un objetivo laboral como requisito.
6. Un `userId`, rol de sistema, URL o comando del cliente no modifica la autoridad o destino.
7. El chat recibe su payload real, admite A1 canónico y conserva la pregunta ante errores.
8. Un cambio de cuenta bloquea respuestas tardías y contexto de la cuenta previa.
9. Se puede continuar por la acción canónica aunque la IA no responda.
10. El diseño funciona con teclado, 390×844 y escritorio sin desborde ni errores de accesibilidad observados en el alcance comprobado.

## Arquitectura trazada después del primer bloque

El primer bloque aporta contexto común y una decisión de continuidad. La capa agéntica completa requiere los siguientes contratos, con un solo asistente visible y roles internos de comprensión y acción:

| Bloque | Resultado para la persona | Criterio de cierre |
|---|---|---|
| Plan y memoria operativa | Volver días después y retomar una decisión útil, con el objetivo y restricciones vigentes | Plan versionado, fuente/revisión, propietario, estados explícitos, corrección/borrado y recuperación tras interrupción; no almacenar toda conversación por defecto |
| Herramientas acotadas | Revisar una propuesta y confirmar una acción concreta dentro de DTC | Lista permitida, inputs tipados, autorización, presupuesto, idempotencia y recibo de persistencia; éxito sólo después de comprobar efecto |
| Continuidad A3/A4 | Conectar práctica, CV, oportunidades y revisión de decisiones con el mismo objetivo | Contextos mínimos y disponibilidad explícita, misma decisión canónica y evidencia de la tarea; vigencia/fuente para oportunidades |
| Revisión y adaptación | Ajustar un plan cuando la persona cambia de objetivo o declara una barrera | Diferenciar declaración, entregable, evaluación y resultado observado; conservar historial y evitar inferir progreso por cantidad de texto o XP |
| Evaluación y operación | Recibir ayuda que demuestra utilidad adicional con coste y latencia controlados | Casos reales anonimizados/sintéticos pertinentes, comparación con el flujo simple, fallos recuperables, límites de tiempo/coste, trazas sin contenido personal |

El primer caso de escritura recomendado fue **proponer un ajuste de práctica y guardarlo tras revisión de la persona**, utilizando el contrato existente y devolviendo el ID confirmado. Ese alcance ya tiene cierre de laboratorio en [AG04](DTC_A2_REVIEWED_ACTIONS_20261106.md), junto con el plan y memoria de AG03. La continuidad con registros declarados A3/A4 está implementada y verificada técnicamente en el checkpoint [AG05](DTC_A2_REVIEW_EVIDENCE_20261106.md); su utilidad con participantes y comparación con el modelo real permanecen pendientes, por lo que el estado sigue `in_progress`. Publicaciones, postulaciones, contactos y gastos conservan sus requisitos de autorización correspondientes.

No es necesario asignar un modelo permanente a cada función. Un coordinador con herramientas de propósito específico y funciones de interpretación/acción separadas puede servir al producto; añadir más agentes debe demostrar mejora frente a la alternativa más simple.

## Fundamento técnico consultado

La recomendación de empezar con composición acotada, herramientas claras, señales reales de progreso y condiciones de término sigue [Building effective agents, Anthropic](https://www.anthropic.com/research/building-effective-agents). Su recomendación no prueba que DTC mejore: esa utilidad requiere evaluación propia.

La distinción entre estado de una ejecución y memoria duradera entre sesiones se contrasta con [Persistence, documentación de LangGraph](https://docs.langchain.com/oss/javascript/langgraph/persistence). Se usa como referencia de contratos; no se incorpora esa dependencia.

Se revisaron la documentación actual de [autenticación SSR de Supabase](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [getUser](https://supabase.com/docs/reference/javascript/auth-getuser), su changelog y la referencia de [Chat Completions](https://developers.openai.com/api/reference/resources/chat). Se mantienen los paquetes instalados y el modelo ya utilizado; no se actualizaron SDK, CLI, esquema o proveedores.

## Evidencia y límites de verificación

**Veredicto: CONDITIONAL_GO para el candidato de código y su integración de laboratorio.** Los criterios funcionales de este bloque están verificados dentro del alcance ejecutado. La publicación y la eficacia de la asistencia con un modelo real conservan las condiciones descritas más abajo.

| Comprobación | Resultado | Alcance real |
|---|---|---|
| Coordinación del siguiente paso | 16 grupos aprobados | Flujo, coordinador, servicio y SDK Supabase reales; Auth y transporte sintéticos, sin base remota |
| API del asistente | 52/52 aprobados | Handler, esquema y prompt reales; sesión, lecturas y proveedor sintéticos; 0 llamadas externas |
| Interacción de navegador | 80/80 aprobadas | Componentes, árboles de páginas y CSS reales en Chromium 153; 390×844 y 1440×844 |
| Accesibilidad automatizada | 20 scans; 0 violaciones; 20 resultados incompletos | Los incompletos son únicamente contraste sobre degradados; no constituyen una certificación WCAG |
| Errores de navegador | 0 errores de ejecución y 0 solicitudes fallidas | Escenarios del laboratorio aislado |
| Gate del repositorio | `npm run quality:gate`, exit 0 | Regresiones profesionales, nuevos contratos, TypeScript, contratos críticos, calidad de reportes y build |
| Build final | `npm run build`, exit 0; clasificación limpia, sin categorías de advertencias | Fuentes finales posteriores a la corrección de contraste; configuración CI sintética |
| CI de la rama | Run 42277726935, `success`, sobre `e880582` | Auth, Supabase/PostgreSQL, RLS, AppShell, recorrido y C1 reales en un stack local desechable con cuentas sintéticas |

El gate completo terminó antes de agregar únicamente `hover:text-white` a los CTA del asistente y panel. El build final y las 80 comprobaciones de navegador verifican esa última corrección. Axe había detectado una relación de contraste 3,89:1 en el hover; el defecto dejó de aparecer tras el cambio. La inspección manual de capturas confirmó ausencia de recortes y superposiciones observables y foco visible. Los 20 resultados incompletos corresponden a 542 apariciones de nodos entre scans: el motor no puede resolver algunos fondos degradados. La inspección visual no mide cada relación de contraste.

Se conservaron los 11 hashes de las fuentes observadas durante la prueba de navegador y se compararon con el candidato final. También se registraron los hashes de los 17 archivos de código y pruebas de este cambio. [La carpeta de evidencia](uat/agentic-coordination-20261106/README.md) contiene los resultados, la revisión y las identidades exactas. Los logs extensos y capturas temporales están identificados por SHA256 y se pueden regenerar con los scripts del candidato; no se incluyen como binarios en la carpeta.

La comprobación automática de la rama terminó correctamente en el [run 42277726935](https://github.com/jcv86/main/actions/runs/42277726935), sobre el SHA exacto `e88058211a14bc10a670cd009c30a1d9d692de46`. Su resultado se conserva en `candidate-evidence.json` y `ci-run.json`: pasaron los 25 pasos del job, incluidos aislamiento UAT, invitaciones, middleware, cookies, persistencia, recorrido A1–A4, RLS, inicio/cierre de sesión y C1 atómico. Es una regresión de la integración existente con Supabase local y no sustituye la evaluación del nuevo asistente con el proveedor real.

### Condiciones pendientes para publicación y operación

- La prueba enfocada del asistente usa eventos de sesión, lecturas y transporte IA sintéticos. No certifica calidad de respuestas del modelo, latencia/coste reales ni el aislamiento de las nuevas lecturas contra el proyecto remoto. Se requiere un smoke del candidato desplegado en el entorno autorizado y una evaluación breve con casos representativos antes de afirmar esas propiedades.
- Las páginas enfocadas se renderizaron con CSS real y fuentes del sistema, sin el AppShell autenticado completo. La regresión existente de la rama comprueba por separado el shell y la autenticación local; no equivale a una sesión del nuevo chat contra producción.
- La preparación de publicación previa sigue requiriendo migraciones y configuración del destino, transición/rollback y smoke del despliegue exacto. Este bloque no añadió esquema ni ejecutó SQL remoto.
- En este primer candidato, planes persistentes, memoria operativa, herramientas con recibos, adaptación A3/A4 y evaluación de utilidad quedaron abiertos en DTC-AG-03/04/05. Las continuaciones AG03/AG04 y la implementación de AG05 se registran debajo con evidencia propia; el criterio de utilidad de AG05 y la evaluación/activación de AG07 siguen pendientes. El historial del chat continúa durando sólo mientras la página permanece abierta.

El UAT aceptado para `7eb0544` conserva su alcance y los estados originales de los 54 casos manuales. Este candidato tiene evidencia nueva, sin extender retrospectivamente esa aceptación. El código está guardado en `uat/dtc-20261106`; no se fusionó `main` ni se desplegó esta ampliación en producción.

## Continuación AG03 — implementación y laboratorio verificado

El [plan revisado](DTC_A2_REVIEWED_PLAN_20261106.md) incorpora propósito, restricciones, uno a cinco pasos y fecha de revisión confirmados por la persona. Tiene versiones, propietario, estados explícitos, corrección, pausa, recuperación, cancelación y borrado del contenido. Una revisión declarada realizada sigue siendo autoinforme; no modifica finalizaciones, accesos ni XP. No se guarda automáticamente la conversación ni se concede al modelo una herramienta de escritura.

La memoria sólo usa planes activos con contexto vigente y verificable. La fuente se identifica por una proyección fechada y un hash calculado en el servidor. Se compara al guardar, recuperar y usar, sin afirmar una transacción sobre todas las fuentes ni añadir un bloqueo global de sus escrituras. CAS, historial y recibos sí son atómicos dentro del plan. Ante un reintento, el recibo anterior se acompaña del estado actual y no reactiva contenido cancelado o eliminado después.

El candidato inicial de esta continuación fue [`bb6523d70a96a1bef15284fd55b656482658c9a6`](https://github.com/jcv86/main/commit/bb6523d70a96a1bef15284fd55b656482658c9a6). La [evidencia nueva](uat/a2-reviewed-plan-20261106/) registra 56 contratos, 39 API del plan, 95 API del asistente, 81 runtime, 42 adaptador y 56 canary aprobados localmente, junto con `quality:gate` y build exit 0 sobre ese código. El harness anterior dio 80/80; su GET de plan vacío es sintético y no prueba persistencia de AG03. Esa UI es una regresión anterior: el hash de la tarjeta del plan cambió después, por lo que no se atribuyen todos sus hashes al candidato vigente.

El primer intento [42290241847](https://github.com/jcv86/main/actions/runs/42290241847) falló en una consulta del fixture del caso SQL 17 por una vinculación incompatible de fecha/texto. La migración se aplicó dos veces, 16 casos SQL pasaron y se limpiaron los 20 propietarios sintéticos; el navegador de AG03 no se ejecutó. El [registro del intento](uat/a2-reviewed-plan-20261106/attempt-1/ci-run.json) conserva ese resultado. La corrección convierte ambos usos del parámetro a fecha y el valor JSON a ISO mediante `to_char`.

El segundo intento [42291669836](https://github.com/jcv86/main/actions/runs/42291669836), sobre `f093497`, aprobó SQL 22/22 y advisors con cero hallazgos del candidato. El navegador aprobó un paso y abrió el editor, pero detectó dos reglas serias: cuatro barras sin nombre y contraste 4,24:1 del CTA del sidebar. El [registro del segundo intento](uat/a2-reviewed-plan-20261106/attempt-2/ci-run.json) conserva su resultado fallido; no acredita el resto del flujo CRUD.

El candidato de aplicación y gate final es [`b9a017db939d8a060c9696312987a93381132cea`](https://github.com/jcv86/main/commit/b9a017db939d8a060c9696312987a93381132cea), árbol `98696f925f0dedfe1f5cf261ee78b1603265f374`. Corrige nombres/valor de progreso, colores del CTA y de confirmación de borrado, y el selector del enlace canónico. La [revisión visual enfocada](uat/a2-reviewed-plan-20261106/a2-sidebar-accessibility-results.json) registra una reproducción previa y 19 auditorías posteriores sin violaciones, cuatro escenarios ARIA, cero errores JavaScript y 19 incompletos de contraste sobre degradados. Sus puertos Auth/HTTP son sintéticos.

La tercera [corrida 42294482643](https://github.com/jcv86/main/actions/runs/42294482643), sobre `b9a017d`, aprobó SQL 22/22, limpieza y advisors sin hallazgos del candidato. El navegador registró seis pasos aprobados antes de agotar 30 segundos esperando el GET del retorno a la pestaña. El [tercer intento](uat/a2-reviewed-plan-20261106/attempt-3/ci-run.json) conserva ese resultado parcial; las fases posteriores no terminaron.

El cuarto candidato `7e0c777` añadió un preflight antes de Supabase y Chromium con interfaz bajo Xvfb. La [corrida 42297804670](https://github.com/jcv86/main/actions/runs/42297804670) se detuvo en ese prerrequisito: una sesión CDP adicional no retiró la emulación de foco de la sesión original de Playwright y ambas pestañas seguían visibles/con foco. El [cuarto intento](uat/a2-reviewed-plan-20261106/attempt-4/ci-run.json) conserva el fallo antes de iniciar aplicación o SQL.

El quinto candidato fue [`b72f7f6c920aad60f7e35d1a34c4de62f9314abd`](https://github.com/jcv86/main/commit/b72f7f6c920aad60f7e35d1a34c4de62f9314abd), árbol `d0a6b5dbc3f024a25979e052eac4c3379bdf3729`. Su ajuste de driver se limita a una expresión de las herramientas temporales, con versión, integridad npm, hashes y conteo único verificados, y una bandera exclusiva de preflight/A2. El helper conserva transiciones nativas `hidden`/`visible` y eventos `isTrusted`; no modifica propiedades DOM ni genera eventos sustitutos. La [quinta corrida 42299599120](https://github.com/jcv86/main/actions/runs/42299599120) se detuvo al resolver core 1.65.0 desde la raíz de herramientas en vez de la dependencia 1.56.1 de Playwright. El guard rechazó el desacuerdo antes de modificar el driver o iniciar app/SQL; el [quinto intento](uat/a2-reviewed-plan-20261106/attempt-5/ci-run.json) conserva el fallo.

El candidato de cierre de AG03 fue [`f86177717d701de24dea323058c791472fd9d23c`](https://github.com/jcv86/main/commit/f86177717d701de24dea323058c791472fd9d23c), árbol `73c38830c04401590d33912fdbb160e7195a502c`. Sólo cambia la resolución del adapter desde la dependencia efectiva de Playwright mediante `createRequire`, conservando versión, integridad y hashes. La reproducción aislada pasó tanto con ambos cores —sin alterar el árbol 1.65.0— como con el layout plano 1.56.1; no ejecutó transiciones de navegador.

El gate completo final de `b9a017d` terminó con exit 0, Node.js 24.22.1, 354 páginas estáticas y 26 hashes sin cambios durante esa ejecución. La aplicación y migración siguen idénticas en `f861777`; los cambios posteriores de workflow/harness no se presentan como un gate local nuevo. La sexta [corrida 42300106261](https://github.com/jcv86/main/actions/runs/42300106261) concluyó en **`success`** sobre ese candidato y árbol exactos, con Node.js 22.23.4, Playwright/core 1.56.1 y Chromium 141.0.7390.37.

El [resumen verificado](uat/a2-reviewed-plan-20261106/attempt-6/verified-summary.json) registra migración aplicada dos veces, **22/22 casos SQL**, cero hallazgos de advisors totales y del candidato, **17 pasos de navegador** y **14 fuentes copiadas coincidentes**. Los 17 pasos se distribuyen en diez de escritorio, seis de viewport móvil y uno de acceso. Los snapshots completos de siete tablas de progreso/XP se conservaron. El preflight y el retorno a la aplicación registraron `hidden`→`visible`, foco y eventos `isTrusted`. Las seis baterías de contrato/API/asistente/runtime/provider/canary se repitieron con transporte de modelo sintético.

Las **ocho auditorías axe** registraron cero violaciones y ocho comprobaciones incompletas de `color-contrast`. Hubo cero errores JavaScript y cero solicitudes externas; el registro HTTP conserva abortos y la pérdida de respuesta inducida. Los tamaños **1440×1000** y **390×844** son viewports de Chromium: el segundo no acredita dispositivo móvil físico, interacción táctil o Safari. En cambio de cuenta se retuvo una respuesta POST después del commit real, se inició sesión con otro actor y se liberó la respuesta. Se verificaron limpieza de la UI y ausencia de escrituras en el segundo propietario; Auth puede cancelar antes de la entrega, por lo que esta prueba no distingue esa rama del rechazo de una respuesta tardía ni acredita ambas por separado. Las pruebas unitarias cubren la comprobación del actor después de una respuesta.

El [registro de CI6](uat/a2-reviewed-plan-20261106/attempt-6/ci-run.json) conserva el artefacto **13544122221**, 15.812.617 bytes, con SHA-256 verificado `b5aa30acd11a14f2e6276b53ee9afe8b43bb119eb9b02aade7114d9158afd3a0`; la copia de Actions vence el `2026-11-13T22:01:22Z`. **DTC-AG-03 quedó `verified` en alcance de laboratorio**, con los cinco intentos fallidos conservados. No hubo SQL remoto, IA real, nueva ejecución manual de los 54 casos ni publicación en producción. En ese checkpoint, DTC-AG-04 y DTC-AG-05 seguían abiertos con sus criterios propios; el cierre posterior de AG04 se registra a continuación.

## Continuación AG04 — confirmación y efecto comprobado

**DTC-AG-04 queda `verified` en laboratorio** sobre [`0e879b161e27eda3e3e85104f47544408c3aba0e`](https://github.com/jcv86/main/commit/0e879b161e27eda3e3e85104f47544408c3aba0e), árbol `b6a12f30e0e42e312702dd543347df6407a66f31`, con [corrida 42307458060](https://github.com/jcv86/main/actions/runs/42307458060) `success`. El [documento técnico](DTC_A2_REVIEWED_ACTIONS_20261106.md), el [resumen verificado](uat/a2-reviewed-actions-20261106/attempt-2/verified-summary.json) y la [carpeta de evidencia](uat/a2-reviewed-actions-20261106/) conservan contratos, fuentes y atribución exacta.

La propuesta tipada sólo aparece si la variante swarm seleccionada obtiene una aceptación del revisor. La persona compara el contexto actual, edita el trabajo conservado y próxima acción, elige una fecha y confirma. El modelo no ejecuta esa confirmación. La API autoriza mediante journey en modo read-only, por lo que una fila canónica ausente no se inicializa como efecto de un GET o un POST rechazado.

La transacción conserva el envelope existente de ajuste de práctica y escribe documento y recibo juntos. La lectura posterior usa la sesión/RLS del propietario y distingue `present`, `changed` y `removed`; sólo la coincidencia actual exacta permite mostrar el ajuste como guardado. Un reintento del mismo comando recupera su recibo y el efecto actual sin duplicar ni restaurar un documento eliminado. La identidad se vuelve a comprobar y la comparación de instantes conserva microsegundos. El bloqueo por propietario serializa estas acciones y compara el último ajuste consumido; recorrido, objetivo y demás fuentes mantienen el alcance de observaciones fechadas sin bloqueo global.

| Comprobación | Resultado observado | Alcance |
|---|---|---|
| Gate local final | **Exit 0, 30 fuentes sin cambios y 354 páginas estáticas** | [Registro final](uat/a2-reviewed-actions-20261106/local-quality.json), fuentes comparadas con el commit exacto; entorno sintético |
| SQL AG04 | **20/20**, migración aplicada dos veces | PostgreSQL/RLS reales; rollback, concurrencia, recibos, acceso, fechas y conservación canónica; 16 propietarios de prueba eliminados y fixtures del navegador preservadas |
| Navegador AG04 | **13 pasos, 23 fuentes verificadas** | Auth, cookies, API, RLS y persistencia reales; seis propuestas de generación sintéticas, tres fallos controlados y snapshots completos de siete tablas canónicas |
| Accesibilidad AG04 | **8 auditorías, cero violaciones y 7 incompletos de contraste** | Ocho capturas verificadas, cero errores JavaScript y solicitudes externas; abortos inducidos registrados por separado |
| Regresión AG03 del mismo candidato | **22 SQL, 17 pasos de navegador, 19 fuentes** | Migración doble, retorno nativo y conservación de progreso; ocho auditorías axe, cero violaciones y siete incompletos |
| Advisors | **Cero hallazgos totales y del candidato** en AG03 y AG04 | Laboratorio local; los objetos y el fixture heredado de documentos tienen alcance declarado |

La regresión nueva de AG03 se mantiene separada de su cierre histórico de `f861777`: aquel manifiesto contiene **14 fuentes** y sus ocho auditorías conservan **ocho resultados incompletos**. No se trasladan los resultados de la nueva corrida a los archivos anteriores. El [registro de CI2](uat/a2-reviewed-actions-20261106/attempt-2/ci-run.json) identifica el artefacto `13546709691`, 17.659.663 bytes, SHA-256 `dda2e7f13adf9339b061bcd05c3798f914293e870168d1223bd90654a9066d3d`, cuya descarga fue comprobada.

El primer [run 42305826318](https://github.com/jcv86/main/actions/runs/42305826318), sobre `0fd98c7`, permanece **FAIL** en [su registro](uat/a2-reviewed-actions-20261106/attempt-1/ci-run.json). Había aprobado 20 casos SQL y advisors, además de tres pasos del navegador, cuando axe detectó una violación seria de contraste en las etiquetas de nivel/racha. La [reproducción enfocada](uat/a2-reviewed-actions-20261106/appshell-contrast-visual-review.json) comprobó que `bg-background/88` no generaba CSS y dejaba transparente la cabecera sobre el CTA verde. El cambio a `bg-background` sólido mantuvo posiciones, scroll y umbrales de auditoría. AppShell pasó a formar parte del manifiesto AG04 de 23 fuentes; la segunda corrida verificó el arreglo.

La generación de propuestas de estas pruebas integradas es explícitamente sintética y el canary continúa **default-off, sin activación**. Los guardados no modifican finalizaciones, accesos ni XP. No se ejecutó SQL remoto ni se activó otro entorno; siguen separados el esquema de producción de documentos, despliegue, smoke y reversión del destino autorizado. Tampoco se acreditan utilidad, calidad, coste o latencia con IA real, una interacción táctil/Safari ni una sesión con participantes. El GO de negocio corresponde a `7eb0544` y los **54 casos manuales siguen `NO EJECUTADO`**. En aquel checkpoint AG04, AG05 seguía `not_started`; su implementación posterior se registra a continuación. AG07 permanece `in_progress` con medición real, comparación de utilidad y decisión de activación pendientes.

## Continuación AG05 — revisión con registros A3/A4, utilidad todavía pendiente

**DTC-AG-05 pasa a `in_progress`.** El código permite revisar un plan con fuentes actuales y conservar la edición antes de confirmarla. Este resultado técnico está comprobado dentro del laboratorio; el criterio de cierre exige además una comparación con el flujo simple y utilidad observada con participantes y modelo real. Los fixtures no representan resultados de participantes ni una mejora de capacidad.

El código publicado exclusivamente en **`uat/dtc-20261106`** es [`22d533d6e42f3663d2a46b9ca48116bf138c23f7`](https://github.com/jcv86/main/commit/22d533d6e42f3663d2a46b9ca48116bf138c23f7), árbol `7b1c57f9f7fce14b439650865ebbdacef15b1725`. La [corrida 42313235840](https://github.com/jcv86/main/actions/runs/42313235840) concluyó `completed/success` y aprobó sus **30 pasos**. El futuro commit de documentación registra esta ejecución; no sustituye el SHA del código probado. El [documento técnico](DTC_A2_REVIEW_EVIDENCE_20261106.md), el [resumen verificado](uat/a2-review-evidence-20261106/attempt-1/verified-ag05-summary.json) y la [carpeta de evidencia](uat/a2-review-evidence-20261106/) contienen contratos y límites.

### Qué puede revisar la persona

A3 aporta el último registro inicial y de seguimiento de `a3_structured_interview`, versión `2-capture`. Son respuestas conservadas sin evaluación: un par temporal conserva `not_evaluated` y `comparable:false`. A4 aporta la próxima decisión abierta y la última revisión cerrada directamente desde su bitácora. El resultado, su clasificación y los eventos externos son declaraciones de la persona; no se convierten en hechos verificados por DTC ni en efectos causados por el plan. Los puntajes históricos basados en longitud de texto y los contadores de finalizaciones quedan fuera de esta adaptación.

El panel **Antes de seguir** usa la vista existente del plan, con fuentes y fechas. Abrirlo o volver al editor no escribe ni reemplaza un borrador. Ante una fuente cambiada, la persona revisa el contexto, conserva su edición y confirma. Una fuente aplicable `unavailable` bloquea una nueva confirmación; `missing` requiere una lectura válida sin registro. `locked` conserva el límite de acceso y Persona usa `not_applicable` sin consultar A3/A4 profesionales. El guardado reutiliza CAS y recibos del plan; no añade tablas, migraciones ni otro framework.

Baseline y swarm reciben la misma proyección mínima, sin UUID, enlaces o hash del snapshot en el contexto nuevo del modelo. Sólo los registros disponibles aportan referencias. El servidor relee la evidencia antes de entregar una respuesta y también la incluye en el hash de una propuesta AG04 y de su confirmación posterior. Las revisiones conservan microsegundos y los snapshots v1 anteriores siguen siendo válidos sin añadir valores por defecto ni reescribir hashes. Las fuentes se observan mediante lecturas fechadas separadas; no hay un bloqueo global entre A3, A4 y el plan.

La revisión de código detectó que un fallo de Auth podía conservar orientación privada en la respuesta de error. **El defecto está corregido en `22d533d`**: tanto el cambio de identidad como la imposibilidad de verificarla retiran guía, respuesta y propuesta. Cinco regresiones cubren lectura inicial y relectura final en baseline/swarm, incluso si una consulta Auth posterior vuelve al actor original. El primer gate se conserva como [preparatorio](uat/a2-review-evidence-20261106/preparatory-gate.json); el [gate final](uat/a2-review-evidence-20261106/local-quality.json) corresponde a las fuentes corregidas.

### Evidencia observada del candidato

| Comprobación | Resultado | Alcance |
|---|---|---|
| Gate local final | **PASS, 30 fuentes estables y 354 páginas** | Gate completo con TypeScript/build y entorno sintético |
| Pruebas focalizadas | **128 asistente, 108 swarm, 42 provider, 56 canary, 64 revisión y 76 API de acciones**, todas PASS | Contratos, rutas y lectores reales con transporte/modelo sintéticos; son ejecuciones, no evaluación de utilidad de respuestas reales |
| SQL/RLS AG05 | **4/4**, secuencia existente de migraciones aplicada dos veces | SELECT del propietario, aislamiento entre usuarios, denegación anónima y escrituras directas del cliente denegadas |
| Navegador AG05 | **15 pasos, 41 fuentes exactas** | Auth, cookies, APIs y persistencia reales en Supabase local; cuatro propietarios sintéticos y ninguna llamada de generación en esta fase |
| Accesibilidad AG05 | **8 auditorías axe, 0 violaciones, 8 resultados incompletos `color-contrast`** | Capturas y revisión visual con alcance propio; los incompletos no equivalen a contraste comprobado |
| Ejecución AG05 | **0 errores JavaScript, 0 solicitudes externas; 14 abortos GET auxiliares** | Los abortos permanecen visibles por separado en el artefacto |
| Integridad | **17 propietarios previos y siete tablas canónicas preservados** | Comparaciones completas antes/después; el historial sintético usado para habilitar etapas no acredita avance de participantes |
| Regresión AG03 | **22 SQL, 17 pasos de navegador, 27 fuentes; 8 axe / 0 violaciones / 7 incompletos** | Nueva ejecución sobre este mismo candidato |
| Regresión AG04 | **20 SQL, 13 pasos de navegador, 31 fuentes; 8 axe / 0 violaciones / 7 incompletos** | Nueva ejecución; conserva generación de propuestas sintética y comprobación real de recibo/efecto |
| Advisors | **0 hallazgos del candidato y del laboratorio** | Fuentes existentes A3/A4 y persistencia reutilizada en el laboratorio local |

El [registro de CI](uat/a2-review-evidence-20261106/attempt-1/ci-run.json) conserva el artefacto **13548784558**, **21.825.666 bytes**, **137 archivos extraídos** y SHA-256 **`6f83ca7bfb984cd65e2bc50d3798dc42506da4c1eed879c791a12ef7928da1bc`**. El verificador dio **PASS** sobre registros, fuentes exactas y archivo descargado; no reejecuta de manera independiente las transacciones SQL o los pasos de navegador. La [revisión visual](uat/a2-review-evidence-20261106/attempt-1/visual-review.json) se conserva con sus límites observacionales.

Las cifras nuevas no reemplazan el historial: AG03 mantiene su cierre de **14 fuentes y ocho incompletos**, su regresión sobre AG04 conserva **19 fuentes y siete incompletos**, y el cierre AG04 conserva **23 fuentes y siete incompletos**. El primer fallo AG04 y la corrección de la cabecera transparente siguen documentados arriba. El GO anterior continúa ligado a **`7eb0544de496e10a2b1be1b482cdafec1d96dc3d`** y los **54 casos manuales permanecen `NO EJECUTADO`**.

### Trabajo necesario antes de cerrar AG05

La evaluación siguiente debe comprobar que revisar estos registros ayuda a una persona a elegir un ajuste útil, compararlo con el flujo simple y observar el comportamiento del modelo real, incluyendo fallos recuperables y coste/latencia. La equivalencia de contextos entre baseline y swarm ya comprobada con transporte sintético no satisface esa evaluación de utilidad. Tampoco se ha verificado de forma independiente el contenido de fuentes enlazadas ni los resultados externos declarados en A4.

AG07 sigue `in_progress` y el canary permanece **default-off, sin activación**. Esta publicación autorizada no ejecutó SQL remoto, no activó un entorno alojado, no fusionó `main` y no desplegó producción. Las pruebas en viewport móvil no acreditan dispositivo físico, interacción táctil o Safari; cero violaciones axe en el alcance ejecutado tampoco acredita conformidad WCAG completa. El avance de documentación no constituye una nueva aceptación humana ni modifica los registros manuales previos.

### Registro de la planilla

La [versión 7 del mismo archivo UAT](uat/a2-review-evidence-20261106/uat-workbook.json) quedó guardada después de exportar, reabrir y revisar cinco capturas. Añade `Protocolo!A139:C164` y `Control!B53:F53`. La comparación nativa preservó **2.126 celdas anteriores**, cuatro hojas, dos tablas, fórmulas, estilos y validaciones sin diferencias ni errores de fórmula. El archivo pesa **48.335 bytes**, SHA-256 `49ebf57d371bc0a606b3d7541cb748807bf7e08e175e0ab496832f418bf645bc`. El apéndice mantiene AG05 en curso, los 54 casos manuales en `NO EJECUTADO` y la aceptación original.
