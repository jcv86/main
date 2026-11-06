# Evidencia del enjambre A2 — 6 de noviembre de 2026

Base: `a1b6388e4f31f5505ba86883e1731acb6309dbc2`. Entrega en `uat/dtc-20261106`.
Candidato de código: [`cc2ef70b2fe5518c4d02b736896c5dbbfeb82285`](https://github.com/jcv86/main/commit/cc2ef70b2fe5518c4d02b736896c5dbbfeb82285).
Árbol revisado: `00665941dbf1a3b9aff0ebf1ffee1c3637e2e46e`.
Implementación y límites: [DTC_A2_SWARM_20261106.md](../../DTC_A2_SWARM_20261106.md).

| Batería | Resultado final local | Alcance |
|---|---|---|
| API A2 y recuperación | 83/83 | Ruta, coordinador y adaptador reales con sesión, lecturas y HTTP sintéticos |
| Coordinación Sofía/Dani/revisor | 78/78 | Paralelismo, schemas, fuente canónica A1 real, presupuestos, cancelación y fallos |
| Adaptador OpenAI | 42/42 | HTTP sintético, esquema, formato, tamaño, plazos y privacidad |
| Selección y evidencia canary | 56/56, 12 ejecuciones CLI | Cohortes, apagado, métricas, identidad, ventana y recomendaciones |
| Siguiente acción canónica | 16 grupos | Coordinador y servicios existentes con Auth/HTTP sintéticos |

Los cuatro JSON adjuntos conservan los nombres de los casos y sus resultados.
`source-manifest.json` fija los hashes SHA-256 del código y scripts comprobados.
Las llamadas de modelo fueron sintéticas. No hubo llamadas a IA real ni activación
de un canary, y esta evidencia no prueba la utilidad humana de las respuestas.

## Fallos detectados y corregidos

- El trabajo heredado importaba dos módulos aún inexistentes y tenía una suite sin escenarios ejecutados. Se completaron runtime, adaptador y casos reales.
- La evidencia canary podía aceptar respuestas sin las llamadas necesarias y ocultar máximos por consulta. Ahora verifica coherencia y el máximo observado.
- El formato canónico de aclaraciones A1 contiene objetos, no strings. Se corrigió el contrato y se probó la cadena real de cuestionario, informe y proyección.
- La respuesta de recuperación podía admitir un rol incorrecto. Ahora valida rol, una sola opción, ausencia de errores/acciones, finalización y tamaño.
- La primera comprobación global detectó la discriminación TypeScript de `SwarmResult`. Se corrigió con una comparación literal de `ok` y se volvió a ejecutar el gate completo.

## Compilación e integración

`npm run quality:gate` finalizó con código 0 en Node.js 24.22.1, tras la corrección
del tipo discriminado. Incluyó regresiones de cierre profesional, las cinco
baterías anteriores, TypeScript de todo el repositorio, contratos críticos,
contratos de informes y compilación Next.js. La compilación generó 354/354 páginas
estáticas. Usó configuración sintética y no afirmó un entorno UAT remoto.

Los metadatos de la comprobación local están en `local-quality.json`.

La integración final de GitHub Actions terminó con **26/26 pasos aprobados**:
[corrida 42284049633](https://github.com/jcv86/main/actions/runs/42284049633),
Node.js 22.23.4, candidato exacto
[`0f1e6ffd568c26d835365ecd96fe94ae7ed55ec6`](https://github.com/jcv86/main/commit/0f1e6ffd568c26d835365ecd96fe94ae7ed55ec6).
Ese commit conserva el código de aplicación de `cc2ef70` y corrige únicamente
la ubicación de evidencia en el workflow, junto con su manifiesto. Las cuatro
baterías específicas repitieron 83/83, 78/78, 42/42 y 56/56 en CI.

La corrida ejecutó Auth, PostgreSQL, RLS, AppShell, recorrido y C1 reales dentro
de Supabase local desechable, con usuarios sintéticos. Incluyó continuidad tras
recarga, invitaciones, recuperación de sesiones, límites de acceso, atomicidad,
reintentos y navegador en escritorio y móvil. No llamó a un modelo real.
`ci-run.json` conserva identidad, resultados de los 26 pasos, resúmenes originales
de las cuatro suites y metadatos del artefacto, incluido SHA-256 y caducidad.

La primera corrida, [42283525397](https://github.com/jcv86/main/actions/runs/42283525397),
aprobó las pruebas nuevas pero falló al preparar el laboratorio: el directorio
de evidencia A2 creaba antes de tiempo la raíz protegida del laboratorio A1.
Se separaron ambos directorios en `0f1e6ff`; la protección contra sobrescritura
se conservó y se comprobó antes de repetir la integración. El resultado final
vigente es la corrida 42284049633.

## Relación con el UAT

La aceptación del responsable para `7eb0544` permanece documentada. Los 54 casos
manuales conservan sus estados. Las pruebas nuevas se agregan como ampliación
técnica; no se atribuyen a participantes, OAuth remoto ni un proveedor real.

El laboratorio de la rama usa Supabase local desechable. El entorno hosted
propuesto anteriormente permanece inactivo. No hubo migración remota, merge a
`main` ni publicación como parte de esta implementación.
