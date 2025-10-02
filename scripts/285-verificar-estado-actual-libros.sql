-- Verificar el estado actual de los primeros 10 libros
SELECT 
    id,
    title,
    author,
    category,
    LENGTH(content) as longitud_contenido,
    CASE 
        WHEN LENGTH(content) < 5000 THEN 'Muy corto - necesita expansión'
        WHEN LENGTH(content) < 15000 THEN 'Corto - podría mejorarse'
        WHEN LENGTH(content) < 30000 THEN 'Medio - contenido aceptable'
        ELSE 'Largo - contenido completo'
    END as estado,
    LEFT(content, 200) as preview
FROM knowledge_base 
ORDER BY id
LIMIT 10;
