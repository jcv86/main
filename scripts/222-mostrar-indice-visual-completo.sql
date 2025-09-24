-- Mostrar índice visual completo de todos los libros organizados por categorías
DO $$
DECLARE
    categoria_record RECORD;
    libro_record RECORD;
    total_libros INTEGER;
    contador INTEGER := 0;
BEGIN
    -- Contar total de libros
    SELECT COUNT(*) INTO total_libros FROM knowledge_base;
    
    RAISE NOTICE '📚 ÍNDICE COMPLETO DE LA BIBLIOTECA DE DESARROLLO PROFESIONAL';
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
    RAISE NOTICE 'Total de libros: %', total_libros;
    RAISE NOTICE '';
    
    -- Iterar por cada categoría
    FOR categoria_record IN 
        SELECT category, COUNT(*) as total_categoria 
        FROM knowledge_base 
        GROUP BY category 
        ORDER BY category
    LOOP
        RAISE NOTICE '📂 %: % libros', categoria_record.category, categoria_record.total_categoria;
        RAISE NOTICE '─────────────────────────────────────────────────────────────';
        
        -- Mostrar libros de esta categoría
        FOR libro_record IN 
            SELECT id, title, author, 
                   CEIL(LENGTH(content) / 200.0) as paginas,
                   CEIL(LENGTH(content) / 1000.0) as tiempo_lectura,
                   read_count,
                   LENGTH(content) as caracteres
            FROM knowledge_base 
            WHERE category = categoria_record.category
            ORDER BY read_count DESC, title
        LOOP
            contador := contador + 1;
            RAISE NOTICE '  %%. 📖 % - %', 
                LPAD(contador::text, 2, '0'),
                libro_record.title, 
                libro_record.author;
            RAISE NOTICE '      📊 % páginas | ⏱️ % min | ⭐ % lecturas | 📝 % chars',
                libro_record.paginas,
                libro_record.tiempo_lectura,
                libro_record.read_count,
                libro_record.caracteres;
        END LOOP;
        
        RAISE NOTICE '';
    END LOOP;
    
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
    RAISE NOTICE '✅ Índice completo generado: % libros en % categorías', 
        total_libros, 
        (SELECT COUNT(DISTINCT category) FROM knowledge_base);
END $$;
