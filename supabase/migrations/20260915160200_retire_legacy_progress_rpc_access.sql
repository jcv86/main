-- Legacy progress helpers are no longer used by the current runtime.
-- Existing installations may still have them, so close their Data API surface without dropping them.

do $$
begin
  if to_regprocedure('public.update_progress_flag(uuid,character varying,boolean)') is not null then
    revoke execute on function public.update_progress_flag(uuid, character varying, boolean) from public;
    revoke execute on function public.update_progress_flag(uuid, character varying, boolean) from anon, authenticated;
    grant execute on function public.update_progress_flag(uuid, character varying, boolean) to service_role;
  end if;

  if to_regprocedure('public.check_user_prerequisites(uuid,text[])') is not null then
    revoke execute on function public.check_user_prerequisites(uuid, text[]) from public;
    revoke execute on function public.check_user_prerequisites(uuid, text[]) from anon, authenticated;
    grant execute on function public.check_user_prerequisites(uuid, text[]) to service_role;
  end if;
end
$$;
