# Outcomes Chile: primera referencia oficial y preparación de ingesta

Estado al **7 de octubre de 2026**: lote revisado, aplicado y leído de vuelta en **DTCFINAL**. La referencia corresponde a **ESI 2025**, publicada por INE el **14 de julio de 2026**. Se instalaron exactamente dos filas nacionales; la aplicación de Outcomes Chile conserva su despliegue en Preview hasta cerrar su release. La identidad y verificación están en el [registro de activación](DTC_OUTCOMES_CHILE_ACTIVATION.md).

## Alcance revisado

| Estimación nacional | CLP mensuales | Evidencia primaria |
| --- | ---: | --- |
| Ingreso medio | 962.945 | Síntesis nacional, página PDF 5; reporte de calidad, página PDF 13, tabla 4, Total País |
| Ingreso mediano | 680.000 | Síntesis nacional, página PDF 6 |

El [comunicado oficial de publicación](https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2026/07/14/la-mitad-de-las-personas-ocupadas-en-chile-percibieron-ingresos-menores-o-iguales-a-%24680.000-en-2025) confirma ambas cifras y su fecha. Se contrastaron los montos completos con las páginas renderizadas del documento original; no se reconstruyeron desde barras redondeadas en miles.

El [manifiesto versionado](../../data/outcomes-chile/official/ine-esi-2025-national.v1.json) conserva cuatro documentos oficiales, URLs exactas, hashes SHA-256 de sus bytes, fecha de recuperación y localizadores por página. Los documentos se obtuvieron del catálogo de la [página temática del INE](https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/encuesta-suplementaria-de-ingresos), incluidos sus archivos de síntesis, metodología, calidad y ficha. No se versionan copias completas de los PDF en el repositorio.

## Definición y límites

Se importa el ingreso de la ocupación principal, para el total nacional de personas ocupadas elegibles en ESI. Los importes están expresados a precios de octubre de 2025. La edición se recolectó en octubre-diciembre; la referencia de los ingresos es el mes anterior a cada levantamiento. El campo `source_period = 2025` identifica la edición anual y conserva por separado esas fechas en el manifiesto.

La muestra lograda de **34.460 viviendas** y la población expandida de **9.022.697 personas** no son el número no ponderado de personas de cada estimación. Por ello `sample_size` permanece **null**, con motivo explícito. El reporte de calidad publica para la media un error absoluto de **22.551 CLP** y un error relativo de **2,3%**; no se atribuyen esos errores a la mediana. Su tabla 14, página PDF 22, informa que todas las estimaciones de los tabulados 1_1 (media) y 2_1 (mediana) son fiables según el estándar INE. Esta clasificación no significa certeza estadística del 100%. La condición `official_published` describe cifras publicadas por INE, no una nueva estimación calculada por DTC.

Aunque ESI denomina netos estos ingresos, sus componentes, población, imputaciones y base de precios todavía no están armonizados con `monthly_net_clp`. El motor sigue devolviendo `versusBenchmark.comparable = false`: ambas cifras son contexto, sin brecha personal, ranking ni causalidad DTC. Las desagregaciones y fuentes ENE/ENADEL permanecen fuera del lote.

## Preparación reproducible

```bash
node --import tsx scripts/prepare-outcomes-chile-official-import.ts
```

El resultado es un plan con dos filas, UUID deterministas y el hash del manifiesto. No lee credenciales ni conecta a ninguna base. Para producir SQL revisable, se exige ese hash y los cuatro PDF originales descargados con los nombres indicados en el manifiesto:

```bash
node --import tsx scripts/prepare-outcomes-chile-official-import.ts \
  --format=sql \
  --sources-dir=/ruta/absoluta/a/los/pdf \
  --manifest-sha256=HASH_DEL_PLAN_REVISADO
```

El comando valida tamaño y SHA-256 de todos los PDF antes de emitir SQL. **Emitir SQL no lo ejecuta.** La aplicación remota corresponde al proceso de activación C18, después de revisar identidad del entorno, migraciones y contenido del plan.

El lote aplicado se generó con el hash canónico `205e8e079466d0cd01ea7dc3e19a2c4139abf24df68362e4abd7b560b6dab74e`. Los cuatro originales superaron la comprobación de bytes y el SQL se revisó antes de ejecutarlo. La lectura posterior confirmó valores, unidades, período, publicación, fiabilidad, fuente y muestra nula.

La transacción generada inserta únicamente estas filas en `dtc_chile_benchmarks`, sin modificar esquema ni filas previas. Repetir el lote idéntico no duplica registros. Cambiar contenido bajo un ID existente aborta el lote completo; una publicación equivalente con otro ID también bloquea la carga para revisión. Una futura corrección con la misma URL y fecha necesita resolver explícitamente su identidad de versión, no sobrescribir historia.

## Verificación

```bash
node --import tsx scripts/check-outcomes-chile-official-import.ts
```

Comprueba contratos, rechazo de 37 manifiestos incompatibles, integridad de bytes, corte de publicación, UUID estables, orden de filas y ausencia de comparación salarial en el motor real. Con `DTC_OUTCOMES_PGLITE_MODULE` apuntando a un módulo local absoluto, también ejecuta el SQL en una base desechable: repetición, conflicto de contenido, rollback de lote y duplicado de publicación. Ese laboratorio no usa credenciales ni datos remotos; el reporte distingue si realmente ejecutó SQL.
