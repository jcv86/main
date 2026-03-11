-- Crear tabla user_profiles_enriched
CREATE TABLE IF NOT EXISTS user_profiles_enriched (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  current_title TEXT,
  current_company TEXT,
  industry TEXT,
  location TEXT,
  country TEXT,
  skills TEXT[],
  experience_history JSONB,
  education JSONB,
  profile_source TEXT,
  google_synced_at TIMESTAMP WITH TIME ZONE,
  linkedin_synced_at TIMESTAMP WITH TIME ZONE,
  linkedin_raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_user_profiles_enriched_user_id ON user_profiles_enriched(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_enriched_created_at ON user_profiles_enriched(created_at);

-- Agregar columna linkedin_context a coach_context_snapshots
ALTER TABLE IF EXISTS coach_context_snapshots 
ADD COLUMN IF NOT EXISTS linkedin_context JSONB;

-- Enable RLS
ALTER TABLE user_profiles_enriched ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own enriched profile" ON user_profiles_enriched;
CREATE POLICY "Users can view own enriched profile"
  ON user_profiles_enriched FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own enriched profile" ON user_profiles_enriched;
CREATE POLICY "Users can update own enriched profile"
  ON user_profiles_enriched FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own enriched profile" ON user_profiles_enriched;
CREATE POLICY "Users can insert own enriched profile"
  ON user_profiles_enriched FOR INSERT
  WITH CHECK (auth.uid() = user_id);
