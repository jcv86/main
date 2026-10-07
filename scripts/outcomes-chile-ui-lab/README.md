# Outcomes Chile: laboratorio de interfaz

Este laboratorio renderiza `OutcomesChileExperience` y sus componentes reales en Chromium. Reutiliza React, Tailwind, `globals.css` y `design-system.css` del proyecto. La API, los registros y el caché de idempotencia del servidor son **sintéticos**. No inicia Next, no necesita credenciales, no abre una sesión real y no modifica Supabase.

El arnés reproduce el espacio reservado para la navegación de escritorio y el contenedor del `main` de la aplicación. No verifica esa navegación ni el control de acceso del layout. Intercepta todas las solicitudes antes de que lleguen a la red; una solicitud externa inesperada hace fallar el caso.

## Ejecutar

Desde la raíz del checkout, con las dependencias de aplicación instaladas desde su lockfile y Node 24:

```bash
export DTC_OUTCOMES_UI_TOOLS_ROOT="${RUNNER_TEMP:-/tmp}/dtc-outcomes-ui-tools"
export DTC_OUTCOMES_UI_EVIDENCE_ROOT="${RUNNER_TEMP:-/tmp}/dtc-outcomes-ui-evidence"

npm install --prefix "$DTC_OUTCOMES_UI_TOOLS_ROOT" --no-audit --no-fund --ignore-scripts --no-save --package-lock=false playwright@1.62.1 @sparticuz/chromium@153.0.0 axe-core@4.14.0

node --import tsx scripts/outcomes-chile-ui-lab/run.mjs
```

Las herramientas se instalan fuera de la aplicación. No se añade Playwright al paquete principal ni se descarga otro navegador: `@sparticuz/chromium@153.0.0` incluye el binario headless Linux. La combinación local verificada fue Node 24.19.0, Playwright 1.62.1 y Chromium 153.0.8010.0. El proceso usa un navegador nuevo por caso porque el binario empaquetado funciona en un solo proceso.

Para usar un Chromium ya instalado, se puede indicar `DTC_OUTCOMES_UI_BROWSER_EXECUTABLE=/ruta/al/binario`. El arnés busca las herramientas en `DTC_OUTCOMES_UI_TOOLS_ROOT`, el proyecto y, si existe, el runtime principal. La ejecución de CI debe utilizar las versiones exactas anteriores.

`tsx` y `esbuild` se resuelven desde el árbol de dependencias instalado del proyecto. La implementación se compila en memoria; no hay servidor escuchando ni archivos de build en el checkout. El origen interceptado es `http://127.0.0.1:3147/despega/resultados-laborales`.

## Alcance y escenarios

- Render móvil de 390 × 844 y escritorio de 1440 × 960 con ausencia de desborde horizontal.
- Teclado: salto desde la acción principal, recorrido de pestañas, foco visible, mensajes de error, nuevo registro y respuesta a seguimiento.
- Auditoría axe de los componentes renderizados para WCAG 2 A/AA y 2.1 A/AA, incluido contraste con los CSS de la aplicación.
- Carga, estado vacío, GET 503, recuperación y mantenimiento del borrador durante la actualización.
- Ingreso vacío, negativo inválido, cero explícito y comparación de ingresos con diferencia negativa o evidencia ambigua.
- Doble activación de guardar, respuesta perdida después de un guardado sintético, reintento con el mismo `requestId` y preservación de campos al cambiar pestañas.
- POST 503 y 401: reintento estable y ocultamiento de datos personales tras expirar la sesión, con borrador conservado sólo en memoria.
- Seguimiento pendiente, respuesta guardada, fecha futura bloqueada y evidencia con fecha inconsistente que requiere revisión.
- Fecha y hora de evento según la zona del dispositivo (America/Santiago), convertida a un instante UTC.
- Referencia de mercado presente con fuente, período, fecha de publicación, cobertura, muestra desconocida y aviso de que no corresponde calcular una brecha contra ingreso líquido.

`fixtures.ts` llama a `buildChileImpact` y `buildChileWorkspace` reales con evidencia inventada. El benchmark de $765.432 es deliberadamente sintético; su referencia visible indica que no existe una publicación y que no debe citarse. No representa un dato del INE, SENCE ni de otra fuente.

## Estilos y tipografía

Se procesan ambos CSS en el orden del layout raíz. El import externo de Google Fonts se retira sólo del CSS del laboratorio para mantener la prueba sin red. Si `.next/static/css` contiene fuentes Montserrat de un build local, se extraen sus declaraciones y archivos WOFF2 y se sirven mediante el mismo transporte interceptado.

Si no hay build local, se usa Arial y `report.json` lo declara como `Arial-system-fallback`, junto con el límite de no haber verificado las métricas tipográficas de producción. No se necesita un build adicional para ejecutar los casos de interacción en CI. Un build previo permite igualar la fuente y obtener evidencia visual más fiel.

## Evidencia y veredicto

La salida queda en `DTC_OUTCOMES_UI_EVIDENCE_ROOT`, que debe estar fuera del checkout. Se generan `report.json` y capturas PNG del contenido real. El informe incluye commit base, estado `workingTreeDirty`, hashes SHA-256 de todos los componentes Outcomes Chile y fuentes principales, versiones, fuente utilizada, resultados por caso, errores de axe y límites de la prueba. Si el árbol contiene cambios sin commit, los hashes identifican la fuente probada; el commit base por sí solo no la identifica. Si un caso falla, se intenta guardar una captura del estado antes de continuar.

El comando devuelve código 0 y `GO` cuando pasan todos sus escenarios, o código distinto de cero y `NO_GO` si alguno falla. Ese veredicto se limita a esta interfaz aislada. La persistencia e idempotencia reales deben pasar las pruebas de la API/RPC y del laboratorio SQL; autenticación, integración Next, navegación de la aplicación y despliegue requieren sus verificaciones correspondientes.

Las capturas son evidencia con datos sintéticos. No son capturas de producción y no acreditan resultados laborales de usuarios.
