-- Seed Data for A4 Radar Estratégico MVP
-- Insert example tesis del día
INSERT INTO a4_radar_tesis_dia (titulo, resumen, nivel_energia, descuenta_mercado, fecha) VALUES
('Transformación Digital Acelerada', 'La crisis económica acelera adopción de tecnología. Las empresas que no digitalizan quedan rezagadas. El mercado ya descuenta una tasa de cambio tecnológico mayor a la histórica.', 'Alta', 'Sí, velocidad de transformación', NOW()),
('Consolidación del Mercado Laboral', 'Después de volatilidad extrema, emerge patrón claro: demanda por habilidades digitales crece 40% anual. Las carreras tradicionales pierden relevancia. El mercado ya espera automatización de roles administrativos.', 'Confirmación', 'Sí, pero no del todo priced in', NOW());

-- Insert example noticias
INSERT INTO a4_radar_noticias (tesis_id, titulo, fuente, url, resumen, nivel_cobertura) 
SELECT id, 'Startups Tech Reciben $2.3B en Inversión Q1', 'Reuters', 'https://example.com', 'Inversión en startups de tech alcanza máximo histórico', 'Alta'
FROM a4_radar_tesis_dia LIMIT 1;

-- Insert example weak signals
INSERT INTO a4_radar_weak_signals (tesis_id, señal, potencial, horizontetiempo)
SELECT id, 'Gobiernos exploran regulaciones de IA', 'Alto - Podría impactar M&A y estrategias de producto', '6-12 meses'
FROM a4_radar_tesis_dia LIMIT 1;
