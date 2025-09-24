-- Reporte detallado de la biblioteca con formato mejorado
-- Incluye análisis completo de contenido y estadísticas

-- ENCABEZADO DEL REPORTE
SELECT 
    '🏛️ BIBLIOTECA DE DESARROLLO PROFESIONAL - REPORTE COMPLETO' as titulo,
    'Generado el: ' || CURRENT_DATE as fecha,
    'Total de libros: ' || COUNT(*) as resumen
FROM knowledge_base;

-- SECCIÓN 1: DISTRIBUCIÓN POR CATEGORÍAS
SELECT 
    '📊 DISTRIBUCIÓN POR CATEGORÍAS' as seccion,
    '' as separador;

WITH categoria_detalle AS (
    SELECT 
        category,
        COUNT(*) as cantidad,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM knowledge_base), 1) as porcentaje,
        AVG(read_count) as promedio_lecturas,
        SUM(read_count) as total_lecturas
    FROM knowledge_base 
    GROUP BY category
)
SELECT 
    '📚 ' || category as categoria,
    cantidad || ' libros (' || porcentaje || '%)' as distribucion,
    'Promedio lecturas: ' || ROUND(promedio_lecturas) as estadistica,
    'Total lecturas: ' || total_lecturas as total
FROM categoria_detalle 
ORDER BY cantidad DESC;

-- SECCIÓN 2: CATÁLOGO DETALLADO POR CATEGORÍA
SELECT 
    '📖 CATÁLOGO DETALLADO POR CATEGORÍA' as seccion,
    '' as separador;

-- Comunicación
SELECT 
    '🗣️ COMUNICACIÓN' as categoria_titulo,
    '' as separador;

WITH comunicacion_numerada AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Comunicación'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM comunicacion_numerada
ORDER BY numero;

-- Desarrollo Personal
SELECT 
    '🌱 DESARROLLO PERSONAL' as categoria_titulo,
    '' as separador;

WITH desarrollo_numerado AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Desarrollo Personal'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM desarrollo_numerado
ORDER BY numero;

-- Liderazgo
SELECT 
    '👑 LIDERAZGO' as categoria_titulo,
    '' as separador;

WITH liderazgo_numerado AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Liderazgo'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM liderazgo_numerado
ORDER BY numero;

-- Productividad
SELECT 
    '⚡ PRODUCTIVIDAD' as categoria_titulo,
    '' as separador;

WITH productividad_numerada AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Productividad'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM productividad_numerada
ORDER BY numero;

-- Psicología
SELECT 
    '🧠 PSICOLOGÍA' as categoria_titulo,
    '' as separador;

WITH psicologia_numerada AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Psicología'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM psicologia_numerada
ORDER BY numero;

-- Negocios
SELECT 
    '💼 NEGOCIOS' as categoria_titulo,
    '' as separador;

WITH negocios_numerados AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Negocios'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM negocios_numerados
ORDER BY numero;

-- Tecnología
SELECT 
    '💻 TECNOLOGÍA' as categoria_titulo,
    '' as separador;

WITH tecnologia_numerada AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Tecnología'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM tecnologia_numerada
ORDER BY numero;

-- Finanzas
SELECT 
    '💰 FINANZAS' as categoria_titulo,
    '' as separador;

WITH finanzas_numeradas AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Finanzas'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM finanzas_numeradas
ORDER BY numero;

-- Gestión
SELECT 
    '📋 GESTIÓN' as categoria_titulo,
    '' as separador;

WITH gestion_numerada AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Gestión'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM gestion_numerada
ORDER BY numero;

-- Innovación
SELECT 
    '💡 INNOVACIÓN' as categoria_titulo,
    '' as separador;

WITH innovacion_numerada AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Innovación'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM innovacion_numerada
ORDER BY numero;

-- Emprendimiento
SELECT 
    '🚀 EMPRENDIMIENTO' as categoria_titulo,
    '' as separador;

WITH emprendimiento_numerado AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Emprendimiento'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM emprendimiento_numerado
ORDER BY numero;

-- Bienestar
SELECT 
    '🧘 BIENESTAR' as categoria_titulo,
    '' as separador;

WITH bienestar_numerado AS (
    SELECT 
        title, author, content, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY title) as numero
    FROM knowledge_base 
    WHERE category = 'Bienestar'
)
SELECT 
    '  ' || numero || '. ' || title as libro,
    '     👤 Autor: ' || author as autor_info,
    '     📄 Contenido: ' || LENGTH(content) || ' caracteres' as contenido_info,
    '     👥 Lecturas: ' || read_count as lecturas_info,
    '     🔗 Slug: ' || slug as slug_info
FROM bienestar_numerado
ORDER BY numero;

-- SECCIÓN 3: ANÁLISIS DE CONTENIDO
SELECT 
    '📈 ANÁLISIS DE CONTENIDO' as seccion,
    '' as separador;

WITH analisis_contenido AS (
    SELECT 
        category,
        COUNT(*) as libros,
        AVG(LENGTH(content)) as promedio_caracteres,
        MIN(LENGTH(content)) as min_caracteres,
        MAX(LENGTH(content)) as max_caracteres,
        SUM(LENGTH(content)) as total_caracteres,
        AVG(read_count) as promedio_lecturas
    FROM knowledge_base 
    GROUP BY category
)
SELECT 
    category as categoria,
    libros,
    ROUND(promedio_caracteres) as promedio_chars,
    min_caracteres,
    max_caracteres,
    total_caracteres,
    ROUND(promedio_lecturas) as promedio_lecturas,
    ROUND(total_caracteres / 200.0) as paginas_estimadas
FROM analisis_contenido 
ORDER BY libros DESC;

-- SECCIÓN 4: RESUMEN FINAL
SELECT 
    '📋 RESUMEN FINAL' as seccion,
    '' as separador;

SELECT 
    'Total de libros en la biblioteca: ' || COUNT(*) as total_libros,
    'Total de categorías: ' || COUNT(DISTINCT category) as total_categorias,
    'Total de autores únicos: ' || COUNT(DISTINCT author) as total_autores,
    'Total de caracteres: ' || SUM(LENGTH(content)) as total_caracteres,
    'Promedio de caracteres por libro: ' || ROUND(AVG(LENGTH(content))) as promedio_caracteres,
    'Total de lecturas registradas: ' || SUM(read_count) as total_lecturas,
    'Promedio de lecturas por libro: ' || ROUND(AVG(read_count)) as promedio_lecturas_libro
FROM knowledge_base;

-- Verificación final de que tenemos exactamente 70 libros
SELECT 
    CASE 
        WHEN COUNT(*) = 70 THEN '✅ VERIFICACIÓN EXITOSA: La biblioteca contiene exactamente 70 libros'
        ELSE '❌ ERROR: La biblioteca contiene ' || COUNT(*) || ' libros, se esperaban 70'
    END as verificacion_final
FROM knowledge_base;
