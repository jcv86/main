-- Exportar índice completo en formato JSON para uso en aplicaciones
-- Versión corregida sin funciones de ventana dentro de agregados

-- Información básica de la biblioteca
WITH biblioteca_stats AS (
    SELECT 
        COUNT(*) as total_libros,
        COUNT(DISTINCT category) as total_categorias,
        COUNT(DISTINCT author) as total_autores,
        SUM(LENGTH(content)) as total_caracteres,
        ROUND(AVG(LENGTH(content))) as promedio_caracteres,
        SUM(read_count) as total_lecturas,
        ROUND(AVG(read_count)) as promedio_lecturas
    FROM knowledge_base
),
libro_mas_popular AS (
    SELECT title, author, read_count
    FROM knowledge_base 
    ORDER BY read_count DESC 
    LIMIT 1
),
libro_mas_extenso AS (
    SELECT title, author, LENGTH(content) as caracteres
    FROM knowledge_base 
    ORDER BY LENGTH(content) DESC 
    LIMIT 1
),
categorias_stats AS (
    SELECT 
        category,
        COUNT(*) as cantidad,
        ROUND(COUNT(*) * 100.0 / (SELECT total_libros FROM biblioteca_stats), 1) as porcentaje,
        ROUND(AVG(read_count)) as promedio_lecturas,
        SUM(LENGTH(content)) as total_caracteres
    FROM knowledge_base 
    GROUP BY category
),
autores_stats AS (
    SELECT 
        author,
        COUNT(*) as cantidad,
        jsonb_agg(
            jsonb_build_object(
                'titulo', title,
                'categoria', category,
                'slug', slug
            ) ORDER BY title
        ) as libros_array
    FROM knowledge_base 
    GROUP BY author
),
top_populares AS (
    SELECT 
        title, author, category, read_count, slug,
        ROW_NUMBER() OVER (ORDER BY read_count DESC) as ranking
    FROM knowledge_base 
    ORDER BY read_count DESC 
    LIMIT 10
),
top_extensos AS (
    SELECT 
        title, author, category, LENGTH(content) as caracteres, slug,
        ROW_NUMBER() OVER (ORDER BY LENGTH(content) DESC) as ranking
    FROM knowledge_base 
    ORDER BY LENGTH(content) DESC 
    LIMIT 10
),
top_recientes AS (
    SELECT title, author, category, created_at, slug
    FROM knowledge_base 
    ORDER BY created_at DESC 
    LIMIT 10
)
SELECT jsonb_pretty(
    jsonb_build_object(
        'biblioteca_info', jsonb_build_object(
            'nombre', 'Biblioteca de Desarrollo Profesional',
            'version', '1.0',
            'fecha_generacion', CURRENT_DATE,
            'total_libros', bs.total_libros,
            'total_categorias', bs.total_categorias,
            'total_autores', bs.total_autores
        ),
        'estadisticas_generales', jsonb_build_object(
            'total_caracteres', bs.total_caracteres,
            'promedio_caracteres_por_libro', bs.promedio_caracteres,
            'total_lecturas', bs.total_lecturas,
            'promedio_lecturas_por_libro', bs.promedio_lecturas,
            'libro_mas_popular', jsonb_build_object(
                'titulo', lmp.title,
                'autor', lmp.author,
                'lecturas', lmp.read_count
            ),
            'libro_mas_extenso', jsonb_build_object(
                'titulo', lme.title,
                'autor', lme.author,
                'caracteres', lme.caracteres
            )
        ),
        'categorias', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'nombre', category,
                    'cantidad_libros', cantidad,
                    'porcentaje', porcentaje,
                    'promedio_lecturas', promedio_lecturas,
                    'total_caracteres', total_caracteres
                ) ORDER BY cantidad DESC
            )
            FROM categorias_stats
        ),
        'autores', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'nombre', author,
                    'cantidad_libros', cantidad,
                    'libros', libros_array
                ) ORDER BY cantidad DESC
            )
            FROM autores_stats
        ),
        'indice_alfabetico', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'titulo', title,
                    'autor', author,
                    'categoria', category,
                    'slug', slug,
                    'caracteres', LENGTH(content),
                    'lecturas', read_count,
                    'paginas_estimadas', CEIL(LENGTH(content) / 200.0),
                    'tiempo_lectura_estimado', CEIL(LENGTH(content) / 1000.0),
                    'tags', tags
                ) ORDER BY title
            )
            FROM knowledge_base
        ),
        'top_libros', jsonb_build_object(
            'mas_populares', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'ranking', ranking,
                        'titulo', title,
                        'autor', author,
                        'categoria', category,
                        'lecturas', read_count,
                        'slug', slug
                    ) ORDER BY ranking
                )
                FROM top_populares
            ),
            'mas_extensos', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'ranking', ranking,
                        'titulo', title,
                        'autor', author,
                        'categoria', category,
                        'caracteres', caracteres,
                        'paginas_estimadas', CEIL(caracteres / 200.0),
                        'slug', slug
                    ) ORDER BY ranking
                )
                FROM top_extensos
            ),
            'mas_recientes', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'titulo', title,
                        'autor', author,
                        'categoria', category,
                        'fecha_creacion', created_at,
                        'slug', slug
                    ) ORDER BY created_at DESC
                )
                FROM top_recientes
            )
        )
    )
) as indice_biblioteca_json
FROM biblioteca_stats bs, libro_mas_popular lmp, libro_mas_extenso lme;
