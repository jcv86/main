# A4 — comprobación operativa del 14 de octubre de 2026

Estado: evidencia documental adicional para la PR #237, que permanece en borrador. No modifica código de aplicación ni completa por sí sola los hitos S01, S02 o P01.

## Identidad comprobada

- Repositorio: `jcv86/main`; main observado: `172a09b94e266084c9d79be235053893db5ef549`.
- La consulta autenticada de Vercel para el dominio canónico resolvió producción `dpl_JDvrrvfSwMdmghUionzASdAsEyDU`, estado `READY`, proyecto `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`, con el mismo SHA de main.
- La publicación permanece en la versión de las PR #241/#242. Esta revisión no inició otra publicación.
- Base consultada: exclusivamente DTCFINAL. Todas las consultas de esta revisión fueron SELECT de metadatos o agregados; no se ejecutaron cambios de datos, esquema, permisos, cuentas, horarios, leases o credenciales.
- Corte del catálogo: **2026-10-14 11:47:32 UTC / 08:47:32 America/Santiago**. Corte de calidad y tableros: **11:49:12 UTC / 08:49:12 Chile**.

## Catálogo observado

“Frescas” significa `verification_status = 'verified_active'` y `last_verified_at >= now() - interval '24 hours'` en la consulta. No equivale al número de tarjetas vistas ni a coincidencias para una búsqueda particular.

| Fuente | Guardadas | Estado activo | Activas verificadas en 24 h |
|---|---:|---:|---:|
| Chiletrabajos | 251 | 244 | 66 |
| Get on Board | 44 | 44 | 34 |
| Greenhouse | 26 | 26 | 26 |
| Lever | 21 | 19 | 19 |
| **Total** | **342** | **333** | **145** |

Get on Board ya tiene ingesta nativa y filas recientes. El corte histórico de 93 ofertas del 8 de octubre se conserva como histórico, no como inventario actual. Estos cambios corresponden al recolector existente; esta revisión no lanzó una ingesta manual.

## Ejecuciones posteriores a la última publicación

Ventana consultada: desde **2026-10-08T03:35:24.835Z**, hora READY de la publicación, hasta el corte de consulta del 14 de octubre. Se observaron **50 ejecuciones registradas**:

| Resultado registrado | Ejecuciones | Alcance del diagnóstico |
|---|---:|---|
| `success / ok` | 31 | Lote completo según el contrato del recolector |
| `failure / partial`, Coderio | 17 | `SOURCE_DATA_PARTIAL`; se conservan las ofertas válidas |
| `failure / partial`, Chiletrabajos | 1 | `PROVIDER_UNAVAILABLE`, 9 de octubre a las 06:15 UTC |
| `failure / partial`, Fintual | 1 | `PROVIDER_UNAVAILABLE`, 10 de octubre a las 00:15 UTC |

Los cuatro grupos registran operaciones de inserción o actualización. Los resultados parciales no se reclasifican como éxitos completos ni como una caída total del recolector. Las operaciones `upserted` no se cuentan como nuevas ofertas únicas.

La ejecución más reciente observada empezó el **14 de octubre a las 09:15:01 UTC / 06:15:01 Chile**, slot `165923`: parcial por Coderio, **33 upserts**, cero rechazos del índice y cero invalidaciones. Get on Board aportó 30 upserts, Coderio 2 y PagerDuty 1. Coderio recibió 15 registros: 2 aceptados, 11 excluidos por geografía no confirmada y 2 rechazados por `missing_description`. Su snapshot permanece incompleto; no se inventa contenido ni se habilita reconciliación por ausencia para ese tablero.

## Cobertura y mantenimiento comprobados

| Tablero | Visitas registradas | Resultados completos | Resultados parciales |
|---|---:|---:|---:|
| Cabify / Greenhouse | 16 | 16 | 0 |
| Checkr Chile / Greenhouse | 17 | 17 | 0 |
| PagerDuty / Greenhouse | 17 | 17 | 0 |
| APPLY Digital / Lever | 17 | 17 | 0 |
| Coderio / Lever | 17 | 0 | 17 |
| Fintual / Lever | 16 | 15 | 0 |

La visita restante de Fintual es el fallo temporal indicado arriba. Una visita posterior exitosa de Fintual se observó el 14 de octubre a las 03:15 UTC. Chiletrabajos también registra recuperación posterior: ejecución completa a las 06:15 UTC del 14 de octubre. La recuperación no fue provocada por esta revisión.

Se observaron **40 ejecuciones con comprobaciones de mantenimiento**. Los grupos de ejecuciones registran **8 invalidaciones** en total; son operaciones de invalidación, no una cuenta certificada de documentos únicos. No apareció ningún mapa de cooldown no vacío: **la pausa y reanudación por Retry-After no quedan certificadas en producción**.

## Calidad de las 145 filas frescas

| Fuente | Con requisitos no vacíos | Con habilidades no vacías | Con modalidad no vacía y distinta de `unknown` |
|---|---:|---:|---:|
| Chiletrabajos | 51 | 16 | 11 |
| Get on Board | 21 | 34 | 34 |
| Greenhouse | 22 | 20 | 23 |
| Lever | 12 | 7 | 19 |
| **Total** | **106** | **77** | **87** |

La consulta midió presencia de campos; no verificó semánticamente todos sus contenidos. La ausencia de un campo sigue siendo falta de información de la publicación, no ausencia de una capacidad personal.

## Límites y estado de aceptación

La consulta de grupos de errores de Vercel para las rutas cron, catálogo y for-me no devolvió grupos en las últimas 24 horas al momento de la revisión. Esto no contradice los resultados parciales guardados, no equivale a revisar cada log ni certifica ausencia de todos los errores.

Esta sesión no completó un recorrido autenticado del Radar ni la prueba positiva con CV estructurado y evidencia DTC reales. No inspeccionó contenido personal ni certificó la disponibilidad de las fuentes de una cuenta. Las comprobaciones HTTP de salud no pudieron validarse con el lector web disponible; el estado READY procede de metadatos autenticados de Vercel, no sustituye una prueba de usuario.

- **S01/S02:** se incorpora evidencia positiva de Get on Board, visitas a los seis tableros, mantenimiento y recuperación de dos fallos temporales. Conservan `in_progress` para los criterios todavía no observados, especialmente cooldown/reanudación. Coderio sigue explícitamente parcial.
- **P01:** conserva `in_progress`. El siguiente criterio decisivo es una orientación positiva en sesión del propietario con evidencia legítima de DTC y CV; mantener filtros explícitos, respaldos de ambos lados y requisitos por confirmar. Una cuenta habilitada no prueba personalización.
- No se repitieron las 542 pruebas históricas, la compilación completa ni la revisión visual en esta sesión. Su evidencia conserva exclusivamente el alcance de la entrega anterior.

## Consulta mínima reproducible de catálogo

Ejecutar solo en DTCFINAL. Es una consulta de lectura; el resultado cambia con el corte temporal.

```sql
select now() as checked_at,
       source,
       count(*) as stored,
       count(*) filter (
         where verification_status = 'verified_active'
       ) as active,
       count(*) filter (
         where verification_status = 'verified_active'
           and last_verified_at >= now() - interval '24 hours'
       ) as fresh_24h,
       max(last_verified_at) as last_verified_at
from public.a4_verified_opportunities
group by source
order by source;
```

Documentos de referencia: [recolector](DTC_MULTISOURCE_OPPORTUNITY_COLLECTOR.md), [ledger](DTC_CLOSURE_LEDGER.md) y [orientación personal](DTC_A4_PERSONAL_ORIENTATION.md). Este corte complementa sus registros históricos sin sobrescribirlos ni cambiar sus estados globales.
