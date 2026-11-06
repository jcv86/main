# DTC — coordinación del asistente y siguiente acción

Fecha: 6 de noviembre de 2026. Rama: `uat/dtc-20261106`.
Base auditada: `79e038ba72fe7bac44e575b488c648789c91ad12`.
Candidato de código: [`e88058211a14bc10a670cd009c30a1d9d692de46`](https://github.com/jcv86/main/commit/e88058211a14bc10a670cd009c30a1d9d692de46).

**Continuación posterior de AG03: `verified` en laboratorio.** El [plan revisado y su memoria acotada](DTC_A2_REVIEWED_PLAN_20261106.md) quedó verificado en [`f861777`](https://github.com/jcv86/main/commit/f86177717d701de24dea323058c791472fd9d23c), con sexta [corrida 42300106261](https://github.com/jcv86/main/actions/runs/42300106261) `success` y artefacto comprobado: 22 casos SQL, 17 pasos de navegador, ocho auditorías axe sin violaciones y advisors sin hallazgos. Conserva ocho comprobaciones incompletas de contraste y los límites documentados de viewport móvil y cambio de cuenta. La aplicación y el gate local final siguen atribuidos a `b9a017d`; sólo workflow y harness cambiaron después. Las cifras del primer bloque mantienen su candidato histórico, y la aceptación humana de `7eb0544` y los 54 registros manuales no cambian.

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

## Arquitectura a completar después

El primer bloque aporta contexto común y una decisión de continuidad. La capa agéntica completa requiere los siguientes contratos, con un solo asistente visible y roles internos de comprensión y acción:

| Bloque | Resultado para la persona | Criterio de cierre |
|---|---|---|
| Plan y memoria operativa | Volver días después y retomar una decisión útil, con el objetivo y restricciones vigentes | Plan versionado, fuente/revisión, propietario, estados explícitos, corrección/borrado y recuperación tras interrupción; no almacenar toda conversación por defecto |
| Herramientas acotadas | Revisar una propuesta y confirmar una acción concreta dentro de DTC | Lista permitida, inputs tipados, autorización, presupuesto, idempotencia y recibo de persistencia; éxito sólo después de comprobar efecto |
| Continuidad A3/A4 | Conectar práctica, CV, oportunidades y revisión de decisiones con el mismo objetivo | Contextos mínimos y disponibilidad explícita, misma decisión canónica y evidencia de la tarea; vigencia/fuente para oportunidades |
| Revisión y adaptación | Ajustar un plan cuando la persona cambia de objetivo o declara una barrera | Diferenciar declaración, entregable, evaluación y resultado observado; conservar historial y evitar inferir progreso por cantidad de texto o XP |
| Evaluación y operación | Recibir ayuda que demuestra utilidad adicional con coste y latencia controlados | Casos reales anonimizados/sintéticos pertinentes, comparación con el flujo simple, fallos recuperables, límites de tiempo/coste, trazas sin contenido personal |

El primer caso de escritura recomendable es **proponer un ajuste de práctica y guardarlo tras revisión de la persona**, utilizando el contrato existente en vez de un comando genérico. Debe conservar la versión revisada y devolver el ID confirmado. Después se puede seguir un resultado con evidencia y decidir si mantener o cambiar la acción. Publicaciones, postulaciones, contactos y gastos requieren su autorización correspondiente.

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
- En este primer candidato, planes persistentes, memoria operativa, herramientas con recibos, adaptación A3/A4 y evaluación de utilidad quedaron abiertos en DTC-AG-03/04/05. La continuación AG03 se registra debajo con evidencia propia; el historial del chat sigue durando sólo mientras la página permanece abierta.

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

El candidato vigente es [`f86177717d701de24dea323058c791472fd9d23c`](https://github.com/jcv86/main/commit/f86177717d701de24dea323058c791472fd9d23c), árbol `73c38830c04401590d33912fdbb160e7195a502c`. Sólo cambia la resolución del adapter desde la dependencia efectiva de Playwright mediante `createRequire`, conservando versión, integridad y hashes. La reproducción aislada pasó tanto con ambos cores —sin alterar el árbol 1.65.0— como con el layout plano 1.56.1; no ejecutó transiciones de navegador.

El gate completo final de `b9a017d` terminó con exit 0, Node.js 24.22.1, 354 páginas estáticas y 26 hashes sin cambios durante esa ejecución. La aplicación y migración siguen idénticas en `f861777`; los cambios posteriores de workflow/harness no se presentan como un gate local nuevo. La sexta [corrida 42300106261](https://github.com/jcv86/main/actions/runs/42300106261) concluyó en **`success`** sobre ese candidato y árbol exactos, con Node.js 22.23.4, Playwright/core 1.56.1 y Chromium 141.0.7390.37.

El [resumen verificado](uat/a2-reviewed-plan-20261106/attempt-6/verified-summary.json) registra migración aplicada dos veces, **22/22 casos SQL**, cero hallazgos de advisors totales y del candidato, **17 pasos de navegador** y **14 fuentes copiadas coincidentes**. Los 17 pasos se distribuyen en diez de escritorio, seis de viewport móvil y uno de acceso. Los snapshots completos de siete tablas de progreso/XP se conservaron. El preflight y el retorno a la aplicación registraron `hidden`→`visible`, foco y eventos `isTrusted`. Las seis baterías de contrato/API/asistente/runtime/provider/canary se repitieron con transporte de modelo sintético.

Las **ocho auditorías axe** registraron cero violaciones y ocho comprobaciones incompletas de `color-contrast`. Hubo cero errores JavaScript y cero solicitudes externas; el registro HTTP conserva abortos y la pérdida de respuesta inducida. Los tamaños **1440×1000** y **390×844** son viewports de Chromium: el segundo no acredita dispositivo móvil físico, interacción táctil o Safari. En cambio de cuenta se retuvo una respuesta POST después del commit real, se inició sesión con otro actor y se liberó la respuesta. Se verificaron limpieza de la UI y ausencia de escrituras en el segundo propietario; Auth puede cancelar antes de la entrega, por lo que esta prueba no distingue esa rama del rechazo de una respuesta tardía ni acredita ambas por separado. Las pruebas unitarias cubren la comprobación del actor después de una respuesta.

El [registro de CI6](uat/a2-reviewed-plan-20261106/attempt-6/ci-run.json) conserva el artefacto **13544122221**, 15.812.617 bytes, con SHA-256 verificado `b5aa30acd11a14f2e6276b53ee9afe8b43bb119eb9b02aade7114d9158afd3a0`; la copia de Actions vence el `2026-11-13T22:01:22Z`. **DTC-AG-03 queda `verified` en alcance de laboratorio**, con los cinco intentos fallidos conservados. No hubo SQL remoto, IA real, nueva ejecución manual de los 54 casos ni publicación en producción. DTC-AG-04 y DTC-AG-05 continúan abiertos con sus criterios propios.
