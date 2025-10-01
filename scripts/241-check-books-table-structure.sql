-- Verificar la estructura real de la tabla de libros
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('books', 'knowledge_base', 'knowledge_base_documents')
    AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Ver qué tablas existen
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename LIKE '%book%' OR tablename LIKE '%knowledge%'
ORDER BY tablename;
