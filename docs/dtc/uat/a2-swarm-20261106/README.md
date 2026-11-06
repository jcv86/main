# Evidencia del enjambre A2 — 6 de noviembre de 2026

Base: `a1b6388e4f31f5505ba86883e1731acb6309dbc2`. Entrega en `uat/dtc-20261106`.
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

La compilación final y la corrida de GitHub Actions del candidato se registrarán
en esta sección al terminar. Los resultados de la tabla son evidencia local de
Node.js 24.22.1; no sustituyen una corrida del workflow con Node.js 22.

## Relación con el UAT

La aceptación del responsable para `7eb0544` permanece documentada. Los 54 casos
manuales conservan sus estados. Las pruebas nuevas se agregan como ampliación
técnica; no se atribuyen a participantes, OAuth remoto ni un proveedor real.

El laboratorio de la rama usa Supabase local desechable. El entorno hosted
propuesto anteriormente permanece inactivo. No hubo migración remota, merge a
`main` ni publicación como parte de esta implementación.
