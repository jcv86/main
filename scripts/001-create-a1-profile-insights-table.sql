-- Crear tabla a1_profile_insights para almacenar los insights de El Ritual (Despega Cerebral)
-- Esta tabla cachea los 8 insights personalizados generados por IA después de completar el test

CREATE TABLE IF NOT EXISTS a1_profile_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Datos del perfil de El Ritual
  ritual_profile JSONB NOT NULL, -- { dominante, dominanteScore, secundario, secundarioScore, dimD, dimI, dimS, dimC }
  patron_dominante VARCHAR(1) NOT NULL, -- 'D', 'I', 'S' o 'C'
  patron_secundario VARCHAR(1) NOT NULL,
  
  -- Los 8 Insights Personalizados generados con IA
  fortalezas_principales TEXT NOT NULL,      -- Tus Fortalezas Principales
  areas_desarrollo TEXT NOT NULL,              -- Áreas de Desarrollo
  estilo_entrevista TEXT NOT NULL,            -- Tu Estilo en Entrevistas
  dinamica_equipo TEXT NOT NULL,              -- Dinámica de Equipo
  carrera_align TEXT NOT NULL,                 -- Carreras Alineadas
  comunicacion_efectiva TEXT NOT NULL,        -- Comunicación Efectiva
  gestion_conflicto TEXT NOT NULL,            -- Gestión de Conflictos
  proxi_paso TEXT NOT NULL,                   -- Tu Próximo Paso
  
  -- Metadatos
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_user_id CHECK (user_id IS NOT NULL)
);

-- Habilitar RLS
ALTER TABLE a1_profile_insights ENABLE ROW LEVEL SECURITY;

-- Política RLS: Los usuarios solo pueden ver sus propios insights
CREATE POLICY "Usuarios ven solo sus insights de El Ritual"
  ON a1_profile_insights
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política RLS: Solo el service role puede insertar/actualizar insights (desde API)
CREATE POLICY "Service role puede gestionar insights de El Ritual"
  ON a1_profile_insights
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_a1_profile_insights_user_id ON a1_profile_insights(user_id);
CREATE INDEX idx_a1_profile_insights_created_at ON a1_profile_insights(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
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
