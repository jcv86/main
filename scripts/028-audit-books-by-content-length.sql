-- AUDIT SCRIPT: Ranking de libros por cantidad de caracteres
-- Esto mostrará exactamente qué libros necesitan más contenido

SELECT 
  id,
  title,
  author,
  LENGTH(COALESCE(content, '')) as num_caracteres,
  CASE 
    WHEN LENGTH(COALESCE(content, '')) < 2000 THEN 'CRÍTICO - Vacío'
    WHEN LENGTH(COALESCE(content, '')) < 5000 THEN 'Muy Corto'
    WHEN LENGTH(COALESCE(content, '')) < 10000 THEN 'Corto'
    WHEN LENGTH(COALESCE(content, '')) < 15000 THEN 'Aceptable'
    WHEN LENGTH(COALESCE(content, '')) >= 15000 THEN 'Completo'
  END as estado,
  CASE 
    WHEN LENGTH(COALESCE(content, '')) < 2000 THEN 1
    WHEN LENGTH(COALESCE(content, '')) < 5000 THEN 2
    WHEN LENGTH(COALESCE(content, '')) < 10000 THEN 3
    WHEN LENGTH(COALESCE(content, '')) < 15000 THEN 4
    ELSE 5
  END as prioridad
FROM knowledge_base
ORDER BY num_caracteres ASC;
