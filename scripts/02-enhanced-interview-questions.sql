-- Enhanced Interview Questions with Full Metadata
-- This replaces the basic question system with rich, contextual questions

INSERT INTO a3_preguntas_entrevista (pregunta, tipo_entrevista, dificultad, categoria, tips, question_metadata) VALUES

-- ENTRY LEVEL QUESTIONS (10 questions for 15+ minutes)
('Tell me about yourself and your professional journey', 'Estructurada', 'Fácil', 'Introduction', 
  '{
    "estructura": "Árbol de respuesta",
    "tiempo_ideal": 90,
    "palabras_clave": ["profesional", "experiencia", "motivación"]
  }',
  '{
    "tips_available": 3,
    "time_limit_seconds": 120,
    "difficulty_score": 2,
    "duration_minutes": 3,
    "key_points": ["Background", "Career progression", "Key accomplishments", "Why this role"],
    "common_mistakes": ["Too long/vague", "Irrelevant details", "Lack of energy", "Not matching job requirements"],
    "follow_ups": ["Why did you choose this career?", "What are your career goals?"],
    "success_indicators": ["Clear narrative", "Relevant experience", "Enthusiasm", "Connection to role"]
  }'
),

('Describe a time when you faced a challenging problem at work. How did you solve it?', 'Estructurada', 'Intermedia', 'Problem-Solving', 
  '{"estructura": "STAR Method"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 150,
    "difficulty_score": 4,
    "duration_minutes": 4,
    "key_points": ["Situation clarity", "Task complexity", "Action steps", "Results & metrics"],
    "common_mistakes": ["Unclear situation", "Focus on obstacles instead of solutions", "Exaggerating results", "Too technical"],
    "follow_ups": ["What would you do differently?", "How did that impact the team?"],
    "success_indicators": ["Structured response", "Quantifiable results", "Learning mindset", "Team collaboration"]
  }'
),

('What are your main strengths and how do they relate to this position?', 'Estructurada', 'Intermedia', 'Self-Assessment',
  '{"estructura": "Evidence-based"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 120,
    "difficulty_score": 3,
    "duration_minutes": 3,
    "key_points": ["Authentic strengths", "Job alignment", "Evidence/examples", "Impact"],
    "common_mistakes": ["Generic strengths", "Not tying to role", "Lack of examples", "Overconfidence"],
    "follow_ups": ["Can you give me an example?", "How did you develop this strength?"],
    "success_indicators": ["Specific strengths", "Clear connection to role", "Concrete examples", "Humble confidence"]
  }'
),

('Tell me about a situation where you had to work with a difficult team member', 'Estructurada', 'Intermedia', 'Teamwork',
  '{"estructura": "STAR + Empathy"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 150,
    "difficulty_score": 4,
    "duration_minutes": 4,
    "key_points": ["Conflict description", "Your approach", "Resolution", "Learning"],
    "common_mistakes": ["Blaming the person", "Avoiding the conflict", "No resolution", "Not showing empathy"],
    "follow_ups": ["What did you learn?", "How would you handle it now?"],
    "success_indicators": ["Empathy", "Constructive approach", "Resolution-focused", "Growth mindset"]
  }'
),

('How do you stay updated with industry trends and developments?', 'Estructurada', 'Fácil', 'Learning',
  '{"estructura": "Examples-based"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 120,
    "difficulty_score": 2,
    "duration_minutes": 3,
    "key_points": ["Learning resources", "Specific examples", "Application", "Passion for growth"],
    "common_mistakes": ["Generic answer", "No specific examples", "Passive learning only", "Disconnected from role"],
    "follow_ups": ["Can you share what youve learned recently?", "How do you apply this to your work?"],
    "success_indicators": ["Proactive learning", "Specific examples", "Relevance to role", "Continuous growth"]
  }'
),

('Describe your ideal work environment and team', 'Estructurada', 'Fácil', 'Cultural Fit',
  '{"estructura": "Values-based"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 120,
    "difficulty_score": 2,
    "duration_minutes": 3,
    "key_points": ["Work style", "Team dynamics", "Company culture", "Values alignment"],
    "common_mistakes": ["Only focusing on salary/benefits", "Unrealistic expectations", "Misalignment with company", "Too picky"],
    "follow_ups": ["Why does this matter to you?", "How do you adapt when its different?"],
    "success_indicators": ["Alignment with company", "Flexibility", "Clear values", "Realistic expectations"]
  }'
),

('Tell me about your biggest professional failure. What did you learn?', 'Estructurada', 'Difícil', 'Growth-Mindset',
  '{"estructura": "Vulnerability + Learning"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 180,
    "difficulty_score": 5,
    "duration_minutes": 5,
    "key_points": ["Own responsibility", "Impact acknowledgment", "Learning taken", "Prevention measures"],
    "common_mistakes": ["Not admitting fault", "Blaming others", "No learning shown", "Repeating mistakes"],
    "follow_ups": ["How did you recover?", "Have you faced similar challenges since?"],
    "success_indicators": ["Accountability", "Learning focus", "Prevention measures", "Resilience"]
  }'
),

('Why do you want to work for our company specifically?', 'Estructurada', 'Intermedia', 'Motivation',
  '{"estructura": "Research-based"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 150,
    "difficulty_score": 4,
    "duration_minutes": 3,
    "key_points": ["Company research", "Mission alignment", "Specific interest", "Career alignment"],
    "common_mistakes": ["Generic answer", "No research", "Only about money", "Misaligned values"],
    "follow_ups": ["What attracts you most?", "How do you see yourself contributing?"],
    "success_indicators": ["Deep research", "Values alignment", "Specific examples", "Enthusiasm"]
  }'
),

('Describe your leadership style or how you handle responsibility', 'Estructurada', 'Intermedia', 'Leadership',
  '{"estructura": "Example-based"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 150,
    "difficulty_score": 4,
    "duration_minutes": 4,
    "key_points": ["Style clarity", "Accountability", "Team empowerment", "Results focus"],
    "common_mistakes": ["Autocratic tone", "No examples", "Lack of accountability", "Not people-focused"],
    "follow_ups": ["How do you motivate your team?", "Can you give an example?"],
    "success_indicators": ["Clear style", "Accountability", "Team focus", "Results orientation"]
  }'
),

('What questions do you have for us?', 'Estructurada', 'Fácil', 'Closing',
  '{"estructura": "Prepared questions"}',
  '{
    "tips_available": 3,
    "time_limit_seconds": 120,
    "difficulty_score": 3,
    "duration_minutes": 3,
    "key_points": ["Thoughtful questions", "Company research", "Role understanding", "Team dynamics"],
    "common_mistakes": ["No questions", "Generic questions", "Only salary/benefits", "Unprepared"],
    "follow_ups": [],
    "success_indicators": ["Thoughtful questions", "Research shown", "Interest displayed", "Engagement"]
  }'
);

-- Create views for easier question retrieval
CREATE OR REPLACE VIEW interview_questions_with_metadata AS
SELECT 
  id,
  pregunta,
  tipo_entrevista,
  dificultad,
  categoria,
  question_metadata ->> ''tips_available'' AS tips_count,
  question_metadata ->> ''time_limit_seconds'' AS time_limit,
  question_metadata ->> ''difficulty_score'' AS difficulty_score,
  question_metadata ->> ''duration_minutes'' AS duration_minutes,
  question_metadata ->> ''key_points'' AS key_points,
  question_metadata ->> ''common_mistakes'' AS common_mistakes,
  question_metadata ->> ''follow_ups'' AS follow_ups,
  question_metadata ->> ''success_indicators'' AS success_indicators
FROM a3_preguntas_entrevista
WHERE tipo_entrevista IS NOT NULL;
