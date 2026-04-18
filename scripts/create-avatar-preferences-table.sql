-- Create avatar_preferences table to store user avatar selections
CREATE TABLE IF NOT EXISTS public.avatar_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- User avatar preferences (who represents the user in interviews)
  user_avatar_id VARCHAR(50) DEFAULT 'professional-1',
  
  -- Interviewer avatar preferences (who represents the interviewer)
  interviewer_avatar_id VARCHAR(50) DEFAULT 'interviewer-classic-1',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one preference per user
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS avatar_preferences_user_id_idx ON public.avatar_preferences(user_id);

-- Enable RLS
ALTER TABLE public.avatar_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own avatar preferences" ON public.avatar_preferences;
CREATE POLICY "Users can view own avatar preferences"
  ON public.avatar_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own avatar preferences" ON public.avatar_preferences;
CREATE POLICY "Users can update own avatar preferences"
  ON public.avatar_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own avatar preferences" ON public.avatar_preferences;
CREATE POLICY "Users can insert own avatar preferences"
  ON public.avatar_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_avatar_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_avatar_preferences_updated_at_trigger ON public.avatar_preferences;
CREATE TRIGGER update_avatar_preferences_updated_at_trigger
  BEFORE UPDATE ON public.avatar_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_avatar_preferences_updated_at();

-- Insert default preferences for existing users if any
-- (This will only insert if records don't already exist)
INSERT INTO public.avatar_preferences (user_id, user_avatar_id, interviewer_avatar_id)
SELECT id, 'professional-1', 'interviewer-classic-1'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.avatar_preferences WHERE user_id = auth.users.id
)
ON CONFLICT (user_id) DO NOTHING;
