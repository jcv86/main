# Montserrat local

`montserrat-latin-wght.woff2` es el recurso Latin oficial de Montserrat servido por Google Fonts, conservado byte por byte. No se ha convertido, recortado ni modificado. Evita depender de la descarga y el análisis del CSS remoto durante cada build.

- Fuente del archivo: https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2
- CSS oficial que identifica el recurso y su cobertura Latin: https://fonts.googleapis.com/css2?family=Montserrat:wght@400..700&display=swap
- Descargado y verificado el 2026-11-02.
- Tamaño: **37.956 bytes**.
- SHA-256: `06b16db7a969135d48d38c49183be7fb88d4452e2a3011957c7851941f4e4879`.
- Metadatos internos: **Version 9.000**, fuente variable con eje `wght` de **100 a 900**. El nombre de familia heredado del recurso es `Montserrat Thin` porque su valor por defecto es 100; el CSS oficial lo identifica como Montserrat. La aplicación declara exclusivamente los pesos **400, 500, 600 y 700**, todos sobre este mismo archivo.
- Cobertura verificada con el decodificador que utiliza Next: `áéíóúüñÁÉÍÓÚÜÑ¿¡€—“”`. Se conserva el subconjunto Latin utilizado por el producto en español.

`app/layout.tsx` usa `next/font/local`, conserva `--font-montserrat`, `preload: true` y `display: "swap"`. La variable se define en `html` para que esté disponible en la raíz y sus descendientes; `body` conserva `font-sans`. Las reglas globales, incluidas las clases de títulos heredadas, apuntan a esa variable sin una referencia inválida a Lora. El contrato de diseño comprueba el archivo real, su SHA, la familia, los cuatro pesos, los caracteres españoles, el ámbito de la variable y la ausencia del import remoto.

## Licencia y procedencia

El archivo se distribuye bajo **SIL Open Font License 1.1**. Se incluye la licencia completa sin modificaciones en `OFL.txt`, con el copyright de The Montserrat.Git Project Authors. Una copia idéntica en `public/fonts/montserrat-OFL.txt` acompaña al despliegue y se puede consultar en `/fonts/montserrat-OFL.txt`.

- Proyecto original: https://github.com/JulietaUla/Montserrat
- Licencia oficial: https://github.com/google/fonts/blob/main/ofl/montserrat/OFL.txt
- Archivo de licencia descargado: https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/OFL.txt
- SHA-256 de `OFL.txt`: `8b7141c03fa4f8d44e6345d5d4931709290f0f67875e452e95ac1fd3a027802e`.

No se añade una dependencia ni se modifica el lockfile. Para actualizar el recurso se debe volver a verificar su origen, licencia, cobertura y SHA; no se sustituye por un archivo generado o renombrado de otra familia.
