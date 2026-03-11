-- Crear tabla user_profiles_enriched
CREATE TABLE IF NOT EXISTS user_profiles_enriched (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Datos básicos
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  
  -- LinkedIn Professional Data
  current_title TEXT,
  current_company TEXT,
  industry TEXT,
  location TEXT,
  country TEXT,
  
  -- Skills array
  skills TEXT[],
  
  -- Career history
  experience_history JSONB,
  education JSONB,
  
  -- Source tracking
  profile_source TEXT CHECK (profile_source IN ('google', 'linkedin', 'both')),
  google_synced_at TIMESTAMP WITH TIME ZONE,
  linkedin_synced_at TIMESTAMP WITH TIME ZONE,
  
  -- Raw data for analysis
  linkedin_raw_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_user_profiles_enriched_user_id ON user_profiles_enriched(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_enriched_created_at ON user_profiles_enriched(created_at);

-- Agregar columna linkedin_context a coach_context_snapshots (si no existe)
ALTER TABLE IF EXISTS coach_context_snapshots 
ADD COLUMN IF NOT EXISTS linkedin_context JSONB;

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles_enriched ENABLE ROW LEVEL SECURITY;

-- Policy: Usuarios solo pueden ver su propio perfil enriquecido
CREATE POLICY IF NOT EXISTS "Users can view own enriched profile"
  ON user_profiles_enriched
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Usuarios solo pueden actualizar su propio perfil
CREATE POLICY IF NOT EXISTS "Users can update own enriched profile"
  ON user_profiles_enriched
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Usuarios pueden insertar su propio perfil
CREATE POLICY IF NOT EXISTS "Users can insert own enriched profile"
  ON user_profiles_enriched
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_profiles_enriched_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profiles_enriched_update_timestamp ON user_profiles_enriched;
CREATE TRIGGER user_profiles_enriched_update_timestamp
BEFORE UPDATE ON user_profiles_enriched
FOR EACH ROW
EXECUTE FUNCTION update_user_profiles_enriched_updated_at();
