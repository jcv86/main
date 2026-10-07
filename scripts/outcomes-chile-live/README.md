# Outcomes Chile: integración con Next y Supabase reales

Este runner abre sesiones legítimas en Supabase Auth y usa HTTP contra un **Preview exacto de DTC**. Verifica la página, los route handlers de Next, la persistencia, RLS y los reintentos. No sustituye respuestas de la API, no firma JWT, no modifica controles de acceso y no crea endpoints de pruebas. Los usuarios y los resultados son sintéticos; el transporte y la base de datos son reales.

## Alcance y autorización

La allowlist del código admite únicamente el proyecto Supabase **DTCFINAL**, ref `dcfrbwxbejtbcouionna`, y un origen inmutable del proyecto Vercel `prj_SvrOCS2CtFQunqirMeYidZRHZKpm`. Rechaza el dominio de producción, aliases de rama, otros proyectos, credenciales JWT de otro ref y un HEAD distinto del despliegue atestado.

`--preflight` es el modo predeterminado y no crea recursos remotos. `--execute` necesita que el operador ya tenga autorización para crear y eliminar dos identidades sintéticas en el proyecto allowlisted. El flag es una protección operativa: no reemplaza esa autorización.

El runner no carga `.env`, no aplica migraciones, no publica despliegues, no altera la configuración de Auth y no envía correos. `auth.admin.createUser` usa correo `@example.invalid`, contraseña aleatoria y `email_confirm: true`. Reserva UUID antes de crear cada usuario para poder recuperar una respuesta perdida sin buscar otras cuentas. Los metadatos administrativos identifican la ejecución.

El acceso piloto utiliza dos invitaciones efímeras y los RPC existentes `claim_pilot_invitation` y `resolve_pilot_access`. Comprueba que quedan al menos dos cupos y respeta el límite vigente de 100; una carrera que consume el último cupo debe fallar y limpiar sus propios recursos. No concede membresías directamente ni marca cuentas como históricas.

## Configuración por stdin

Requiere Node con `fetch`, las dependencias fijadas por el lockfile de la aplicación y las herramientas aisladas ya usadas por `outcomes-chile-ui-lab`: Playwright `1.62.1` y `@sparticuz/chromium` `153.0.0`.

El operador obtiene del conector/API de Vercel la identidad actual del Preview, confirma su ref Supabase y entrega **un objeto JSON por stdin**. La atestación debe tener menos de 30 minutos. No existe descubrimiento automático ni selección del último despliegue.

```json
{
  "target": {
    "origin": "https://v0-fork-of-despega-tu-carrera-clone-DEPLOYMENT.vercel.app",
    "environment": "preview",
    "readyState": "READY",
    "deploymentId": "dpl_FROM_VERIFIED_VERCEL_METADATA",
    "vercelProjectId": "prj_SvrOCS2CtFQunqirMeYidZRHZKpm",
    "supabaseProjectRef": "dcfrbwxbejtbcouionna",
    "commitSha": "EXACT_40_CHARACTER_LOCAL_AND_DEPLOYED_SHA",
    "verifiedAt": "RECENT_UTC_TIMESTAMP_FROM_OPERATOR"
  },
  "supabase": {
    "url": "https://dcfrbwxbejtbcouionna.supabase.co",
    "publicKey": "INJECT_IN_MEMORY",
    "serviceRoleKey": "INJECT_IN_MEMORY"
  },
  "vercelProtectionBypass": "OPTIONAL_EXISTING_AUTOMATION_ACCESS_SECRET",
  "vercelProtectionCookies": [
    { "name": "_vercel_jwt", "value": "OPTIONAL_COOKIE_OBTAINED_IN_MEMORY_FOR_THIS_EXACT_PREVIEW" }
  ],
  "evidenceDirectory": "/tmp/dtc-live-UNIQUE_NEW_DIRECTORY",
  "browser": {
    "toolsRoot": "/tmp/dtc-outcomes-ui-tools"
  }
}
```

La carpeta padre de evidencia debe existir y la carpeta final debe ser nueva, fuera del checkout. El ejemplo contiene marcadores y no puede ejecutarse. **No guardar una versión con credenciales en un archivo**, historial de terminal, argumentos, capturas o logs. Un proceso autorizado debe generar e inyectar el JSON directamente al stdin de uno de estos comandos:

```bash
node scripts/outcomes-chile-live/run.mjs --preflight
node scripts/outcomes-chile-live/run.mjs --execute
```

Se puede indicar `browser.executablePath` si se dispone de otro binario Chromium comprobado. `browser.toolsRoot` admite como alternativa `DTC_OUTCOMES_UI_TOOLS_ROOT`. Las claves siempre entran por stdin; no se leen de esas variables de herramientas.

El acceso de Vercel admite una cookie `_vercel_jwt` obtenida previamente por el operador y conservada en memoria para ese Preview, o un secreto de automatización válido en `vercelProtectionBypass`. El token `_vercel_share` de un enlace compartido **no** es un secreto de automatización. El runner no intercambia ese token: recibe la cookie resultante, fija su host al origen exacto y no guarda cookies en el checkpoint, reportes ni argumentos. `host` es opcional en el objeto cookie; si se entrega debe coincidir exactamente con el hostname del Preview. Se rechazan otros nombres y alcances.

El navegador usa un relay de respuestas HTTP **reales**: `route.fetch` con `maxRedirects: 0`, validación del origen de `Location` y `route.fulfill` de la respuesta original. No fabrica JSON ni sustituye datos. La regla se aplica a Preview, Supabase y fuentes. No usa overrides de headers en `route.continue`, porque Playwright puede propagarlos a redirects sin volver a invocar el guard del destino. Un redirect externo se bloquea antes de enviarlo. El navegador rechaza mutaciones externas y sólo permite POST de Outcomes o cierre de sesión en la aplicación, además del refresh/logout de Supabase Auth.

## Recorrido comprobado

- GET y POST anónimos rechazados; página privada redirigida al inicio de sesión.
- Esquema necesario, acceso de servicio y dependencia del Preview disponibles.
- Dos usuarios nuevos con sesiones verificadas por Auth y acceso piloto concedido por el flujo real de RPC.
- Captura de búsqueda, ingreso inicial, empleo e ingreso posterior mediante Next; una identidad enviada por el cliente no cambia al propietario.
- Dos POST simultáneos con la misma clave producen un empleo, tres seguimientos y una sola reserva de solicitud.
- Una sesión renovada recupera el mismo resultado; reutilizar la clave con otro contenido recibe 409.
- El segundo usuario no ve resultados del primero mediante resumen ni lectura directa con RLS. Un ingreso asociado a un empleo ajeno recibe 422 y un seguimiento ajeno recibe 404.
- Una misma clave de solicitud puede usarse independientemente por dos propietarios. El cliente no puede invocar el RPC de servicio ni leer el registro privado de solicitudes.
- Un seguimiento futuro recibe 409 sin dejar una reserva. Dos respuestas competidoras para un seguimiento vencido producen una respuesta guardada y un conflicto; el ganador se conserva al leer y reintentar.
- Chromium móvil 390 × 844 registra un empleo desde la página real, recarga, confirma los tres seguimientos y responde el seguimiento vencido. Chromium de escritorio 1440 × 960 comprueba el aislamiento visible y usa el cierre de sesión real de la aplicación.

Las fechas históricas sintéticas permiten que exista un seguimiento de 30 días vencido sin mover el reloj ni editar la fecha programada en la base.

## Limpieza y evidencia

En `finally`, el runner verifica el marcador administrativo, revoca las sesiones conocidas y elimina sólo los usuarios creados por ese run. La eliminación de Auth debe activar los `ON DELETE CASCADE`; después comprueba que no queden filas Outcomes, membresías, `despega_journey_state` ni `despega_user_profiles` de esos propietarios y que su sesión anterior reciba 401. Elimina las invitaciones propias por UUID **y** hash del token, conservando también las condiciones de claim y usuario comprobadas al leer. Nunca borra por prefijo de correo, rango de fecha, toda una tabla o IDs proporcionados por otra persona.

Produce un **checkpoint privado de recuperación** y, por separado, `report.json` y capturas del `main` de la página. El reporte público no incluye identificadores de usuarios/resultados/solicitudes. El `main` excluye el correo sintético del sidebar. No se guardan contraseñas, claves, cookies, JWT, storageState, HTML ni respuestas completas. Los fallos se expresan con códigos fijos, no con excepciones completas de las herramientas.

`httpDiagnostics` conserva por caso únicamente transporte, método, ruta conocida, estado HTTP, clase de contenido/cuerpo, nombres permitidos de claves JSON y `Retry-After` cuando es un entero entre 0 y 604800 segundos. Las claves inesperadas sólo se cuentan: podrían contener datos personales en su nombre. No registra valores de JSON, otras cabeceras, query strings ni cookies. Chromium obtiene ese diagnóstico de la misma respuesta real que entrega a la página. Un 429 produce `APP_RATE_LIMITED` o `LIVE_BROWSER_RATE_LIMITED` y `NO_GO`, seguido de la limpieza; el runner no espera la ventana, cambia la IP, repite la petición ni omite el control.

El contrato de `GET /api/auth/pilot-status` exige estado 200 y `allowed: true` después de los RPC piloto. La ausencia de sesión recibe 401; un fallo del RPC recibe 503; el middleware puede rechazar la petición con 429 antes de ejecutar el handler. Estas situaciones se distinguen por estado y estructura, sin inferir que una respuesta de middleware representa una sesión inválida. Los contratos de Outcomes conservan 201 para nuevas capturas, 200 para completar un seguimiento y 409/422/404 para los conflictos y referencias ajenas comprobados.

Antes de ejecutar, el operador congela `run.mjs`, `guards.mjs` y `browser.mjs` y verifica sus hashes con la revisión aprobada. Deben permanecer sin cambios hasta terminar la limpieza. El reporte registra los hashes del inicio; una edición durante el proceso impide afirmar equivalencia con los archivos finales y exige una nueva revisión antes del siguiente intento.

`checkpoint.json` es un archivo 0600 dentro de una carpeta 0700. Registra `runReference`, ref/proyecto, UUID y etiqueta de cada cuenta sintética, además de UUID, hash de token, claimId y UUID de propietario de cada invitación sintética. Se actualiza **antes de cada create**, escribiendo y sincronizando un temporal privado, haciendo rename atómico y sincronizando el directorio. Así, incluso una invitación insertada cuya respuesta o claim nunca llegó conserva una identidad inequívoca para limpieza. No publicar ni adjuntar este checkpoint como evidencia de producto.

SIGINT y SIGTERM solicitan cancelación cooperativa: no abortan la petición HTTP en curso ni comienzan cleanup desde el manejador de señal. Se detienen nuevas operaciones, se espera a que terminen las peticiones pendientes —incluidas ambas de una pareja simultánea— y se llega a `finally`. Durante cleanup, las señales no interrumpen la limpieza. Una terminación forzada (`SIGKILL`) no puede ejecutar `finally`; requiere el procedimiento de recuperación siguiente.

## Recuperación de una ejecución interrumpida

Este procedimiento es sólo para el operador que ya tiene autorización sobre las identidades sintéticas de la ejecución. No iniciar una segunda recuperación mientras el proceso original siga vivo; comprobar primero su finalización y que no quedan solicitudes en curso. No volver a ejecutar `--execute` para limpiar una ejecución anterior.

1. Importar `readRecoveryCheckpoint` desde `guards.mjs` y pasar la ruta absoluta del checkpoint. Rechaza symlinks, archivos no regulares, propietario distinto al proceso, permisos distintos de 0600, más de dos cuentas/invitaciones, UUIDs inválidos, duplicados, relaciones rotas y otro ref/proyecto. No imprimir el objeto devuelto. Los clientes SDK de recuperación deben apuntar al mismo `https://dcfrbwxbejtbcouionna.supabase.co`, recibir sus claves sólo en memoria y rechazar redirects.
2. Para **cada** entrada `u` de `checkpoint.users`, usar `admin.auth.admin.getUserById(u.id)`. Si existe, exigir simultáneamente: ID idéntico, `app_metadata.dtc_live_run === checkpoint.runReference`, `app_metadata.synthetic === true`, y email igual a ``dtc-live-${checkpoint.runReference}-${u.label.toLowerCase()}@example.invalid``. Si no existe, sólo aceptar un 404 confirmado. Un fallo de red no demuestra ausencia. Validar todas las entradas antes de borrar alguna.
3. Para **cada** invitación `i`, leer por `i.id` únicamente `id,token_hash,claimed_by_claim_id,claimed_by_user_id`. Si existe, exigir `token_hash === i.tokenHash`, claim nulo o igual a `i.claimId`, y propietario nulo o igual a `i.userId`. La cuenta propietaria debe figurar en el mismo checkpoint. Una fila con diferencias queda intacta y produce `NO_GO`.
4. Si se perdieron los tokens en SIGKILL, obtener una sesión **real y efímera** únicamente de cada cuenta ya verificada mediante el flujo administrativo de recuperación que no envía email. La secuencia SDK es la siguiente; todas las respuestas y tokens quedan en memoria. No usar `resetPasswordForEmail`, `signInWithOtp` ni `inviteUserByEmail`:

```js
const link = await admin.auth.admin.generateLink({ type: 'recovery', email: expectedSyntheticEmail })
// Exigir !link.error y link.data.user.id === expectedSyntheticUserId antes de continuar.
const session = await publicClient.auth.verifyOtp({ type: 'recovery', token_hash: link.data.properties.hashed_token })
// Exigir !session.error, session.data.user.id === expectedSyntheticUserId y access_token presente.
const revoked = await admin.auth.admin.signOut(session.data.session.access_token, 'global')
// Exigir !revoked.error. Después, releer y comprobar el marcador de usuario descrito arriba.
const removed = await admin.auth.admin.deleteUser(expectedSyntheticUserId)
// Exigir !removed.error y getUserById(expectedSyntheticUserId) con 404 confirmado.
```

5. Comprobar por `user_id` exacto cero filas en todas las tablas de `CASCADE_TABLES`, incluidas las cuentas que ya estaban ausentes. Eliminar cada invitación que pasó la validación con predicados sobre **ID, hash y el estado de claim/propietario observado**; comprobar después cero filas para ese ID. No eliminar filas Outcomes directamente para ocultar una cascada defectuosa.
6. Conservar el checkpoint y emitir un reporte de recuperación con conteos y códigos, sin UUIDs ni tokens. Sólo cerrar con `GO` si todas las cuentas, invitaciones y cascadas están ausentes. Si una operación falla, conservar el manifiesto y reportar `NO_GO`; no ampliar la búsqueda ni el borrado a otros usuarios.

`GO` exige recorrido remoto, navegador y limpieza completos. Una prueba fallida o limpieza incompleta devuelve `NO_GO` y código de salida 1. Un preflight aprobado devuelve `CONDITIONAL_GO`, porque todavía no acredita escrituras ni persistencia. El operador debe consultar logs de aplicación por separado cuando necesite investigar un error; no debe volcar secretos ni datos personales al informe.

La prueba acredita Auth con contraseña para identidades sintéticas, no el consentimiento de Google/LinkedIn ni el envío de email. La identidad del despliegue se verifica externamente y se contrasta con HEAD: el informe identifica expresamente esa atestación. Las referencias oficiales de mercado y la promoción de producción se verifican fuera de este runner.

## Regresión local de las guardas

Con las mismas herramientas Chromium aisladas, ejecutar `node scripts/outcomes-chile-live/check.mjs`. No necesita claves ni hace solicitudes a Supabase o Vercel. Comprueba allowlist/cookies, actualización atómica del checkpoint antes del claim, rechazo de manifiestos inseguros, cancelación cooperativa y SIGTERM del runner real. Comprueba también la redacción de valores y claves JSON arbitrarias. Una prueba con Chromium hace fallar el click antes de emitir una petición y cierra el navegador: el waiter real de captura no provoca un rechazo sin manejar que pueda interrumpir la limpieza, y conserva su error para quien lo espere. Usa dos servidores HTTP en loopback para exigir que un redirect externo reciba **cero solicitudes y cero credenciales**, mientras se conservan el redirect interno, cuerpo/status real y Set-Cookie del helper `relayRealRoute`. Una respuesta 429 real del servidor local conserva cuerpo y status sin reintento y genera sólo el diagnóstico permitido.

Referencias de implementación: [Supabase Auth `createUser`](https://supabase.com/docs/reference/javascript/auth-admin-createuser), [sesión con contraseña](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [integración SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [generación administrativa de enlaces](https://supabase.com/docs/reference/javascript/auth-admin-generatelink), [cierre de sesión](https://supabase.com/docs/reference/javascript/auth-signout) y [Playwright Route](https://playwright.dev/docs/api/class-route). Las firmas del SDK se contrastaron también con las versiones instaladas del lockfile.
