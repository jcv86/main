-- Candidate: replace the existing RPC without changing its signature or historical assessments.
-- Requires an explicit deployment window. Never run this from application startup.
-- p_questions, p_disc_profile and pattern arguments remain for old clients, but are not trusted.
-- The frozen v1 bank below is compared byte-for-meaning with the TypeScript bank in CI.
set lock_timeout = '5s';

create or replace function public.save_a1_cerebral_with_career_identity(
  p_responses jsonb,
  p_questions jsonb,
  p_disc_profile jsonb,
  p_dominant_pattern text,
  p_secondary_pattern text default null,
  p_correlation_id text default null
)
returns table(assessment_id uuid, identity_id uuid, identity_version integer)
language plpgsql
security invoker
set search_path = ''
as $writer$
declare
  v_user_id uuid := auth.uid();
  v_questions constant jsonb := $dtc_a1_v1$[{"id":1,"pregunta":"Cuando enfrento un desafío importante, tiendo a ser más:","opciones":[{"texto":"Decidido y directo","dimension":"D"},{"texto":"Optimista e inspirador","dimension":"I"},{"texto":"Paciente y considerado","dimension":"S"},{"texto":"Analítico y preciso","dimension":"C"}]},{"id":2,"pregunta":"En situaciones inesperadas, mi reacción natural es:","opciones":[{"texto":"Tomar control rápidamente","dimension":"D"},{"texto":"Ver lo positivo y motivar","dimension":"I"},{"texto":"Mantener la calma y estabilidad","dimension":"S"},{"texto":"Analizar antes de actuar","dimension":"C"}]},{"id":3,"pregunta":"Mi mayor fortaleza en el trabajo es:","opciones":[{"texto":"Ejecutar y lograr resultados","dimension":"D"},{"texto":"Conectar personas e ideas","dimension":"I"},{"texto":"Mantener armonía y apoyo","dimension":"S"},{"texto":"Garantizar calidad y precisión","dimension":"C"}]},{"id":4,"pregunta":"En un grupo, naturalmente:","opciones":[{"texto":"Tomo la iniciativa y lidero","dimension":"D"},{"texto":"Energizo y animo la participación","dimension":"I"},{"texto":"Escucho y apoyo a otros","dimension":"S"},{"texto":"Aseguro que todo esté bien hecho","dimension":"C"}]},{"id":5,"pregunta":"Cuando tomo decisiones importantes, considero más:","opciones":[{"texto":"Velocidad y resultados","dimension":"D"},{"texto":"Opiniones y entusiasmo del equipo","dimension":"I"},{"texto":"Impacto en las personas","dimension":"S"},{"texto":"Datos y análisis detallado","dimension":"C"}]},{"id":6,"pregunta":"Mi estilo de comunicación es más:","opciones":[{"texto":"Directo y asertivo","dimension":"D"},{"texto":"Abierto y conversacional","dimension":"I"},{"texto":"Calmado y reflexivo","dimension":"S"},{"texto":"Preciso y estructurado","dimension":"C"}]},{"id":7,"pregunta":"Ante conflictos, generalmente:","opciones":[{"texto":"Confronto directamente","dimension":"D"},{"texto":"Busco soluciones ganadoras para todos","dimension":"I"},{"texto":"Intento mantener la paz","dimension":"S"},{"texto":"Examino todos los hechos","dimension":"C"}]},{"id":8,"pregunta":"Lo que más me motiva es:","opciones":[{"texto":"Ganar y lograr metas","dimension":"D"},{"texto":"Reconocimiento y visibilidad","dimension":"I"},{"texto":"Estabilidad y relaciones sólidas","dimension":"S"},{"texto":"Excelencia y perfeccionamiento","dimension":"C"}]},{"id":9,"pregunta":"Prefiero trabajar en entornos que sean:","opciones":[{"texto":"Competitivos y desafiantes","dimension":"D"},{"texto":"Dinámicos y colaborativos","dimension":"I"},{"texto":"Estables y previsibles","dimension":"S"},{"texto":"Ordenados y bien documentados","dimension":"C"}]},{"id":10,"pregunta":"Cuando surgen problemas, mi primera reacción es:","opciones":[{"texto":"Atacar la solución inmediatamente","dimension":"D"},{"texto":"Reunir al equipo para ideas","dimension":"I"},{"texto":"Evaluar el impacto en todos","dimension":"S"},{"texto":"Investigar la raíz del problema","dimension":"C"}]},{"id":11,"pregunta":"Mi relación con las reglas es:","opciones":[{"texto":"Las cambio si obstaculizan resultados","dimension":"D"},{"texto":"Las adapto según la situación","dimension":"I"},{"texto":"Las respeto por estabilidad","dimension":"S"},{"texto":"Las sigo porque existen por razones","dimension":"C"}]},{"id":12,"pregunta":"Sobre cambios y innovación, tiendo a:","opciones":[{"texto":"Impulsar cambios transformacionales","dimension":"D"},{"texto":"Entusiasmarme con nuevas ideas","dimension":"I"},{"texto":"Ser cauteloso hasta estar seguro","dimension":"S"},{"texto":"Evaluar sistemáticamente los beneficios","dimension":"C"}]},{"id":13,"pregunta":"Mi relación con los detalles es:","opciones":[{"texto":"Delego, no me distraen","dimension":"D"},{"texto":"Los omito si no son importantes","dimension":"I"},{"texto":"Los considero en lo importante","dimension":"S"},{"texto":"Son críticos, nada se me escapa","dimension":"C"}]},{"id":14,"pregunta":"Cuando trabajo en equipo, mi rol es más:","opciones":[{"texto":"Definir dirección y metas","dimension":"D"},{"texto":"Inspirar y conectar personas","dimension":"I"},{"texto":"Apoyar y facilitar el trabajo","dimension":"S"},{"texto":"Verificar calidad y procesos","dimension":"C"}]},{"id":15,"pregunta":"Ante críticas, típicamente:","opciones":[{"texto":"Las veo como información para mejorar","dimension":"D"},{"texto":"Las recibo pero las analizo después","dimension":"I"},{"texto":"Me afecta emocionalmente al principio","dimension":"S"},{"texto":"Las examino objetivamente","dimension":"C"}]},{"id":16,"pregunta":"Mi idea de éxito es:","opciones":[{"texto":"Alcanzar metas ambiciosas","dimension":"D"},{"texto":"Tener impacto e influencia","dimension":"I"},{"texto":"Contribuir a algo mayor que yo","dimension":"S"},{"texto":"Crear algo duradero y excelente","dimension":"C"}]},{"id":17,"pregunta":"Cuando trabajo solo, tiendo a:","opciones":[{"texto":"Avanzar rápido hacia la meta","dimension":"D"},{"texto":"Buscar formas de conectar mi trabajo","dimension":"I"},{"texto":"Trabajar a ritmo constante","dimension":"S"},{"texto":"Refinar hasta la excelencia","dimension":"C"}]},{"id":18,"pregunta":"Lo que menos tolero es:","opciones":[{"texto":"Falta de acción y decisiones","dimension":"D"},{"texto":"Aislamiento y monotonía","dimension":"I"},{"texto":"Conflicto y cambio constante","dimension":"S"},{"texto":"Imprecisión y caos","dimension":"C"}]},{"id":19,"pregunta":"En negociaciones, mis puntos fuertes son:","opciones":[{"texto":"Negociar hasta ganar","dimension":"D"},{"texto":"Persuadir carismáticamente","dimension":"I"},{"texto":"Encontrar soluciones colaborativas","dimension":"S"},{"texto":"Presentar casos bien argumentados","dimension":"C"}]},{"id":20,"pregunta":"Sobre feedback y evaluación, prefiero:","opciones":[{"texto":"Resultados medibles claros","dimension":"D"},{"texto":"Reconocimiento del equipo","dimension":"I"},{"texto":"Conversaciones reflexivas","dimension":"S"},{"texto":"Análisis detallado y específico","dimension":"C"}]},{"id":21,"pregunta":"Mi paciencia se agota con:","opciones":[{"texto":"Gente indecisa o lenta","dimension":"D"},{"texto":"Gente negativa o distante","dimension":"I"},{"texto":"Conflicto y tensión","dimension":"S"},{"texto":"Desorden e imprecisión","dimension":"C"}]},{"id":22,"pregunta":"Cuando debo liderar, mi enfoque es:","opciones":[{"texto":"Establecer dirección clara y exigencia","dimension":"D"},{"texto":"Inspirar y motivar al equipo","dimension":"I"},{"texto":"Apoyar y desarrollar a otros","dimension":"S"},{"texto":"Crear sistemas que funcionen","dimension":"C"}]},{"id":23,"pregunta":"Mis amigos me describirían como:","opciones":[{"texto":"Ambicioso y decidido","dimension":"D"},{"texto":"Divertido y conectado","dimension":"I"},{"texto":"Leal y confiable","dimension":"S"},{"texto":"Pensador y analítico","dimension":"C"}]},{"id":24,"pregunta":"En proyectos, mi contribución típica es:","opciones":[{"texto":"Impulsar avance y alcanzar metas","dimension":"D"},{"texto":"Generar entusiasmo y creatividad","dimension":"I"},{"texto":"Mantener cohesión del equipo","dimension":"S"},{"texto":"Asegurar implementación correcta","dimension":"C"}]},{"id":25,"pregunta":"Cuando veo oportunidades, típicamente:","opciones":[{"texto":"Las capturo rápidamente","dimension":"D"},{"texto":"Las comparto e inspiro a otros","dimension":"I"},{"texto":"Las evaluó cuidadosamente","dimension":"S"},{"texto":"Las analizo profundamente","dimension":"C"}]},{"id":26,"pregunta":"Mi zona de confort es más:","opciones":[{"texto":"Desafíos y competencia","dimension":"D"},{"texto":"Interacción y visibilidad","dimension":"I"},{"texto":"Estabilidad y relaciones","dimension":"S"},{"texto":"Profundidad y competencia técnica","dimension":"C"}]},{"id":27,"pregunta":"Ante errores, mi reacción es:","opciones":[{"texto":"Corregir inmediatamente y avanzar","dimension":"D"},{"texto":"Buscar soluciones creativas","dimension":"I"},{"texto":"Apologizarme y hacer enmienda","dimension":"S"},{"texto":"Analizar qué salió mal","dimension":"C"}]},{"id":28,"pregunta":"Mi visión del futuro es más:","opciones":[{"texto":"Conquistar nuevas alturas","dimension":"D"},{"texto":"Impactar e inspirar a muchos","dimension":"I"},{"texto":"Construir algo sostenible","dimension":"S"},{"texto":"Perfeccionar y dominar","dimension":"C"}]}]$dtc_a1_v1$::jsonb;
  v_question jsonb;
  v_id text;
  v_more text;
  v_less text;
  v_more_dimension text;
  v_less_dimension text;
  v_scores jsonb := '{"D":0,"I":0,"S":0,"C":0}';
  v_more_answers jsonb := '{}';
  v_less_answers jsonb := '{}';
  v_intensities jsonb;
  v_primary_candidates text[];
  v_secondary_candidates text[] := array[]::text[];
  v_primary text;
  v_secondary text;
  v_ranked text[];
  v_pattern jsonb;
  v_responses jsonb;
  v_projection jsonb;
  v_assessment_id uuid;
  v_identity_id uuid;
  v_identity_version integer;
  v_correlation_id text;
  v_now timestamptz;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;
  if jsonb_typeof(p_responses) is distinct from 'object'
    or jsonb_typeof(p_responses->'more') is distinct from 'object'
    or jsonb_typeof(p_responses->'less') is distinct from 'object' then
    raise exception using errcode = '22023', message = 'A1 requires more and less selection objects';
  end if;
  if (p_responses->'_meta') ? 'questionnaireVersion'
    and p_responses->'_meta'->>'questionnaireVersion' is distinct from 'dtc-disc-28.v1' then
    raise exception using errcode = '22023', message = 'Unsupported A1 questionnaire version';
  end if;
  if octet_length(p_responses::text) > 32768 then
    raise exception using errcode = '22023', message = 'A1 response exceeds the supported size';
  end if;
  if (select count(*) from jsonb_object_keys(p_responses->'more')) <> 28
    or (select count(*) from jsonb_object_keys(p_responses->'less')) <> 28 then
    raise exception using errcode = '22023', message = 'Exactly 28 selections are required in each group';
  end if;

  for v_question in select value from jsonb_array_elements(v_questions) loop
    v_id := v_question->>'id';
    if jsonb_typeof(p_responses->'more'->v_id) is distinct from 'string'
      or jsonb_typeof(p_responses->'less'->v_id) is distinct from 'string' then
      raise exception using errcode = '22023', message = 'Missing or malformed A1 selection';
    end if;
    v_more := btrim(p_responses->'more'->>v_id);
    v_less := btrim(p_responses->'less'->>v_id);
    if v_more = v_less then
      raise exception using errcode = '22023', message = 'More and less selections must differ';
    end if;
    select value->>'dimension' into v_more_dimension
      from jsonb_array_elements(v_question->'opciones') where value->>'texto' = v_more;
    select value->>'dimension' into v_less_dimension
      from jsonb_array_elements(v_question->'opciones') where value->>'texto' = v_less;
    if v_more_dimension is null or v_less_dimension is null then
      raise exception using errcode = '22023', message = 'Selection does not belong to the frozen A1 questionnaire';
    end if;
    v_scores := jsonb_set(v_scores, array[v_more_dimension], to_jsonb((v_scores->>v_more_dimension)::integer + 1));
    v_scores := jsonb_set(v_scores, array[v_less_dimension], to_jsonb((v_scores->>v_less_dimension)::integer - 1));
    v_more_answers := v_more_answers || jsonb_build_object(v_id, v_more);
    v_less_answers := v_less_answers || jsonb_build_object(v_id, v_less);
  end loop;

  select array_agg(key order by ord) into v_primary_candidates
    from unnest(array['D','I','S','C']) with ordinality as dims(key,ord)
    where (v_scores->>key)::integer = (select max(value::integer) from jsonb_each_text(v_scores));
  if cardinality(v_primary_candidates) = 1 then
    v_primary := v_primary_candidates[1];
    select array_agg(key order by ord) into v_secondary_candidates
      from unnest(array['D','I','S','C']) with ordinality as dims(key,ord)
      where key <> v_primary and (v_scores->>key)::integer =
        (select max(value::integer) from jsonb_each_text(v_scores) where key <> v_primary);
    if cardinality(v_secondary_candidates) = 1 then v_secondary := v_secondary_candidates[1]; end if;
  end if;
  select array_agg(key order by (v_scores->>key)::integer desc,ord) into v_ranked
    from unnest(array['D','I','S','C']) with ordinality as dims(key,ord);
  select jsonb_object_agg(key, round((value::numeric + 28) / 56 * 100)) into v_intensities
    from jsonb_each_text(v_scores);
  v_pattern := jsonb_build_object(
    'version','disc-net-evidence.v2',
    'status',case when v_primary is not null and v_secondary is not null then 'resolved' else 'ambiguous' end,
    'primary',v_primary,'secondary',v_secondary,
    'primaryCandidates',to_jsonb(v_primary_candidates),'secondaryCandidates',to_jsonb(v_secondary_candidates)
  );
  v_responses := jsonb_build_object('more',v_more_answers,'less',v_less_answers,'_meta',jsonb_build_object(
    'questionnaireVersion','dtc-disc-28.v1','scoringVersion','disc-net-evidence.v2',
    'writerVersion','a1-source-writer.v2','patternEvidence',v_pattern,
    'compatibilityLabelsOnly',v_primary is null or v_secondary is null
  ));
  v_correlation_id := coalesce(nullif(btrim(p_correlation_id),''),gen_random_uuid()::text);
  if length(v_correlation_id) > 128 then
    raise exception using errcode = '22023', message = 'Invalid correlation identifier';
  end if;

  -- Serialize only concurrent A1 writers for this owner. Timestamp is assigned after waiting,
  -- not at BEGIN, so an older transaction cannot overwrite a newer source with an older date.
  perform pg_advisory_xact_lock(hashtextextended('dtc:a1:' || v_user_id::text,0));
  v_now := clock_timestamp();
  insert into public.a1_cerebral_assessment (
    user_id,questions,responses,disc_profile,dominant_pattern,secondary_pattern,completed_at,created_at
  ) values (
    v_user_id,v_questions,v_responses,v_scores,v_ranked[1],v_ranked[2],v_now,v_now
  ) returning id into v_assessment_id;
  -- Non-null legacy label columns are storage adapters only; all semantic fields below preserve ties.
  v_projection := jsonb_build_object(
    'policy','a1-preferences-not-competencies.v1','writerVersion','a1-source-writer.v2',
    'kind','self_reported_preferences','status',v_pattern->>'status',
    'assessmentId',v_assessment_id,'assessmentDate',v_now,
    'rawScores',v_scores,'displayIntensities',v_intensities,
    'primary',v_primary,'secondary',v_secondary,
    'primaryCandidates',to_jsonb(v_primary_candidates),'secondaryCandidates',to_jsonb(v_secondary_candidates),
    'patternEvidence',v_pattern,'questionnaireVersion','dtc-disc-28.v1',
    'limitation','Preferencias relativas autodeclaradas; no acreditan competencias, aptitud laboral ni confianza psicológica. Las intensidades no son percentiles.',
    'reportPath','/despega/a1-report'
  );
  insert into public.career_identities(user_id,communication_profile,metadata)
    values(v_user_id,jsonb_build_object('a1',v_projection),jsonb_build_object('a1Connected',true,'a1LastAssessmentId',v_assessment_id,'a1WriterVersion','a1-source-writer.v2'))
    on conflict(user_id) do update set
      communication_profile = (
        case when lower(public.career_identities.communication_profile->>'framework') = 'disc'
          then public.career_identities.communication_profile - array['framework','scores','confidence','dominantPattern','secondaryPattern','lastAssessmentId','lastAssessedAt']
          else public.career_identities.communication_profile end
      ) || excluded.communication_profile,
      metadata = public.career_identities.metadata || excluded.metadata,
      version = public.career_identities.version + 1,
      updated_at = v_now
    returning id,version into v_identity_id,v_identity_version;

  -- No career_skills, career_evidence or memory projection: their required confidence/skill
  -- fields are not meaningful for DISC. Existing historical rows and A2/A3/A4 remain untouched.
  insert into public.career_agent_events(
    user_id,identity_id,agent_id,agent_version,source_module,correlation_id,operation,
    entity_type,entity_id,outcome,payload
  ) values (
    v_user_id,v_identity_id,'a1-assessment-writer','2.0.0','a1',v_correlation_id,'save_assessment_dual_write',
    'a1_cerebral_assessment',v_assessment_id,'accepted',jsonb_build_object(
      'writerVersion','a1-source-writer.v2','questionnaireVersion','dtc-disc-28.v1',
      'kind','self_reported_preferences','patternStatus',v_pattern->>'status','questionCount',28
    )
  );
  return query select v_assessment_id,v_identity_id,v_identity_version;
end;
$writer$;

revoke all on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) from public;
revoke all on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) from anon;
grant execute on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) to authenticated;
comment on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text)
  is 'A1 source writer v2: canonical responses, signed preferences, explicit ambiguity and atomic identity/audit; not competency scoring.';
reset lock_timeout;
