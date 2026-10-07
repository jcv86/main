# Outcomes Chile — registro de integración y activación

Fecha: 7 de octubre de 2026. Proyecto exclusivo: DespegaTuCarrera.

## Identidad y alcance

- Repositorio: `jcv86/main`; PR #233, rama `agent/dtc-outcomes-chile-data-foundation`.
- Base de aplicación del Preview: `2ac5764644bc5859be93746ce03a95094d165227`.
- Preview comprobado: `dpl_DnNroJq3kyYQWjAg54x73cBhu5Yx`, proyecto Vercel `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`, estado READY y target Preview.
- Base remota: DTCFINAL, `dcfrbwxbejtbcouionna`, PostgreSQL 17.4.
- Aplicación de producción al comenzar: `main`, `7f56e2599d05edd04890901e17e6d64d7be0fdbb`, deployment `dpl_Fm9pmGFsD1hXELa1cSQFNNSpQb6c`.

El usuario aceptó continuar con la integración y activación descritas al cerrar el bloque de experiencia. Este bloque instala el esquema aditivo y las referencias oficiales, y verifica el recorrido desde el Preview con cuentas nuevas sintéticas. La promoción de la aplicación conserva su propia comprobación de versión y calidad.

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

La evidencia final del recorrido se añadirá después de repetirlo en el Preview que incluya la corrección. Hasta entonces este documento no acredita un recorrido autenticado aprobado.

## Recuperación de la aplicación

Si una comprobación de activación falla, se conserva o restaura la versión anterior de la aplicación. No se eliminan tablas, evidencias, reservas de solicitudes ni historial de migraciones como mecanismo de recuperación. Las cuentas sintéticas se eliminan únicamente después de verificar sus identificadores y marcadores de ejecución, junto con sus recursos propios.

No se modificaron proveedores de autenticación, secretos de proyecto ni los controles de protección del despliegue. Las mejoras administrativas previas de la plataforma conservan su seguimiento independiente en el ledger.
