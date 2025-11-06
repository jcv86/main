-- Eliminar libros duplicados, manteniendo solo el más reciente de cada título
-- Script para limpiar la base de datos de libros duplicados

DO $cleanup$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- Eliminar duplicados manteniendo el registro con el ID más alto (más reciente)
    DELETE FROM knowledge_base a
    USING knowledge_base b
    WHERE a.id < b.id 
    AND a.title = b.title 
    AND a.author = b.author;
    
    GET DIAGNOSTICS duplicate_count = ROW_COUNT;
    
    RAISE NOTICE 'Se eliminaron % libros duplicados', duplicate_count;
    
    -- Mostrar resumen de libros únicos restantes
    RAISE NOTICE 'Total de libros únicos: %', (SELECT COUNT(*) FROM knowledge_base);
END $cleanup$;

-- Verificar que no hay duplicados
SELECT 
    title,
    author,
    COUNT(*) as cantidad
FROM knowledge_base
GROUP BY title, author
HAVING COUNT(*) > 1;
