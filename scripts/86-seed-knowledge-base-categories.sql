-- Insert knowledge base categories
INSERT INTO knowledge_base_categories (name, slug, description, icon, sort_order) VALUES
('Documentación Técnica', 'technical-docs', 'Especificaciones técnicas y documentación del sistema', 'FileCode', 1),
('Guías de Usuario', 'user-guides', 'Guías paso a paso para usar la plataforma', 'BookOpen', 2),
('Información de Carreras', 'career-info', 'Información detallada sobre carreras y mercado laboral', 'GraduationCap', 3),
('Recursos Generales', 'general-resources', 'Recursos adicionales y materiales de apoyo', 'Library', 4)
ON CONFLICT (slug) DO NOTHING;
