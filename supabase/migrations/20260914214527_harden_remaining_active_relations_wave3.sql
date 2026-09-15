-- Wave 3: harden every remaining RLS-off public relation with an
-- unambiguous owner, catalog, or server-only boundary.
--
-- Live preflight 2026-09-15 confirmed brain_feedback.user_id and
-- successful_patterns.user_id are TEXT, not UUID. Both active callsites use
-- the server-side AdvancedBrainEngine service-role client, so they belong to
-- the server-only boundary rather than the authenticated UUID-owner group.

do $migration$
declare
  target_table text;
  policy_record record;
begin
  foreach target_table in array array['cerebro_conversation_memory','cerebro_feedback_learning','cerebro_predictive_insights','cerebro_reasoning_chains','cerebro_user_patterns','user_chilevalora_interactions','user_journey_progress','cv_data']
  loop
    execute format('alter table public.%I enable row level security', target_table);
    for policy_record in
      select polname from pg_policy where polrelid = format('public.%I', target_table)::regclass
    loop
      execute format('drop policy %I on public.%I', policy_record.polname, target_table);
    end loop;
    execute format('revoke all privileges on table public.%I from anon, authenticated', target_table);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', target_table);
    execute format(
      'create policy %I on public.%I for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)',
      target_table || '_owner_all',
      target_table
    );
  end loop;

  foreach target_table in array array['ab_test_events','ai_conversations','ai_insights','ai_interpretations','brain_analytics_events','cerebro_cross_test_analysis','coach_conversations','spaced_repetition_items','user_ab_assignments','user_achievements','user_bookmarks','user_learning_path_progress','user_reading_progress','user_skill_assessments','book_reviews']
  loop
    execute format('alter table public.%I enable row level security', target_table);
    for policy_record in
      select polname from pg_policy where polrelid = format('public.%I', target_table)::regclass
    loop
      execute format('drop policy %I on public.%I', policy_record.polname, target_table);
    end loop;
    execute format('revoke all privileges on table public.%I from anon, authenticated', target_table);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', target_table);
    execute format(
      'create policy %I on public.%I for all to authenticated using (lower((select auth.jwt() ->> ''email'')) = lower(user_email)) with check (lower((select auth.jwt() ->> ''email'')) = lower(user_email))',
      target_table || '_email_owner_all',
      target_table
    );
  end loop;

  foreach target_table in array array['a3_module_unlock_rules','ab_test_variants','cerebro_market_insights','cerebro_test_combinations','learning_path_steps','learning_paths','web_resources','skill_benchmarks']
  loop
    execute format('alter table public.%I enable row level security', target_table);
    for policy_record in
      select polname from pg_policy where polrelid = format('public.%I', target_table)::regclass
    loop
      execute format('drop policy %I on public.%I', policy_record.polname, target_table);
    end loop;
    execute format('revoke all privileges on table public.%I from anon, authenticated', target_table);
    execute format('grant select on table public.%I to anon, authenticated', target_table);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      target_table || '_public_read',
      target_table
    );
  end loop;

  foreach target_table in array array['api_usage_tracking','brain_response_cache','embedding_generation_logs','brain_feedback','successful_patterns']
  loop
    execute format('alter table public.%I enable row level security', target_table);
    for policy_record in
      select polname from pg_policy where polrelid = format('public.%I', target_table)::regclass
    loop
      execute format('drop policy %I on public.%I', policy_record.polname, target_table);
    end loop;
    execute format('revoke all privileges on table public.%I from anon, authenticated', target_table);
  end loop;
end
$migration$;

-- Remove the legacy arbitrary-UUID SECURITY DEFINER data reader.
revoke execute on function public.get_user_reading_stats(uuid) from public, anon, authenticated;

-- Preserve the API consumed by lib/books.ts, but bind its email argument to
-- the authenticated JWT and execute under RLS.
create or replace function public.get_user_reading_stats(user_email_param text)
returns table(
  total_books bigint,
  completed_books bigint,
  reading_books bigint,
  not_started_books bigint,
  paused_books bigint,
  total_reading_time integer,
  average_progress numeric,
  bookmarks_count bigint,
  reviews_count bigint,
  favorite_category text
)
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if (select auth.uid()) is null
     or lower(coalesce((select auth.jwt() ->> 'email'), '')) <> lower(user_email_param) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  return query
  select
    count(*)::bigint,
    count(*) filter (where urp.status = 'completed')::bigint,
    count(*) filter (where urp.status = 'reading')::bigint,
    count(*) filter (where urp.status = 'not_started')::bigint,
    count(*) filter (where urp.status = 'paused')::bigint,
    coalesce(sum(urp.reading_time_minutes), 0)::integer,
    coalesce(avg(urp.reading_progress), 0)::numeric,
    (select count(*) from public.user_bookmarks ub where lower(ub.user_email) = lower(user_email_param))::bigint,
    (select count(*) from public.book_reviews br where lower(br.user_email) = lower(user_email_param))::bigint,
    coalesce((
      select kb.category
      from public.user_reading_progress urp2
      join public.knowledge_base kb on kb.id = urp2.book_id
      where lower(urp2.user_email) = lower(user_email_param)
      group by kb.category
      order by count(*) desc
      limit 1
    ), 'N/A')::text
  from public.user_reading_progress urp
  where lower(urp.user_email) = lower(user_email_param);
end
$function$;

revoke execute on function public.get_user_reading_stats(text) from public, anon;
grant execute on function public.get_user_reading_stats(text) to authenticated;
