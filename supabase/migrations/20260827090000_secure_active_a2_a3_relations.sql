begin;

-- These relations are consumed through authenticated Next.js server routes.
-- They must not be mutable through the public Supabase Data API.
alter table public.a2_learning_routes enable row level security;
alter table public.a3_preguntas_entrevista enable row level security;
alter table public.a3_respuestas_entrevista enable row level security;
alter table public.a3_entrevista_feedback_ia enable row level security;

revoke all on table public.a2_learning_routes from anon, authenticated;
revoke all on table public.a3_preguntas_entrevista from anon, authenticated;
revoke all on table public.a3_respuestas_entrevista from anon, authenticated;
revoke all on table public.a3_entrevista_feedback_ia from anon, authenticated;

grant select, insert, update, delete on table public.a2_learning_routes to service_role;
grant select, insert, update, delete on table public.a3_preguntas_entrevista to service_role;
grant select, insert, update, delete on table public.a3_respuestas_entrevista to service_role;
grant select, insert, update, delete on table public.a3_entrevista_feedback_ia to service_role;

comment on table public.a2_learning_routes is
  'Server-owned A2 route catalog; not exposed directly to browser roles.';
comment on table public.a3_preguntas_entrevista is
  'Server-owned A3 interview question catalog; not exposed directly to browser roles.';
comment on table public.a3_respuestas_entrevista is
  'Server-owned user interview responses; access is mediated by authenticated application routes.';
comment on table public.a3_entrevista_feedback_ia is
  'Server-owned user interview feedback; access is mediated by authenticated application routes.';

commit;
