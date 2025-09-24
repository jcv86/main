-- Exportar índice completo en formato JSON para uso en aplicaciones
-- Este script genera un JSON estructurado con toda la información de la biblioteca

SELECT jsonb_pretty(
    jsonb_build_object(
        'biblioteca_info', jsonb_build_object(
            'nombre', 'Biblioteca de Desarrollo Profesional',
            'version', '1.0',
            'fecha_generacion', CURRENT_DATE,
            'total_libros', (SELECT COUNT(*) FROM knowledge_base),
            'total_categorias', (SELECT COUNT(DISTINCT category) FROM knowledge_base),
            'total_autores', (SELECT COUNT(DISTINCT author) FROM knowledge_base)
        ),
        'estadisticas_generales', (
            SELECT jsonb_build_object(
                'total_caracteres', SUM(LENGTH(content)),
                'promedio_caracteres_por_libro', ROUND(AVG(LENGTH(content))),
                'total_lecturas', SUM(read_count),
                'promedio_lecturas_por_libro', ROUND(AVG(read_count)),
                'libro_mas_popular', (
                    SELECT jsonb_build_object(
                        'titulo', title,
                        'autor', author,
                        'lecturas', read_count
                    )
                    FROM knowledge_base 
                    ORDER BY read_count DESC 
                    LIMIT 1
                ),
                'libro_mas_extenso', (
                    SELECT jsonb_build_object(
                        'titulo', title,
                        'autor', author,
                        'caracteres', LENGTH(content)
                    )
                    FROM knowledge_base 
                    ORDER BY LENGTH(content) DESC 
                    LIMIT 1
                )
            )
            FROM knowledge_base
        ),
        'categorias', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'nombre', category,
                    'cantidad_libros', cantidad,
                    'porcentaje', ROUND(cantidad * 100.0 / total_libros, 1),
                    'promedio_lecturas', ROUND(promedio_lecturas),
                    'total_caracteres', total_caracteres
                ) ORDER BY cantidad DESC
            )
            FROM (
                SELECT 
                    category,
                    COUNT(*) as cantidad,
                    AVG(read_count) as promedio_lecturas,
                    SUM(LENGTH(content)) as total_caracteres,
                    (SELECT COUNT(*) FROM knowledge_base) as total_libros
                FROM knowledge_base 
                GROUP BY category
            ) cat_stats
        ),
        'autores', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'nombre', author,
                    'cantidad_libros', cantidad,
                    'libros', libros_array
                ) ORDER BY cantidad DESC
            )
            FROM (
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
            ) author_stats
        ),
        'libros_por_categoria', (
            SELECT jsonb_object_agg(
                category,
                libros_categoria
            )
            FROM (
                SELECT 
                    category,
                    jsonb_agg(
                        jsonb_build_object(
                            'id', id,
                            'titulo', title,
                            'autor', author,
                            'slug', slug,
                            'caracteres', LENGTH(content),
                            'lecturas', read_count,
                            'fecha_creacion', created_at,
                            'tags', tags,
                            'resumen', LEFT(content, 200) || '...'
                        ) ORDER BY title
                    ) as libros_categoria
                FROM knowledge_base 
                GROUP BY category
            ) cat_books
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
                        'ranking', ROW_NUMBER() OVER (ORDER BY read_count DESC),
                        'titulo', title,
                        'autor', author,
                        'categoria', category,
                        'lecturas', read_count,
                        'slug', slug
                    )
                )
                FROM (
                    SELECT * FROM knowledge_base 
                    ORDER BY read_count DESC 
                    LIMIT 10
                ) top_popular
            ),
            'mas_extensos', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'ranking', ROW_NUMBER() OVER (ORDER BY LENGTH(content) DESC),
                        'titulo', title,
                        'autor', author,
                        'categoria', category,
                        'caracteres', LENGTH(content),
                        'paginas_estimadas', CEIL(LENGTH(content) / 200.0),
                        'slug', slug
                    )
                )
                FROM (
                    SELECT * FROM knowledge_base 
                    ORDER BY LENGTH(content) DESC 
                    LIMIT 10
                ) top_extensos
            ),
            'mas_recientes', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'titulo', title,
                        'autor', author,
                        'categoria', category,
                        'fecha_creacion', created_at,
                        'slug', slug
                    )
                )
                FROM (
                    SELECT * FROM knowledge_base 
                    ORDER BY created_at DESC 
                    LIMIT 10
                ) top_recientes
            )
        )
    )
) as indice_biblioteca_json;
