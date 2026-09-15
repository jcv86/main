# DTC Closure Ledger

Última actualización: 2026-09-15. Este ledger registra evidencia observable; un cambio de código sin prueba no cuenta como verificado.

| ID | Resultado para el usuario | Evidencia / aceptación | Responsable | Dependencia | Estado | Bloquea release |
|---|---|---|---|---|---|---|
| DTC-SEC-01 | Ningún entorno desplegado puede omitir autenticación o exponer laboratorios internos | Contrato `check-production-laboratory-boundary`; demo retirado y laboratorios limitados a localhost; Preview del candidato READY | Backend/QA | Validación HTTP autenticada | in_progress | sí |
| DTC-SEC-02 | Tokens, sesiones y administración legacy no quedan expuestos por Data API/RPC | Migración P0 + contrato `check-security-p0`; falta validación remota controlada | Supabase | Aprobación de migración | in_progress | sí |
| DTC-AUTH-01 | Un escáner de correo no consume la invitación | GET no mutante + POST explícito; pruebas de scanner y claim | Auth/QA | Preview autenticado | in_progress | sí |
| DTC-JRN-01 | El usuario recurrente siempre retoma desde una única fuente canónica | Router legacy eliminado; contrato de estados divergentes | Journey/QA | Preview autenticado | in_progress | sí |
| DTC-A4-01 | Las fuentes externas se verifican sin SSRF/DNS rebinding y sin enlaces obsoletos | Contratos runtime, build y release de PR #165 | A4/QA | Ninguna | verified | no |
| DTC-QA-01 | Existe una puerta reproducible de TypeScript, contratos críticos y build | `npm run quality:gate`; candidato `e888ac1` con 10/10 workflows PASS y Vercel READY | QA | Ninguna | verified | sí |
| DTC-QA-02 | Invitado nuevo y usuario recurrente completan un recorrido autenticado real | Desktop y 390x844: claim, login, guardar, recargar, retomar y cerrar sesión | QA | Cuenta/fixture sintético | not_started | sí |
| DTC-JRN-02 | Días A2 bloqueados no renderizan contenido por URL directa | Guard SSR compartido 11–90 + pruebas 11/31/61/90; falta Preview autenticado | Journey | Preview autenticado | in_progress | sí |
| DTC-UX-01 | El menú muestra progreso persistido, no inferido desde la URL | Estados canónicos, enlaces bloqueados, disponibilidad explícita de gamificación y porcentaje XP server-owned; `Shell system` + `Shell contextual navigation` PASS | Frontend | Journey canónico | verified | no |
| DTC-SEC-03 | El resto del esquema legacy queda clasificado y cerrado por oleadas compatibles | Waves 2–3 preparadas: las 195 relaciones detectadas quedan clasificadas; falta aplicar y verificar remotamente | Supabase | Aprobación y verificación remota | in_progress | sí |
| DTC-OPS-01 | Errores críticos pueden seguirse de navegador a API sin registrar PII | `x-dtc-request-id` propagado por middleware; API journey/gamificación correlacionadas; errores internos redactados; transiciones estructuradas; código de soporte visible; contrato/workflow dedicados pendientes de CI del PR apilado | Observabilidad | CI + Preview del PR apilado | in_progress | no |

## Criterio de 9,7

La nota 9,7 exige que todos los ítems marcados como bloqueadores estén `verified`. No se interpreta un CI verde de contratos estáticos como prueba HTTP, base de datos o navegador real.
