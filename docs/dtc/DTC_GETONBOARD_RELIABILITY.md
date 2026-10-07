# Get on Board en A4: lectura y diagnóstico

## Incidente observado

El 7 de octubre de 2026, a las 18:10 UTC, el diagnóstico del dominio público de DTC devolvió HTTP 503 y cero ofertas, sin error de transporte. Una lectura directa del endpoint público del proveedor devolvió 120 avisos. El adaptador descartaba los registros porque buscaba la empresa y el enlace público dentro de campos que no corresponden al formato vigente.

La observación de los primeros 30 avisos confirmó que todos incluían empresa expandida, enlace público e instante de publicación; ninguno necesitaba credenciales privadas para su lectura.

## Contrato comprobado

Fuentes primarias:

- [Referencia oficial de la API](https://www.getonbrd.com/api-doc.html).
- [OpenAPI publicado por el proveedor](https://www.getonbrd.com/doc/openapi.yaml?v=2026-05-08-agent-docs).
- [Biblioteca oficial de Get on Board](https://github.com/getonbrd/getonbrd-ruby).
- [Listado público consultado](https://www.getonbrd.com/api/v0/categories/programming/jobs?page=1&per_page=30&expand%5B%5D=company&expand%5B%5D=location_cities&expand%5B%5D=tags&expand%5B%5D=location_regions&expand%5B%5D=location_tenants).

| Dato | Campo de la respuesta pública | Tratamiento |
| --- | --- | --- |
| Identidad | `data[i].id` | Se conserva el identificador del proveedor. |
| Empresa | `attributes.company.data.attributes.name` | Se lee el recurso expandido. |
| Enlace original | `data[i].links.public_url` | Se valida HTTPS, dominio del proveedor e identidad del aviso. |
| Publicación | `attributes.published_at` | El entero Unix en segundos se convierte a ISO. |
| Ciudad | `attributes.location_cities.data[].attributes` | Se conservan nombres y países declarados; un identificador sin nombre no se convierte en una ciudad inventada. |
| Alcance remoto | `attributes.location_regions.data[]` y `attributes.location_tenants.data[]` | Se leen nombres expandidos de regiones y países; `Remote` no es un país. |
| Habilidades | `attributes.tags.data[].attributes.name` | Se usan nombres de etiquetas, sin convertir sus palabras clave en requisitos. |
| Modalidad | `attributes.remote_modality` | Se conserva la modalidad explícita; una declaración híbrida no se reduce a presencial por `remote:false`. |
| Descripción | Campos HTML de la oferta | Se extrae texto visible, sin ejecutar ni mostrar HTML del proveedor. |

La consulta expandida, observada a las 18:08 UTC, devolvió 30 avisos: empresa en 30, etiquetas expandidas en 30 y ciudades declaradas en 18. Los demás registros no deben recibir una ciudad inferida. La muestra incluía 17 avisos híbridos, 12 remotos de distintas modalidades y uno presencial.

`remote_local` conserva su alcance territorial. Una consulta posterior confirmó la expansión de regiones y países para los siete avisos de ese tipo incluidos en la muestra: el campo `countries` contenía únicamente el marcador `Remote`, mientras los límites reales estaban en esos recursos relacionados. Una modalidad temporal o una contradicción no deben convertirse en una promesa de trabajo remoto permanente. Los nombres declarados ayudan a conservar ese contexto; el adaptador no amplía por su cuenta la elegibilidad de una oferta. Si no puede resolver restricciones de un aviso `remote_local`, descarta esa fila y lo registra en el diagnóstico del lote.

## Lectura y límites

El adaptador solicita una página de hasta 30 registros, con expansión de empresa, ciudades, etiquetas, regiones y países. No realiza una petición por empresa ni por aviso. Mantiene la cancelación y el límite de tiempo de la petición usados por el actualizador. La respuesta queda limitada a 2 MiB y la normalización comprueba el vencimiento del presupuesto de tiempo.

`fetchGetOnBoardBatch` entrega los avisos normalizados y un diagnóstico del lote. `fetchGetOnBoardJobs` conserva el contrato de lista que utiliza la actualización del catálogo y propaga un error si la respuesta no puede interpretarse.

La colección pública corresponde a una categoría del proveedor y puede incluir ofertas de varios países. Los filtros del usuario continúan aplicándose en A4. Una página es una muestra acotada; no constituye el catálogo completo de Get on Board.

## Estados del diagnóstico

| Situación | HTTP | Significado |
| --- | --- | --- |
| Respuesta válida con ofertas | 200 | La fuente respondió y hubo registros utilizables. |
| Respuesta válida con lista vacía | 200 | La conexión funcionó y esa consulta no devolvió ofertas. |
| Formato inválido o todos los registros descartados | 502 | La respuesta no se pudo interpretar como un lote utilizable. |
| Fallo de conexión, del proveedor o de tiempo | 503 | No se pudo completar la consulta. |

El diagnóstico público devuelve una muestra acotada y códigos de error controlados. No devuelve el payload crudo ni datos de usuarios. La ruta de A4 conserva la autenticación y la comprobación de acceso; consultar ofertas no ejecuta una ingesta.

## Regresiones

```sh
pnpm run test:getonboard
pnpm run test:a4-opportunities
pnpm exec tsc --noEmit
```

Las nuevas pruebas utilizan la estructura comprobada de la API y contenido sintético identificado como tal. Cubren lectura de relaciones, enlace e identidad, fechas, modalidad, formato vacío o inválido, límites de transporte y las respuestas de los handlers, incluidos sus controles de acceso.

El workflow Get on Board Source ejecuta las regresiones y TypeScript. Los resultados concretos del commit, su Preview y las comprobaciones de producción se registran en la PR correspondiente. El entorno local de esta sesión no inició, por lo que no se presentan estas comprobaciones como ejecuciones locales.

## Activación del catálogo persistido

Corregir la lectura pública no acredita una nueva ingesta del catálogo. La programación introducida en [PR234](https://github.com/jcv86/main/pull/234) sigue necesitando una credencial de cron válida y un despliegue que la incorpore.

Al preparar este ajuste, la configuración del cron permanecía sin cambios: la revisión automática de aprobación rechazó la separación de una variable compartida porque requería retirar temporalmente su asociación con Production. Esa activación queda pendiente de autorización expresa. Este cambio no altera credenciales ni relaja el control del cron.

Ver también [Chiletrabajos y actualización verificada](DTC_CHILETRABAJOS_RELIABILITY.md).
