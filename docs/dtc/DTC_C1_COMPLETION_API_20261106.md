# DTC-C1-02 — contrato de finalización y recuperación

Fecha: 2026-11-06. Rama de trabajo: `uat/dtc-20261106`.

## Frontera HTTP

`GET /api/journey/complete-c1` obtiene al actor exclusivamente mediante `auth.getUser()` y consulta `get_c1_completion_status` con el cliente de servicio. La RPC comprueba el acceso al piloto. Una respuesta válida incluye `X-DTC-Actor-Id`, con el actor verificado, y uno de estos estados:

- `not_started`, con `draft: null`.
- `in_progress`, con el borrador real y su revisión `updatedAt`.
- `completed`, con `origin: atomic | legacy`, `responseId`, `draftId` (nullable sólo para legado), `completedAt`, `nextPath` y `draft: null`.
- `recovery_required`, con el borrador disponible o `draft: null`. Este estado no acredita una finalización.

`POST /api/journey/complete-c1` exige `X-DTC-Expected-User-Id`, tomado del GET, y este cuerpo:

```json
{
  "schemaVersion": 1,
  "answers": { "1": ["Otro"], "_customResponses": { "1": "Detalle conservado" } },
  "expectedDraftUpdatedAt": null
}
```

El ejemplo ilustra la forma; una finalización requiere las siete respuestas. `answers` conserva el formato de borrador y `_customResponses`. La revisión debe ser el `updatedAt` exacto del último GET/PUT, sin truncar fracciones del timestamp. `null` significa que todavía no existía un borrador al cargar. No hay un `operationId` público ni un usuario dentro del cuerpo. La RPC determina la identidad del reintento a partir del actor y del snapshot de respuestas.

El servidor compara el encabezado esperado con `getUser()`; el encabezado nunca autoriza ni elige el actor. Si falta o no coincide, devuelve `409 session_changed` antes de consultar la RPC o escribir. Esa misma precondición protege `PUT` y `POST /api/assessments/drafts/c1`. A1 mantiene su contrato anterior, sin exigir este encabezado.

El POST llama únicamente a `complete_c1_atomic`. Una respuesta válida añade `success: true` y `replayed: boolean` a la confirmación de finalización. No hay PUT previo en la última pregunta, ni insert de respuestas, cierre de borrador o actualización de perfil desde el navegador. Una respuesta HTTP 200 incompleta o malformada no habilita la navegación.

Todas las respuestas de completion usan caché privada y `no-store`, también para CDN. Los errores públicos son 401 (sesión), 403 (acceso), 422 (respuestas), 409 (cambio de cuenta/revisión/conflicto/recuperación) o 503 (servicio). Se publican mensajes seguros; los diagnósticos SQL, tokens y detalles del proveedor no se devuelven.

## Comportamiento del formulario

El GET inicial restaura preguntas, respuestas, detalles de «Otro» y revisión. Sólo una confirmación completa navega a `/despega/a1-cerebral-intro`. Un legado incompleto permite recuperar su borrador; si no tiene borrador, presenta recuperación y mantiene bloqueado el formulario vacío.

Ante un fallo final, conserva la pregunta 7, la selección, los textos y la revisión y libera «Continuar». El mensaje depende del código: un fallo de servicio o una respuesta perdida muestra «No pudimos confirmar el guardado. Tus respuestas siguen aquí. Intenta de nuevo.»; sesión, acceso, validación y conflictos tienen su mensaje específico. Un reintento usa la misma revisión; una finalización ya confirmada se resuelve mediante el replay verificado de la RPC. Si se perdió la respuesta tras el commit, recargar usa GET y recupera la confirmación sin otro POST.

Si la sesión vence, se puede ingresar en otra pestaña y reintentar con la misma cuenta sin sustituir las respuestas locales por un borrador anterior. Si cambia la persona, el formulario elimina el estado anterior y carga el avance de la cuenta actual. Las operaciones pendientes llevan una generación y un propietario: una respuesta tardía de GET, PUT, validación o finalización no actualiza ni navega el formulario de otra cuenta. La precondición de servidor cubre también el intervalo anterior a que el cliente detecte el cambio de sesión.

## Compatibilidad de pestañas anteriores

Una pestaña C1 abierta con código que no envía el encabezado de propietario recibirá 409 al invocar el nuevo completion POST o draft PUT/POST. Recargar permite obtener el nuevo contrato; antes debe conservar cualquier texto todavía no guardado. La precondición no revoca escrituras directas a Supabase de versiones antiguas ni operaciones que ya estaban en vuelo. La transición y el rollback con esos clientes requieren verificación antes de publicar. No modifica los proveedores ni la sesión global de Auth.

## Verificación de este bloque

`node --import tsx scripts/test-c1-completion.mjs`: **32/32 PASS**, cero intentos de red externa. Se ejecutan los Route Handlers reales, SDK de Supabase real con transporte sintético, helpers reales, controladores extraídos del AST de la página y hook real con fronteras React simuladas. Incluye autenticación, actor esperado, errores, payloads, revisión exacta, guardado final único, respuesta perdida, recuperación, cambio de cuenta y respuestas tardías.

`node --import tsx scripts/test-assessment-drafts.mjs`: PASS para borradores parciales, compatibilidad de legado, texto de «Otro», límites y fidelidad de reportes.

Estas regresiones no acreditan atomicidad de PostgreSQL, RLS ni renderizado en navegador. Esas evidencias pertenecen a los gates SQL y de navegador locales del bloque integrado. Estas pruebas no escribieron en servicios remotos ni aplicaron migraciones sobre datos reales. La identidad del candidato, su publicación en la rama UAT y el estado del gate integrado se registran en el [informe de cierre](DTC_AUTH_C1_CLOSURE_20261106.md).

El candidato integrado `7eb0544` pasó además 19 casos PostgreSQL y 24 casos de navegador C1 en [Actions 42268602016](https://github.com/jcv86/main/actions/runs/42268602016). El detalle de aislamiento, fallos inducidos, fuentes y límites se conserva en el informe de cierre.
