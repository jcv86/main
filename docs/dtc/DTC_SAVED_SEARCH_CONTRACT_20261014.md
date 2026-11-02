# A4 — contrato de recuperación de búsqueda (14 de octubre de 2026)

**Estado: utilidad de datos implementada y probada; todavía no integrada en páginas ni API. No cambia la experiencia publicada.**

Base: `3de1cbfc5b3147ad0f6ee109742ccb06728e5cda`. Esta entrega queda separada de la PR #244 y no modifica su candidato ni sus criterios de aceptación.

## Alcance entregado

`lib/opportunities/saved-search.ts` valida los datos de la búsqueda principal antes de utilizarlos: identidad, revisión, fase activa/principal, cargos, amplitud, regiones y modalidades. Conserva rubros y exclusiones separados de los cargos sin aplicarlos como filtros. Mantiene la modalidad heredada `flexible` sin cambiar su semántica.

El contrato distingue una lista válida sin búsqueda principal de una respuesta inválida; rechaza dos principales, listas mal formadas, límites excedidos y valores no admitidos. La confirmación exige que los filtros devueltos coincidan con los solicitados. La fábrica de filtros vacíos no atribuye un cargo ni una región al usuario. Leer los datos no modifica el objeto original.

**Límites:** no hay fetch, persistencia, autorización, filtrado por rubro ni control concurrente ejecutándose en la aplicación. El objeto de revisión solo está validado; todavía no está conectado con una escritura condicional. La pantalla existente conserva su estado anterior, incluida su región inicial. La separación completa de cargo/área/rubro sigue pendiente.

## Validación realizada

- `node --import tsx scripts/test-saved-search-contract.cjs`: **42/42 pruebas puras**, sin red ni base de datos.
- `pnpm exec tsc --noEmit`: aprobado.
- `git diff --check`: aprobado para los archivos rastreados; los dos archivos nuevos se verificaron mediante sus blobs.
- Comando final `cmd_48f8613651714755a0ae733a10e3`: exit 0, duración 99.593 ms.
- La primera pasada detectó que una lista de exclusiones explícitamente nula se confundía con ausencia. Se corrigió y se conservó la regresión. También se añadió rechazo de amplitud no textual por coerción.
- Blob de la utilidad probada: `fb8a331a21681317fced6be9ad4a52e2b00dc220`.
- Blob de las pruebas ejecutadas: `a0bc8afee7ea9bd1df1ba0dcaa3bee0f115853bd`.

No se ejecutó compilación completa, navegador, integración autenticada o revisión independiente de esta entrega. El script no se añade a CI ni a package.json en este corte; se ejecuta con el comando indicado.

## Bloqueo y continuidad

La llamada que intentaba integrar la recuperación en `opportunity-search-experience.tsx` y `search-intent-form.tsx` recibió: «OpenAI bloqueó esta llamada a la herramienta al no poder determinar el estado de seguridad de la solicitud». Esa integración no se ejecutó ni se repitió por otra herramienta. Una inspección posterior del árbol confirmó únicamente la utilidad nueva; las pruebas posteriores se limitaron a esa utilidad ya creada.

El paso pendiente es integrar lectura y edición explícita sin sobrescribir borradores, comprobar la revisión en el servidor al guardar y validar el resultado completo. Estas tareas no se dan por hechas por tener un validador aprobado. No se ha modificado producción, datos, cuentas, permisos, esquema o configuración de despliegue. La PR #244 conserva sus comprobaciones pendientes de autenticación, revisión visual integrada y revisión independiente.
