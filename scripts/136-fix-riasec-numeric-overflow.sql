-- Fix RIASEC numeric overflow by using safe values
-- Delete existing RIASEC result to avoid conflicts
DELETE FROM test_results WHERE user_email = 'travis@example.com' AND test_type = 'riasec';

-- Insert RIASEC result with safe numeric values
INSERT INTO test_results (
    user_email, 
    test_type, 
    results, 
    completed_at
) VALUES (
    'travis@example.com',
    'riasec',
    '{
        "R": 6,
        "I": 16,
        "A": 13,
        "S": 12,
        "E": 15,
        "C": 8,
        "total_score": 70,
        "max_score": 90,
        "percentage": 78,
        "holland_code": "IEA",
        "top_categories": ["Investigativo", "Emprendedor", "Artístico"],
        "career_matches": [
            "Desarrollador de Software",
            "Diseñador UX/UI",
            "Consultor de Tecnología",
            "Arquitecto de Sistemas",
            "Product Manager"
        ],
        "strengths": [
            "Pensamiento analítico y lógico",
            "Capacidad de liderazgo e iniciativa",
            "Creatividad e innovación",
            "Resolución de problemas complejos"
        ],
        "development_areas": [
            "Habilidades sociales y trabajo en equipo",
            "Atención al detalle y organización",
            "Paciencia en tareas rutinarias"
        ],
        "reflective_responses": {
            "q31": "Me motiva resolver problemas complejos y crear soluciones innovadoras que tengan impacto real.",
            "q32": "En 5 años me veo liderando un equipo de desarrollo, creando productos tecnológicos disruptivos.",
            "q33": "Mi mayor logro fue desarrollar una aplicación que ayudó a 10,000 usuarios a mejorar su productividad.",
            "q34": "Supero desafíos analizando el problema desde múltiples perspectivas y buscando soluciones creativas.",
            "q35": "Contribuyo al equipo aportando ideas innovadoras, liderazgo técnico y motivando a otros."
        }
    }',
    NOW()
);

-- Verify the insertion
SELECT user_email, test_type, results->>'holland_code' as holland_code, completed_at 
FROM test_results 
WHERE user_email = 'travis@example.com' AND test_type = 'riasec';
