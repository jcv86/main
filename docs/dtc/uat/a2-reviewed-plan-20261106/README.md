# Evidencia DTC-AG-03 — plan revisado y memoria mínima A2

## Identidad y estado

- Rama de trabajo: `uat/dtc-20261106`.
- Candidato de integración: `f86177717d701de24dea323058c791472fd9d23c`.
- Árbol: `73c38830c04401590d33912fdbb160e7195a502c`.
- Corrida del candidato: [42300106261](https://github.com/jcv86/main/actions/runs/42300106261).
- Estado de laboratorio del candidato: **PASS — DTC-AG-03 verificado en el laboratorio desechable**.
- Gate local completo: PASS sobre `b9a017db939d8a060c9696312987a93381132cea`, con 26 hashes idénticos durante su ejecución. Desde ese gate sólo cambiaron cinco archivos de configuración y pruebas del navegador; aplicación, migración y pruebas unitarias permanecen idénticas.

## Historial de integración

| Intento | Candidato | Resultado observado |
| --- | --- | --- |
| [1](attempt-1/ci-run.json) | `bb6523d` | Migración aplicada dos veces; 16 SQL PASS. Una consulta de prueba mezclaba el tipo fecha y texto del mismo parámetro. |
| [2](attempt-2/ci-run.json) | `f093497` | 22 SQL PASS y cero hallazgos de advisors del candidato. Navegador detenido por nombres de progreso ausentes y contraste del CTA lateral. |
| [3](attempt-3/ci-run.json) | `b9a017d` | 22 SQL y seis pasos reales de navegador PASS. Tres auditorías axe sin violaciones. El regreso de pestaña no produjo el GET esperado: aún faltaba demostrar la transición nativa. |
| [4](attempt-4/ci-run.json) | `7e0c777` | El preflight headed no observó visibilidad/foco complementarios al desactivar la emulación desde una sesión CDP adicional. Se detuvo antes de iniciar aplicación o SQL. |
| [5](attempt-5/ci-run.json) | `b72f7f6` | El control de versión rechazó el core 1.65.0 instalado en la raíz por axe. La copia exacta 1.56.1 usada por Playwright estaba anidada; se reprodujo y corrigió su resolución. No se ejecutó el preflight ni la aplicación. |
| [6](attempt-6/ci-run.json) | `f861777` | CI completa PASS: 22 SQL, 17 pasos de navegador, preflight y retorno nativo de A2; cero hallazgos de advisors y ocho auditorías axe sin violaciones. Artefacto descargado y digest verificado. |

`b9a017d` corrige nombres y valores ARIA del progreso, contraste del CTA y de confirmación del borrado, y limita el selector al enlace canónico sin cambiar su comprobación de destino. El laboratorio de foco utiliza Chromium headed y Xvfb. Un adapter temporal, fijado a Playwright 1.56.1, cambia una sola expresión de su sesión original para desactivar el foco forzado únicamente con `DTC_NATIVE_TAB_FOCUS=yes`. La bandera sólo está presente en preflight y aceptación A2. Se verifican integridad npm, versión, rutas reales, hash original y hash modificado. Las demás fases conservan el comportamiento anterior.

La prueba exige transiciones reales `hidden/unfocused` y `visible/focused`, junto con eventos nativos `isTrusted`; no cambia propiedades del documento ni inyecta eventos. El preflight corre antes de preparar Supabase. La [validación local del adapter](native-driver-local-validation.json) acredita transformación y guardas; la [reproducción de dependencias anidadas](native-driver-hoist-validation.json) comprueba que la copia independiente 1.65.0 queda intacta. Ninguna de esas dos validaciones sustituye el preflight nativo de CI.

## Comprobaciones locales

| Informe | Resultado | Alcance |
| --- | --- | --- |
| `a2-plan-contract.json` | 56/56 | Contratos reales, fechas, proyección de contexto, estados y memoria mínima; sin base de datos. |
| `a2-plan-api.json` | 39/39 | Handlers, lectura y hash reales con puertos sintéticos; recuperación de recibos, CAS y errores. |
| `a2-assistant-route.json` | 95/95 | Ruta real del asistente y revalidación antes de responder; Auth, lecturas y transporte del modelo sintéticos. |
| `a2-swarm-runtime.json` | 81/81 | Coordinador y validaciones reales; completados del modelo sintéticos. |
| `a2-swarm-provider.json` | 42/42 | Adaptador HTTP real con transporte sintético. |
| `a2-swarm-canary.json` | 56/56 | Selector, evaluación y 12 ejecuciones de CLI con evidencia sintética. |
| `agentic-browser-results.json` | 80/80, candidato inicial | Regresión anterior de componentes con Auth y lecturas sintéticas; sólo GET vacío del plan. El color del botón de borrado cambió después. |
| `a2-sidebar-accessibility-results.json` | 19 auditorías posteriores sin violaciones | Layout, tarjeta, sidebar, Button, Radix Progress y CSS reales; Auth/API sintéticos. Incluye una auditoría anterior adicional que reproduce los fallos. |
| `local-quality.json` | PASS | `npm run quality:gate`, TypeScript, contratos y build de 354 páginas. |

`source-manifest.json` vincula las fuentes de cada batería con su candidato, sin atribuir los 13 hashes de la regresión anterior al código final. `final-quality-source-check.json` registra el gate final, sin cambios de fuentes durante su ejecución. La prueba enfocada comprobó cuatro nombres distintos y valores ARIA correctos en 0/50/100, foco visible y ausencia de desbordamiento en escritorio/móvil. Sus 19 auditorías posteriores conservan resultados incompletos de contraste por gradientes; la regresión anterior conserva 20. La inspección visual no resuelve por sí sola una medición completa de contraste.

## Integración final y revisión visual

El [registro de CI6](attempt-6/ci-run.json) identifica el commit exacto y todos los pasos. La [verificación del artefacto](attempt-6/verified-summary.json) contrasta las 14 fuentes copiadas con ese commit y registra los hashes de las ocho capturas. Los informes JSON completos de SQL, advisors, navegador, preflight, adapter y las seis baterías de regresión se conservan en `attempt-6/`.

| Comprobación final | Resultado |
| --- | --- |
| PostgreSQL, concurrencia, recibos y rollback | 22/22; migración aplicada dos veces; 20 propietarios SQL de prueba eliminados. |
| Seguridad del laboratorio y del candidato | Cero hallazgos en advisors; RLS y prohibición de escrituras directas comprobadas. |
| UI, email Auth, API y persistencia reales | 17/17 pasos; cuentas y contenido sintéticos. |
| Regreso de pestaña | Preflight y retorno dentro de A2 aprobados con visibilidad/foco complementarios y eventos `isTrusted`; se conserva el borrador. |
| Progreso canónico y XP | Siete tablas comparadas completamente antes y después, sin cambios por operaciones del plan. |
| Auditorías finales de accesibilidad | Ocho sin violaciones; ocho resultados incompletos de contraste por gradientes. |
| JavaScript y solicitudes externas | Cero errores de ejecución y cero intentos de solicitudes externas. Los fallos de transporte deliberados se conservan en el JSON. |
| Versiones observadas | Node.js 22.23.4, Playwright 1.56.1 y Chromium 141.0.7390.37. |

El ZIP de CI es el artefacto `13544122221`, de 15.812.617 bytes, con SHA-256 `b5aa30acd11a14f2e6276b53ee9afe8b43bb119eb9b02aade7114d9158afd3a0`. Su retención termina el 13 de noviembre de 2026 a las 22:01:22 UTC; los JSON y hashes incorporados aquí permanecen en el repositorio.

La [revisión visual](attempt-6/visual-review.json) inspeccionó las ocho capturas y sus estados. Las capturas de página completa incluyen elementos fijos en la posición de desplazamiento desde la que se tomaron; no acreditan ausencia de obstrucción en todos los viewports. El aviso al cambiar de cuenta conserva un detalle cosmético previo a AG03: el enlace de reapertura queda pegado al punto anterior. No es un fallo nuevo de persistencia y queda registrado para revisión visual manual.

El viewport móvil es Chromium a 390×844; no se probó un dispositivo físico, interacción táctil ni Safari. La prueba de cambio de actor permite que Auth cancele la solicitud antes de entregar la respuesta retenida; acredita limpieza y aislamiento, sin distinguir esa rama de un rechazo posterior a una entrega tardía. El laboratorio conserva la sustitución de documento raíz/fuentes ya declarada en su alcance. Los incompletos de contraste y estas capturas no equivalen a conformidad WCAG completa.

## Alcance de la entrega

El plan guarda únicamente lo que la persona revisa y confirma. El chat sigue siendo temporal. Marcar un paso como realizado expresa una declaración de la persona y no cambia tareas canónicas, XP, acceso ni competencias.

El asistente recibe texto mínimo únicamente cuando el plan está activo, vigente y coincide con el contexto verificado. La huella del contexto identifica una lectura fechada; no constituye una transacción global entre las fuentes independientes. Una pausa, corrección, eliminación o cambio de contexto observado durante la generación impide entregar una respuesta basada en la memoria anterior.

Los recibos durables distinguen el resultado de un comando del estado actual del plan. Tras borrar, una solicitud antigua puede recuperar su recibo sin restaurar contenido. El borrado elimina el contenido vigente y su historial; conserva sólo metadatos mínimos de versión y deduplicación.

## Límites

- El laboratorio utiliza Supabase local desechable y propietarios sintéticos. No aplica migraciones a un proyecto alojado.
- No se prueban calidad de un modelo real, producción, cohortes activas ni ejecución autónoma en segundo plano.
- La aceptación previa del propietario corresponde al candidato `7eb0544de496e10a2b1be1b482cdafec1d96dc3d`.
- Los 54 casos de UAT manual conservan su estado **NO EJECUTADO**. Las pruebas automáticas no sustituyen esa aceptación.

## Planilla UAT

`DTC_UAT_2026-11-06.xlsx` quedó actualizada a la versión 5. El [registro de preservación](uat-workbook.json) identifica su hash y las únicas áreas añadidas: `Protocolo!A80:C105` y `Control!B49:F49`. Se recalculó, exportó, reabrió e inspeccionó visualmente; la comparación nativa conservó 1.957 celdas originales, las cuatro hojas, fórmulas, formatos, validaciones, formato condicional y dos tablas, sin diferencias en los elementos verificados. La aceptación anterior y los 54 casos manuales mantienen sus estados.
