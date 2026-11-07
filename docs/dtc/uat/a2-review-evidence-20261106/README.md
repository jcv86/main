# AG05 — revisión del plan con registros declarados de A3/A4

## Estado y atribución

**Verificación técnica aprobada; AG05 permanece `in_progress`.** La evidencia cubre lectura, acceso, revisión explícita, persistencia y continuidad del plan. La comparación de utilidad con el asistente habitual, la evaluación con participantes y las mediciones con un modelo real siguen pendientes. Los 54 casos manuales conservan `NO EJECUTADO` y el GO de negocio original corresponde a `7eb0544de496e10a2b1be1b482cdafec1d96dc3d`.

| Referencia | Identidad verificada |
| --- | --- |
| Repositorio / rama autorizada | `jcv86/main` / `uat/dtc-20261106` |
| Candidato de aplicación | `22d533d6e42f3663d2a46b9ca48116bf138c23f7` |
| Árbol del candidato | `7b1c57f9f7fce14b439650865ebbdacef15b1725` |
| CI | [42313235840](https://github.com/jcv86/main/actions/runs/42313235840), intento 1, `completed/success` |
| Job | `128219522309`, `isolated-browser`, 30 pasos aprobados |
| Artefacto | `13548784558`, `a1-browser-evidence-22d533d6e42f3663d2a46b9ca48116bf138c23f7` |
| ZIP | 21.825.666 bytes; 137 archivos verificados |
| SHA-256 del ZIP | `6f83ca7bfb984cd65e2bc50d3798dc42506da4c1eed879c791a12ef7928da1bc` |
| Expiración informada por GitHub | `2026-11-13T23:51:08Z` |

El commit que incorpora este registro es documental: no sustituye la identidad del candidato sobre el que se ejecutó CI. La publicación se limita a la rama UAT. No se activa el canary, se provisiona Supabase alojado, se ejecuta SQL remoto ni se hace un merge a `main`.

## Resultados integrados

| Fase en el mismo candidato | SQL | Pasos de navegador | Fuentes copiadas y cotejadas | Auditorías axe | Violaciones | Resultados incompletos de contraste |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| AG03, regresión | 22 | 17 | 27 | 8 | 0 | 7 |
| AG04, regresión | 20 | 13 | 31 | 8 | 0 | 7 |
| AG05 | 4 | 15 | 41 | 8 | 0 | 8 |

AG05 tiene ocho pasos de escritorio, cinco de móvil y dos de acceso. Cada fase registra cero hallazgos de advisors, tanto del candidato como del conjunto del laboratorio, con Supabase CLI `2.117.0`. Las fuentes se compararon por bytes/hash con el commit de aplicación y el checkout local. Los resultados históricos de AG03/AG04 mantienen sus propias identidades; esta tabla describe su reejecución sobre AG05.

El laboratorio utiliza PostgreSQL, RLS, Auth y rutas de fuente/plan reales y locales, con datos sintéticos. AG05 añade cuatro propietarios y conserva los 17 anteriores. Tres fixtures incluyen 90 días A2 y diez módulos A3 con cierre de ruta como preparación explícita del acceso. Esas filas no representan actividad ni resultados de participantes.

Después de preparar los fixtures, se compararon las filas completas de siete tablas canónicas: `despega_user_profiles`, `despega_journey_state`, `a2_user_task_completions`, `a3_user_progress`, `a3_route_progression`, `user_gamification_profile` y `user_dtc_balance`. La lectura de evidencia y la revisión del plan no alteraron esos datos.

Los cambios de fuente incluyen una captura A3 autenticada por su API, una revisión A4 autenticada por su API y una eliminación A4 mediante SQL local declarada. Los fallos controlados comprueban que una fuente A4 ilegible conserva el plan, que una captura v2 numérica más reciente produce `unavailable` sin volver a una captura antigua y que Persona/etapas bloqueadas omiten las consultas profesionales incluso al revocar ambos permisos de lectura.

## Suites de contrato, rutas y coordinación

| Suite retenida en `attempt-1` | Comprobaciones aprobadas |
| --- | ---: |
| `a2-review-evidence.json` | 64 |
| `a2-assistant-route.json` | 128 |
| `a2-swarm-runtime.json` | 108 |
| `a2-swarm-provider.json` | 42 |
| `a2-swarm-canary.json` | 56 |
| `a2-action-api.json` | 76 |
| `a2-action-contract.json` | 28 |
| `a2-plan-contract.json` | 56 |
| `a2-plan-api.json` | 39 |

Estas suites ejecutan los contratos, lectores, handlers y coordinadores declarados en cada reporte con puertos de sesión/HTTP/almacenamiento o proveedor sintéticos. Algunos nombres se repiten por parametrización; no se suman como casos con nombres únicos. La prueba del canary no certifica telemetría real ni activa tráfico.

En el navegador AG05 no hubo llamadas al modelo ni respuestas de generación sustituidas. El caso combinado de confirmar una acción AG04 con evidencia A3/A4 disponible se verifica mediante puertos sintéticos. Las integraciones reales de AG04 y AG05 son fases separadas. Los usuarios AG05 con historial completo no tienen un día A2 pendiente, y el laboratorio no fabrica uno para atribuir ese caso a navegador real.

## Interfaz, accesibilidad y red

La revisión visual cubre las ocho capturas AG05 y la captura AG04 de cambio de cuenta, cotejadas con el manifiesto del ZIP. No se observaron nuevos defectos visuales accionables. El espacio entre la frase del aviso de sesión y «Volver a abrir el asistente» queda resuelto en la captura revisada. El informe conserva los hashes, dimensiones, observaciones y límites por imagen.

AG05 registra cero errores JavaScript y cero solicitudes externas, además de **14 GET auxiliares abortados**: siete a `/api/banco-central-data` y siete a `/api/a4-strategic-score`, todos `net::ERR_ABORTED`. No se resume esto como ausencia de fallos de red. AG03 y AG04 conservan respectivamente 20 y 19 fallos/abortos registrados, incluidos los fallos de transporte controlados de sus pruebas de reintento.

Los ocho incompletos AG05 son ocho resultados de `color-contrast`, uno por auditoría; no equivalen necesariamente a ocho elementos distintos. La inspección visual no los cierra ni certifica WCAG. Móvil corresponde a Chromium con viewport 390 × 844; escritorio, 1440 × 844. El shell y las fuentes de laboratorio, el scroll de las capturas de página completa y la ausencia de pruebas en dispositivos físicos, Safari y tecnologías asistivas se declaran en [la revisión visual](attempt-1/visual-review.json).

La UI local previa aporta 55 comprobaciones, ocho auditorías axe sin violaciones y ocho resultados incompletos, con 11 fuentes estables. Usa componentes y CSS reales con Auth/HTTP sintéticos. No se usa esa fase para acreditar los accesos reales del laboratorio integrado.

## Archivos y reproducción

- [Índice de copias y hashes](attempt-1/artifact-index.json): 30 archivos retenidos, con procedencia y hash. Los 26 JSON originales seleccionados del artefacto se copiaron sin reserializarlos.
- [Metadatos de CI](attempt-1/ci-run.json): run, job, commit, árbol y artefacto obtenidos de GitHub.
- [Verificación independiente](attempt-1/verified-ag05-summary.json): identidad, bytes del ZIP, conjunto exacto de fuentes, suites, SQL, invariantes, auditorías y PNG.
- [Verificador utilizado](attempt-1/verify-ag05-ci-artifact.py): comparación de solo lectura. Su hash figura en el resultado.
- [Quality gate local final](local-quality.json): `PASS`, 30 fuentes estables, build de 354 páginas y atribución al candidato exacto.
- [Gate preparatorio](preparatory-gate.json): salió con código 0, pero cambió una fuente durante su ejecución al corregir el error de identidad. No es evidencia estable del candidato. La corrida final y CI cubren la corrección.
- [UI local original](local-ui/a2-plan-review-evidence-ui.json), [atribución de fuentes](local-ui/candidate-attribution.json) y [revisión visual local](local-ui/visual-review.json).
- [Planilla UAT y preservación](uat-workbook.json): identidad y versión del mismo archivo, hash, áreas añadidas, conservación nativa y revisión visual.

El ZIP completo y los PNG no están embebidos en este directorio Git. Las copias originales seleccionadas, sus hashes y los informes quedan versionados aquí; la descarga completa depende de la disponibilidad del artefacto en GitHub. El verificador requiere el ZIP original y su extracción completa, no sólo este subconjunto:

```bash
python verify-ag05-ci-artifact.py /ruta/al/artefacto/extraido \
  22d533d6e42f3663d2a46b9ca48116bf138c23f7 \
  --repo /ruta/al/checkout \
  --zip /ruta/al/artifact.zip \
  --metadata ci-run.json \
  --run-id 42313235840 \
  --artifact-id 13548784558 \
  --tree 7b1c57f9f7fce14b439650865ebbdacef15b1725
```

El checkout debe contener el objeto del candidato y las mismas fuentes de aplicación. No se introdujeron dependencias ni migraciones para AG05. El detalle funcional y sus límites están en [DTC_A2_REVIEW_EVIDENCE_20261106.md](../../DTC_A2_REVIEW_EVIDENCE_20261106.md).
