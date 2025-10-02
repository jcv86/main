-- Exportar Lista Simple de Todos los Libros con Estado
-- Formato fácil de leer y compartir

SELECT 
    ROW_NUMBER() OVER (ORDER BY 
        CASE 
            WHEN LENGTH(content) >= 50000 THEN 1
            WHEN LENGTH(content) >= 35000 THEN 2
            WHEN LENGTH(content) >= 20000 THEN 3
            ELSE 4
        END,
        title
    ) as "#",
    
    CASE 
        WHEN LENGTH(content) >= 100000 THEN '🌟 EXCEPCIONAL'
        WHEN LENGTH(content) >= 75000 THEN '⭐ EXCELENTE'
        WHEN LENGTH(content) >= 50000 THEN '✅ COMPLETO'
        WHEN LENGTH(content) >= 35000 THEN '🟡 BUENO'
        WHEN LENGTH(content) >= 20000 THEN '🟠 MEDIO'
        WHEN LENGTH(content) >= 10000 THEN '🔴 CORTO'
        ELSE '⚠️ MUY CORTO'
    END as "Estado",
    
    title as "Título",
    author as "Autor",
    category as "Categoría",
    
    LENGTH(content) as "Caracteres",
    ROUND(LENGTH(content) / 2500.0, 1) as "Páginas Est.",
    
    CASE 
        WHEN LENGTH(content) >= 50000 THEN 'OK'
        ELSE (50000 - LENGTH(content)) || ' caracteres más'
    END as "Acción Requerida",
    
    read_count as "Lecturas",
    
    TO_CHAR(created_at, 'YYYY-MM-DD') as "Creado",
    TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI') as "Última Actualización"
    
FROM knowledge_base
ORDER BY 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN 1
        WHEN LENGTH(content) >= 35000 THEN 2
        WHEN LENGTH(content) >= 20000 THEN 3
        ELSE 4
    END,
    title;
