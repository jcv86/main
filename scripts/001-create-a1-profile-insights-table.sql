-- Create a1_profile_insights table to cache and store AI-generated insights
-- This table stores the enhanced insights generated for users after completing the Despega Cerebral test

CREATE TABLE IF NOT EXISTS a1_profile_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile data
  disc_profile JSONB NOT NULL, -- { D, I, S, C, primary, primaryScore, secondary, secondaryScore }
  dominant_pattern VARCHAR(1) NOT NULL,
  secondary_pattern VARCHAR(1) NOT NULL,
  
  -- 8 Enhanced insights
  fortalezas_principales TEXT NOT NULL,
  areas_desarrollo TEXT NOT NULL,
  estilo_entrevista TEXT NOT NULL,
  dinamica_equipo TEXT NOT NULL,
  carrera_align TEXT NOT NULL,
  comunicacion_efectiva TEXT NOT NULL,
  gestion_conflicto TEXT NOT NULL,
  proxi_paso TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- RLS for users to see only their own insights
  CONSTRAINT check_user_id CHECK (user_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE a1_profile_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own insights
CREATE POLICY "Users can view own a1 insights"
  ON a1_profile_insights
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Only service role can insert/update insights (API endpoint)
CREATE POLICY "Service role can manage a1 insights"
  ON a1_profile_insights
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_a1_profile_insights_user_id ON a1_profile_insights(user_id);
CREATE INDEX idx_a1_profile_insights_created_at ON a1_profile_insights(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_a1_profile_insights_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_a1_profile_insights_timestamp
  BEFORE UPDATE ON a1_profile_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_a1_profile_insights_timestamp();
