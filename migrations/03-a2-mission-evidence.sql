-- Extend the canonical A2 completion record so every completed day keeps
-- the submitted evidence and the server-side validation result.

ALTER TABLE public.a2_user_task_completions
  ADD COLUMN IF NOT EXISTS mission_type text,
  ADD COLUMN IF NOT EXISTS submission jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS validation_status text NOT NULL DEFAULT 'legacy',
  ADD COLUMN IF NOT EXISTS validation_result jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.a2_user_task_completions
  DROP CONSTRAINT IF EXISTS a2_user_task_completions_validation_status_check;

ALTER TABLE public.a2_user_task_completions
  ADD CONSTRAINT a2_user_task_completions_validation_status_check
  CHECK (
    validation_status IN (
      'legacy',
      'specialized',
      'structural',
      'checkpoint',
      'needs_revision'
    )
  );

CREATE INDEX IF NOT EXISTS idx_a2_completions_validation
  ON public.a2_user_task_completions (user_id, validation_status, day);

COMMENT ON COLUMN public.a2_user_task_completions.submission IS
  'Normalized evidence submitted when the A2 day was completed.';

COMMENT ON COLUMN public.a2_user_task_completions.validation_result IS
  'Server-side score, criteria and errors used to validate the A2 deliverable.';
