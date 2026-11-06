# Evidencia Auth y C1 — 2026-11-06

Código `7eb0544de496e10a2b1be1b482cdafec1d96dc3d`, árbol `1b828ca81ec3c1cdbc01aaf1f59347c8e13c076b`.
[Actions 42268602016](https://github.com/jcv86/main/actions/runs/42268602016), job `128066975458`: **SUCCESS**.

El [manifest](artifact-manifest.json) conserva la identidad del artifact, digest verificado, fecha de expiración y hashes de cada JSON. El ZIP completo de capturas vence el 13 de noviembre de 2026 a las 18:21:39 UTC; estos resultados permanecen en Git.

| Evidencia | Contenido |
|---|---|
| [auth-results.json](auth-results.json) / [auth-scope.json](auth-scope.json) | 17 casos reales de ingreso, invitación, Provider, cuotas y salida; 18 revisiones de accesibilidad/layout y diagnóstico de red |
| [c1-results.json](c1-results.json) / [c1-scope.json](c1-scope.json) | 24 casos de conservación de texto, rollback, pérdida de respuesta y recarga; 10 revisiones de accesibilidad/layout |
| [c1-atomic-sql.json](c1-atomic-sql.json) | 19 casos PostgreSQL: transacción, concurrencia, CAS, recuperación histórica, permisos y manipulación posterior |
| [c1-seed.json](c1-seed.json) / [c1-advisors.json](c1-advisors.json) | Doble aplicación de migración, trigger A4 real, timestamp y cero warnings/errors locales |
| [closure-results.json](closure-results.json) / [closure-scope.json](closure-scope.json) | 41 casos de los seis formularios, 28 revisiones de accesibilidad/layout y readiness del CSS responsive |
| [results.json](results.json), [flow-results.json](flow-results.json) | 22 casos base de navegador y 12 de recorrido A1–A4 |
| [objective-writer-compatibility.json](objective-writer-compatibility.json) | 19 casos de compatibilidad SQL de objetivo laboral |
| [runtime-boundary-results.json](runtime-boundary-results.json), [invitation-browser.json](invitation-browser.json), [ops-correlation.json](ops-correlation.json) | Fronteras HTTP, invitación de un solo uso y correlación sin identificadores personales |

Se trata de usuarios y datos sintéticos del stack local desechable. No contiene contraseñas, JWT, cookies, HAR, storageState ni logs privados del servidor. Los errores HTTP inducidos, los 404 auxiliares del runtime mínimo y las cancelaciones de transporte están declarados; cero errores JavaScript no capturados no significa cero mensajes de recursos HTTP. Las capturas usan fuentes del sistema y las de página completa conservan el contexto de scroll de elementos fijos; no certifican la tipografía de marca o un diseño pixel-perfect.

El [informe completo](../../DTC_AUTH_C1_CLOSURE_20261106.md) y el [contrato API](../../DTC_C1_COMPLETION_API_20261106.md) explican decisiones, recuperación, publicación y límites. No se ejecutaron migraciones remotas ni la aceptación humana de los 54 casos UAT.
