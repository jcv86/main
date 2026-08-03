begin;

-- Balances, transactions, purchases and awarded XP are server-owned facts.
-- Users may read only their own rows through RLS; direct client writes are revoked.
revoke all privileges on table
  public.user_dtc_balance,
  public.dtc_transactions,
  public.dtc_purchases,
  public.interview_session_gamification,
  public.user_gamification_profile
from anon, authenticated;

grant select on table
  public.user_dtc_balance,
  public.dtc_transactions,
  public.dtc_purchases,
  public.interview_session_gamification,
  public.user_gamification_profile
to authenticated;

grant all privileges on table
  public.user_dtc_balance,
  public.dtc_transactions,
  public.dtc_purchases,
  public.interview_session_gamification,
  public.user_gamification_profile
to service_role;

commit;
