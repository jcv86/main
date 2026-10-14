# Outcomes — diagnóstico de navegador y alcance comprobado

Fecha: 14 de octubre de 2026.
PR: #244. Estado: **borrador; no apto todavía para fusionar**.
Código de aplicación examinado: `50e1df37edd095c2a89399df0018d24342adb0af`.
Script conservado: `scripts/test-outcome-browser-regression.cjs`.
Commit del script: `d1ad48c22d0cf8acad96d7d60eeb995594c9c06f`.
Blob del script ejecutado y recuperado desde GitHub: `9419ea959c6d82bce724166a5525f73ca031314b` (10.986 bytes).

## Diagnóstico que sí se cerró

La prueba anterior no conseguía observar el aviso de error después de un POST 503. Se reprodujo en el mismo componente A1, sin cambiar el código de DTC. El estilo calculado era `display: block`, `visibility: visible`, `opacity: 1`, pero su caja tenía ancho 324 y altura **0**. Otros textos, incluido el encabezado, tampoco tenían métricas normales.

El navegador empaquetado no estaba usando la configuración de sus fuentes. Su propio helper `setupLambdaEnvironment` establece `FONTCONFIG_PATH` hacia las fuentes incluidas. Al configurar ese valor en el proceso del navegador, manteniendo el mismo componente y los estilos DTC, el aviso pasó a medir ancho 324 y altura **40**; `isVisible()` devolvió `true`.

**La causa reproducida era el entorno de pruebas, no un cambio necesario en el formulario.** Esto no certifica todo el recorrido de producción. El nuevo script comprueba primero que un encabezado tenga métricas de fuente reales para no repetir ese falso diagnóstico.

Referencias técnicas consultadas: documentación oficial de Playwright sobre actionability/visibilidad y el helper de `@sparticuz/chromium` 153.0.0. La visibilidad requiere una caja con dimensiones, no solo que el elemento exista en el DOM.

## Escenario que llegó a completarse

A1, ancho 390, alto 844, tema claro; React y componentes reales, CSS de DTC, API sintética limitada a loopback. No se utilizaron cuentas ni información de clientes, ni el shell autenticado completo.

Se ejecutaron correctamente estas **16 comprobaciones de comportamiento**:

1. Las fuentes del navegador producen métricas reales.
2. El formulario vacío no permite guardar.
3. La vista inicial no desborda horizontalmente.
4. Un fallo de guardado muestra un error visible.
5. El fallo conserva todas las respuestas en la página abierta.
6. El reintento conserva la identidad de la solicitud.
7. El formulario no envía una nota, confianza o propietario manipulable.
8. El texto recién guardado se puede desplegar y leer.
9. Continuar requiere una acción explícita.
10. La recarga recupera el texto del punto de partida desde la API sintética.
11. Leer el historial no rellena ni reemplaza el nuevo borrador.
12. Punto de partida y seguimiento tienen fechas y texto recuperables.
13. El texto no anuncia una mejora de capacidad evaluada.
14. La lectura desplegada no genera desbordamiento horizontal.
15. Un error al leer no se presenta como historial vacío.
16. Reintentar la lectura recupera el historial.

El reintento del guardado también se activó con foco y Enter. Esto no sustituye una auditoría completa de teclado o lector de pantalla. No se observaron excepciones de JavaScript en este escenario.

## Hallazgo de accesibilidad todavía abierto

Axe Core 4.14.0 informó `color-contrast`, impacto `serious`, con selector `button`, tanto en el estado de error de escritura como después del seguimiento guardado. Son **dos observaciones de la misma regla**, no dos defectos únicos certificados.

El registro disponible identifica selector, regla y estado; todavía falta el detalle de colores y el diagnóstico dentro de la presentación completa de DTC. Por tanto, **no se certifica accesibilidad ni se declara aprobado el escenario completo** pese a las 16 comprobaciones de comportamiento positivas. Tampoco se modificó el botón global sin revisar su impacto.

## Por qué la batería no terminó

El script contiene 12 combinaciones previstas: A1/A2/A3, 390/1440 y claro/oscuro. Después del primer escenario, el navegador se cerró al intentar abrir la siguiente página/contexto. No llegaron a ejecutarse los escenarios restantes. El proceso usaba los argumentos predeterminados de Chromium empaquetado, que incluyen `--single-process`; esa configuración es una hipótesis pendiente de comprobar, no una causa demostrada del cierre.

La llamada que preparaba un ajuste del laboratorio y más detalle del diagnóstico fue bloqueada por el control de seguridad. También se bloqueó la inicialización de una base PostgreSQL local y desechable para las pruebas de aislamiento. Mensaje recibido en ambos casos:

> OpenAI bloqueó esta llamada a la herramienta al no poder determinar el estado de seguridad de la solicitud.

No hubo diagnóstico más específico. No se ejecutaron esas acciones bloqueadas por otra vía. No se levantó la base local ni se realizaron pruebas Auth/RLS efectivas. La instalación de herramientas de prueba fuera del repositorio no demuestra su funcionamiento.

## Herramientas y reproducción

Versiones instaladas fuera del repositorio: Chromium empaquetado 153.0.0, navegador 153.0.8010.0, Playwright Core 1.64.1, esbuild 0.28.2 y Axe Core 4.14.0. El producto conserva sus dependencias y lockfile.

En un entorno aislado autorizado, el script requiere:

```text
DTC_OUTCOME_BROWSER_LAB=yes
DTC_OUTCOME_BROWSER_TOOLS=<directorio de las herramientas de prueba>
DTC_OUTCOME_BROWSER_OUTPUT=<directorio de evidencias>
node scripts/test-outcome-browser-regression.cjs
```

**El script se conserva como reproducción de una ejecución incompleta; no como una batería aprobada.** Está fuera de `quality:gate` y no se añadió ningún workflow para ejecutarlo. Su condición previa impide correrlo accidentalmente sin la opción explícita de laboratorio. El código todavía usa los argumentos predeterminados del paquete del navegador y debe revisarse antes de ampliar su alcance; no es una configuración para probar seguridad web.

## Revisión independiente y estado de producto

Se volvió a solicitar a GitHub la revisión con el identificador documentado `copilot-pull-request-reviewer[bot]`. La lectura posterior de `reviews` siguió vacía: **no hay una revisión independiente entregada**. No se atribuye trabajo en curso a Copilot.

Esta pasada no modificó código de aplicación, datos, esquema, permisos, cuentas, tareas programadas, variables ni dependencias del producto. Agrega solamente el script de prueba y este registro. No fusionó la PR ni publicó la funcionalidad en producción. Las pruebas automatizadas y el build del candidato anterior conservan el alcance y SHA documentados en la PR; no se presentan como una validación del navegador o de resultados de clientes.

Pendientes concretos: diagnosticar/corregir el contraste, completar los otros escenarios del navegador, verificar el recorrido autenticado y el aislamiento real entre propietarios y obtener la revisión independiente. La evaluación de capacidades y la validación de outcomes de clientes siguen siendo una etapa diferente de la captura y recuperación de respuestas.
