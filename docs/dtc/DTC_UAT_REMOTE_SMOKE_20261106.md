# UAT: comprobación técnica remota de entrada

Estado al preparar este documento (6 de noviembre de 2026): **runner preparado, ejecución remota pendiente**. El nuevo Supabase aún requiere aprobación del costo informado por el proveedor. Una comprobación local del runner no demuestra que exista un UAT operativo.

## Alcance

`scripts/uat/remote-smoke.mjs` comprueba una ronda pequeña con dos propietarios sintéticos, usando la aplicación desplegada, Auth remoto, cookies SSR, APIs de borradores y RLS reales. La cuenta profesional pasa de nueva a una cuenta de retorno mediante guardados efectivos; no se siembra un resultado para simular esa continuidad.

Se reutilizan el observador de respuestas reales `captureUiJsonResponse`, los selectores semánticos y los criterios de desborde/accesibilidad del laboratorio existente. Los scripts `scripts/a1-browser-qa/closure-*` mantienen sus guardas de localhost y no se apuntan al servidor remoto.

| Comprobación | Relación con la matriz | Límite |
|---|---|---|
| Página privada y borrador sin sesión | UAT-002 | Una ruta y el endpoint de borrador; ampliar durante el UAT. |
| Login email/contraseña con cuenta piloto real | UAT-003 | Prueba el acceso existente `/auth/email-login`; no prueba alta por invitación ni OAuth. |
| A1: guardar, recargar, recuperar, fallo de red y reintento | UAT-019 y UAT-020 | Tres preguntas reales; no completa el instrumento A1. |
| Reintento idéntico de borrador conserva una fila | UAT-021 | Idempotencia del borrador; el envío final del informe queda pendiente. |
| Dos propietarios con controles positivos propios, SELECT/PATCH ajenos rechazados | UAT-049 | Borradores A1; CV, objetivo y otros objetos tienen casos adicionales. |
| A2/A4 siguen restringidos a ambos usuarios nuevos | UAT-017 | Verifica las fronteras iniciales; no completa el caso de guardar un objetivo temprano. |
| Cierre de sesión, atrás y regreso con avance | UAT-005 y UAT-007 | Continuidad de A1; no sustituye el historial de CV/entrevista. |
| Segunda sesión independiente a 390 × 844 | UAT-054 | Emulación Chromium; no representa un teléfono físico ni su teclado. |
| A1 a 390 × 844 y 1440 × 1000, axe y navegación móvil | UAT-047 y UAT-048 | No acredita todo el recorrido ni conformidad WCAG completa. |

Los IDs anteriores son **cobertura parcial**, salvo el comportamiento específico descrito. No marcar un caso completo como aprobado sólo porque aparezca su ID en un paso de smoke. El criterio de aceptación humana de los 54 casos se conserva.

## Precondiciones para ejecutar

1. Aprobación del recurso, Supabase UAT creado y esquema/RLS aplicados y verificados. No usar el proyecto productivo `dcfrbwxbejtbcouionna`.
2. Deployment de `DTC-UAT` identificado y fijado a un commit. Registrar su URL, ID de despliegue y SHA reales, sin mezclar rondas.
3. El servidor devuelve `X-DTC-Environment: uat` y `X-DTC-UAT-Backend: <nuevo-ref>` sólo después de pasar la validación de configuración. El runner exige ambos antes de autenticarse o guardar.
4. Dos cuentas creadas **únicamente** en UAT mediante Auth Admin, con correo confirmado, contraseñas distintas, acceso en `pilot_memberships` y perfil inicial. Correos: `dtc-uat-<ronda>-professional@example.invalid` y `dtc-uat-<ronda>-personal@example.invalid`. No enviar correos. No insertar borradores o resultados A1 para esas cuentas.
5. Las cuentas tienen focos de perfil `profesional` y `persona`, cuando el bootstrap prepare dichos perfiles. No dar acceso A2/A4 anticipado ni una exención de QA para este smoke.
6. Resolver acceso al deployment protegido. Si se usa una credencial de automatización Vercel, conservarla sólo en el archivo privado. El runner la envía únicamente al origen exacto de UAT.
7. Tener Playwright y axe en un directorio de herramientas. Las versiones de referencia son las del workflow actual: `playwright@1.56.1` y `@axe-core/playwright@4.10.2`. No se agregan dependencias al producto para esta comprobación.

## Archivo privado de ejecución

Preparar un JSON **fuera del repositorio y de la carpeta de evidencia**, con permisos `0600`. El contenido se recibe por ruta, nunca por un argumento que contenga las contraseñas. El runner no necesita `service_role`, contraseña de Postgres ni datos de producción.

```json
{
  "version": 1,
  "syntheticAccountsOnly": true,
  "runId": "dtc-uat-RONDA",
  "commit": "SHA_REAL_DE_40_CARACTERES",
  "deploymentId": "dpl_IDENTIFICADOR_REAL",
  "baseUrl": "https://URL_INMUTABLE_UAT.vercel.app",
  "supabaseRef": "REFERENCIA_REAL_NUEVA",
  "supabaseUrl": "https://REFERENCIA_REAL_NUEVA.supabase.co",
  "anonKey": "CLAVE_PUBLICABLE_O_ANON_DEL_UAT",
  "users": [
    {"label": "professional", "id": "UUID_REAL", "email": "dtc-uat-RONDA-professional@example.invalid", "password": "CONTRASENA_DE_PRUEBA_UNICA"},
    {"label": "personal", "id": "OTRO_UUID_REAL", "email": "dtc-uat-RONDA-personal@example.invalid", "password": "OTRA_CONTRASENA_DE_PRUEBA_UNICA"}
  ]
}
```

Añadir `protectionBypassToken` sólo cuando el deployment lo requiera. El ejemplo deliberadamente no es ejecutable: no sustituir valores reales por referencias inventadas.

## Ejecución

```sh
node scripts/uat/remote-smoke.mjs --self-check
node scripts/uat/remote-smoke.mjs --validate --fixture /ruta/privada/uat-fixtures.json
```

Los dos comandos anteriores no acceden a la red. Después de que el entorno y sus cuentas estén preparados:

```sh
DTC_UAT_TOOLS_ROOT=/ruta/herramientas node scripts/uat/remote-smoke.mjs --run --fixture /ruta/privada/uat-fixtures.json --evidence-dir /ruta/evidencia/uat-ronda
```

El runner no crea cuentas, aplica migraciones, envía mensajes, elimina información ni reinicia un entorno. Rechaza cuentas con datos A1 previos para no sobrescribirlos. Para una nueva ronda, preparar cuentas nuevas e identificar su dataset. No desactivar RLS, ampliar permisos o quitar la protección del deployment para resolver un fallo.

La ronda hace exactamente cinco llamadas a `/api/auth/*`: cuatro ingresos y un cierre de sesión. El acceso real a `/despega` ya verifica la pertenencia al piloto, por lo que no se agrega una consulta redundante de estado. Se conservan el límite de cinco solicitudes por IP en quince minutos y las demás cuotas de la aplicación. Una respuesta `429`, incluso por actividad previa desde la misma IP, es un fallo de esa ejecución y se registra; no reiniciar contadores ni aumentar cuotas para ocultarlo.

## Resultado y límites

Se genera `remote-smoke-results.json` con versión, despliegue, referencia UAT, fechas, pasos, excepciones de JavaScript, desbordes y resultados de accesibilidad. Las capturas contienen sólo el perfil sintético y sirven para inspección interna; no contienen el formulario de credenciales. No se conserva storage state, HAR, cookies, claves, tokens, contraseñas ni respuestas de Auth.

`GO` del runner significa únicamente que esta comprobación técnica de entrada pasó. No es el acta del UAT humano. Un fallo de identidad, autenticación, RLS, persistencia o interfaz deja `NO_GO` para el smoke y debe revisarse antes de invitar participantes.

OAuth Google/LinkedIn, expiración real de JWT, entrevista/CV, oferta real, cierre completo del instrumento, foco personal durante A2 y demás recorridos siguen pendientes de sus casos específicos. Los proveedores externos ajenos a los dos orígenes aprobados se bloquean en el navegador; este smoke no acredita su funcionamiento.
