# Evidencia — coordinación del asistente y siguiente acción

Fecha: 6 de noviembre de 2026, America/Santiago.

- Rama: `uat/dtc-20261106`.
- Base auditada: `79e038ba72fe7bac44e575b488c648789c91ad12`.
- Candidato de código: [`e88058211a14bc10a670cd009c30a1d9d692de46`](https://github.com/jcv86/main/commit/e88058211a14bc10a670cd009c30a1d9d692de46).
- [Informe, criterios de aceptación y condiciones](../../DTC_AGENTIC_COORDINATION_20261106.md).

## Registros conservados

| Archivo | Contenido |
|---|---|
| [candidate-evidence.json](candidate-evidence.json) | Identidad del candidato, hashes de 17 archivos, resultados resumidos, CI y límites de alcance |
| [journey-guided-next-action.json](journey-guided-next-action.json) | Resultado emitido por el test real durante el quality gate: 16 grupos aprobados |
| [a2-assistant-route.json](a2-assistant-route.json) | Los 52 casos del handler y contrato reales con sesión, lecturas y proveedor sintéticos |
| [agentic-browser-results.json](agentic-browser-results.json) | 80 comprobaciones, 20 scans axe con detalle, dimensiones, fuentes y hashes |
| [agentic-manual-review.json](agentic-manual-review.json) | Inspección de capturas, incidencia corregida y limitaciones de accesibilidad |
| [agentic-final-sha256.json](agentic-final-sha256.json) | Hashes de fuentes y evidencia original, incluidas capturas reproducibles |
| [quality-gate.json](quality-gate.json) | Comando, exit code, duración, versión Node y hash del log del gate |
| [final-build.json](final-build.json) | Build posterior a la última corrección de contraste y hash del log |
| [ci-run.json](ci-run.json) | Run 42277726935 completado con éxito sobre el candidato; identidad y resultados de los 25 pasos del job |

Los JSON son resultados originales salvo `candidate-evidence.json`, que reúne las identidades y alcances, y `journey-guided-next-action.json`, extraído sin cambiar campos del resultado emitido en el log. El campo `parentCommit` del navegador identifica la base sobre la que se ejecutaron archivos aún sin commit; `sourceHashes` y el manifiesto del candidato vinculan esas fuentes con el commit final. No significa que el navegador haya probado sólo el árbol anterior.

Las capturas y logs extensos son artefactos temporales reproducibles y no se incluyen aquí como binarios. Sus nombres y hashes se conservan para identificar lo observado. El archivo temporal `agentic-browser-failure.json` no es un resultado final: contiene un fallo anterior de configuración del harness. El resultado vigente es `agentic-browser-results.json`.

## Reproducción y límites

`npm run test:guided-assistant` ejecuta los tests de coordinación y API. También se incluyeron en `test:professional-closure`, dentro del `quality:gate` existente. Los resultados del asistente usan transporte sintético; no realizan llamadas reales al proveedor ni certifican su calidad.

El navegador se ejecuta con `DTC_AGENTIC_BROWSER_LAB=yes node --import tsx scripts/agentic-browser-qa.mjs` en un fixture desechable. Requiere Playwright/Chromium y axe locales, con `DTC_AGENTIC_BROWSER_TOOLS` si están instalados fuera del proyecto y `DTC_AGENTIC_QA_OUTPUT` para elegir el directorio de resultados. Esta ejecución usó Chromium 153.0.8010.0 disponible en el entorno de pruebas; no agregó dependencias a la aplicación. El script contiene los puntos de sustitución explícitos y rechaza uso sin la variable de laboratorio.

Cuando Chromium no proviene de la instalación habitual de Playwright, `DTC_AGENTIC_CHROMIUM_PATH` permite indicar el ejecutable preparado. El run conservado utilizó esa opción con un Chromium empaquetado y su configuración de fuentes/fontconfig preparada fuera del repositorio. La alternativa con Chromium instalado por Playwright no requiere reproducir esa preparación específica del entorno.

Se probaron componentes React, árboles de páginas, CSS y selectores canónicos reales en 390×844 y 1440×844. Auth, lecturas del servidor, transporte HTTP IA, enlaces Next y fuentes remotas se sustituyeron por fixtures, anchors y fuentes del sistema. No se montó el AppShell autenticado completo en esta prueba enfocada.

Los 20 resultados `incomplete` de axe pertenecen exclusivamente a `color-contrast`: fondos degradados que el motor no puede determinar, con 542 apariciones de nodos entre scans. Se inspeccionaron capturas, pero eso no mide cada relación de contraste. No se afirma conformidad WCAG completa.

La CI existente de la rama ejecuta por separado Auth, Supabase/PostgreSQL y RLS locales, shell, recorrido y C1. Su run para este código, [42277726935](https://github.com/jcv86/main/actions/runs/42277726935), terminó con `success`: los 25 pasos del job fueron aprobados. La identidad exacta y los resultados se conservan en el manifiesto del candidato y `ci-run.json`. No es una validación del proveedor IA en vivo.

El UAT de `7eb0544` conserva su propia aceptación y sus 54 estados manuales. Ningún registro de esta carpeta cambia esos estados, aplica SQL remoto, modifica datos de participantes o declara un despliegue de producción.
