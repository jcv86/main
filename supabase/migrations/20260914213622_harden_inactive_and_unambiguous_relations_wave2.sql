-- Wave 2: close Data API access for legacy tables with no active .from()
-- callsite, then enable existing, unambiguous owner/catalog policies.
-- RPC dependencies and uncertain active relations are intentionally deferred.

do $migration$
declare
  target_table text;
begin
  foreach target_table in array array[
    'a1_test_requirements',
    'a1_test_results',
    'a2_micro_actions',
    'a2_route_modules',
    'a3_api_webhooks',
    'a3_empleadores',
    'a3_empleadores_partners',
    'a3_entrevistas',
    'a3_modulos_educativos',
    'a3_multimodal_analysis_cache',
    'a3_video_banco',
    'a3_videos_banco',
    'a4_document_label_assignments',
    'a4_document_sources',
    'a4_score_decay_config',
    'ab_test_question_variants',
    'ab_test_results_tracking',
    'activity_reminders',
    'admin_notifications',
    'ai_coaching_sessions',
    'ai_interactions',
    'application_interviews',
    'application_status_history',
    'archived_data_metadata',
    'assessment_results',
    'autopublish_config',
    'autopublish_history',
    'autopublish_monitoring',
    'biblioteca_categories',
    'book_chapters',
    'book_reviews',
    'brain_conversations',
    'brain_queries',
    'canary_deployment_events',
    'canary_deployment_metrics',
    'canary_deployment_stages',
    'canary_deployments',
    'canary_rollback_history',
    'capacity_alerts',
    'capacity_history',
    'career_tips',
    'cerebro_hybrid_insights',
    'cerebro_insights',
    'chilean_market_insights',
    'chilevalora_chunks',
    'chilevalora_market_trends',
    'chilevalora_profile_ucl',
    'chilevalora_ucl',
    'cip_tasks',
    'coaching_conversations',
    'coaching_insights',
    'coaching_metrics',
    'coaching_sessions',
    'companies',
    'content_license_history',
    'content_licenses',
    'contextual_suggestions',
    'cron_job_alerts',
    'cron_job_config',
    'cron_job_executions',
    'cv_ai_generations',
    'cv_data_backup',
    'cv_feedback_history',
    'cv_job_matches',
    'cv_records',
    'cv_templates',
    'data_cleanup_history',
    'data_retention_policies',
    'despega_perfil_benchmark',
    'disc_results',
    'document_chunks',
    'document_conversations',
    'document_messages',
    'documents',
    'dsar_audit_log',
    'dsar_config',
    'dsar_data_collected',
    'dsar_requests',
    'email_insights_history',
    'embedding_generation_log',
    'generated_cvs',
    'interview_simulations',
    'job_applications',
    'job_recommendations',
    'jobs',
    'knowledge_base_articles',
    'knowledge_base_categories',
    'knowledge_base_documents',
    'library_book_chapters',
    'library_books',
    'library_insights',
    'license_compliance_alerts',
    'market_data',
    'metric_alerts',
    'metric_thresholds',
    'metric_values',
    'mirix_access_logs',
    'mirix_memories',
    'mirix_sessions',
    'open_responses',
    'personality_assessments',
    'personality_results',
    'personality_tests',
    'platform_config',
    'platform_knowledge',
    'prompt_assignments',
    'prompt_review_tasks',
    'prompt_versions',
    'reading_achievements',
    'reading_goals',
    'reading_sessions',
    'resumes',
    'retention_notifications',
    'riasec_career_matches',
    'saved_insights',
    'severity_thresholds',
    'skill_assessments',
    'skills_assessments',
    'task_sessions',
    'test_analytics_summary',
    'test_benchmarks',
    'test_combination_patterns',
    'test_completion_metrics',
    'test_questions',
    'threshold_alerts',
    'user_activities',
    'user_awards',
    'user_book_bookmarks',
    'user_book_highlights',
    'user_book_notes',
    'user_book_progress',
    'user_book_quotes',
    'user_certifications',
    'user_cvs',
    'user_education',
    'user_experience',
    'user_goals',
    'user_languages',
    'user_projects',
    'user_reading_sessions',
    'user_recommendations',
    'user_research',
    'user_skills',
    'web_resource_book_relations',
    'whatsapp_config'
  ]
  loop
    if to_regclass(format('public.%I', target_table)) is not null then
      execute format('alter table public.%I enable row level security', target_table);
      execute format('revoke all privileges on table public.%I from anon, authenticated', target_table);
    end if;
  end loop;
end
$migration$;

-- Active owner-scoped relations whose existing policies bind auth.uid() to user_id.
alter table public.achievements enable row level security;
revoke all privileges on table public.achievements from anon, authenticated;
grant select, insert on table public.achievements to authenticated;

alter table public.ai_insights_from_coaching enable row level security;
revoke all privileges on table public.ai_insights_from_coaching from anon, authenticated;
grant select, insert on table public.ai_insights_from_coaching to authenticated;

alter table public.user_coaching_memory enable row level security;
revoke all privileges on table public.user_coaching_memory from anon, authenticated;
grant select, insert, update on table public.user_coaching_memory to authenticated;

alter table public.user_performance_context enable row level security;
revoke all privileges on table public.user_performance_context from anon, authenticated;
grant select, update on table public.user_performance_context to authenticated;

alter table public.user_progress enable row level security;
revoke all privileges on table public.user_progress from anon, authenticated;
grant select, insert, update on table public.user_progress to authenticated;

alter table public.user_reading_stats enable row level security;
revoke all privileges on table public.user_reading_stats from anon, authenticated;
grant select, insert, update on table public.user_reading_stats to authenticated;

-- Active public catalogs: preserve read behavior while removing all writes.
alter table public.chilevalora_profiles enable row level security;
revoke all privileges on table public.chilevalora_profiles from anon, authenticated;
grant select on table public.chilevalora_profiles to anon, authenticated;

alter table public.despega_misiones enable row level security;
revoke all privileges on table public.despega_misiones from anon, authenticated;
grant select on table public.despega_misiones to anon, authenticated;

alter table public.despega_rutas enable row level security;
revoke all privileges on table public.despega_rutas from anon, authenticated;
grant select on table public.despega_rutas to anon, authenticated;

alter table public.job_listings enable row level security;
revoke all privileges on table public.job_listings from anon, authenticated;
grant select on table public.job_listings to anon, authenticated;
