# Outcomes — aceptación automatizada del navegador, 14 de octubre de 2026

## Veredicto acotado

**La batería automatizada de navegador queda aprobada: 12 escenarios, 193 comprobaciones y 24 análisis de Axe, sin infracciones, resultados incompletos ni excepciones JavaScript. La PR #244 todavía no queda aprobada para publicar.**

El alcance de esta entrega sigue limitado a captura y recuperación de respuestas A1/A2/A3. No acredita mejora de capacidades, empleabilidad ni eficacia de DTC.

## Identidad comprobada

- Código de aplicación: `4244f3689621215b0e0d3f6ebab1518654187e33`.
- Script ejecutado: `scripts/test-outcome-browser-regression.cjs`.
- Blob exacto del script: `a75eed1ca6b1822ed42af1a2866d694ca4831358`, guardado mediante el commit `0e6cef61448f81f6d94be097eded8b531041e595`.
- Este último commit modifica únicamente el ensayo; no cambia los componentes, rutas, estilos globales, dependencias o esquema del producto.
- Navegador: Chromium `153.0.8010.0`.
- Herramientas aisladas: `@sparticuz/chromium@153.0.0`, `playwright-core@1.64.1`, `esbuild@0.28.2`, `axe-core@4.14.0`.

## Resultado final ejecutado

| Grupo | Resultado | Alcance |
|---|---:|---|
| A1/A2/A3 × 390/1440 píxeles × clase dark activada/desactivada | 12/12 escenarios | Altura de viewport 844 píxeles |
| Comprobaciones de comportamiento | 193/193 | 16 por escenario y una comprobación global de excepciones |
| Axe: fallo de guardado y seguimiento guardado | 24 análisis | Etiquetas `wcag2a`, `wcag2aa`, `wcag21aa` |
| Infracciones automáticas | 0 | En los componentes y estados examinados |
| Resultados de Axe incompletos | 0 | El ensayo ahora también falla ante estos resultados |
| Excepciones JavaScript | 0 | Eventos `pageerror` de los 12 escenarios |
| Pruebas focalizadas de captura/rutas/componentes repetidas | 79/79 | Transporte y hooks sintéticos en sus respectivos grupos |
| Cinco scripts de contratos, sintaxis del ensayo y diff-check | Aprobados | No sustituyen una integración autenticada real |

Los escenarios comprueban: formulario incompleto sin envío, ausencia de desbordamiento, aviso visible de fallo, conservación del texto, reintento con la misma identidad, ausencia de nota/identidad propietaria enviada por el cliente, revisión de respuestas, continuación explícita, recuperación tras recarga, separación del borrador, lectura de ambas fases y recuperación después de un error de historial. El uso de Enter se comprueba en el botón de reintento; no se presenta como una auditoría exhaustiva de navegación mediante teclado o lector de pantalla.

## Diagnóstico que se cerró

La primera pasada con el código `4244f3` ya completó las 193 comprobaciones y no encontró infracciones, pero Axe dejó observaciones incompletas en escritorio. Una segunda pasada diagnóstica identificó un único elemento afectado: el **h1 añadido por el laboratorio**, parcialmente superpuesto y renderizado con 88 píxeles de tamaño. No correspondía al botón ni al título del componente DTC.

Se ajustaron únicamente tamaño, interlineado y margen del título del montaje de pruebas. Se conservaron el control de fuentes y todos los escenarios, se ampliaron los diagnósticos de resultados incompletos y se hizo fallar el ensayo ante cualquier infracción **o** resultado incompleto. La pasada posterior terminó sin ninguno de ellos. No se excluyó la regla de contraste ni se ocultó un elemento del producto para conseguir un resultado favorable.

La configuración por proceso de navegador introducida en `4244f3` permitió completar los 12 escenarios sin el cierre prematuro observado anteriormente. El aviso de error dejó de ser un bloqueo; su diagnóstico previo de fuentes conserva su evidencia histórica.

## Evidencia de ejecución

- Primera pasada del ensayo existente: comando `cmd_0a8f58f531334486b9c457f4c595`, exit 0, 82.410 ms incluyendo instalación aislada.
- Pasada diagnóstica: `cmd_0190f12a08854a10b73937cf6540`, exit 0, 59.013 ms.
- Pasada final con el script guardado: `cmd_f83bddeeccc34430be55c9620b67`, exit 0, 60.125 ms.
- Repetición de contratos y comprobación sintáctica: `cmd_ef6dec6fd1e54a24a16c4b5605cf`, exit 0.
- SHA-256 del JSON final generado: `5a5af7849def7bcf3d434bfcc8c8569b2f765a438016a477bc371867f2f82c83`.
- SHA-256 del registro de progreso generado: `f4d1397b0e3bdf00e286b03df5e0c9cdc07016be8fb90faa76118630992f5d82`.
- Último escenario completado: `a3/1440/dark`.

Los JSON y capturas se generaron en el entorno temporal. Este documento conserva el resultado y sus huellas; las huellas no son enlaces de descarga ni implican almacenamiento permanente de los archivos temporales. No se compartieron fuentes tipográficas.

## Reproducción

Instalar las dependencias de aplicación desde el lockfile y las cuatro herramientas fijadas arriba en un directorio temporal separado. Ejecutar desde la raíz del repositorio, en un entorno de pruebas autorizado y sin credenciales de producción:

```sh
DTC_OUTCOME_BROWSER_LAB=yes \
DTC_OUTCOME_BROWSER_TOOLS=/ruta/al/directorio/temporal/de/herramientas \
DTC_OUTCOME_BROWSER_OUTPUT=/ruta/al/directorio/de/evidencia \
node scripts/test-outcome-browser-regression.cjs
```

El montaje sirve únicamente en loopback y bloquea peticiones de navegador a otros orígenes. Usa componentes React y CSS reales, pero API sintética y fuentes de respaldo del navegador. La clase dark se alterna; esto no prueba el proveedor de temas de la aplicación completa.

## Límites de publicación que se mantienen

1. **Integración autenticada real:** falta comprobar guardar → recargar → continuar y aislamiento entre dos propietarios con Auth/JWT/RLS efectivos. En esta sesión se instaló una herramienta de PostgreSQL en el directorio temporal, pero una lectura preparatoria fue bloqueada por el control de seguridad. No se inició ni certificó ese ensayo, no se recuperaron credenciales de producción y no se repitió la acción bloqueada por otra vía.
2. **Revisión independiente:** se publicó una solicitud `@codex review` en el comentario `6170781987`, limitada a inspección de código sin ejecución o cambios. La publicación de la solicitud no equivale a una revisión aceptada o entregada; se debe verificar la respuesta antes de cerrar este criterio.
3. **Revisión visual/integración de presentación:** la batería es automatizada. Sus capturas se generaron, pero no se afirma inspección visual humana ni auditoría completa del shell autenticado, fuentes definitivas, accesibilidad o navegación entre módulos.

No se requiere ampliar funcionalidades para cerrar la PR. Mantener pendiente el merge y la publicación hasta resolver la aceptación restante. El objetivo laboral y la PR #237 no forman parte de este bloque. La evaluación con rúbrica y el piloto de outcomes profesionales siguen siendo una etapa diferente.
