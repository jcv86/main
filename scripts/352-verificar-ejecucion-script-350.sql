-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN ESPECÍFICA: ¿Se ejecutó el script 350?
-- ═══════════════════════════════════════════════════════════════════════════

-- Buscar los 3 libros específicos del script 350
SELECT 
    '🔍 VERIFICACIÓN SCRIPT 350' as verificacion,
    title,
    LENGTH(content) as caracteres,
    CASE 
        WHEN LENGTH(content) >= 15000 THEN '✅ Expandido correctamente'
        WHEN LENGTH(content) >= 8000 THEN '⚠️ Parcialmente expandido'
        ELSE '❌ No expandido'
    END as estado,
    updated_at,
    CASE 
        WHEN updated_at > NOW() - INTERVAL '1 hour' THEN '🆕 Actualizado hace poco'
        WHEN updated_at > NOW() - INTERVAL '24 hours' THEN '📅 Actualizado hoy'
        ELSE '⏰ Actualizado hace más de 24h'
    END as tiempo_desde_actualizacion
FROM knowledge_base
WHERE title ILIKE '%Deep Work%' 
   OR title ILIKE '%Trabajo Profundo%'
   OR title ILIKE '%Thinking%Fast%'
   OR title ILIKE '%Pensar%Rápido%'
   OR title ILIKE '%Start%Why%'
   OR title ILIKE '%Empieza%Por%Qué%'
   OR title ILIKE '%Empezar%Por%Qué%'
ORDER BY LENGTH(content) DESC;

-- Buscar variaciones de títulos
SELECT 
    '📚 BÚSQUEDA AMPLIA DE TÍTULOS' as busqueda,
    id,
    title,
    LENGTH(content) as chars
FROM knowledge_base
WHERE title ILIKE '%deep%work%'
   OR title ILIKE '%thinking%fast%slow%'
   OR title ILIKE '%start%why%'
   OR title ILIKE '%pensar%rapido%despacio%'
   OR title ILIKE '%empeza%por%que%'
ORDER BY title;
