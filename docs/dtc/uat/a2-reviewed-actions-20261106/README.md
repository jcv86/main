# Evidencia AG04 — acciones revisadas del asistente A2

Estado: **verificado en laboratorio**. Código final `0e879b161e27eda3e3e85104f47544408c3aba0e`, árbol `b6a12f30e0e42e312702dd543347df6407a66f31`, rama `uat/dtc-20261106`. El [informe técnico](../../DTC_A2_REVIEWED_ACTIONS_20261106.md) describe comportamiento, contratos y límites.

## Resultado integrado y atribución

La [corrida 42307458060](https://github.com/jcv86/main/actions/runs/42307458060) terminó `success`. El [registro oficial](attempt-2/ci-run.json) identifica el artefacto `13546709691`, de 17.659.663 bytes, con SHA-256 verificado `dda2e7f13adf9339b061bcd05c3798f914293e870168d1223bd90654a9066d3d`. La [atribución](attempt-2/source-attribution.json) incluye tamaño/hash y origen de cada JSON copiado sin cambios. El ZIP y los metadatos de GitHub fueron comprobados separadamente del verificador interno del artefacto.

| Evidencia | Resultado y alcance |
|---|---|
| [Resumen verificado](attempt-2/verified-summary.json) | PASS; comparación de 23 fuentes AG04 y 19 AG03 con el objeto Git exacto y el checkout, productores y migraciones; PNG, escenarios e invariantes. |
| [Seed AG04](attempt-2/a2-action-seed.json) | Migración aplicada dos veces; cuatro propietarios sintéticos de navegador, sin ajustes ni recibos al inicio. |
| [SQL AG04](attempt-2/a2-action-sql.json) | 20 casos PASS; escritura y recibo atómicos, replay, grants/RLS, admisión, concurrencia, fechas y cambios/eliminación. 16 propietarios SQL limpiados; fixtures del navegador preservadas. |
| [Navegador AG04](attempt-2/a2-action-browser-results.json) | 13 pasos PASS: seis desktop, cuatro mobile y tres de acceso. Siete tablas canónicas completas sin cambios respecto del baseline declarado. Auth, API, RPC, RLS y PostgreSQL reales locales; generación sintética. |
| [Advisors AG04](attempt-2/a2-action-advisors.json) | Sin hallazgos candidatos ni totales en el laboratorio. No inspecciona el esquema alojado. |
| [Regresión SQL AG03](attempt-2/a2-plan-sql.json) y [navegador AG03](attempt-2/a2-plan-browser-results.json) | 22 SQL y 17 pasos PASS sobre este candidato; 19 fuentes. No sustituye el registro histórico de AG03. |
| [Revisión visual AG04](attempt-2/visual-review.json) | Ocho capturas originales inspeccionadas; ningún bloqueo visual nuevo; un hallazgo cosmético abierto de espaciado en el aviso de cambio de cuenta. |
| Auditorías axe integradas | AG04: ocho auditorías, cero violaciones, **siete incompletas de contraste**. AG03 en esta corrida: ocho, cero, **siete incompletas**. Los incompletos conservan su significado, sin certificación WCAG global. |
| [Preflight de foco](attempt-2/focus-visibility-preflight.json) y [adaptador nativo](attempt-2/native-tab-focus-adapter.json) | Evidencia de la fase AG03 en la misma corrida, con cambio real de foco/visibilidad; no atribuir ese mecanismo a un caso AG04 distinto. |

El [verificador de sólo lectura](verify-ci-artifact.py) tiene SHA-256 `6585d95cf413cd68e68f38d279b2de626ce75be517902c78dba010b4f1972bc3`. Se corrigió su comparación de ancho para exigir PNG = `layout.document`, manteniendo no-overflow. AG03 excluye la barra de desplazamiento de 8 px de su captura completa; AG04 documento y viewport coinciden. Esa corrección del verificador no modifica la aplicación, el harness ni los resultados brutos de CI.

Los JSON de seed/SQL/advisors y suites unitarias no incluyen por sí solos el commit. Su atribución depende del mismo ZIP comprobado con la metadata oficial; manifiestos, productores y anclas que sí incluyen SHA se verificaron además contra el candidato. El informe no inventa hashes embebidos que sus productores no generaron.

## Evidencia local separada

| Registro | Qué prueba |
|---|---|
| [Gate completo final](local-quality.json) y [manifiesto](source-manifest.json) | `npm run quality:gate` PASS, Node 24.22.1, TypeScript y build de 354 páginas. 30 fuentes sin cambios durante el gate y cotejadas con `0e879b1`. Log SHA-256 `79d7409762f60b6b6f067f57de7c738792c9fc52c0da2f4ce612cf3641e5c682`. |
| [Contrato](a2-action-contract.json) y [API/readback](a2-action-api.json) | 28 y 69 casos; 52 operaciones HTTP sintéticas en la suite API. Puertos de sesión/base sustituidos, sin prueba SQL/RLS real en estas suites. |
| [API asistente](a2-assistant-route.json), [runtime](a2-swarm-runtime.json), [proveedor](a2-swarm-provider.json), [canary](a2-swarm-canary.json) | 103/94/42/56 casos. Fuentes y respuestas del modelo sintéticas; canary sigue desactivado por defecto. |
| [Contrato de plan](a2-plan-contract.json) y [API de plan](a2-plan-api.json) | Regresión local de 56 y 39 casos. |
| [UI local](local-a2-assistant-action-ui.json) y [revisión visual local](local-visual-review.json) | 49 comprobaciones, ocho auditorías sin violaciones y **ocho incompletas** de contraste. Componentes y CSS reales; Auth/HTTP sintéticos. Cifra independiente de las siete incompletas del segundo CI. |
| [Hallazgos corregidos](review-findings.json) | Identidad, lectura sin crear journey, precisión de timestamps, recepción/cancelación, borradores y recuperación, con atribución a los candidatos. |
| [Planilla UAT](uat-workbook.json) | Reemplazo de la misma planilla, controles de preservación y vínculo con el candidato; mantiene 54 casos NO EJECUTADO y aceptación anterior. |

Las ocho suites unitarias de esta tabla se repitieron en CI; las copias del artefacto están dentro de `attempt-2/`. Las evidencias locales conservan su origen, sin presentarse como pruebas integradas.

## Primer intento y corrección de contraste

El [intento 1](attempt-1/ci-run.json), candidato `0fd98c7db202af6e369173374261b589fda0cc0f`, corrida `42305826318`, permanece **failure**. AG04 completó 20 casos SQL, pero el navegador se detuvo tras tres pasos por una violación seria de contraste del encabezado sobre el CTA verde. No se cuentan sus casos restantes como ejecutados.

La [prueba enfocada](appshell-contrast-probe.json) y su [inspección visual](appshell-contrast-visual-review.json) reprodujeron los targets originales: la clase `bg-background/88` no generaba CSS efectivo. La corrección `bg-background` dio fondo opaco y cambió el contraste medido de 2,23:1 a 8,06:1. No se modificaron desplazamiento, scanner, reglas ni umbrales. La auditoría enfocada sin incompletos no elimina los incompletos de las páginas completas.

## Límites y retención

Los datos y propietarios son sintéticos. No se acredita calidad, coste o latencia de un modelo real; uso con personas; hardware móvil/Safari; despliegue; esquema remoto ni migraciones remotas. El contrato conserva un contexto fechado, sin transacción global sobre todos los escritores. Los borradores y comandos pendientes de la pantalla permanecen en memoria; no se promete recuperarlos tras recargar.

El defecto `ag04-visual-account-alert-spacing` permanece abierto como cosmético. El UAT conserva su GO anterior para `7eb0544de496e10a2b1be1b482cdafec1d96dc3d` y **54 casos manuales NO EJECUTADO**. AG05 y evaluación/activación AG07 siguen pendientes.

El artefacto de CI expira el **13 de noviembre de 2026**. Este directorio conserva JSON de resultados, hashes de las capturas y metadatos de procedencia. No incluye cookies, credenciales, storageState, HAR, logs privados ni enlaces temporales de descarga.
