-- Preserve the original completion instant when an existing A2 deliverable is edited.
-- Activity metrics use created_at first, but this trigger keeps completed_at
-- semantically stable for future reads and integrations as well.

create or replace function public.preserve_a2_completion_timestamp()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.completed_at is not null
     and new.completed_at is distinct from old.completed_at then
    new.completed_at := old.completed_at;
  end if;

  if old.created_at is not null
     and new.created_at is distinct from old.created_at then
    new.created_at := old.created_at;
  end if;

  return new;
end;
$$;

revoke all on function public.preserve_a2_completion_timestamp() from public;
revoke all on function public.preserve_a2_completion_timestamp() from anon;
revoke all on function public.preserve_a2_completion_timestamp() from authenticated;

drop trigger if exists preserve_a2_completion_timestamp
  on public.a2_user_task_completions;

create trigger preserve_a2_completion_timestamp
before update on public.a2_user_task_completions
for each row
execute function public.preserve_a2_completion_timestamp();
