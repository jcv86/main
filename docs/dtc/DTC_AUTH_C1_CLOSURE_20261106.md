# Cierre de acceso, sesión y finalización C1

Fecha: 2026-11-06. Rama: `uat/dtc-20261106`. Repositorio: `jcv86/main`.

| Identidad | Valor |
|---|---|
| Código candidato | `7eb0544de496e10a2b1be1b482cdafec1d96dc3d` |
| Árbol de código | `1b828ca81ec3c1cdbc01aaf1f59347c8e13c076b` |
| Base del bloque | `59645764989f7eed1a54be41d2755b48e98278fa` |
| Integración del candidato | [Actions 42268602016](https://github.com/jcv86/main/actions/runs/42268602016) |
| Evidencia local y hashes | [auth-c1-local-20261106.json](uat/auth-c1-local-20261106.json) |
| Esquema observado, sólo catálogo | [c1-schema-readonly-20261106.json](uat/c1-schema-readonly-20261106.json) |

Este bloque implementa DTC-AUTH-01/02/03 y DTC-C1-01/02 del [registro de cierre](DTC_CLOSURE_LEDGER.md). La compilación, las regresiones locales y la integración PostgreSQL/navegador del candidato están aprobadas. **Dictamen técnico previo a la aceptación: CONDITIONAL_GO para avanzar a UAT con este bloque de código verificado.** La publicación requiere las condiciones del último apartado. Las cinco filas del registro quedan verificadas únicamente para este candidato y laboratorio. La ejecución manual de la matriz conserva su estado documentado; la aceptación posterior del responsable se registra a continuación.

**Actualización de aceptación — 6 de noviembre de 2026:** el responsable indicó «hazlo aceptado el uat». El UAT del candidato queda **ACEPTADO** y DTC-UAT-03 verificado según el [acta de aceptación](DTC_UAT_ACCEPTANCE_20261106.md). El dictamen técnico anterior conserva su alcance histórico; la decisión de negocio deja de estar pendiente.

## Resultado funcional

### Entrada con correo, invitación y sesión real

La pantalla canónica ofrece «Continuar con correo y contraseña». Conserva el destino interno solicitado, el contexto de invitación y los motivos reconocidos de recuperación. El endpoint verifica primero las credenciales y aplica `resolve_pilot_access` al usuario autenticado y al claim firmado. Los parámetros públicos de la URL no otorgan acceso.

Las cookies nuevas sólo se publican después de la admisión. Si ésta falla, se retira la sesión del intento sin aceptar la cuenta nueva ni borrar una sesión anterior del navegador. Una caída temporal conserva la posibilidad de reintentar la invitación. El éxito carga el documento de destino para que el Provider y el cliente Supabase reconstruyan la sesión a partir de sus cookies reales.

Los errores distinguen entrada inválida, contraseña incorrecta, correo sin confirmar, cuenta sin acceso, límite de intentos y servicio no disponible. La UI muestra mensajes propios y permite recuperación incluso ante respuestas HTML.

### Salida confirmada y cuotas separadas

AppShell, perfil y navbar comparten el control de salida, con espera, error y reintento. El cliente navega sólo después de una confirmación válida. El endpoint usa `scope: local`, comprueba que la sesión actual haya sido retirada y publica sus cookies al confirmarlo; el formulario nativo conserva su POST de respaldo. No se promete cerrar otros dispositivos.

Las consultas ordinarias al estado del piloto dejan de consumir la cuota de ingreso. Se mantienen cinco intentos de ingreso por quince minutos, y el POST exacto de salida continúa disponible al agotarse la cuota. El navegador comprueba el estado efectivo de la sesión y la protección al volver atrás.

### Conservación del detalle de «Otro»

Las preguntas 1 y 5 guardan el detalle en `_customResponses` dentro del JSON de borrador existente. Se valida que corresponda a una pregunta permitida, que «Otro» siga seleccionado y que tenga como máximo 500 unidades UTF-16, coherentes con la UI. Los borradores parciales y anteriores siguen siendo legibles.

La respuesta final conserva las claves numéricas y el formato string/array que leen los informes; el detalle se integra como `Otro: detalle`. Desmarcar la opción excluye su texto del guardado. Siguiente, Atrás y recarga restauran el detalle activo. Un fallo conserva la entrada y permite reintentar. Los controles quedan bloqueados durante el guardado y se reinician al cambiar de pregunta para no arrastrar el estado de voz o asistencia.

### Finalización atómica de C1

La última pregunta llama únicamente a `POST /api/journey/complete-c1`. El navegador deja de insertar respuestas, cerrar el borrador y actualizar el perfil por separado. El servidor obtiene al actor mediante `auth.getUser()` y realiza una sola llamada a `complete_c1_atomic`.

La migración [20261106173017_c1_atomic_completion.sql](../../supabase/migrations/20261106173017_c1_atomic_completion.sql) incluye:

- Validación completa de las siete respuestas y serialización canónica desde el formato raw; el banco SQL se contrasta con el banco y serializador TypeScript reales.
- Acceso al piloto dentro de la transacción, bloqueo por usuario y bloqueo de la fila del borrador. La revisión `updatedAt` se compara sin truncar sus fracciones.
- Escritura conjunta de respuesta canónica, bandera/timestamp del perfil, cierre del borrador y recibo privado. Una excepción revierte las cuatro relaciones.
- Recibo durable que reconoce un reintento ya confirmado antes de comprobar su antigua revisión. Conserva identificadores y timestamp y rechaza otro snapshot de respuestas.
- Carrera controlada frente a un PUT que crea un borrador: se preserva su versión y se devuelve un conflicto recuperable, sin sobrescribirlo ni filtrar un error SQL.
- Recuperación compatible de una respuesta histórica idéntica con borrador abierto o cerrado. No se deduplican ni reescriben filas históricas en masa.
- RPC y helpers `SECURITY INVOKER`, `search_path` vacío y EXECUTE sólo para `service_role`. El esquema privado y sus recibos no tienen acceso desde `anon` o `authenticated`.

El timestamp C1 del perfil mantiene el tipo `timestamp without time zone` observado en DTCFINAL y guarda UTC explícito. La prueba de integración usa además el trigger A4 real, no un sustituto simplificado. El catálogo remoto confirmó que el esquema `dtc_private` y ambas RPC nuevas todavía no existían; esa consulta no leyó filas de participantes ni aplicó SQL de escritura.

### Recarga, sesión vencida y cambio de cuenta

`GET /api/journey/complete-c1` distingue inicio, borrador, finalización confirmada y recuperación pendiente. Una respuesta perdida tras un commit se resuelve al recargar mediante GET y el mismo recibo, sin volver a responder ni emitir otro POST. Un fallo de escritura mantiene Q7, los textos y «Continuar» disponible; una finalización no confirmada no emite éxito ni navega.

El GET devuelve el actor verificado en `X-DTC-Actor-Id`. Cada guardado C1 envía `X-DTC-Expected-User-Id`; completion POST y draft PUT/POST comparan ese valor con `getUser()` antes de escribir. El encabezado es una precondición, nunca una autoridad. Si falta o cambió la cuenta, devuelven `409 session_changed`. A1 mantiene su contrato anterior.

Las respuestas tardías de GET, PUT, validación y finalización se descartan si cambió el propietario o la generación del formulario. Renovar la sesión de la misma cuenta conserva las respuestas locales. Cambiar de cuenta carga el avance de la persona activa. El [contrato HTTP y de compatibilidad](DTC_C1_COMPLETION_API_20261106.md) detalla estados, errores y tratamiento de pestañas antiguas.

## Verificación ejecutada localmente

| Gate | Resultado | Alcance real |
|---|---|---|
| C1 completion | **32/32 PASS** | Route Handlers y SDK reales, transporte sintético; handlers reales extraídos del AST y hook con frontera React simulada; cero red |
| Email login | **22/22 PASS** | Handler, invitación, cookies y SDK reales con I/O sintético |
| Signout | **16/16 PASS** | Sesión, middleware, cuota, errores y navegación con I/O sintético |
| Assessment drafts | **PASS** | Borradores parciales/legacy, «Otro», límites, roundtrip y lectores de informes |
| Auth lab self-check | **17/17 PASS** | Guardas de aislamiento, fixtures y hashes |
| `npm run quality:gate` | **PASS, 157,2 s** | Cierre profesional, TypeScript, contratos críticos, calidad de informes y build completo de **356 páginas** |
| Preflight SQL PGlite | **PASS** | Doble aplicación, serializer/banco, Unicode, rollback/retry y recuperación histórica; no sustituye PostgreSQL real |

El gate completo corresponde a los archivos de aplicación de `7bb843f`. Son idénticos en `7eb0544`; este último cambia únicamente la espera del viewport del runner Closure. Node local: 24.22.1; CI: 22. La compilación utilizó únicamente las credenciales ficticias de los workflows. No valida proveedores externos. Los logs locales están identificados por hash en el JSON; las comprobaciones anteriores de `6d172f7` y `86bd06b` se conservan como historia.

## Integración en PostgreSQL y navegador

**Resultado: PASS en [Actions 42268602016](https://github.com/jcv86/main/actions/runs/42268602016), job `128066975458`.** El workflow conserva todas las suites previas y ejecutó Auth y C1 en 1440×1000 y 390×844. La identidad del commit está en manifest y resultados; los archivos copiados al runtime se comparan byte a byte con las fuentes.

| Integración ejecutada | Resultado observado |
|---|---|
| Auth real | **17/17 casos**, 18 revisiones de layout/axe, cero violaciones reportadas |
| C1 real | **24/24 casos**, 10 revisiones de layout/axe, cero violaciones reportadas |
| C1 PostgreSQL | **19/19 casos**, incluidos rollback en las tres etapas, concurrencia, CAS, permisos y recuperación histórica |
| Migración C1 | Aplicada dos veces correctamente, con el trigger A4 real y el timestamp canónico |
| Security advisors local | **0 findings warn/error**, tanto en los objetos C1 como en el resto del fixture consultado |
| Closure anterior | **41/41 casos**, 28 revisiones de layout/axe, cero violaciones; 28 esperas de viewport correctas, máximo dos intentos |
| Regresión anterior A1–A4 | 22 casos de navegador base, 12 de recorrido, 19 de compatibilidad SQL de objetivo laboral y 5 de frontera HTTP; invitación y correlación aprobadas |

En cada viewport se observó un POST fallido con rollback completo y un POST exitoso cuyo 200 se perdió deliberadamente después del commit. La recarga reconoció **una respuesta canónica y un recibo**, sin otro POST; hubo **cero PUT finales**. El marcador de introducción A1 se escribió una vez, sólo después de llegar a ese destino. Los 24 usuarios del gate SQL y sus triggers temporales quedaron eliminados; los dos propietarios del browser conservaron su estado inicial antes de ese recorrido.

Se materializó el artifact **13529305661**, de **13.188.970 bytes**, y se verificó su SHA-256 `34ce943213b0b87bb845c75f7fd524aab9a5bdb50ae48152ea34893d759d25e3`. El ZIP de GitHub vence el **2026-11-13 a las 18:21:39 UTC**. Los resultados JSON, alcances y hashes quedan conservados en [auth-c1-evidence-20261106](uat/auth-c1-evidence-20261106/README.md), independientemente de esa retención. Se revisaron las capturas de recuperación móvil, rollback de escritorio, «Otro» restaurado en móvil y A3 móvil.

Hubo cero errores JavaScript no capturados y cero hosts externos observados por los browsers. Esto no equivale a consola o transporte vacíos: Auth registró 108 avisos de recursos HTTP —76 de las dos rutas auxiliares 404 fuera de alcance, más los estados de Auth previstos y perfiles inicialmente ausentes— y 67 cancelaciones de peticiones. C1 registró 24 cancelaciones de esas rutas auxiliares, tres de navegación a A1 y dos cortes deliberados de entrega. Los eventos y sus paths están en los JSON; no se presentan las rutas auxiliares como funcionalidad validada. Las 76 comprobaciones de preparación de lecturas Auth terminaron correctamente.

La fase C1 usa los dos propietarios sintéticos admitidos por la invitación real de la fase Auth. Aplica la migración de borradores una vez y la nueva migración atómica **dos veces** a PostgreSQL 17 desechable. Agrega al fixture mínimo las columnas de apoyo observadas en el catálogo y aplica `migrations/07-a4-unlock-guard.sql`, con su dependencia A3 real.

El gate SQL crea 24 usuarios temporales propios y los elimina junto con sus triggers. Comprueba privilegios, consistencia entre SQL/TypeScript, rollback en perfil/borrador/recibo, reintentos, concurrencia con respuestas iguales/diferentes, CAS, carrera con PUT, compatibilidad histórica, adulteración y rechazo sin acceso. Debe dejar sin respuestas, borradores ni recibos a los dos participantes reservados al navegador.

El navegador recorre la UI real. En escritorio provoca un fallo de perfil y en móvil un fallo al cerrar el borrador, mediante triggers dirigidos únicamente al UUID sintético. Exige un 503 real, rollback íntegro de las cuatro relaciones y la última respuesta editable. Después retira el trigger, ejecuta un único POST real y verifica su commit antes de cortar sólo la entrega del 200. Recargar debe recuperar el mismo resultado por GET. El test exige dos POST finales —uno fallido y uno confirmado—, cero PUT finales y una única respuesta/recibo.

La entrada real de A1 guarda su propio marcador de introducción. El harness reconoce ese POST únicamente después de observar el destino y valida sus tres campos; no lo confunde con una escritura de finalización C1. El rollback compara el perfil íntegro; después de navegar compara sus campos C1 y conserva íntegros canon, borrador y recibo.

Security advisors se ejecutó con Supabase CLI 2.117.0 contra el stack local. No encontró warnings/errors. El gate distingue los objetos nuevos C1 de las otras estructuras del fixture. No es un dictamen global del backend remoto.

### Fronteras explícitas de la evidencia

- Q2–Q4 se preparan mediante la API real de borradores para aislar conservación y finalización C1. La calidad de la validación externa por IA y el dictado no forman parte de este gate.
- Los fallos 503/429 del runner Auth, el PUT 503 C1, los triggers de error SQL y la pérdida de entrega están declarados. Las respuestas exitosas usan el servidor y Supabase local reales.
- En navegaciones que sustituyen el documento se observan status/cabeceras, nuevo documento, cookies, Provider y acceso efectivo. La UI valida su JSON; no se intenta leer después un cuerpo descartado por Chromium.
- El laboratorio usa fuentes del sistema. No acredita la tipografía de marca ni su descarga remota. Las revisiones de accesibilidad y layout conservan su alcance automatizado.
- El cambio de cuenta y los callbacks tardíos tienen regresiones focales. No se presenta como recorrido manual de dos pestañas en producción.

## Defectos encontrados durante la verificación

| Run | Código | Hallazgo y resolución |
|---|---|---|
| [42252367657](https://github.com/jcv86/main/actions/runs/42252367657) | `6d172f7` | Contraste del botón de ingreso; corregido con los tokens indigo y texto blanco. |
| [42254520881](https://github.com/jcv86/main/actions/runs/42254520881) | `86bd06b` | Espera del harness sobre cuerpos 404 no consumidos; ahora observa sus cabeceras. |
| [42256436814](https://github.com/jcv86/main/actions/runs/42256436814) | `b6202a3` | Selector alert coincidía con el anunciador de Next; se limita al error del formulario. |
| [42257965965](https://github.com/jcv86/main/actions/runs/42257965965) | `b03cba3` | Lectura tardía de JSON tras navegación de documento. |
| [42259971731](https://github.com/jcv86/main/actions/runs/42259971731) | `a2ae401` | Chromium descarta el cuerpo incluso con observación temprana; se comprueban el contrato de UI y los efectos reales de sesión. |
| [42261395652](https://github.com/jcv86/main/actions/runs/42261395652) | `0e72e07` | Auth escritorio completo; contraste móvil del CTA bajo hover, corregido con blanco explícito. |
| [42262916358](https://github.com/jcv86/main/actions/runs/42262916358) | `48143e6` | Auth **17 casos/18 scans aprobados**. C1 detectó contraste del skiplink AppShell; corregido en `7bb843f`. |

El [run 42266908704](https://github.com/jcv86/main/actions/runs/42266908704), código `7bb843f`, se detuvo antes de Auth/C1: Chromium informó 390 px mientras todavía aplicaba los 288 px de padding desktop de AppShell. El diagnóstico registra breadcrumb en left320 y la captura posterior ya muestra el layout móvil. `7eb0544` espera de forma acotada el breakpoint y sus estilos reales, registra `viewportReadiness` y mantiene la única medición estricta de overflow/axe; no espera a que un desborde desaparezca ni repite el scan.

La revisión del código previo reprodujo también DTC-C1-02: si la inserción de respuestas funcionaba y fallaba el cierre del borrador, reintentar insertaba otra fila; si fallaba el perfil, se emitía finalización y navegación con la bandera falsa. La reproducción usó handlers reales y almacenamiento sintético inline, sin log bruto retenido. Sus contadores quedan en el JSON. El candidato sustituye esa secuencia por la transacción descrita; los 19 casos PostgreSQL y los 24 de navegador aportan ahora la evidencia integrada de su cierre. No se afirma que esos fallos hayan ocurrido a participantes de producción.

## Condiciones para una publicación posterior

Este trabajo deja el candidato en la rama UAT. No fusiona `main`, despliega Vercel, aplica migraciones remotas ni cambia proveedores o datos reales.

El CI del SHA correspondiente está aprobado y la aceptación del responsable quedó registrada en el acta de UAT. Los resultados manuales de los 54 casos conservan su estado documentado; no se añaden ejecuciones por esta decisión. Para un despliegue autorizado, primero se aplican y verifican las migraciones necesarias y después se despliega el frontend/API del mismo candidato. Sin las RPC, la nueva página falla de forma recuperable; no crea una finalización ficticia.

El rollback de aplicación aún requiere validar la compatibilidad con los recibos y el esquema nuevo. Conservar filas históricas y recibos evita una reversión destructiva, pero no acredita que regresar al flujo anterior de C1 sea seguro. No se ha probado una migración inversa ni un rollback productivo.

Las solicitudes sin el nuevo encabezado a completion POST y draft PUT/POST reciben 409. Una pestaña antigua debe conservar su texto todavía no guardado antes de recargar. Esta precondición no revoca escrituras directas a Supabase de versiones anteriores ni operaciones ya en vuelo; la transición y el rollback con esos clientes requieren verificación antes del despliegue.

Se requiere smoke de cada despliegue exacto. La aceptación de negocio del UAT está **ACEPTADA**. El detalle de ejecución de los **54 casos** se conserva por separado y no se convierte en 54 PASS. OAuth externo, IA, dictado, fuentes/ofertas externas y tipografía remota retienen sus gates propios. Las posteriores actualizaciones sólo de `docs/**` no repiten el laboratorio: la evidencia continúa vinculada al SHA de código probado.
