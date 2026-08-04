-- Explicitly restrict the A1 Career Identity writer to authenticated sessions.
-- The function also validates auth.uid(), but privilege boundaries should fail closed.
revoke all on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) from public;
revoke all on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) from anon;
grant execute on function public.save_a1_cerebral_with_career_identity(jsonb,jsonb,jsonb,text,text,text) to authenticated;
