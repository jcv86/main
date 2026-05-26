/**
 * Travis Mockup Data Population - All Pillars
 * Populates realistic test data for Travis across A1, A2, A3, and A4 pillars
 * This enables full platform testing and demo flow validation
 */

-- Constants for Travis
-- Travis user ID: travis-dev-user-001
-- These queries use parameterized values that should be replaced with actual Travis user ID

-- ====================================
-- A1 PILLAR DATA - El Ritual (Identity)
-- ====================================

-- A1 Identity (foundational record)
INSERT INTO a1_identity (
  user_id,
  created_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  NOW()
)
ON CONFLICT DO NOTHING;

-- A1 Progress tracking
INSERT INTO a1_progress (
  user_id,
  cerebral_completed,
  inteligencia_emocional_completed,
  mapa_personalidad_completed,
  cinco_dimensiones_completed,
  competencias_completed,
  brujula_vocacional_completed,
  tests_completed,
  created_at,
  last_updated
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  true,
  true,
  true,
  true,
  true,
  true,
  6,
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  cerebral_completed = true,
  inteligencia_emocional_completed = true,
  mapa_personalidad_completed = true,
  cinco_dimensiones_completed = true,
  competencias_completed = true,
  brujula_vocacional_completed = true,
  tests_completed = 6,
  last_updated = NOW();

-- A1 Unified Report (completion summary)
INSERT INTO a1_unified_report (
  user_id,
  perfil_disco_type,
  inteligencia_emocional_score,
  personalidad_tipo,
  generated_at,
  created_at,
  version
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'D',
  82,
  'Decisive Leader',
  NOW(),
  NOW(),
  '1.0'
)
ON CONFLICT DO NOTHING;

-- A1 Profile Insights (key findings)
INSERT INTO a1_profile_insights (
  user_id,
  patron_dominante,
  patron_secundario,
  fortalezas_principales,
  areas_desarrollo,
  dinamica_equipo,
  gestion_conflicto,
  comunicacion_efectiva,
  carrera_align,
  estilo_entrevista,
  proxi_paso,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'Driver',
  'Analytical',
  'Strategic thinking, Execution, Data-driven decisions',
  'Delegation, Stakeholder management, Patience with process',
  'Natural leader, motivates through clarity and results',
  'Direct but respectful, prefers solution-focused dialogue',
  'Clear, structured, uses data to persuade',
  'Product Management, Startup Leadership',
  'Confident, structured responses, talks about metrics',
  'Prepare portfolio, build network in B2B SaaS',
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  patron_dominante = 'Driver',
  patron_secundario = 'Analytical',
  updated_at = NOW();

-- ====================================
-- A2 PILLAR DATA - Exploración (Routes)
-- ====================================

-- A2 Route Progress (assumes route exists)
INSERT INTO a2_user_route_progress (
  user_id,
  route_id,
  estado,
  dia_actual,
  porcentaje_completado,
  fecha_inicio,
  created_at,
  updated_at
)
SELECT
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  a2r.id,
  'completed',
  90,
  100,
  NOW() - INTERVAL '90 days',
  NOW(),
  NOW()
FROM a2_learning_routes a2r
WHERE a2r.activo = true
LIMIT 1
ON CONFLICT DO NOTHING;

-- A2 User Missions (core mission progress)
INSERT INTO a2_user_missions (
  user_id,
  route_id,
  estado,
  objetivo_especifico,
  metrica_exito,
  progreso_porcentaje,
  fecha_inicio,
  fecha_fin_planeada,
  fecha_completada,
  created_at,
  updated_at
)
SELECT
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  a2r.id,
  'completed',
  'Complete 90-day route with focus on PM positioning',
  'Document impact, refine pitch, build portfolio',
  100,
  NOW() - INTERVAL '90 days',
  NOW(),
  NOW(),
  NOW(),
  NOW()
FROM a2_learning_routes a2r
WHERE a2r.activo = true
LIMIT 1
ON CONFLICT DO NOTHING;

-- A2 Day 1 Submission (route contract)
INSERT INTO a2_day1_submissions (
  user_id,
  current_step,
  completed_steps,
  status,
  vision_role,
  vision_environment,
  vision_desired_outcome,
  action_plan,
  milestone_day10,
  milestone_day20,
  milestone_day30,
  analysis_status,
  pass_fail_status,
  created_at,
  updated_at,
  completed_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  0,
  ARRAY['vision', 'action_plan', 'milestones'],
  'completed',
  'Product Manager - Growth Lead',
  'B2B SaaS Scale-up (Series A-B)',
  'Drive $200K+ annual ARR impact; Lead product strategy for emerging market',
  '{"key_actions": ["Validate PM positioning", "Build case studies", "Network with 50 PMs"], "timeline": "90 days", "resources": "Portfolio docs, LinkedIn, Industry events"}',
  'Complete portfolio with 3 case studies',
  'Apply to 10 target companies, get 3 interviews',
  'Secure offer with 30%+ salary increase',
  'completed',
  'pass',
  NOW() - INTERVAL '90 days',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- A2 Professional Identity
INSERT INTO a2_professional_identities (
  user_id,
  day_number,
  candidate_archetype,
  archetype_description,
  version_simple,
  version_recruiter,
  version_interview,
  stress_test_result,
  status,
  is_validated,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  4,
  'The Proven Executor',
  'PM with demonstrable track record of impact execution',
  'Product Manager with 18 months experience, $200K+ impact documented',
  'Execution-focused PM driving $200K annual ARR, strong metrics orientation, B2B SaaS specialist',
  'Strategic PM combining user insight with execution rigor, comfortable with ambiguity, data-driven',
  'Strong presence, confident communication, specific examples, metrics-oriented',
  'completed',
  true,
  NOW() - INTERVAL '60 days',
  NOW()
)
ON CONFLICT DO NOTHING;

-- A2 Market Signals (signals identified)
INSERT INTO a2_market_signals (
  user_id,
  day_number,
  job_title,
  company_name,
  industry,
  requirements,
  strengths_needed,
  salary_range,
  location,
  created_at,
  updated_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  3,
  'Senior PM - Growth',
  'EdTech Scale-up',
  'EdTech',
  '["5+ years PM", "SaaS background", "Growth metrics", "Team leadership"]',
  '["Data analysis", "User research", "Cross-functional leadership"]',
  '$100K-140K',
  'Remote',
  NOW() - INTERVAL '87 days',
  NOW() - INTERVAL '87 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  3,
  'Product Manager - Platform',
  'B2B SaaS Series B',
  'SaaS',
  '["API experience", "Developer tools", "Technical writing"]',
  '["Technical communication", "System thinking", "Partner relationships"]',
  '$90K-130K',
  'Hybrid',
  NOW() - INTERVAL '87 days',
  NOW() - INTERVAL '87 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  3,
  'PM Director',
  'MarTech Company',
  'MarTech',
  '["10+ years product", "Team leadership", "GTM strategy"]',
  '["Strategic vision", "Executive presence", "Revenue ownership"]',
  '$140K-180K',
  'SF/NYC',
  NOW() - INTERVAL '87 days',
  NOW() - INTERVAL '87 days'
)
ON CONFLICT DO NOTHING;

-- A2 Extracted Signals
INSERT INTO a2_extracted_signals (
  user_id,
  day_number,
  signal_type,
  signal_text,
  frequency,
  importance,
  related_jobs_count,
  category,
  created_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  3,
  'skill',
  'Data Analysis',
  8,
  9,
  3,
  'Technical',
  NOW() - INTERVAL '87 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  3,
  'skill',
  'User Research',
  7,
  8,
  3,
  'Discovery',
  NOW() - INTERVAL '87 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  3,
  'tool',
  'Jira/Asana',
  9,
  7,
  3,
  'Tools',
  NOW() - INTERVAL '87 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  3,
  'soft_skill',
  'Cross-functional Leadership',
  6,
  9,
  3,
  'Leadership',
  NOW() - INTERVAL '87 days'
)
ON CONFLICT DO NOTHING;

-- A2 Candidate Board
INSERT INTO a2_candidate_boards (
  user_id,
  day_number,
  column_1_quien_soy,
  column_2_que_quiere,
  column_3_que_prueba,
  column_4_que_falta,
  candidate_hypothesis,
  candidate_archetype,
  status,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  4,
  'Product Manager with 18 months PM experience in B2B SaaS. Led 5 features generating $200K+ revenue impact. Specialist in data-driven product decisions.',
  'Market demands: Data Analysis, User Research, Cross-functional Leadership. Tools: Jira, Amplitude, Figma. Compensation: $80K-140K PM Mid/Senior roles.',
  'Documented 5 features launched with metrics. 23% churn reduction via onboarding redesign. $80K new revenue roadmap. 15+ user research interviews. $40K MRR via API integrations.',
  'Lack formal PM title (currently Analyst). CV underrepresents actual scope. LinkedIn outdated. Portfolio lacks visual case studies.',
  'If position as PM with 18 months practical experience and $200K documented impact, will access PM Mid-level roles with 30-50% salary increase.',
  'The Proven Executor',
  'completed',
  NOW() - INTERVAL '86 days',
  NOW() - INTERVAL '86 days'
)
ON CONFLICT DO NOTHING;

-- A2 Test Introductions
INSERT INTO a2_test_introductions (
  user_id,
  day_number,
  test_type,
  version_a,
  version_b,
  version_c,
  test_feedback,
  status,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  5,
  'linkedin_post',
  'Product Manager with B2B SaaS experience. Led features generating $200K+ revenue. Passionate about data-driven product decisions.',
  'PM specialist in EdTech/SaaS. 18 months: 23% churn reduction, $80K new revenue roadmap, $40K MRR API integrations. Ready for next challenge.',
  'PM in B2B SaaS focusing on user insight + execution rigor. Transformed 50+ interviews into features boosting retention 23%, generating $200K+ impact. Ready to drive significant results.',
  'Version C resonated best - specific metrics, clear value prop, strong call-to-action.',
  'completed',
  NOW() - INTERVAL '85 days',
  NOW() - INTERVAL '85 days'
)
ON CONFLICT DO NOTHING;

-- ====================================
-- A3 PILLAR DATA - Entrenamiento (Interview Prep)
-- ====================================

-- A3 Module Completion (training modules completed)
INSERT INTO a3_module_completion (
  user_id,
  module_id,
  module_number,
  best_score,
  total_attempts,
  completed_at,
  created_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'module_1',
  1,
  92,
  3,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'module_2',
  2,
  88,
  2,
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '25 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'module_3',
  3,
  95,
  2,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
)
ON CONFLICT DO NOTHING;

-- A3 Session Attempts (practice interviews)
INSERT INTO a3_session_attempts (
  user_id,
  session_type,
  module_id,
  module_number,
  difficulty,
  is_route_checkpoint,
  status,
  progress,
  score,
  created_at,
  session_started_at,
  updated_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'practice',
  'module_1',
  1,
  'intermediate',
  false,
  'completed',
  100,
  92,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'practice',
  'module_2',
  2,
  'intermediate',
  false,
  'completed',
  100,
  88,
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '25 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'practice',
  'module_3',
  3,
  'advanced',
  true,
  'completed',
  100,
  95,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
)
ON CONFLICT DO NOTHING;

-- A3 User Progress
INSERT INTO a3_user_progress (
  user_id,
  current_module,
  completed_module_ids,
  total_xp,
  module_states,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'module_4',
  ARRAY['module_1', 'module_2', 'module_3'],
  275,
  '{"module_1": "completed", "module_2": "completed", "module_3": "completed"}',
  NOW() - INTERVAL '30 days',
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  completed_module_ids = ARRAY['module_1', 'module_2', 'module_3'],
  total_xp = 275,
  updated_at = NOW();

-- ====================================
-- A4 PILLAR DATA - La Realidad (Strategic Documents)
-- ====================================

-- A4 Documents Extended (core strategic documents)
INSERT INTO a4_documents_extended (
  user_id,
  title,
  type,
  content,
  source_module,
  status,
  version,
  created_at,
  updated_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'PM Impact Portfolio - Complete',
  'portfolio',
  '5 Case Studies with metrics, ROI analysis, stakeholder testimonials documented',
  'a4_strategic',
  'completed',
  1,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  '90-Day Strategic Roadmap',
  'roadmap',
  'Positioning strategy: Month 1 Portfolio, Month 2 Networking, Month 3 Interviews & Offer',
  'a4_strategic',
  'completed',
  1,
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '12 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'Target Companies Analysis',
  'research',
  '15 target companies profiled: culture, growth stage, PM roles, comp packages',
  'a4_strategic',
  'completed',
  1,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
)
ON CONFLICT DO NOTHING;

-- A4 Module Progress (A4 completion tracking)
INSERT INTO a4_module_progress (
  user_id,
  module_id,
  modulo_titulo,
  completado,
  progreso_porcentaje,
  completado_at,
  created_at,
  updated_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'module_portfolio',
  'PM Impact Portfolio',
  true,
  100,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'module_positioning',
  'Strategic Positioning',
  true,
  100,
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '12 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'module_execution',
  'Execution & Next Steps',
  true,
  100,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT DO NOTHING;

-- A4 Strategic Score
INSERT INTO a4_strategic_score (
  user_id,
  score,
  score_7day_average,
  created_at,
  updated_at,
  last_updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  92,
  90,
  NOW() - INTERVAL '5 days',
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  score = 92,
  score_7day_average = 90,
  updated_at = NOW(),
  last_updated_at = NOW();

-- A4 Engagement Tracking
INSERT INTO a4_engagement_tracking (
  user_id,
  event_type,
  feature,
  completed,
  duration_seconds,
  created_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'document_view',
  'portfolio',
  true,
  1200,
  NOW() - INTERVAL '2 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'document_edit',
  'roadmap',
  true,
  1800,
  NOW() - INTERVAL '1 day'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'completion',
  'module_execution',
  true,
  2400,
  NOW()
)
ON CONFLICT DO NOTHING;

-- ====================================
-- DESPEGA PROFILE UPDATES
-- ====================================

-- Update Despega user profile to mark all pillars unlocked
UPDATE despega_user_profiles
SET
  a1_test_completed = true,
  a1_test_completed_at = NOW() - INTERVAL '90 days',
  a1_cerebral_completed = true,
  a1_cerebral_completed_at = NOW() - INTERVAL '88 days',
  onboarding_conozcamonos_1_completed = true,
  onboarding_conozcamonos_1_completed_at = NOW() - INTERVAL '88 days',
  conozcamonos_2_completed = true,
  a2_missions_started = true,
  a2_missions_started = true,
  a3_unlocked = true,
  a3_unlocked_at = NOW() - INTERVAL '30 days',
  a4_unlocked = true,
  a4_unlocked_at = NOW() - INTERVAL '15 days',
  current_stage = 'a4_strategic',
  progress_percentage = 100,
  updated_at = NOW()
WHERE user_id = '00000000-0000-0000-0000-000000000001'  -- Travis user ID
OR user_id = 'travis-dev-user-001';

-- ====================================
-- PILLAR PROGRESS TRACKING
-- ====================================

-- Set Travis pilar progress to 100% across all pillars
INSERT INTO despega_pilar_progress (
  user_id,
  pilar,
  estado,
  progreso,
  score,
  is_unlocked,
  created_at,
  updated_at
)
VALUES
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'a1',
  '{"status": "completed", "tests_passed": 6}',
  100,
  92,
  true,
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '90 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'a2',
  '{"status": "completed", "days_completed": 90}',
  100,
  88,
  true,
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '60 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'a3',
  '{"status": "completed", "modules_completed": 3}',
  100,
  95,
  true,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
),
(
  '00000000-0000-0000-0000-000000000001',  -- Travis user ID
  'a4',
  '{"status": "completed", "documents_created": 3}',
  100,
  92,
  true,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (user_id, pilar) DO UPDATE SET
  progreso = 100,
  is_unlocked = true,
  updated_at = NOW();

-- ====================================
-- VERIFICATION QUERIES (RUN AFTER SEED)
-- ====================================
-- Uncomment to verify data was populated:
/*
SELECT 'A1' as pillar, COUNT(*) as count FROM a1_identity WHERE user_id = '00000000-0000-0000-0000-000000000001' UNION
SELECT 'A2_routes', COUNT(*) FROM a2_user_route_progress WHERE user_id = '00000000-0000-0000-0000-000000000001' UNION
SELECT 'A3_modules', COUNT(*) FROM a3_module_completion WHERE user_id = '00000000-0000-0000-0000-000000000001' UNION
SELECT 'A4_docs', COUNT(*) FROM a4_documents_extended WHERE user_id = '00000000-0000-0000-0000-000000000001';
*/
