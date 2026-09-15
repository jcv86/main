# DTC Closure Ledger

Última actualización: 2026-09-15. Este ledger registra evidencia observable; un cambio de código sin prueba no cuenta como verificado. Cuando existe evidencia browser/local fuerte pero falta una comprobación live remota explícita, el gate permanece `in_progress` y se documenta la parte ya cerrada.

| ID | Resultado para el usuario | Evidencia / aceptación | Responsable | Dependencia | Estado | Bloquea release |
|---|---|---|---|---|---|---|
| DTC-SEC-01 | Ningún entorno desplegado puede omitir autenticación o exponer laboratorios internos | Browser/HTTP local Preview-equivalent PASS: `/demo`, `/test`, `/design-system`, `/auth/debug`, `/auth/test` son 404 reales bajo `VERCEL_ENV=preview`; cookie/query legacy no bypass; rutas protegidas no renderizan sin sesión. En Preview Vercel real de #169 se confirmó además `/demo` = 404 con `x-dtc-request-id`. Falta una sesión live reutilizable para repetir todo el set detrás de Vercel SSO. | Backend/QA | Validación live multi-ruta detrás de Deployment Protection | in_progress | sí |
| DTC-SEC-02 | Tokens, sesiones y administración legacy no quedan expuestos por Data API/RPC | Migración P0 + contratos PASS. Preflight live sólo lectura detectó RPCs legacy `SECURITY DEFINER` todavía ejecutables por roles cliente en DTCFINAL; #169 y #172 preparan revocaciones, preservan el único RPC residual activo ligado a `auth.uid()` y endurecen `search_path`, sin aplicar cambios remotamente. | Supabase | Aprobación de migración + verificación remota | in_progress | sí |
| DTC-AUTH-01 | Un escáner de correo no consume la invitación | Chromium + Supabase Auth/PostgREST locales + SQL real de invitación: GET/scanner no consume; POST explícito reclama una sola vez; segundo navegador no reutiliza el token. Regresión browser completa PASS en #167/#169/#170. Falta repetir claim + OAuth dentro del Preview protegido. | Auth/QA | Preview OAuth real | in_progress | sí |
| DTC-JRN-01 | El usuario recurrente siempre retoma desde una única fuente canónica | #170 elimina el segundo resolver legacy y delega a `loadJourneyFlow(journey).next.href`. Browser PASS: seis URLs legacy convergen a `/despega/a3/career-mirror` para A2 Día 7 con checkpoint pendiente; onboarding incompleto converge a C1. A1-A4 continuity + browser QA + Pilot PASS; Preview exacto READY. | Journey/QA | Repetición live autenticada en Preview protegido | in_progress | sí |
| DTC-A4-01 | Las fuentes externas se verifican sin SSRF/DNS rebinding y sin enlaces obsoletos | Contratos runtime, build y release de PR #165 | A4/QA | Ninguna | verified | no |
| DTC-QA-01 | Existe una puerta reproducible de TypeScript, contratos críticos y build | `npm run quality:gate`; #166 `e888ac1` 10/10 workflows PASS + Vercel READY; #167–#172 mantienen regresión crítica y preflights de seguridad verdes en sus candidatos exactos. | QA | Ninguna | verified | sí |
| DTC-QA-02 | Invitado nuevo y usuario recurrente completan un recorrido autenticado real | Laboratorio: Auth/JWT/PostgREST reales locales, scanner-safe claim, guardar/recargar/retomar, desktop, 390×844, print, aislamiento, A1→A4 y logout/boundaries PASS. Falta claim + OAuth real en Preview protegido y cierre de sesión extremo a extremo allí. | QA | Preview OAuth real | in_progress | sí |
| DTC-JRN-02 | Días A2 bloqueados no renderizan contenido por URL directa | #169/#170 browser HTTP con layout SSR real: usuario máximo Día 7 intenta Día 31/61/90 y es redirigido a Día 7 antes de renderizar child content. Migraciones canónicas aplicadas x2 en Supabase local: PASS. Preview exacto READY. Falta repetición live autenticada detrás de Vercel SSO. | Journey | Preview autenticado live | in_progress | sí |
| DTC-UX-01 | El menú muestra progreso persistido, no inferido desde la URL | Estados canónicos, enlaces bloqueados, disponibilidad explícita de gamificación y porcentaje XP server-owned; `Shell system` + `Shell contextual navigation` PASS | Frontend | Journey canónico | verified | no |
| DTC-SEC-03 | El resto del esquema legacy queda clasificado y cerrado por oleadas compatibles | Waves 2–3 preparadas; #171 corrige una incompatibilidad live detectada en tablas `user_id text` y prueba Wave 3 dos veces contra un esquema con forma live. Aún falta aplicación autorizada y verificación remota; los advisors live siguen abiertos hasta entonces. | Supabase | Aprobación y verificación remota | in_progress | sí |
| DTC-OPS-01 | Errores críticos pueden seguirse de navegador a API sin registrar PII | `x-dtc-request-id` navegador→middleware→API→respuesta/log; Chromium fuerza falla controlada de gamificación y verifica el mismo ID en header/body/log; log sin email/credenciales; transiciones con código de soporte; contrato OPS + TypeScript + build + Preview READY | Observabilidad | Ninguna | verified | no |

## Evidencia de candidatos apilados

- PR #167 `b952a7c4b776e10eb5a7dc02f4369542051c75e3`: observabilidad + invitación browser; CI/Preview verde.
- PR #168 `712137efda34747468f963c0b008b06964e98a9f`: boundaries HTTP Preview-equivalent; CI/Preview verde.
- PR #169 `8fc0f0f6a94c8ff156fb011cc5cbb4e348a221db`: fundación journey reproducible + guard A2 SSR; CI/Preview verde.
- PR #170 `e7bcd4975a0a977c4ccead52ea307c4398709ff8`: reanudación canónica única; 5 workflows relevantes PASS y Vercel READY.
- PR #171 `68ce3523ae3c63a66c7c900566c620c7e761e2eb`: Wave 3 live-shaped preflight + Pilot PASS; Vercel READY.
- PR #172 `8bbc8165988aca8337441bff13c1c726c6d37bf6`: Wave 4 residual RPC preflight PASS tras corregir exclusivamente el harness de prueba; migración aplicada dos veces en Supabase local desechable.

## Candidato de integración a main

- PR #172 fue retargeteado a `main` como PR único de integración del stack #166–#172.
- Antes de este commit, su rama estaba **55 commits ahead / 0 behind** respecto de `main`, con merge-base exactamente en `b775bba40038cc319ac7fe4a0266d634f0286319`.
- Este commit documental existe para disparar una validación integral fresca del diff completo contra `main` antes del merge final.
- Las migraciones Supabase permanecen versionadas en Git pero **no se han aplicado a DTCFINAL**; mergear código no equivale a ejecutar DDL remoto.

## Criterio de 9,7

La nota 9,7 exige que todos los ítems marcados como bloqueadores estén `verified`. Un CI verde o una prueba local, aunque use navegador/Auth/PostgREST reales, no sustituye por sí sola una verificación live explícitamente exigida por el gate. No se rebaja Deployment Protection ni se aplican migraciones remotas sólo para completar evidencia.
