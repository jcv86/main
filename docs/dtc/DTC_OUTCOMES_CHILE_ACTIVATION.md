# Outcomes Chile — registro de integración y activación

Fecha: 7 de octubre de 2026. Proyecto exclusivo: DespegaTuCarrera.

## Identidad y alcance

- Repositorio: `jcv86/main`; PR #233, rama `agent/dtc-outcomes-chile-data-foundation`.
- Aplicación de la integración final: `f3f2110c5f67416bc0973d098d1391d8a438d6c8`, que incorpora la corrección del limitador.
- Preview de la rama original: [`6ukwtlrn7`](https://v0-fork-of-despega-tu-carrera-clone-6ukwtlrn7.vercel.app), deployment `dpl_5LusyUP6ikW6qRB1kJpWQE2ACZ3K`, proyecto Vercel `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`, estado READY, target Preview y SHA `f3` comprobados antes de ejecutar.
- Intentos anteriores: el primero usó `2ac5764644bc5859be93746ce03a95094d165227` en `dpl_DnNroJq3kyYQWjAg54x73cBhu5Yx`; el segundo usó `f3` en `dpl_AwjNwcSPehHjvY3kiuoNgML72yeq` (`he0zewf6k`, rama `agent/dtc-outcomes-chile-activation`).
- Base remota: DTCFINAL, `dcfrbwxbejtbcouionna`, PostgreSQL 17.4.
- Aplicación de producción al comenzar: `main`, `7f56e2599d05edd04890901e17e6d64d7be0fdbb`, deployment `dpl_Fm9pmGFsD1hXELa1cSQFNNSpQb6c`.

El usuario aceptó continuar con la integración y activación descritas al cerrar el bloque de experiencia. Este bloque instala el esquema aditivo y las referencias oficiales, y verifica el recorrido desde el Preview con cuentas nuevas sintéticas. La promoción de la aplicación conserva su propia comprobación de versión y calidad.

## Resultado del bloque — CONDITIONAL_GO

El esquema y las referencias oficiales están instalados. El cuarto intento aprobó **14/14 casos funcionales**, incluidos **4/4 subcasos de navegador real**. Su limpieza se interrumpió y el runner conserva **NO_GO**; una recuperación transaccional independiente terminó con **RECOVERED** y verificó la ausencia de todos los recursos sintéticos de esa ejecución.

La evidencia permite continuar preparando el release. Antes de aprobar producción quedan la clasificación de **15 eventos de consola móvil y 4 de escritorio** y la comprobación de publicación de la aplicación bajo C18. La revisión de evidencias por operador conserva su alcance separado C20. Los informes originales, la recuperación y sus límites se conservan más abajo.

## Esquema instalado

La inspección previa confirmó que no existían las siete tablas ni las dos funciones nuevas; las dependencias de Auth y UUID estaban disponibles. Las cuatro migraciones se aplicaron mediante el servicio de migraciones de Supabase. Sus versiones locales se alinearon con las versiones devueltas por ese servicio sin cambiar SQL ni reescribir el historial remoto.

| Versión instalada | Migración | SHA-256 del SQL |
|---|---|---|
| `20261007143246` | `dtc_outcomes_chile_foundation` | `0d9c482e14c39daaf1c0d5e8baedac34b5c6291c7d3b24ed57e95b3593a4b870` |
| `20261007143340` | `dtc_outcomes_chile_atomic_capture` | `e0c2278ad84ffc67a5c682bc0b643cabbc29b2a9c5529631900681ddce96ec6b` |
| `20261007143341` | `dtc_outcomes_chile_idempotent_capture` | `ec26697ca8d5e19c493be776801942027e0ad8428788e8f9db91bc00a2884827` |
| `20261007143343` | `dtc_outcomes_chile_explicit_privileges` | `586fd92b6c74d283bfc094fc1cfd5c75c4a1967e521d90ab9cc110bde3ce5a75` |

La revisión independiente detectó que los permisos predeterminados del proyecto concedían ALL a `service_role`. Un GRANT adicional no retiraba DELETE/TRUNCATE del registro de solicitudes. La cuarta migración revoca los permisos de esas siete tablas y concede únicamente los previstos; no altera roles, políticas, datos ni permisos predeterminados globales.

Comprobación remota posterior:

- Siete tablas presentes, con RLS habilitada y forzada, sin permisos de PUBLIC.
- 56 combinaciones de tabla y permiso, verificadas para tres roles: **168/168 correctas**.
- Seis políticas SELECT: cinco de propietario y una para referencias oficiales; el registro de solicitudes no tiene políticas de cliente.
- Dos funciones SECURITY INVOKER, con `search_path=pg_catalog` y EXECUTE exclusivo del servidor.
- Una restricción UNIQUE, dos relaciones compuestas de propietario y un trigger AFTER INSERT, presentes y habilitados.
- El servidor tiene CRUD en las seis tablas originales y SELECT/INSERT/UPDATE en el registro de solicitudes; los clientes solo tienen las lecturas expresamente permitidas por RLS.

El laboratorio reproduce los permisos predeterminados observados, demuestra el exceso previo, verifica la normalización y ejecuta rechazos reales de DELETE/TRUNCATE. La eliminación de un usuario mediante Auth Admin sigue activando la cascada de sus solicitudes.

## Referencias oficiales instaladas

Lote: `ine-esi-2025-national-20260714-v1`.

Manifiesto canónico revisado: `205e8e079466d0cd01ea7dc3e19a2c4139abf24df68362e4abd7b560b6dab74e`.

Se comprobaron las huellas y tamaños de los cuatro PDF originales y se revisaron población, definición, período y calidad. La ingesta insertó únicamente dos referencias nacionales, que se leyeron de vuelta desde DTCFINAL:

| Métrica | CLP mensuales | Edición | Publicación |
|---|---:|---|---|
| Ingreso laboral medio | 962.945 | ESI 2025 | 14-07-2026 |
| Ingreso laboral mediano | 680.000 | ESI 2025 | 14-07-2026 |

Ambas conservan `sample_size=null`: viviendas logradas y población expandida no equivalen al número no ponderado de personas de cada estimación. Son contexto nacional y no acreditan ingresos esperados, posiciones individuales, causalidad DTC ni una comparación salarial homologada. Los componentes, precios de octubre de 2025 y localizadores están en el [contrato de ingesta](DTC_OUTCOMES_CHILE_OFFICIAL_IMPORT.md).

El generador exige el hash exacto revisado y los bytes originales; el SQL se ejecuta como un lote atómico, rechaza una versión equivalente con otro ID y conserva el contenido existente si hay conflicto. El generador no conecta a ninguna base de datos por sí mismo.

## Recorrido autenticado y recuperación

La implementación reproducible está en [scripts/outcomes-chile-live](../../scripts/outcomes-chile-live/README.md). Usa el servidor Next y Supabase reales, dos identidades sintéticas, el flujo de acceso piloto existente y Chromium. Las credenciales entran por stdin y permanecen en memoria. La protección de Vercel se conserva.

El primer intento (`9176c5e3-01e8-4a47-9d95-8a92c141d0a7`) pasó los tres controles previos y encontró un bloqueo al consultar `/api/auth/pilot-status`. El registro del Preview a las 14:53:20 UTC confirmó un 429 del middleware. Los contadores generales y de autenticación compartían el mismo Map por IP: las lecturas previas agotaban el umbral de autenticación. Se corrigió el aislamiento por instancia del limitador, sin cambiar los umbrales ni la autorización. La cabecera de límite informa ahora el valor efectivo. La regresión ejecuta las políticas reales, comprueba bloqueo, ventanas independientes y recuperación; los cuatro escenarios pasaron.

El intento se detuvo antes de capturar resultados. La limpieza eliminó sus dos usuarios Auth y su invitación, comprobó cero filas propias en las nueve relaciones verificadas y confirmó que las sesiones borradas ya no accedían a la API. No se guardaron credenciales en el informe.

El segundo intento (`f8d857f0-d147-4534-9c42-4b95edcac93e`) ejecutó la aplicación `f3` con el árbol de trabajo limpio y los hashes de herramienta aprobados. Pasaron las 13 comprobaciones anteriores al recorrido de navegador: acceso, persistencia, renovación de sesión, idempotencia concurrente, aislamiento por propietario, rechazo de referencias ajenas y protección de seguimientos. El arranque móvil falló antes de recibir una respuesta HTTP y el intento conserva **NO_GO**.

La limpieza del segundo intento encontró un fallo de revocación antes de eliminar una de las cuentas. Una recuperación separada volvió a comprobar todos los marcadores y eliminó únicamente la identidad sintética restante. Confirmó ambos usuarios ausentes en Auth, cero filas en 18 comprobaciones de las nueve relaciones por ambos propietarios y ambas invitaciones ausentes. Su veredicto **RECOVERED** acredita la recuperación de recursos y no convierte la prueba fallida en GO. Los tokens anteriores ya no estaban disponibles; no se afirma una nueva prueba de revocación de esos tokens.

La aplicación `f3` aprobó [13/13 workflows](https://github.com/jcv86/main/pull/233/checks). El [workflow Outcomes Chile](https://github.com/jcv86/main/actions/runs/37642882694) confirmó PostgreSQL 17.11 nativo con dos esperas reales por bloqueo, siete regresiones de seguridad del verificador y 15 escenarios de UI con transporte sintético. Esa evidencia permanece separada del recorrido autenticado real.

El tercer intento (`7188c66a-9375-4890-8e59-351f8116fa84`, 15:39:52–15:52:10 UTC) volvió a pasar las 13 comprobaciones anteriores al navegador. La aplicación era `f3` en el Preview `6ukwtlrn7`; el árbol local difería únicamente por herramienta y documentación, y sus hashes quedaron registrados. Chromium guardó un trabajo desde móvil, conservó el resultado tras recargar, respondió el seguimiento vencido y capturó las vistas de ambos propietarios. El cierre de sesión respondió 303 y una lectura posterior de la API devolvió 401. La nueva navegación a la página privada recibió 307, pero el siguiente salto a inicio de sesión falló por TLS. El veredicto del intento sigue siendo **NO_GO**.

La limpieza del tercer intento terminó dentro del propio runner: dos usuarios eliminados y confirmados ausentes, las nueve cascadas comprobadas para ambos propietarios, cero filas restantes, dos invitaciones eliminadas y confirmadas ausentes, y cero errores. Tanto `resourcesAbsent` como `completed` quedaron en `true`. Una revocación fue efectiva y las dos posteriores devolvieron la clase precisa de sesión ya ausente; ambas sesiones conservadas para la comprobación final recibieron 401.

Una reproducción posterior de sólo lectura aisló el fallo: el relay recibió el 307 de la página privada, y Chromium siguió el salto a `/auth/signin` sin un segundo callback de routing; esa solicitud falló con `ERR_CERT_AUTHORITY_INVALID`. No creó cuentas ni escribió datos remotos. La revisión posterior incorporó el uso aislado de la CA administrada en Chromium y la guarda de cadenas de redirecciones descritos en el siguiente bloque.

Evidencia conservada, sin credenciales ni identificadores de cuenta:

- [Segundo intento: NO_GO](evidence/outcomes-chile-2026-10-07/integration-v2-no-go.json) y [recuperación exacta](evidence/outcomes-chile-2026-10-07/recovery-v2.json).
- [Comprobación previa del tercer intento](evidence/outcomes-chile-2026-10-07/preflight-v3.json), con salud del Preview confirmada por Chromium y cero escrituras remotas.
- [Tercer intento: NO_GO y limpieza completa](evidence/outcomes-chile-2026-10-07/integration-v3-no-go.json).
- [Captura móvil del tercer intento](evidence/outcomes-chile-2026-10-07/v3-mobile-live-outcomes.png) y [captura de escritorio del segundo propietario](evidence/outcomes-chile-2026-10-07/v3-desktop-live-owner-isolation.png), ambas revisadas visualmente.

Estos tres intentos conservan sus fallos originales. El cuarto completó la redirección posterior al cierre de sesión; su resultado funcional y su recuperación se documentan por separado a continuación.

## Verificador revisado después del tercer intento

La revisión independiente y la suite local integrada aprobaron **13/13 escenarios**. Chromium usa la CA pública administrada existente, comprobada por ruta, huella y vigencia, en una base NSS privada y efímera. El entorno del proceso conserva HOME y los almacenes existentes. Una navegación HTTPS válida pasó; certificados de una CA ajena o con un nombre de servidor incorrecto fueron rechazados antes de enviar HTTP. Los temporales se eliminaron al terminar.

Una guarda CDP independiente comprueba cada solicitud, incluidos los saltos que Playwright continúa de forma nativa. La regresión exige cero solicitudes y credenciales en un destino externo después de dos redirecciones, incluso si ese origen está permitido para solicitudes independientes. También rechaza un POST redirigido a una ruta no autorizada. Las respuestas, cookies y redirecciones permitidas conservan su contenido real.

La comprobación previa usa esa misma implementación: salud 200, página privada anónima 307 e inicio de sesión 200 en el origen exacto. El último paso del recorrido autenticado exige tanto API 401 como inicio de sesión 200 después de salir. Este resultado local no sustituye la integración remota.

| Archivo congelado | SHA-256 aprobado |
|---|---|
| `run.mjs` | `a0bf43b413f8b3525cf085ac6ee4016b3607cebe52a2f202bdd8be5cfb4dc18a` |
| `guards.mjs` | `36a60b40b8f604c2023193a42cbf693c6b3e5519c6ef688612a3b8f24a2ddab8` |
| `browser.mjs` | `73dc2965da9d2623384c0bbb7a1f6b7f25fdf30ad868dc68a9daa9afd5ba25e8` |
| `nss-trust.py` | `d7c49ea003fa5172e93fd23f3c7fe683d80da4ac3a26d9ff17eae619c399d480` |
| `check.mjs` | `98f426ce48e64a7cda47755a6282a52f3ac4bf0156a6b50b07c44d51805a0000` |

El reporte de ejecución registra las cuatro fuentes de runtime; la revisión conserva además la huella de la suite. Los cinco hashes se volvieron a comprobar al terminar V4 y coinciden con la revisión; sus fuentes permanecieron sin cambios durante la ejecución y la recuperación. El [contrato del runner](../../scripts/outcomes-chile-live/README.md) conserva las fuentes técnicas, los requisitos y la recuperación.

## Cuarto intento: recorrido funcional y recuperación independiente

Ejecución `b828f115-ccfb-451b-a988-db66d446080d`, **16:16:02–16:27:52 UTC**. La aplicación fue `f3` en el Preview exacto `6ukwtlrn7`. El reporte registra `workingTreeDirty=true`: el árbol local difiere por scripts de verificación y documentación. Una comparación completa y una revisión independiente confirmaron que aplicación, dependencias, migraciones y configuración de despliegue/CI eran idénticas a `f3`. El commit que incorpora esta evidencia mantiene esa misma aplicación.

Pasaron los **14 casos principales**, con transporte real y sin respuestas de API simuladas: acceso anónimo y autenticado, persistencia tras renovar sesión, captura concurrente sin duplicados, aislamiento por propietario, permisos de cliente, referencias ajenas, seguimientos futuros y protección de una respuesta frente a sobrescrituras.

El caso final incluye cuatro subcasos de navegador aprobados:

- Móvil **390 × 844**: captura real de un trabajo, tres seguimientos, recarga y reintento idempotente.
- Respuesta de un seguimiento vencido conservada tras recargar.
- Escritorio **1440 × 960**: segundo propietario con únicamente su historial y sus seguimientos.
- Cierre real de sesión: POST **303**, API **401**, página privada **307** e inicio de sesión HTML **200** en el origen exacto.

Las dos capturas tuvieron revisión visual independiente. Los datos sintéticos y sus etiquetas **Declarado por ti** son coherentes; la referencia INE conserva definición, período, fuente y ausencia de una brecha salarial homologada. El contador `runtimeErrors` fue cero en ambos puntos de captura. Se registraron **15 emisiones de consola de tipo error en móvil y 4 en escritorio**, antes del cierre de sesión. El runner guarda cantidades, sin mensajes ni correlación con peticiones; por ello no se conocen sus causas. Los diagnósticos HTTP instrumentados no muestran 429 ni 5xx, pero no abarcan todos los recursos. Estos resultados no acreditan una consola limpia y su clasificación permanece como condición de calidad de publicación.

La limpieza confirmó un usuario eliminado, pero fallaron consultas de cascadas, la consulta del segundo usuario y las de las invitaciones. El registro operativo de la sesión notificó la cancelación de autorización de red; el JSON del runner sólo acredita los fallos de disponibilidad. Conserva `NO_GO`, `completed=false` y `resourcesAbsent=false`. Su `ownedRowsRemaining=0` no demuestra ausencia, porque no completó la verificación de ningún propietario.

Después de confirmar que ya no existía ningún proceso de ejecución o recuperación activo, se usó el conector Supabase sobre DTCFINAL. Una lectura acotada comprobó que A ya estaba ausente; B conservaba ID, correo y marcadores administrativos exactos; las dos invitaciones conservaban hash, claim y propietario esperados. Ambas cuentas tenían cero sesiones, tokens de renovación y objetos de Storage. No existían membresías de otros propietarios vinculadas a esas invitaciones.

La [plantilla revisada](evidence/outcomes-chile-2026-10-07/recovery-v4-template.sql) recibió únicamente el subconjunto validado del manifiesto en memoria. En una transacción bloqueó y volvió a validar esos recursos, eliminó las **dos invitaciones y después B**, exigió los conteos afectados exactos y comprobó todas las ausencias antes del commit. Cualquier diferencia abortaba la transacción. No se borraron filas de resultados directamente ni se cambiaron esquema, políticas, permisos o configuración.

Las lecturas independientes posteriores, terminadas a las **16:36:16 UTC**, confirmaron:

- **2/2 usuarios Auth ausentes**, con cero identidades, sesiones y tokens de renovación.
- **18/18 conteos de cascadas en cero**: nueve relaciones para cada propietario, incluido A, ya eliminado por el runner.
- **2/2 invitaciones ausentes**, cero objetos de Storage y cero referencias de membresías ajenas.

El acta adicional concluye **RECOVERED** y enlaza el mismo `runReference`, el SHA-256 del reporte original (`925110bbd8e4468daa1735a4b753fa9c6f5997df07e8ed076e003935187f9798`), la plantilla revisada y la consulta exacta ejecutada. La ausencia se comprobó por SQL; no se afirma una nueva respuesta HTTP 404 de Auth Admin ni una nueva petición con los tokens descartados al terminar el proceso. Tampoco se atribuye al borrado una invalidación criptográfica retroactiva de JWT ya emitidos.

Evidencia final:

- [Preflight V4: CONDITIONAL_GO y cero escrituras](evidence/outcomes-chile-2026-10-07/preflight-v4.json).
- [V4: 14/14 funcionales, NO_GO original y limpieza incompleta](evidence/outcomes-chile-2026-10-07/integration-v4.json).
- [Recuperación independiente: RECOVERED](evidence/outcomes-chile-2026-10-07/recovery-v4.json).
- [Captura móvil](evidence/outcomes-chile-2026-10-07/mobile-live-outcomes.png) y [captura de escritorio del segundo propietario](evidence/outcomes-chile-2026-10-07/desktop-live-owner-isolation.png).

El dictamen conjunto es **CONDITIONAL_GO para preparar el release**, con evidencia funcional aprobada y recuperación separada comprobada. No cambia el NO_GO del runner ni aprueba producción. No se repiten los 14 casos sólo para recuperar recursos; cambios posteriores de aplicación, esquema o políticas deberán recibir la verificación correspondiente. El [ledger](DTC_CLOSURE_LEDGER.md) conserva C18 en progreso por consola/publicación y C20 sin iniciar.

## Recuperación de la aplicación

Si una comprobación de activación falla, se conserva o restaura la versión anterior de la aplicación. No se eliminan tablas, evidencias, reservas de solicitudes ni historial de migraciones como mecanismo de recuperación. Las cuentas sintéticas se eliminan únicamente después de verificar sus identificadores y marcadores de ejecución, junto con sus recursos propios.

No se modificaron proveedores de autenticación, secretos de proyecto ni los controles de protección del despliegue. Las mejoras administrativas previas de la plataforma conservan su seguimiento independiente en el ledger.
